import React, {useState, useEffect } from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import { TabsApp } from '../TabsApp/TabsApp.jsx';
import { StepperApp } from '../StepperApp/StepperApp.jsx';
import StoreService from '../../services/StoreService';
import './AppHeader.scss';


function _AppHeader(props) {

    const location = useLocation()

    const [headerConstrains, setHeaderConstrains] = useState(false)

    useEffect(() => {
        let initWithFalse = {isHeader:false, noHeaderMargin:false,  isStepper:false, isTabs:false}
        switch (location.pathname) {
            case '/':
                setHeaderConstrains(false)
                break;
            case '/calendarAdmin/':
                setHeaderConstrains(false)
                break;
            case '/advertise':
                setHeaderConstrains({...initWithFalse, isHeader:true, noHeaderMargin:true}) 
                break;
            case '/signupOrLogin':
                setHeaderConstrains({...initWithFalse, isHeader:true, noHeaderMargin:true})
                break;
            case '/signup':
                setHeaderConstrains({...initWithFalse, isHeader:true})
                break;
            case '/login':
                setHeaderConstrains({...initWithFalse, isHeader:true})
                break;
            case '/treatments':
                setHeaderConstrains({...initWithFalse, isStepper:true, isTabs:true})
                break;
            case '/calendar':
                setHeaderConstrains({...initWithFalse, isHeader:true, isStepper:true})
                break;
            case '/form':
                setHeaderConstrains({...initWithFalse, isHeader:true, isStepper:true})
                break;
            case '/cancelAppointment':
                 setHeaderConstrains({...initWithFalse, isTabs:true})
                break;
            case '/editUser':
                setHeaderConstrains({...initWithFalse, isHeader:true})
                break;
            default:
                setHeaderConstrains(false)
        }
    }, [location.pathname]);

    function navToHomePage() {
        StoreService.initApp()
        props.history.push('/')
    }

    return (
        <>
            {
                (headerConstrains) &&
                    <div className={`${(headerConstrains.noHeaderMargin)? 'app-header-no-margin':'app-header'}`}>
                            {
                              (headerConstrains.isHeader)?
                                <header className="flex upper-header align-center">
                                  <h2 onClick={navToHomePage} id="text" className="logo"> Tori<i className="fas fa-tasks"></i></h2>
                                </header>
                                :
                                ''
                            }
                            {
                               (headerConstrains.isTabs)?
                                <TabsApp />
                                    :
                                ''
                            }
                            {
                               (headerConstrains.isStepper)?
                                <StepperApp />
                                    :
                                ''
                            }      
                    </div>
            }
        </>
    )
}

export const AppHeader = withRouter(_AppHeader)



