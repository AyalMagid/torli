import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { useLocation, withRouter } from 'react-router-dom';
import { updateIsModalOpen } from '../../actions/modalAction.js';
import { Modal } from '../../cmps/Modal/Modal';
import { motion } from 'framer-motion'
import MotionService from "../../services/MotionService";
import { setTimeSlots } from '../../actions/calendarActions.js';
import { updateActiveStep } from '../../actions/stepperActions';
import UtilsService from "../../services/UtilsService";
import CalendarService from '../../services/CalendarService';
import EventService from '../../services/EventService';
import EmailService from '../../services/EmailService';
import StorageService from "../../services/StorageService";
import { LoaderApp } from '../../cmps/LoaderApp/LoaderApp';
import './CancelAppointment.scss';

export function _CancelAppointment(props) {

    useEffect(() => {
        getEventsByPhone()
    }, []);

    const location = useLocation()

    const [loader, setLoader] = React.useState(<LoaderApp />);
    setTimeout(() => {
        setLoader('')
    }, 2000);

    const [phone, setPhone] = React.useState((props.clickedUser) ? props.clickedUser.phone : StorageService.loadFromStorage('tori-user').phone);

    const [eventsToCancel, setEventsToCancel] = useState(null)

    const [pageCount, setPageCount] = useState(0)

    const [eventsAmount, setEventsAmount] = useState(0)

    function getEventsByPhone() {
        EventService.getEventByPhone(phone)
            .then(events => {
                if (!events[0]) return
                const filteredEvents = events.filter(event => {
                    let year = event.date.slice(0, 4)
                    let month = event.date.slice(5, 7)
                    let day = event.date.slice(8, 10)
                    let hours = +event.startTime.slice(0, 2) + 3
                    const date = new Date(year, month - 1, day, hours, 0).getTime()
                    return (date > Date.now())
                })
                if (filteredEvents.length) {
                    setEventsAmount(filteredEvents.length)
                    filteredEvents.sort((a, b) => {
                        if (+a.date.slice(2,4) > +b.date.slice(2,4)) return 1
                        if (+a.date.slice(8,10) > +b.date.slice(8,10)) return 1
                        if (+a.date.slice(5,7) > +b.date.slice(5,7)) return 1
                        return -1
                    })
                    setEventsToCancel(UtilsService.getEventReadyForDisplay(filteredEvents))
                } else {
                    setEventsToCancel(null)
                }
            })
    }


   
    // CalendarService.removeEventFromCalendar(eventToRmove.eventId)
    // routim
    // email service need changes
    async function cancelAppointment(eventId) {
        props.updateIsModalOpen(true)
        const events = await EventService.getEventByPhone(phone)
        let eventToRmove = events.find(event => event._id === eventId)
        // delete from Calendar
        CalendarService.removeEventFromCalendar(eventToRmove)

        if (pageCount) { setPageCount(pageCount - 1) }
        EmailService.sendEmail(eventToRmove.name, eventToRmove.date, eventToRmove.email, false)
        // delete from mongo data base
        await EventService.removeEventFromDB(eventToRmove._id)
        getEventsByPhone()
        //open modal useing store
    }

    function checkNextBtnDisabillity(){
        if (!eventsToCancel) return true
        return  !((eventsToCancel.length > 1) && (pageCount < eventsToCancel.length-1))
    }

    function checkBackBtnDisabillity(){
        if (!eventsToCancel) return true
        return  !pageCount > 0
    }

    return (
        <div className="cancel-appointment flex column align-center space-between ">
            <motion.div
                className="motion-div"
                initial="out"
                exit="in"
                animate="in"
                variants={MotionService.getMotionStyle('pageVariants')}
                transition={MotionService.getMotionStyle('pageTransition')}
            >
                {
                    (loader) ?
                        <div className="cancel-apointment-loader">{loader}</div>
                        :
                        <main className="cancel-appointment-wrapper">
                                      {(eventsToCancel) ?
                                      (eventsAmount===1) ?
                                        <div className={`appointments-amount-title ${(location.pathname!=='/cancelAppointment')? 'appointments-amount-title-modal' : ''}`}>
                                            {`נמצא תור אחד`}
                                        </div>
                                        :
                                        <div className={`appointments-amount-title ${(location.pathname!=='/cancelAppointment')? 'appointments-amount-title-modal' : ''}`}>
                                            {`נמצאו ${UtilsService.convertNumberToWords(eventsAmount)} תורים`}
                                        </div>
                                            :
                                            ''
                                        }
                            <div className="table-wrapper">
                                {(eventsToCancel) ?
                                <div>
                              
                                    <div className={`cancel-table-container`}>
                                        <div className="apointment-details">
                                            <div className="table-cell"> <span>סוג הטיפול</span> : {eventsToCancel[pageCount].treatments}</div>
                                            <div className="table-cell"> בתאריך : {eventsToCancel[pageCount].date}</div>
                                            <div className="last-cell"> בין השעות : {`${eventsToCancel[pageCount].endTime} - ${eventsToCancel[pageCount].startTime}`}</div>
                                        </div>
                                    </div>
                                </div>
                                    :
                                    <div className="no-apointments">
                                        לא נמצאו תורים
                                    </div>
                                }
                            </div>
                            {eventsToCancel &&
                            <div className="cancel-appointment-btn flex align-center space-around" onClick={() => cancelAppointment(eventsToCancel[pageCount].id)}>
                                    <div className="cancel-appointment-btn-text">בטל תור זה</div>
                                    <i className="fas fa-ban"></i>
                            </div>
                            }
                                    <div className="cancel-appointment-btns-container flex">
                                            <div className="nav-btn-wrapper"  >
                                                <button className={`nav-btn ${(props.clickedUser)?'nav-btn-right':''}`} disabled={checkBackBtnDisabillity()} onClick={() => setPageCount(pageCount - 1)}>
                                                    <i className="fas fa-arrow-circle-right"></i>
                                                </button>
                                            </div>
                                            <div className={`nav-btn-wrapper`} >
                                                <button className={`nav-btn ${(props.clickedUser)?'nav-btn-left':''}`} disabled={checkNextBtnDisabillity()} onClick={() => {
                                                    setPageCount(pageCount + 1)
                                                    console.log(pageCount)
                                            } }>
                                                     <i className="fas fa-arrow-circle-left"></i>
                                                </button>
                                            </div>
                                         </div>
                        </main>
                }
                
            </motion.div>
            <Modal modalContent={
                <div className="flex align-center justify-center" style={{ height: '100%' }}>
                    <div>התור בוטל, תודה על העדכון.</div>
                </div>} />
        </div>
    );
}

function mapStateProps(state) {
    return {
    }
}

const mapDispatchToProps = {
    updateActiveStep,
    setTimeSlots,
    updateIsModalOpen
}

export const CancelAppointment = withRouter(connect(mapStateProps, mapDispatchToProps)(_CancelAppointment))


