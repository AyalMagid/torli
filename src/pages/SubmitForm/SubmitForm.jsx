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
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { motion } from 'framer-motion'
import TreatmentService from "../../services/TreatmentService";
import './SubmitForm.scss';

// style for motion div
const pageVariants = {
    in: {
        opacity: 1,
        x: 0
    },
    out: {
        opacity: 0,
        x: "50%"
    }
}

const pageTransition = {
    duration: 0.5,
    type: "spring",
    stiffness: 50
}
// style for modal + input material ui

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        color: 'form-title'
    },
    input: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        }
    }
}));

export function _SubmitForm(props) {
    const location = useLocation()
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [markedTreatmetns, setMarkedTreatmetns] = React.useState('');
    const dateIsraeliDisplay = UtilsService.convertDateToIsraelisDisplay(props.treatment.date)
    const endTime = UtilsService.calculateEndTime(props.treatment.time, props.duration)
    const { name, phone, email } = props.userToSchedule
    useEffect(() => {
        setMarkedTreatmetns(TreatmentService.getMarkedTreatmentsStr(props.treatments))
    }, [props.treatments])

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        init()
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
          {!isCalendarAdminForm&&  <button className="restart-btn" onClick={init}>אתחול  <i className="fas fa-redo-alt"></i></button>}
            <div className={`user-details ${isCalendarAdminForm ?'user-details-in-modal':''}`}>
                <div>שם : {name}</div>
                <div>טלפון : {phone}</div>
                <div>אימייל : {email}</div>
            </div>
            <motion.div
                initial="out"
                exit="in"
                animate="in"
                variants={pageVariants}
                transition={pageTransition}
                style={{ textAlign: 'center', width: '100%' }}
            >
                <div className="appointment-details">
                    <div className="table-cell">סוג הטיפול : {TreatmentService.getMarkedTreatmentsStr(props.treatments)}</div>
                    <div className="table-cell">תאריך : {UtilsService.convertDateToIsraelisDisplay(props.treatment.date)}</div>
                    <div className="last-cell">בין השעות : {props.treatment.time} - {UtilsService.calculateEndTime(props.treatment.time, props.duration)}</div>
                </div>

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={open}>
                        <div className={classes.paper}>
                            <h2 id="transition-modal-title">התור נקבע בהצלחה</h2>
                            <div> נקבע לך תור ל: {markedTreatmetns}  </div>
                            <div> בתאריך {dateIsraeliDisplay}</div>
                            <div> בין השעות: {endTime} - {props.treatment.time}</div>

                        </div>
                    </Fade>
                </Modal>
            </motion.div>
            {!isCalendarAdminForm&& <NavBtns handleOpen={handleOpen} setAppointment={setAppointment} />}
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
    setTimeSlots
}

export const SubmitForm = withRouter(connect(mapStateProps, mapDispatchToProps)(_SubmitForm))
