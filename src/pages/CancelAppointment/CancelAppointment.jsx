import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {updateIsModalOpen} from '../../actions/modalAction.js';
import {Modal} from '../../cmps/Modal/Modal';
import { motion } from 'framer-motion'
import MotionService from "../../services/MotionService";
import { setTimeSlots } from '../../actions/calendarActions.js';
import { updateActiveStep } from '../../actions/stepperActions';
import UtilsService from "../../services/UtilsService";
import CalendarService from '../../services/CalendarService';
import EventService from '../../services/EventService';
import EmailService from '../../services/EmailService';
import StorageService from "../../services/StorageService";
import { LoaderApp } from '../../cmps/LoaderApp/LoaderApp'
import './CancelAppointment.scss';

export function _CancelAppointment(props) {
    useEffect(() => {
        getEventsByPhone()
    }, []);

    const [loader, setLoader] = React.useState(<LoaderApp />);
    setTimeout(() => {
        setLoader('')
    }, 2000);
    const [phone, setPhone] = React.useState((props.userPhone)? props.userPhone:StorageService.loadFromStorage('tori-user').phone);

    const [eventsToCancel, setEventsToCancel] = useState(null)

    const [pageCount, setPageCount] = useState(0)

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
                    setEventsToCancel(UtilsService.getEventReadyForDisplay(filteredEvents))
                } else {
                    setEventsToCancel(null)
                }
            })
    }

    async function cancelAppointment(eventId) {
        const events = await EventService.getEventByPhone(phone)
        let eventToRmove = events.find(event => event._id === eventId)
        // delete from Calendar
        CalendarService.removeEventFromCalendar(eventToRmove.eventId)
        EmailService.sendEmail(eventToRmove.name, eventToRmove.date, eventToRmove.email, false)
        // delete from mongo data base
        await EventService.removeEventFromDB(eventToRmove._id)
        getEventsByPhone() 
        //open modal useing store
        props.updateIsModalOpen(true)
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
                        <main >
                            <div className="table-wrapper">
                                {(eventsToCancel) ?
                                    <div className={`cancel-table-container ${(props.userPhone)?'table-container-in-contacts-modal':''}`}>
                                        <div className="apointment-details">
                                            <div className="table-cell"> <span>סוג הטיפול</span> : {eventsToCancel[pageCount].treatments}</div>
                                            <div className="table-cell"> בתאריך : {eventsToCancel[pageCount].date}</div>
                                            <div className="last-cell"> בין השעות : {`${eventsToCancel[pageCount].endTime} - ${eventsToCancel[pageCount].startTime}`}</div>
                                        </div>
                                        {(eventsToCancel.length > 1) &&
                                            <div className="arrows-container flex space-between">
                                                {(eventsToCancel[pageCount - 1]) ? <i onClick={() => setPageCount(pageCount - 1)} className="arrow fas fa-angle-right"></i>
                                                    : <i className="arrow-disabled fas fa-angle-right"></i>
                                                }
                                                {eventsToCancel[pageCount + 1] ? <i onClick={() => setPageCount(pageCount + 1)} className="arrow fas fa-angle-left"></i>
                                                    : <i className="arrow-disabled fas fa-angle-left"></i>
                                                }
                                            </div>
                                        }
                                        <button onClick={() => cancelAppointment(eventsToCancel[pageCount].id)} className={`${(props.userPhone)?'contacts-modal-btn':''} trash-btn`} > בטל תור <i className="fas fa-trash" ></i></button>
                                    </div>
                                    :
                                    <div className="no-apointments">
                                        לא נמצאו תורים
                                    </div>
                                }
                            </div>
                            <Modal modalContent={'התור בוטל'} />
                        </main>
                }
            </motion.div>
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


