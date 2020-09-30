import HttpService from './HttpService'
import EventService from './EventService'
import UtilsService from "../services/UtilsService";
import EmailService from '../services/EmailService'
import axios from 'axios';

export default {
    getCalendar,
    getAvailbleDailySlots,
    addEventToCalendar,
    removeEventFromCalendar,
    setAppointment
}

// // AYAL'S CALENDAR
// const ACCOUNT_ID = '413361439'
// const CALENDAR_ID = 'calendar_YXlhbG1pc2huQGdtYWlsLmNvbQ'
// const TOKEN = "Bearer mFzYTSGauAA4QGdG6rI9MtfvvfEZHo"

// BAR SECOND
const ACCOUNT_ID = '416830154'
const CALENDAR_ID = "calendar_YmFydmFyZm1hbjNAZ21haWwuY29t"
const TOKEN = "Bearer Zz1lcWHR2WjThDJhiLrJ4fgJ8ZzoxU"

// BAR
// const ACCOUNT_ID = '416457905'
// const CALENDAR_ID = 'calendar_YmFydmFydGVzdEBnbWFpbC5jb20'
// const TOKEN = "Bearer gVTIuU0seE73kvJqfCyLS8uFYV3cwm"

// get the first calendar connected to this TOKEN (usually only 1 should be there)
function getCalendar() {
    return HttpService.get('calendar')
}

function addEventToCalendar(startTime, endTime, eventName, creatorName, creatorEmail){
    const event = {eventName,creatorName,creatorEmail,startTime,endTime}
    return HttpService.post('calendar',event)
}

async function removeEventFromCalendar (eventId){
    return HttpService.delete('calendar',{eventId})
}

// async function getAvailbleDailySlots (startTime, endtTime, duration){ 
//     const dailySlots = {startTime, endtTime, duration}
//     return await HttpService.post('calendar/slots', dailySlots)
// }

// if no time slots availble returns only the date - update also in backend 
async function getAvailbleDailySlots (startTime, endtTime, duration){ 
    const timeSlots = await axios({
      method: 'post',
      url: `https://api.kloudless.com/v1/accounts/${ACCOUNT_ID}/cal/availability`,
      headers: {Authorization: TOKEN, 'Content-Type': 'application/json'},
      data: JSON.stringify( {
          "meeting_duration": `PT${duration}`,
              "time_windows": [
                  {
                      "start": startTime,
                      "end": endtTime
                  }
              ] 
      })
    })
    if (timeSlots.data.time_windows.length) return timeSlots.data.time_windows
    // return just a string with the date which is needed for later
    else return startTime
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
    EmailService.sendEmail(name, treatment.date, email, true, phone, duration, treatment.time , treatments ) 
}

