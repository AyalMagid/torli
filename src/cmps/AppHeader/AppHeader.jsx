import React from 'react';
import { useLocation,withRouter } from 'react-router-dom';
import { TabsApp } from '../TabsApp/TabsApp.jsx';
import { StepperApp } from '../StepperApp/StepperApp.jsx';
import './AppHeader.scss';


   function _AppHeader(props) {

    const location = useLocation()

    return (
        <>
            {
                (location.pathname !== '/') &&
                <div className="app-header">
                    {
                        ((location.pathname !== '/treatments') && (location.pathname !== '/cancelAppointment')) &&
                        <header className="flex upper-header align-center">
                            <h2 onClick={()=>props.history.push('/')} id="text" className="logo"> Tori<i className="fas fa-tasks"></i></h2>
                        </header>
                    }
                    {((location.pathname === '/treatments') || (location.pathname === '/cancelAppointment')) ? <TabsApp /> : ''}
                    {(location.pathname === '/cancelAppointment') ? '' : <StepperApp />}
                </div>
            }
        </>
    )
}

export const AppHeader = withRouter(_AppHeader)



