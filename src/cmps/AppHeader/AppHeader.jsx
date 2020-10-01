import React from 'react';
import { useLocation } from 'react-router-dom';
import { TabsApp } from '../TabsApp/TabsApp.jsx';
import { StepperApp } from '../StepperApp/StepperApp.jsx';
import './AppHeader.scss';


export function AppHeader(props) {

    const location = useLocation()

    return (
        <>
            <div className="app-header">
                {
                ((location.pathname !== '/') && (location.pathname !== '/cancelAppointment')) && 
                <header className="flex upper-header align-center">
                    <h2 id="text" className="logo"> Tori<i  className="fas fa-tasks"></i></h2>
                </header>
                }
                {((location.pathname === '/')||(location.pathname === '/cancelAppointment'))? <TabsApp /> : ''}
                {(location.pathname === '/cancelAppointment')? '': <StepperApp />}
            </div>

        </>
    )
}





