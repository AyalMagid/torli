const INITIAL_STATE = {
    calendar: null,
    timeSlots: null,
    confirmedEventId:null
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

        default:
            return state;
    }
}


