import React, {useEffect} from "react";
import { connect } from 'react-redux';
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
import TextField from '@material-ui/core/TextField';
import { motion } from 'framer-motion'
import TreatmentService from "../../services/TreatmentService";
import StorageService from "../../services/StorageService";
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
    duration:0.5,
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
    
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [markedTreatmetns, setMarkedTreatmetns] = React.useState('');
    const [credentials, setCredentials] = React.useState({name:'',phone:'',email:''})
    const dateIsraeliDisplay = UtilsService.convertDateToIsraelisDisplay(props.treatment.date)
    const endTime = UtilsService.calculateEndTime(props.treatment.time,props.duration)

    useEffect(() => {
        setMarkedTreatmetns(TreatmentService.getMarkedTreatmentsStr(props.treatments))
        const user = StorageService.loadFromStorage('tori-user')
        if (user) {
            setCredentials (user)
        }
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

    async function setAppointment () {
        const {name,phone,email} = credentials
        await CalendarService.setAppointment(markedTreatmetns, props.duration, phone, email, name, props.treatment)
        StorageService.saveToStorage('tori-user', credentials)
    }

    function handleChange({ target }) {
        const field = target.name;
        const value = target.value;
        switch (field) {
            case 'name':
            setCredentials({...credentials,name:value})
            break;
            case 'phone':
            setCredentials({...credentials,phone:value})
            break;
            case 'email':
            setCredentials({...credentials,email:value})
            break;
            default:
            console.log('Err updating name/phone/email')
        }
    }
    

    const {name, phone, email} = credentials
    return (
        <div className="submit-form flex column align-center">
            <button className="restart-btn" onClick={init}>אתחול  <i className="fas fa-redo-alt"></i></button>
            <div className="appointment-details">
                    <div>סוג הטיפול : {TreatmentService.getMarkedTreatmentsStr(props.treatments)}</div>
                    <div>תאריך : {UtilsService.convertDateToIsraelisDisplay(props.treatment.date)}</div>
                    <div>בין השעות : {props.treatment.time} - {UtilsService.calculateEndTime(props.treatment.time, props.duration)}</div>
            </div>
            <motion.div
                initial="out"
                exit="in"
                animate="in"
                variants={pageVariants}
                transition={pageTransition}
                style={{ textAlign: 'center', width:'100%' }}
            >
                    <form className={`${classes.input}`} noValidate autoComplete="off">
                        <div>
                            <div className="form-title">שם מלא :</div>
                            <TextField autoFocus={true} name="name" id="outlined-basic" variant="outlined" value={name} onChange={handleChange} />
                        </div>
                        <div>
                            <div className="form-title">טלפון :</div>
                            <TextField name="phone" id="outlined-basic" variant="outlined" value={phone} onChange={handleChange} />
                        </div>
                        <div>
                            <div className="form-title">מייל :</div>
                            <TextField name="email" id="outlined-basic" variant="outlined" value={email} onChange={handleChange} />
                        </div>
                    </form>

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
            <NavBtns handleOpen={handleOpen} setAppointment={setAppointment} />
        </div>
    );
}

function mapStateProps(state) {
    return {
        treatments: state.TreatmentReducer.treatments,
        treatment: state.TreatmentReducer.treatment,
        duration: state.TreatmentReducer.duration,
    }
}

const mapDispatchToProps = {
    updateActiveStep,
    setTimeSlots
}

export const SubmitForm = withRouter(connect(mapStateProps, mapDispatchToProps)(_SubmitForm))
