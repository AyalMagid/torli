const INITIAL_STATE = {
    users:[]
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
        
        default:
            return state;
    }
}
