import React, { useState } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { motion } from 'framer-motion'
import { setTimeSlots } from '../../actions/calendarActions.js';
import { updateActiveStep } from '../../actions/stepperActions';
import UtilsService from "../../services/UtilsService";
import CalendarService from '../../services/CalendarService';
import EmailService from '../../services/EmailService';
import StoreService from '../../services/StoreService';
import './CancelAppointment.scss';

// style motion div
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
    duration: 1.3,
    type: "spring",
    stiffness: 50
}


export function _CancelAppointment(props) {


// style material ui modal
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
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
                color: '#172b4d'
            }
        },
    }));


    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const [phone, setPhone] =  React.useState('');

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        init()
        props.history.push('/')
    };

    const [eventToCancel, setEventToCancel] = useState(null)

    function init() {
        StoreService.initApp()
      }

    async function cancelAppointment() {
        const events = await CalendarService.getEventByPhone(phone)
        const eventToRmove = events[0]
        // delete from Calendar
        CalendarService.remove(eventToRmove.eventId)
        // delete from mongo data base
        CalendarService.removeEventFromDB(eventToRmove._id)
        EmailService.sendEmail(eventToCancel.name, eventToCancel.date, eventToCancel.email, false)
        setEventToCancel(null)
        handleOpen()
    }

    function handleChange({ target }) {
        const field = target.name;
        const value = target.value;
        switch (field) {
            case 'phone':
                setPhone(value)
                if (value.length >= 9 && value.length <= 10) {
                    CalendarService.getEventByPhone(value)
                        .then(ev => {
                            if (!ev[0]) return
                            const dateIsraeliDisplay = UtilsService.convertDateToIsraelisDisplay(ev[0].date)
                            setEventToCancel({
                                treatments: ev[0].treatments,
                                startTime: UtilsService.changeTimeForDisplay(ev[0].startTime, -3),
                                endTime: UtilsService.changeTimeForDisplay(ev[0].endTime, -3),
                                date: dateIsraeliDisplay,
                                email:ev[0].email,
                                name:ev[0].name,
                            })
                        })
                }
                break;
            default:
                console.log("err in phone switch case - cancel appoinment");
        }
    }

    return (
        <div className="cancel-appointment flex column align-center space-between ">
        <motion.div
            className="motion-div"
            initial="out"
            exit="in"
            animate="in"
            variants={pageVariants}
            transition={pageTransition}
        >
            <main >
                <div className="cancelation-title-phone">
                    <div className="cancel-form-title">נא להזין מספר טלפון לביטול התור  :</div>
                    <TextField autoFocus={true} className={classes.root} name="phone" id="outlined-basic" variant="outlined" value={phone} onChange={handleChange} />
                </div>
                <div className="table-wrapper">
                    {(eventToCancel) && <div className="table-title"> פרטי התור :</div>}
                    {(eventToCancel) ?
                        <div className="apointment-details">
                            <div className="table-cell"> <span>סוג הטיפול</span> : {eventToCancel.treatments}</div>
                            <div className="table-cell"> בתאריך : {eventToCancel.date}</div>
                            <div className="last-cell"> בין השעות : {`${eventToCancel.endTime} - ${eventToCancel.startTime}`}</div>
                        </div>
                        :
                        <div className="space"></div>
                    }
                </div>
               {(eventToCancel) && <button onClick={cancelAppointment} className="trash-btn"> מחק תור <i className="fas fa-trash" ></i></button>}

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
                            <h2 id="transition-modal-title">התור בוטל</h2>
                            <p id="transition-modal-description"></p>
                        </div>
                    </Fade>
                </Modal>
            </main>
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
    setTimeSlots
}

export const CancelAppointment = withRouter(connect(mapStateProps, mapDispatchToProps)(_CancelAppointment))


