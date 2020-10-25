import HttpService from './HttpService'

export default {
    getAd,
    updateAd,
    createAd
}

// MONGO DB - GOES THREW BACKEND

 function getAd() {
    return HttpService.get('advertise')
}

function updateAd(content) {
    console.log(content);
    return HttpService.put('advertise', content)
}

 function createAd() {
    return  HttpService.post('advertise')
}

