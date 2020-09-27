import HttpService from './HttpService'
import UtilsService from "../services/UtilsService";

export default {
    getTreatments,
    getById,
    remove,
    update,
    updateTreatments,
    getMarkedTreatmentsStr
}

// update only the store not mongo DB
function updateTreatments(treatments, updatedTreatment){
    const idx = treatments.findIndex(tr => tr._id === updatedTreatment._id)
    treatments[idx] = updatedTreatment
return treatments
}

function getMarkedTreatmentsStr(treatments) {
    treatments = (treatments.filter(tr => tr.marked))
    return UtilsService.arrayToString(treatments)
}

// comunicate with backend
function getTreatments() {
    return HttpService.get('treatment')
}

function getById(treatmentId) {
    return HttpService.get(`treatment/${treatmentId}`)
}
function remove(treatmentId) {
    return HttpService.delete(`treatment/${treatmentId}`)
}

function update(treatment) {
    return HttpService.put(`treatment/${treatment._id}`, treatment)
}