import HttpService from './HttpService'

export default {
    saveConfirmedEvent,
    getMongoEventByEventCalendarId,
    getReccurenceMongoEventBySubStrId,
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

async function getReccurenceMongoEventBySubStrId(subStrId) {
    return await HttpService.get(`event/reccurence/${subStrId}`)
}

function removeEventFromDB (_id) {
    return HttpService.delete(`event/${_id}`)
}