import HttpService from './HttpService'

export default {
    getAd,
    updateAd,
    createAd
}

// MONGO DB - GOES THREW BACKEND

function getAd() {
    return HttpService.get(`advertise`)
}

function updateAd(advertise) {
    return HttpService.post('advertise', advertise)
}

function createAd() {
    return HttpService.post('advertise/create')
}

