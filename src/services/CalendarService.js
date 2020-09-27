import HttpService from './HttpService'
import UtilsService from "../services/UtilsService";
import EmailService from '../services/EmailService'
import axios from 'axios';

// const url = process.env.NODE_ENV === 'production'
//     ? '/api/calendar'
//     : '//localhost:3030/api/calendar'

export default {
    getCalendar,
    getAvailbleDailySlots,
    update,
    remove,
    saveConfirmedEvent,
    getEventByPhone,
    removeEventFromDB,
    setAppointment
}

// // AYAL'S CALENDAR
// const ACCOUNT_ID = '413361439'
// const CALENDAR_ID = 'calendar_YXlhbG1pc2huQGdtYWlsLmNvbQ'
// const TOKEN = "Bearer mFzYTSGauAA4QGdG6rI9MtfvvfEZHo"

// BAR
const ACCOUNT_ID = '416457905'
const CALENDAR_ID = 'calendar_YmFydmFydGVzdEBnbWFpbC5jb20'
const TOKEN = "Bearer gVTIuU0seE73kvJqfCyLS8uFYV3cwm"
// BAR new
// const ACCOUNT_ID = '416830154'
// const CALENDAR_ID = "calendar_YmFydmFyZm1hbjNAZ21haWwuY29t"
// const TOKEN = "Bearer Zz1lcWHR2WjThDJhiLrJ4fgJ8ZzoxU"

async function getCalendar() {
    const res = await axios ({
        method: 'get',
        url: 'https://api.kloudless.com/v1/accounts?enabled=True',
        headers: {Authorization: TOKEN}
    })
    const calendar = res.data.objects[0]
    return calendar
}

async function getAvailbleDailySlots (startTime,endtTime,duration){ 
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
  return timeSlots.data.time_windows
}

// should be put/patch
function update (startTime, endtTime, eventName, creatorName, creatorEmail){
    const url = `https://api.kloudless.com/v1/accounts/${ACCOUNT_ID}/cal/calendars/primary/events`
return fetch(url, {
    method: 'post',
    headers: {Authorization: TOKEN, 'Content-Type': 'application/json'}
,
body: JSON.stringify( 
    {
        "name": `${creatorName} - ${eventName}`,
        "description" : eventName,
        "start": startTime,
        "end": endtTime,
        // "creator": {
        //     "name": creatorName,
        //     "email": creatorEmail
        // }
    })
}).then(res=> res.json())
  .then(json => { return json});
}

function saveConfirmedEvent(event){
    return HttpService.post('calendar',event)
}

function getEventByPhone (phone) {
    return HttpService.get(`calendar/${phone}`)
}

async function remove (eventId){
    const url = `https://api.kloudless.com/v1/accounts/${ACCOUNT_ID}/cal/calendars/${CALENDAR_ID}/events/${eventId}`
    const res = await axios (url, {
    method: 'delete',
    headers: {Authorization: TOKEN}
})
    console.log(res.data)
}

function removeEventFromDB (_id) {
    console.log(_id)
    return HttpService.delete(`calendar/${_id}`)
}

// async function update  (startTime, endtTime, eventName, creatorName, creatorEmail){
//   const updatedCalendar = await axios ({
//       maethod: 'post',
//       url: `https://api.kloudless.com/v1/accounts/${ACCOUNT_ID}/cal/calendars/primary/events`,
//       headers: {Authorization: TOKEN, 'Content-Type': 'application/json'},
//       body: JSON.stringify ( 
//         {
//             "name": eventName,
//             "start": startTime,
//             "end": endtTime,
//             "creator": {
//                 "name": creatorName,
//                 "email": creatorEmail
//             }
//         })
//   })
//   console.log('updated',updatedCalendar.data)
// }
    


// function update(calendar) {
//     return HttpService.put('calendar', calendar)
// }

async function setAppointment(treatments, duration, phone, email, name, treatment) {
    let time = UtilsService.changeTimeForDisplay(treatment.time, 3)
    const startTime = `${treatment.date}T${time}:00Z`
    time = UtilsService.calculateEndTime(time, duration)
    const endTime = `${treatment.date}T${time}:00Z`
    const confirmedEvent = await update(startTime, endTime, treatments, name, 'ayal@gmail.com')
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
    saveConfirmedEvent(event)
    console.log(event);
    EmailService.sendEmail(name, treatment.date, email, true, phone, duration, treatment.time , treatments ) 
}

