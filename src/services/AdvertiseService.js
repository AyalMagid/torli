import HttpService from './HttpService'

export default {
    getAd,
    updateAd,
    toggleAdMode,
    createAd
}

// MONGO DB - GOES THREW BACKEND

// routim
//  function getAd(workPlace) {
//     return HttpService.get(`advertise/${workPlace}`)
// }

 function getAd() {
    return HttpService.get('advertise')
}

function updateAd(content) {
    return HttpService.put('advertise', content)
}

// routim
// function updateAd(advertise) {
//     return HttpService.put('advertise', advertise)
// }

function toggleAdMode(isAdMoneOn){
    return HttpService.put('advertise/mode',isAdMoneOn)
}

// routim
// function toggleAdMode(modeObj){
//     return HttpService.put('advertise/mode',modeObj)
// }

 function createAd() {
    return  HttpService.post('advertise')
}

