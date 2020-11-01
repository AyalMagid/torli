import HttpService from './HttpService'

export default {
    getAd,
    updateAd,
    toggleAdMode,
    createAd
}

// MONGO DB - GOES THREW BACKEND

 function getAd() {
    return HttpService.get('advertise')
}

function updateAd(content) {
    return HttpService.put('advertise', content)
}

function toggleAdMode(isAdMoneOn){
    return HttpService.put('advertise/mode',isAdMoneOn)
}

 function createAd() {
    return  HttpService.post('advertise')
}
