import HttpService from './HttpService'

export default {
    login
}

async function login(user, password) {
    return HttpService.post(`auth/`, {user, password})
}