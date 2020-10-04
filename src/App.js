import React from 'react';
import './App.scss';
import { Switch, Route } from 'react-router-dom';
import { AppHeader } from './cmps/AppHeader/AppHeader';
import { TreatmentApp } from './pages/TreatmentApp/TreatmentApp.jsx'
import { CalendarApp } from './pages/CalendarApp/CalendarApp.jsx'
import { SubmitForm } from './pages/SubmitForm/SubmitForm.jsx'
import { CancelAppointment } from './pages/CancelAppointment/CancelAppointment.jsx'
import { HomePage } from './pages/HomePage/HomePage.jsx'
import { HashRouter as Router} from 'react-router-dom';

function App() {

  return (
    <Router>
      <div className="App">
        <AppHeader/>
          <Switch >
            <Route path="/calendar" component={CalendarApp} />
            <Route path="/cancelAppointment" component={CancelAppointment} />
            <Route path="/form" component={SubmitForm} />
            <Route path="/treatments" component={TreatmentApp} />
            <Route path="/" component={HomePage} />
          </Switch>
      </div>
      </Router>
  );
}

export default App;
