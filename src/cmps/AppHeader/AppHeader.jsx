import React, { useEffect, useState } from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import { TabsApp } from '../TabsApp/TabsApp.jsx';
import { StepperApp } from '../StepperApp/StepperApp.jsx';
import './AppHeader.scss';


function _AppHeader(props) {
    const location = useLocation()
    return (
        <>
            {
                (location.pathname !== '/') &&
                <div className={(location.pathname === '/calendarAdmin')?'app-header-no-margin':'app-header'}>
                    {
                        ((location.pathname !== '/treatments') && (location.pathname !== '/cancelAppointment')) &&
                        <header className="flex upper-header align-center">
                            <h2 onClick={() => props.history.push('/')} id="text" className="logo"> Tori<i className="fas fa-tasks"></i></h2>
                        </header>
                    }
                    {((location.pathname === '/treatments') || (location.pathname === '/cancelAppointment')) ? <TabsApp /> : ''}
                    {(location.pathname === '/cancelAppointment') || (location.pathname === '/login')
                        || (location.pathname === '/adminpage') || (location.pathname === '/userpage') || (location.pathname === '/calendarAdmin') ? '' : <StepperApp />}
                </div>
            }
        </>
    )
}

export const AppHeader = withRouter(_AppHeader)



