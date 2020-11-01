import UserService from '../services/UserService';
import StorageService from '../services/StorageService';

export function loadUsers() {
  return async dispatch => {
    try {
      const users = await UserService.getUsers();
      dispatch(setUsers(users));
    } catch (err) {
      console.log('userActions: err in loadUsers', err);
    };
  }
}

export function setUsers(users) {
  return {
    type: 'SET_USERS',
    users
  };
}

export function updateUsers(users) {
  return async dispatch => {
    try {
      dispatch(_updateUsers(users));
    } catch (err) {
      console.log('userActions: err in loadUsers', err);
    };
  }
}

export function _updateUsers(users) {
  return {
    type: 'UPDATE_USERS',
    users
  };
}


export function updateUser(user) {
  return async dispatch => {
    try {
      dispatch(_updateUser(user));
    } catch (err) {
      console.log('userActions: err in updateUser', err);
    };
  }
}

export function _updateUser(user) {
  return {
    type: 'UPDATE_USER',
    user
  };
}


export function setUserToSchedule() {
  return dispatch => {
    const userToSchedule = StorageService.loadFromStorage('tori-user');
    dispatch(_setUserToSchedule(userToSchedule));
  }
}

export function _setUserToSchedule(userToSchedule) {
  return {
    type: 'SET_USER_TO_SCHEDULE',
    userToSchedule
  };
}



export function updateUserToSchedule(userToSchedule) {
  return dispatch => {
    dispatch(_updateUserToSchedule(userToSchedule));
  }
}

export function _updateUserToSchedule(userToSchedule) {
  return {
    type: 'UPDATE_USER_TO_SCHEDULE',
    userToSchedule
  };
}


export function updateIsAdShown(isAdShown) {
  return dispatch => {
    dispatch(_updateIsAdShown(isAdShown));
  }
}

export function _updateIsAdShown(isAdShown) {
  return {
    type: 'UPDATE_IS_AD_SHOWN',
    isAdShown
  };
}



export function updateUserPhoneInContactSignup(userPhoneInContactSignup) {
  return dispatch => {
    dispatch(_updateUserPhoneInContactSignup(userPhoneInContactSignup));
  }
}

export function _updateUserPhoneInContactSignup(userPhoneInContactSignup) {
  return {
    type: 'UPDATE_NUMBER_IN_CONTACT_SIGNUP',
    userPhoneInContactSignup
  };
}

