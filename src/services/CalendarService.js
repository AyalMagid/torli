import HttpService from './HttpService'
import EventService from './EventService'
import UtilsService from "../services/UtilsService";
import EmailService from '../services/EmailService';

export default {
    getCalendar,
    getAvailbleDailySlots,
    addEventToCalendar,
    addRecurrenceToCalendar,
    removeEventFromCalendar,
    setAppointment,
    getEventsFromCalendar,
    buildWeeklyModel,
    getAvailbleDuration,
    getHoursToBlock,
    blockSlotRange,
    getDatesWeeklyRange
}

var gUtcDiff = 2

// get the first calendar connected to this TOKEN (usually only 1 should be there)
function getCalendar() {
    return HttpService.get('calendar')
}


async function getEventsFromCalendar(timeRange) {
    return await HttpService.get(`calendar/${timeRange.start}/${timeRange.end}`)
}

// routim
// async function getEventsFromCalendar(timeRangeAndIds) {
//     return await HttpService.get('calendar/events', timeRangeAndIds)
// }

// function addEventToCalendar(startTime, endTime, eventName, creatorName = 'block', creatorEmail) {
//     const event = { eventName, creatorName, creatorEmail, startTime, endTime }
//     return HttpService.post('calendar', event)
// }

// routim
function addEventToCalendar(startTime, endTime, eventName, creatorName = 'block', creatorEmail, owner) {
    const event = { eventName, creatorName, creatorEmail, startTime, endTime, owner}
    return HttpService.post('calendar', event)
}

// adding Recurrence event/block
// async function addRecurrenceToCalendar(startTime, endTime, eventName, creatorName = 'block', recurrence) {
//     const event = { eventName, creatorName, startTime, endTime, recurrence}
//     return HttpService.post('calendar/recurrence', event)
// }

// adding Recurrence event/block
// routim
async function addRecurrenceToCalendar(startTime, endTime, eventName, creatorName = 'block', recurrence, owner) {
    const token = owner.token
    const accountId = owner.accountId
    const event = { eventName, creatorName, startTime, endTime, recurrence, token, accountId}
    return HttpService.post('calendar/recurrence', event)
}

// routim
async function removeEventFromCalendar(event) {
    const res = await HttpService.delete('calendar', event)
    return res
}

// async function removeEventFromCalendar(eventId) {
//     const res = await HttpService.delete('calendar', { eventId })
//     return res
// }

// routim
async function getAvailbleDailySlots(startTime, endtTime, duration, owner) {
    const dailySlots = { startTime, endtTime, duration, owner }
    return await HttpService.post('calendar/slots', dailySlots)
}

// async function getAvailbleDailySlots(startTime, endtTime, duration) {
//     const dailySlots = { startTime, endtTime, duration }
//     return await HttpService.post('calendar/slots', dailySlots)
// }

// MAKING SOME CALCULATIONS AND THAN CALLING OTHER FUNCTIONS TO ADD THE EVENT TO CALENDAR + MONGO DB
// async function setAppointment(treatments, duration, phone, email, name, treatment) {
// confirmedEvent = await addEventToCalendar(startTime, endTime, treatments, name, 'ayal@gmail.com')
// const event = {
//     name,
//     email,
//     phone,
//     eventId: confirmedEvent.id,
//     treatments,
//     duration,
//     startTime: startTime.slice(11, 20),
//     endTime: endTime.slice(11, 20),
//     date: startTime.slice(0, 10)
// }

// email for routim wasnt applied yet
//  EmailService.sendEmail(name, treatment.date, email, true, phone, duration, treatment.time, treatments, owner.workPlaceTitle) line 111
// on email service needs to update the ENV file somehow or send those details
// routim
    async function setAppointment(treatments, duration, phone, email, name, treatment, owner) { 
    // in case of recurrence => (treatments, duration, phone, email, name, treatment, recurrence)
    let time = UtilsService.changeTimeForDisplay(treatment.time, gUtcDiff)
    let firstTime = time
    const startTime = `${treatment.date}T${time}:00Z`
    time = UtilsService.calculateEndTime(time, duration)
    const endTime = `${treatment.date}T${time}:00Z`
    let confirmedEvent
    // if (!recurrence.isRecurrence){
        confirmedEvent = await addEventToCalendar(startTime, endTime, treatments, name, 'ayal@gmail.com', owner) 
    // } else {
        // checking if recurrence is possible during all the chosen dates
    //     const occupiedDates = await checkRecurrenceAvailbility (new Date(`${treatment.date}T02:00:00Z`), firstTime, time, duration, recurrence)
    //     if (!occupiedDates.length) {
    //     confirmedEvent = await addRecurrenceToCalendar(startTime, endTime, treatments, name, recurrence)
    //     } else {
    //         console.log ('recurrence is not possible - the xx date is already full', occupiedDates)
    //         return
    //     }
    // }

    const event = { 
        name,
        email,
        phone,
        eventId: confirmedEvent.id,
        treatments,
        duration,
        startTime: startTime.slice(11, 20),
        endTime: endTime.slice(11, 20),
        date: startTime.slice(0, 10),
        accountId: owner.accountId,
        calendarId: owner.calendarId,
        token: owner.token,
        workPlace: owner.workPlace
    }
    EventService.saveConfirmedEvent(event)
    EmailService.sendEmail(name, treatment.date, email, true, phone, duration, treatment.time, treatments)
    return confirmedEvent
}


// async function checkRecurrenceAvailbility (fullDate, firstTime, time, duration, recurrence) {
//     const availbleSlots = await getAvailbleDailySlots(startTime, endTime, duration)
// routim

// freq should get DAILY or WEEKLY depends - representing day or week diff. count - for how many times to repeat 
async function checkRecurrenceAvailbility (fullDate, firstTime, time, duration, recurrence, owner) {

    let occupiedDates = []
    let startTime
    let endTime
    let isosDate = UtilsService.getIsosDate(0, fullDate)
    let freq = (recurrence.freq === 'DAILY')? 1 : 7
    let recurrenceAvailbilityCheck = true
    duration = UtilsService.convertDurationToApiStr(duration)

    for (var i=0; i < recurrence.count; i++){
    startTime = `${isosDate}T${firstTime}:00Z`
    endTime = `${isosDate}T${time}:00Z`
    const availbleSlots = await getAvailbleDailySlots(startTime, endTime, duration, owner)

    // if the time is already occupied the day isnt avaiblle
    if (typeof availbleSlots === 'string'){
        occupiedDates.push(isosDate)
    }
    isosDate = UtilsService.getIsosDate(i+freq, fullDate, recurrenceAvailbilityCheck) 
    }
    console.log(occupiedDates)
    return occupiedDates
}

// async function blockSlotRange(slotToBlock, name = 'block', recurrence) {
//  confirmedEvent = await addEventToCalendar(startTime, endTime, name) 
// const occupiedDates = await checkRecurrenceAvailbility (new Date(`${slotToBlock.date}T02:00:00Z`), time1, time2, duration, recurrence)
//            confirmedEvent = await addRecurrenceToCalendar(startTime, endTime, name, 'block', recurrence)
// const event = {
//     name,
//     email: '',
//     phone: '',
//     eventId: confirmedEvent.id,
//     treatments: '',
//     duration: '',
//     startTime: startTime.slice(11, 20),
//     endTime: endTime.slice(11, 20),
//     date: startTime.slice(0, 10)
// }
// routim

async function blockSlotRange(slotToBlock, name = 'block', recurrence, owner) {
    let time1 = UtilsService.changeTimeForDisplay(slotToBlock.start, gUtcDiff)
    let time2 = UtilsService.changeTimeForDisplay(slotToBlock.end, gUtcDiff)
    const startTime = `${slotToBlock.date}T${time1}:00Z`
    const endTime = `${slotToBlock.date}T${time2}:00Z`
    const duration = UtilsService.calculateDuration (time1, time2)

    let confirmedEvent 
    if (+recurrence.count===1) {
        confirmedEvent = await addEventToCalendar(startTime, endTime, name, 'block', '', owner)
        console.log('herer')
    } else {
        // checking if recurrence is possible during all the chosen dates

        const occupiedDates = await checkRecurrenceAvailbility (new Date(`${slotToBlock.date}T02:00:00Z`), time1, time2, duration, recurrence, owner)
        if (!occupiedDates.length) {
             confirmedEvent = await addRecurrenceToCalendar(startTime, endTime, name, 'block', recurrence, owner)
        } else {
            console.log ('recurrence is not possible - the xx date is already full', occupiedDates)
            return occupiedDates
        }
    }
    console.log('adsasd', confirmedEvent)

    const event = { 
        name,
        email: '',
        phone: '',
        eventId: confirmedEvent.id,
        treatments: '',
        duration: '',
        startTime: startTime.slice(11, 20),
        endTime: endTime.slice(11, 20),
        date: startTime.slice(0, 10),
        accountId: owner.accountId,
        calendarId: owner.calendarId,
        token: owner.token,
        workPlace: owner.workPlace
    }
    EventService.saveConfirmedEvent(event)
    return confirmedEvent
}


/////////////////////calendarAdmin:

function buildWeeklyModel(timeSlots, weeklyEvents) {
    let tableCellsModel = []
    for (var i = 0; i < timeSlots.length; i++) {
        tableCellsModel.push([])
    }
    timeSlots.map((ts, tsIdx) => {
        weeklyEvents.map((dailyEvents, dailyIdx) => {
            if (dailyEvents.length) {
                let isCellInUsed = false
                return dailyEvents.map((ev, eventIdx) => {
                    const range = UtilsService.checkIfTsInRange(ts, ev.start, ev.end, 30)
                    if (range.occupied) {
                        isCellInUsed = true
                        tableCellsModel[dailyIdx, tsIdx].push(false)
                        // tableCellsModel[dailyIdx, tsIdx].push({name:ev.name,id:ev.id,start:ev.start,end:ev.end})
                    }
                    else if ((dailyEvents.length === eventIdx + 1) && (!isCellInUsed)) {
                        tableCellsModel[dailyIdx, tsIdx].push(true)
                    }
                })
            } else {
                tableCellsModel[dailyIdx, tsIdx].push(true)
            }
        })
    })
    return tableCellsModel
}

function getAvailbleDuration(table, cellPos, slotSize = 30) {
    let durationAvalability = 0
    let i = cellPos.tsIdx
    while (table[i][cellPos.dailyIdx] && i < table.length - 1) {
        durationAvalability += slotSize
        i++
    }
    if (!durationAvalability) return slotSize
    return durationAvalability
}

function getHoursToBlock(timeSlots, ts, availableDuration, date, isDayFullyAvailable, slotSize = 30) {
    let hoursToBlock = []
    const tsIdx = timeSlots.findIndex(timeSlot => timeSlot === ts)
    const availableSlots = availableDuration / slotSize
    for (let i = tsIdx; i < (tsIdx + availableSlots); i++) {
        hoursToBlock.push(
            {
                date,
                start: ts,
                end: timeSlots[i + 1],
                isMarked: false
            }
        )
    }
    if (isDayFullyAvailable) {
        hoursToBlock.unshift(
            {
                date,
                start: timeSlots[0],
                end: timeSlots[timeSlots.length - 1],
                isMarked: false
            }
        )
        if (ts === timeSlots[0]) hoursToBlock.pop()
    }
    return hoursToBlock
}

function getDatesWeeklyRange(date) {
    const days = UtilsService.getWeekIsosDatesForCalendar(date.getDay() + 1, date)
    const firstDay = UtilsService.convertDateToIsraelisDisplay(days[0].start.slice(0, 10))
    const lastDay = UtilsService.convertDateToIsraelisDisplay(days[days.length - 1].start.slice(0, 10))
    return { lastDay, firstDay }

}