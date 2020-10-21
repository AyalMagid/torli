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
    getAvailbleDuration
}

// get the first calendar connected to this TOKEN (usually only 1 should be there)
function getCalendar() {
    return HttpService.get('calendar')
}


async function getEventsFromCalendar(timeRange) {
    return await HttpService.get(`calendar/${timeRange.start}/${timeRange.end}`)
}

function addEventToCalendar(startTime, endTime, eventName, creatorName, creatorEmail) {
    const event = { eventName, creatorName, creatorEmail, startTime, endTime }
    return HttpService.post('calendar', event)
}

async function removeEventFromCalendar(eventId) {
    return HttpService.delete('calendar', { eventId })
}

async function getAvailbleDailySlots(startTime, endtTime, duration) {
    const dailySlots = { startTime, endtTime, duration }
    return await HttpService.post('calendar/slots', dailySlots)
}

// MAKING SOME CALCULATIONS AND THAN CALLING OTHER FUNCTIONS TO ADD THE EVENT TO CALENDAR + MONGO DB
async function setAppointment(treatments, duration, phone, email, name, treatment) {
    let time = UtilsService.changeTimeForDisplay(treatment.time, 3)
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
    console.log(event);
    EmailService.sendEmail(name, treatment.date, email, true, phone, duration, treatment.time, treatments)
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

function getAvailbleDuration(table, cellPos,slotSize=30) {
    let durationAvalability = 0
    let i = cellPos.tsIdx
    while (table[i][cellPos.dailyIdx] && i < table.length-1) {
        durationAvalability += slotSize
        i++
    }
    if(!durationAvalability) return slotSize
    return durationAvalability
}