import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { NavBtns } from '../../cmps/NavBtns/NavBtns';
import UtilsService from "../../services/UtilsService";
import CalendarService from '../../services/CalendarService';
import StoreService from '../../services/StoreService';
import { setTimeSlots } from '../../actions/calendarActions.js';
import { updateActiveStep } from '../../actions/stepperActions';
import { withRouter } from 'react-router-dom';
import { updateIsModalOpen } from '../../actions/modalAction.js';
import { Modal } from '../../cmps/Modal/Modal';
import { motion } from 'framer-motion'
import MotionService from "../../services/MotionService";
import TreatmentService from "../../services/TreatmentService";
import './SubmitForm.scss';



export function _SubmitForm(props) {
    const location = useLocation()
    const [markedTreatmetns, setMarkedTreatmetns] = React.useState('');
    const dateIsraeliDisplay = UtilsService.convertDateToIsraelisDisplay(props.treatment.date)
    const endTime = UtilsService.calculateEndTime(props.treatment.time, props.duration)
    const { name, phone, email } = props.userToSchedule
    useEffect(() => {
        setMarkedTreatmetns(TreatmentService.getMarkedTreatmentsStr(props.treatments))
    }, [props.treatments])

    const handleOpen = () => {
        //open modal useing store
        props.updateIsModalOpen(true)
    };

    function init() {
        StoreService.initApp()
        props.history.push('/treatments')
    }

    async function setAppointment() {
        await CalendarService.setAppointment(markedTreatmetns, props.duration, phone, email, name, props.treatment)
    }

    let isCalendarAdminForm = (location.pathname === '/calendarAdmin/form')

    return (
        <div className="submit-form flex column  align-center">
            {!isCalendarAdminForm && <button className="restart-btn" onClick={init}>אתחול  <i className="fas fa-redo-alt"></i></button>}
            <div className={`user-details ${isCalendarAdminForm ? 'user-details-in-modal' : ''}`}>
                <div>שם : {name}</div>
                <div>טלפון : {phone}</div>
                <div>אימייל : {email}</div>
            </div>
            <motion.div
                initial="out"
                exit="in"
                animate="in"
                variants={MotionService.getMotionStyle('pageVariants')}
                transition={MotionService.getMotionStyle('pageTransition')}
                style={{ textAlign: 'center', width: '100%' }}
            >
                <div className="appointment-details">
                    <div className="table-cell">סוג הטיפול : {TreatmentService.getMarkedTreatmentsStr(props.treatments)}</div>
                    <div className="table-cell">תאריך : {UtilsService.convertDateToIsraelisDisplay(props.treatment.date)}</div>
                    <div className="last-cell">בין השעות : {UtilsService.calculateEndTime(props.treatment.time, props.duration)} - {props.treatment.time}</div>
                </div>
                <Modal modalContent={<div>
                    <h2>התור נקבע בהצלחה</h2>
                    <div className="form-modal-content flex column space-aruond">
                        <div className="margin-bottom-5"> נקבע לך תור ל: {markedTreatmetns}  </div>
                        <div className="margin-bottom-5"> בתאריך {dateIsraeliDisplay}</div>
                        <div> בין השעות: {endTime} - {props.treatment.time}</div>
                    </div>
                </div>}
                />
            </motion.div>
            {!isCalendarAdminForm && <NavBtns handleOpen={handleOpen} setAppointment={setAppointment} />}
        </div>
    );
}

function mapStateProps(state) {
    return {
        treatments: state.TreatmentReducer.treatments,
        treatment: state.TreatmentReducer.treatment,
        duration: state.TreatmentReducer.duration,
        userToSchedule: state.UserReducer.userToSchedule,
    }
}

const mapDispatchToProps = {
    updateActiveStep,
    setTimeSlots,
    updateIsModalOpen
}

export const SubmitForm = withRouter(connect(mapStateProps, mapDispatchToProps)(_SubmitForm))
