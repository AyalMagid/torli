const INITIAL_STATE = {
    calendar: null,
    timeSlots: null,
    hoursToBlock:null,
    slotToBlock:null,
    confirmedEventId:null,
    isDayFullyAvailable:false
}

export function CalendarReducer(state = INITIAL_STATE, action) {
    switch (action.type) {      
        
        case 'SET_CALENDAR':
            return {
                ...state,
                calendar: action.calendar
            }          
        case 'SET_TIMESLOTS':
            return {
                ...state,
                timeSlots: action.timeSlots
            }          
        case 'UPDATE_HOURS_TO_BLOCK':
            return {
                ...state,
                slotsRangeToBlock: action.slotsRangeToBlock
            }          
        case 'UPDATE_SLOT_TO_BLOCK':
            return {
                ...state,
                slotToBlock: action.slotToBlock
            }          
        case 'UPDATE_IS_DAY_FULLY_AVAILABLE':
            return {
                ...state,
                isDayFullyAvailable: action.isDayFullyAvailable
            }          

        default:
            return state;
    }
}


