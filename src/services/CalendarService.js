import HttpService from './HttpService'
import EventService from './EventService'
import UtilsService from "../services/UtilsService";
import EmailService from '../services/EmailService';

export default {
    getCalendar,
    getAvailbleDailySlots,
    addEventToCalendar,
    removeEventFromCalendar,
    setAppointment,
    getEventsFromCalendar,
    buildWeeklyModel,
    getAvailbleDuration,
    getHoursToBlock,
    blockSlotRange
}

var gUtcDiff = 2

// get the first calendar connected to this TOKEN (usually only 1 should be there)
function getCalendar() {
    return HttpService.get('calendar')
}


async function getEventsFromCalendar(timeRange) {
    return await HttpService.get(`calendar/${timeRange.start}/${timeRange.end}`)
}

function addEventToCalendar(startTime, endTime, eventName, creatorName = 'block', creatorEmail) {
    const event = { eventName, creatorName, creatorEmail, startTime, endTime }
    return HttpService.post('calendar', event)
}

async function removeEventFromCalendar(eventId) {
    const res = await HttpService.delete('calendar', { eventId })
    console.log(res);
    return res
}

async function getAvailbleDailySlots(startTime, endtTime, duration) {
    const dailySlots = { startTime, endtTime, duration }
    return await HttpService.post('calendar/slots', dailySlots)
}

// MAKING SOME CALCULATIONS AND THAN CALLING OTHER FUNCTIONS TO ADD THE EVENT TO CALENDAR + MONGO DB
async function setAppointment(treatments, duration, phone, email, name, treatment) {
    console.log(treatments, duration, phone, email, name, treatment)
    let time = UtilsService.changeTimeForDisplay(treatment.time, gUtcDiff)
    const startTime = `${treatment.date}T${time}:00Z`
    time = UtilsService.calculateEndTime(time, duration)
    const endTime = `${treatment.date}T${time}:00Z`
    const confirmedEvent = await addEventToCalendar(startTime, endTime, treatments, name, 'ayal@gmail.com')
    const event = {
        name,
        email,
        phone,
        eventId: confirmedEvent.id,
        treatments,
        duration,
        startTime: startTime.slice(11, 20),
        endTime: endTime.slice(11, 20),
        date: startTime.slice(0, 10)
    }
    EventService.saveConfirmedEvent(event)
    EmailService.sendEmail(name, treatment.date, email, true, phone, duration, treatment.time, treatments)
    return confirmedEvent
}

async function blockSlotRange(slotToBlock, name = 'block') {
    let time1 = UtilsService.changeTimeForDisplay(slotToBlock.start, gUtcDiff)
    let time2 = UtilsService.changeTimeForDisplay(slotToBlock.end, gUtcDiff)
    const startTime = `${slotToBlock.date}T${time1}:00Z`
    const endTime = `${slotToBlock.date}T${time2}:00Z`
    const confirmedEvent = await addEventToCalendar(startTime, endTime, name)
    const event = {
        name,
        email: '',
        phone: '',
        eventId: confirmedEvent.id,
        treatments: '',
        duration: '',
        startTime: startTime.slice(11, 20),
        endTime: endTime.slice(11, 20),
        date: startTime.slice(0, 10)
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

