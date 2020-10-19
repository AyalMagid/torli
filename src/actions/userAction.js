import UserService from '../services/UserService';

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