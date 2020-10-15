import HttpService from './HttpService'

export default {
    saveConfirmedEvent,
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

function removeEventFromDB (_id) {
    console.log(_id)
    return HttpService.delete(`event/${_id}`)
}
