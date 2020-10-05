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
import EventService from '../../services/EventService';
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
    duration: 0.5,
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

    const [phone, setPhone] = React.useState('');

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        init()
        props.history.push('/treatments')
    };

    const [eventsToCancel, setEventsToCancel] = useState(null)

    const [pageCount, setPageCount] = useState(0)

    function init() {
        StoreService.initApp()
    }

    async function cancelAppointment(eventId) {
        const events = await EventService.getEventByPhone(phone)
        let eventToRmove = events.find(event => event._id === eventId)
        console.log(eventToRmove)
        // delete from Calendar
        CalendarService.removeEventFromCalendar(eventToRmove.eventId)
        // delete from mongo data base
        EventService.removeEventFromDB(eventToRmove._id)
        EmailService.sendEmail(eventToRmove.name, eventToRmove.date, eventToRmove.email, false)
        setEventsToCancel(null)
        handleOpen()
    }

    function handleChange({ target }) {
        const field = target.name;
        const value = target.value;
        switch (field) {
            case 'phone':
                setPhone(value)
                if (value.length >= 9 && value.length <= 10) {
                    console.log(value)
                    EventService.getEventByPhone(value)
                        .then(events => {
                            if (!events[0]) return
                            console.log(events)
                            const filteredEvents = events.filter(event => {
                                let year = event.date.slice(0, 4)
                                let month = event.date.slice(5, 7)
                                let day = event.date.slice(8, 10)
                                let hours = +event.startTime.slice(0, 2) + 3
                                console.log(hours)
                                const date = new Date(year, month - 1, day, hours, 0).getTime()
                                console.log(date, Date.now())
                                return (date > Date.now())
                            })
                            console.log(filteredEvents)
                            if (filteredEvents.length) {
                                setEventsToCancel(UtilsService.getEventReadyForDisplay(filteredEvents))
                            }
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
                        <div className="cancel-form-title">נא להזין מספר טלפון :</div>
                        <TextField autoFocus={true} className={classes.root} name="phone" id="outlined-basic" variant="outlined" value={phone} onChange={handleChange} />
                    </div>
                    <div className="table-wrapper">
                        {(eventsToCancel) ?
                            <div>
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
                                <button onClick={() => cancelAppointment(eventsToCancel[pageCount].id)} className="trash-btn"> בטל תור <i className="fas fa-trash" ></i></button>
                            </div>
                            :
                            <div className="space"></div>
                        }
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


