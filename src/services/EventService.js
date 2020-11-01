import HttpService from './HttpService'

export default {
    saveConfirmedEvent,
    getMongoEventByEventCalendarId,
    getEventByPhone,
    removeEventFromDB
}

// MONGO DB - GOES THREW BACKEND

function saveConfirmedEvent(event){
    return HttpService.post('event',event)
}

function getEventByPhone (phone) {
    return HttpService.get(`event/${phone}`)
}


function getMongoEventByEventCalendarId(evId) {
    return HttpService.get(`event/${evId}`)
}

function removeEventFromDB (_id) {
    return HttpService.delete(`event/${_id}`)
}