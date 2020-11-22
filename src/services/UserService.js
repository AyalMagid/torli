import HttpService from './HttpService'
import StorageService from "../services/StorageService";

export default {
    getUsers,
    getUser,
    addUser,
    removeUser,
    updateUser,
    unshiftCellByPhoneNumber,
    // routim
    getOwner
}

function _sortUsers(users) {
    return users.sort((a, b) => a.name.localeCompare(b.name))
}

async function getUsers() {
    const users = await HttpService.get('user')
    return _sortUsers(users)
}

//  routim
// async function getUsers(workPlace) {
//     const users = await HttpService.get(`user/workPlace/${workPlace}`)
//     return _sortUsers(users)
// }

function getUser(phone) {
    return HttpService.get(`user/${phone}`)
}

// routim
function getOwner(workPlace){
    // const workPlace = (window.location.href)
    // console.log(window.location.href)
    return HttpService.get(`user/owner/${workPlace}`)
}

function updateUser(user) {
    user.oldPhone = StorageService.loadFromStorage('tori-user').phone
    StorageService.saveToStorage('tori-user', user)
    return HttpService.put(`user/`, user)
}

async function addUser(user, isCreateadByAdmin) {
    user.isMarked = false
    if (!isCreateadByAdmin) StorageService.saveToStorage('tori-user', user)
    //need to come from backend env
    if (user.phone === '123456789') user.isAdmin = true
    else user.isAdmin = false
    return await HttpService.post('user', user)
}

async function removeUser(_id) {
    StorageService.saveToStorage('tori-user', '')
    return HttpService.delete(`user/${_id}`)
}


function unshiftCellByPhoneNumber(users, phone) {
    const idx = users.findIndex(user => user.phone === phone)
    let splicedCell = users.splice(idx, 1)[0]
    splicedCell.isMarked = true
    let copySplicedCell = { ...splicedCell }
    users.unshift(copySplicedCell)
    return users
}


