import UserService from '../services/UserService';

const INITIAL_STATE = {
    users: [],
    logedinUser:null,
    userToSchedule: null,
    isAdShown: false,
    userPhoneInContactSignup: ''
}

export function UserReducer(state = INITIAL_STATE, action) {
    switch (action.type) {

        case 'SET_USERS':
            return {
                ...state,
                   users: (state.userPhoneInContactSignup) ? UserService.unshiftCellByPhoneNumber(action.users, state.userPhoneInContactSignup) : action.users
            }
        case 'UPDATE_USERS':
            return {
                ...state,
                users: action.users
            }
        case 'UPDATE_LOGEDIN_USER':
            return {
                ...state,
                logedinUser: action.logedinUser
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
        case 'UPDATE_IS_AD_SHOWN':
            return {
                ...state,
                isAdShown: action.isAdShown
            }
        case 'UPDATE_NUMBER_IN_CONTACT_SIGNUP':
            return {
                ...state,
                userPhoneInContactSignup: action.userPhoneInContactSignup
            }

        default:
            return state;
    }
}
