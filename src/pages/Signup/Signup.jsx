import React, { useState, useEffect } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Link } from 'react-router-dom'
import StorageService from "../../services/StorageService";
import UtilsService from "../../services/UtilsService";
import UserService from "../../services/UserService";
import { motion } from 'framer-motion'
import './Signup.scss';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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


export function Signup(props) {
    const [credentials, setCredentials] = React.useState({ name: '', phone: '', email: '' })
    const { name, phone, email } = credentials
    const [toggleNameValidation, setToggleNameValidation] = useState('visibility');
    const [togglePhoneValidation, setTogglePhoneValidation] = useState('visibility');
    const [toggleEmailValidation, setToggleEmailValidation] = useState('visibility');
    const [isValid, setIsValid] = useState(
        {
            name: false,
            phone: false,
            email: true
        }
    );

    useEffect(() => {
        checkValidation()
    }, [credentials])

    // hide text validation if text is valid
    useEffect(() => {
        if (name) setToggleNameValidation('visibility')
    }, [name])

    useEffect(() => {
        if ((phone.length > 8) && (phone.length < 11)) {
            setTogglePhoneValidation('visibility')
        }
    }, [phone])

    useEffect(() => {
        if (UtilsService.validateEmail(email)) {
            setToggleEmailValidation('visibility')
        }
    }, [email])

    function handleChange({ target }) {
        const field = target.name;
        const value = target.value;
        switch (field) {
            case 'name':
                setCredentials({ ...credentials, name: value })
                break;
            case 'phone':
                setCredentials({ ...credentials, phone: value })
                break;
            case 'email':
                setCredentials({ ...credentials, email: value })
                break;
            default:
                console.log('Err updating name/phone/email')
        }
    }


    function checkValidation() {
        let emailIsValid = true
        if (email) {
            emailIsValid = UtilsService.validateEmail(email)
        }
        setIsValid({
            name: (name.length > 0),
            phone: ((phone.length > 8) && (phone.length < 11)),
            email: emailIsValid
        })
    }

    function toggleValidations() {
        if (!isValid.name) {
            setToggleNameValidation('')
        } else {
            setToggleNameValidation('visibility')
        }
        if (!isValid.phone) {
            setTogglePhoneValidation('')
        } else {
            setTogglePhoneValidation('visibility')
        }
        if (!isValid.email) {
            setToggleEmailValidation('')
        } else {
            setToggleEmailValidation('visibility')
        }
    }


    async function setUser() {
        const user = await UserService.getUser(phone)
        if (user) {
            handleClickOpen()
        } else {
            UserService.addUser(credentials)
            props.history.push('/treatments')
        }
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <motion.div
            className="motion-div"
            initial="out"
            exit="in"
            animate="in"
            variants={pageVariants}
            transition={pageTransition}
        >
            <main className="main-login-container flex align-center justify-center column">
                <div className="login-title">
                    אנא מלאו את השדות הבאים ולחצו 'שמור'.
                    <div className="login-title-sub">שדות המסומנים ב - *  הינם שדות חובה</div>
                </div>
                <form className="main-form flex align-center justify-center column">
                    <div className="input-container">
                        <div className="form-title-container flex">
                            <div className="form-title">* שם מלא  </div>
                            <div className={`validation-text ${toggleNameValidation}`}>זהו שדה חובה, יש להכניס שם</div>
                        </div>
                        <input autoFocus={true} className="name" name="name" id="outlined-basic" variant="outlined" value={name} onChange={handleChange} />
                    </div>
                    <div className="input-container">
                        <div className="form-title-container flex">
                            <div className="form-title">* טלפון  </div>
                            <div className={`validation-text ${togglePhoneValidation}`}>
                                {
                                    (phone) ?
                                        "מספר הטלפון שהוקש שגוי"
                                        :
                                        "זהו שדה חובה, יש להכניס טלפון"
                                }
                            </div>
                        </div>
                        <input className="phone" name="phone" id="outlined-basic" variant="outlined" value={phone} onChange={handleChange} />

                    </div>
                    <div className="input-container">
                        <div className="form-title-container flex">
                            <div className="form-title form-title-email">מייל </div>
                            <div className={`validation-text ${toggleEmailValidation}`}>האימייל שהוקש שגוי</div>
                        </div>
                        <input className="email" name="email" id="outlined-basic" variant="outlined" value={email} onChange={handleChange} />
                    </div>
                </form>

                <span className="save-btn-wrapper" onClick={toggleValidations}> <button className="save-btn" onClick={setUser} disabled={!isValid.phone || !isValid.email || !isValid.name}>שמור</button></span>
                <div>
                    <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        {/* <DialogTitle id="alert-dialog-slide-title">{"Use Google's location service?"}</DialogTitle> */}
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                            <div>
                                    <div>
                                       המספר שהוקש כבר קיים במערכת.
                                    </div>
                                    <div className="flex">
                                        <div>להתחברות לחץ</div>
                                        <Link className="login-link flex align-center justify-center" to="/login">
                                             כאן
                                       </Link>
                                    </div>
                                </div>
                   </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                ביטול
                       </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </main>
        </motion.div>
    );
}
