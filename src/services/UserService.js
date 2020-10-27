import HttpService from './HttpService'
import StorageService from "../services/StorageService";

export default {
    getUsers,
    getUser,
    addUser,
    removeUser,
    updateUser
}

function _sortUsers(users) {
    return users.sort((a, b) => a.name.localeCompare(b.name))
}

async function getUsers() {
    const users = await HttpService.get('user')
    return _sortUsers(users)
}

function getUser(phone) {
    return HttpService.get(`user/${phone}`)
}

function updateUser(user) {
    user.oldPhone = StorageService.loadFromStorage('tori-user').phone
    StorageService.saveToStorage('tori-user', user)
    return HttpService.put(`user/`,user)
}

async function addUser(user) {
    user.isMarked = false
    //need to come from backend env
    if (user.phone === '123456789') user.isAdmin = true
    else user.isAdmin = false
    StorageService.saveToStorage('tori-user', user)
    return HttpService.post('user', user)
}

async function removeUser(_id) {
    StorageService.saveToStorage('tori-user', '')
    return HttpService.delete(`user/${_id}`)
}
