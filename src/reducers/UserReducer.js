const INITIAL_STATE = {
    users:[],
    userToSchedule:null
}

export function UserReducer(state = INITIAL_STATE, action) {
    switch (action.type) {      

        case 'SET_USERS':
            return {
                ...state,
                users: action.users
            }          
        case 'UPDATE_USERS':
            return {
                ...state,
                users: action.users
            }          
        case 'SET_USER_TO_SCHEDULE':
            return {
                ...state,
                userToSchedule: action.userToSchedule
            }          
        case 'UPDATE_USER_TO_SCHEDULE':
            return {
                ...state,
                userToSchedule: action.userToSchedule
            }          
        
        default:
            return state;
    }
}