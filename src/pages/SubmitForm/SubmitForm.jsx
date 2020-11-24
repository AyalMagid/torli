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
        // await CalendarService.setAppointment(markedTreatmetns, props.duration, phone, email, name, props.treatment)
        // routim
        await CalendarService.setAppointment(markedTreatmetns, props.duration, phone, email, name, props.treatment, props.owner)
    }

    let isCalendarAdminForm = (location.pathname === '/calendarAdmin/form')

    return (
        <div className="submit-form flex column  align-center">
            {isCalendarAdminForm && <header className="header-in-form-modal flex align-center space-between">
                <div className="back-arrow" onClick={() => props.history.push('/calendarAdmin/treatments')}><i class="fas fa-arrow-right"></i></div>
                <div>
                    לקביעת התור לחצו 'אישור'
                                    </div>
                <div className={'modal-header-cls-btn-space'}></div>
            </header>}
            {!isCalendarAdminForm && <button className="reset-btn" onClick={init}> איפוס <i className="fas fa-redo-alt"></i></button>}
            <div className={`user-details ${isCalendarAdminForm ? 'user-details-in-modal' : ''}`}>
                <div>שם : {name}</div>
                <div>טלפון : {phone}</div>
                {(email)?<div>אימייל : {email}</div>:''}
            </div>
            <motion.div
                initial="out"
                exit="in"
                animate="in"
                variants={(!isCalendarAdminForm) ? MotionService.getMotionStyle('pageVariants') : ''}
                transition={(!isCalendarAdminForm) ? MotionService.getMotionStyle('pageTransition') : ''}
           style={{textAlign:'center', width:'100%'}}
           >
                <div className="appointment-details">
                    <div className="table-cell">סוג הטיפול : {TreatmentService.getMarkedTreatmentsStr(props.treatments)}</div>
                    <div className="table-cell">תאריך : {UtilsService.convertDateToIsraelisDisplay(props.treatment.date)}</div>
                    <div className="last-cell">בין השעות : {UtilsService.calculateEndTime(props.treatment.time, props.duration)} - {props.treatment.time}</div>
                </div>
            </motion.div>
            <Modal modalContent={<div className="main-modal-in-form flex column justify-center align-center">
                    <div className="title-modal-in-form">התור נקבע בהצלחה</div>
                    <div className="form-modal-content flex column space-between">
                        <div className="margin-bottom-5"> נקבע לך תור ל{markedTreatmetns}  </div>
                        <div className="margin-bottom-5"> בתאריך: {dateIsraeliDisplay}</div>
                        <div> בין השעות: {endTime} - {props.treatment.time}</div>
                    </div>
                </div>}
                />
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
        // routim
        owner:state.UserReducer.owner
    }
}

const mapDispatchToProps = {
    updateActiveStep,
    setTimeSlots,
    updateIsModalOpen
}

export const SubmitForm = withRouter(connect(mapStateProps, mapDispatchToProps)(_SubmitForm))
