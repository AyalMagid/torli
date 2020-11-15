import React, { useEffect } from 'react';
import './App.scss';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { AppHeader } from './cmps/AppHeader/AppHeader';
import { TreatmentApp } from './pages/TreatmentApp/TreatmentApp.jsx'
import { EditTreatments } from './pages/EditTreatments/EditTreatments.jsx'
import { TreatmentToEdit } from './pages/TreatmentToEdit/TreatmentToEdit.jsx'
import { CalendarApp } from './pages/CalendarApp/CalendarApp.jsx'
import { SubmitForm } from './pages/SubmitForm/SubmitForm.jsx'
import { CancelAppointment } from './pages/CancelAppointment/CancelAppointment.jsx'
import { SignupOrLogin } from './pages/SignupOrLogin/SignupOrLogin.jsx'
import { Login } from './pages/Login/Login.jsx'
import { Signup } from './pages/Signup/Signup.jsx'
import { HomePage } from './pages/HomePage/HomePage.jsx'
import { EditUser } from './pages/EditUser/EditUser.jsx'
import { Advertise } from './pages/Advertise/Advertise.jsx'
import { AdminContacts } from './pages/AdminContacts/AdminContacts.jsx'
import { CalendarAdmin } from './pages/CalendarAdmin/CalendarAdmin.jsx'
import { HashRouter as Router } from 'react-router-dom';
import { updateLoggedInUser } from './actions/userAction.js';
import StorageService from './services/StorageService';
import UserService from './services/UserService';

export function _App(props) {

  useEffect(() => {
    (async () => {
    let user = await StorageService.loadFromStorage('tori-user')
    if (user&&!props.loggedInUser) {
     await props.updateLoggedInUser(await UserService.getUser(user.phone))
    }
  })()
  }, []);

  return (
    <Router>
      <div className="App">
        <AppHeader />
        <Switch >
          <Route path="/calendar" component={CalendarApp} />
          <Route path="/cancelAppointment" component={CancelAppointment} />
          <Route path="/form" component={SubmitForm} />
          <Route path="/treatments" component={TreatmentApp} />
          <Route path="/editTreatments" component={EditTreatments} />
          <Route path="/treatmentToEdit" component={TreatmentToEdit} />
          <Route path="/signupOrLogin" component={SignupOrLogin} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/editUser" component={EditUser} />
          <Route path="/calendarAdmin" component={CalendarAdmin} />
          <Route path="/advertise" component={Advertise} />
          <Route path="/adminContacts" component={AdminContacts} />
          <Route path="/" component={HomePage} />
        </Switch>
      </div>
    </Router>
  );
}


function mapStateProps(state) {
  return {
    loggedInUser: state.UserReducer.loggedInUser
  }
}

const mapDispatchToProps = {
  updateLoggedInUser
}

export const App = connect(mapStateProps, mapDispatchToProps)(_App)