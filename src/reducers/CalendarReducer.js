const INITIAL_STATE = {
    calendar: null,
    timeSlots: null,
    hoursToBlock:null,
    slotToBlock:null,
    confirmedEventId:null,
    isDayFullyAvailable:false,
    tableModel:[],
    recurrence: {isRecurrence:false, freq:'DAILY', count: 1}
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
        case 'UPDATE_RECURRENCE':
            return {
                ...state,
                recurrence: action.recurrence
            }          
        case 'UPDATE_TABLE_MODEL':
            console.table('reduce', action.tableModel)
            return {
                ...state,
                tableModel: action.tableModel
            }          

        default:
            return state;
    }
}


