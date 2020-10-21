import {store} from "../store.js";

export default {
    initApp
}

function initApp() {
    store.dispatch({type: 'UPDATE_ACTIVE_STEP',step:0})
    store.dispatch({type: 'SET_TREATMENT', treatment:null})
    store.dispatch({type: 'SET_TREATMENTS', treatments:null})
    store.dispatch({type: 'SET_TIMESLOTS',timeSlots:null})
    store.dispatch({type: 'INIT_DURATION'})
    store.dispatch({type: 'INIT_PICKED_TREATMENTS_COUNT'})
}