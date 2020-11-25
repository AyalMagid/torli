import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import StorageService from "../../services/StorageService";
import UserService from "../../services/UserService";
import { motion } from 'framer-motion'
import MotionService from "../../services/MotionService";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { updateLoggedInUser } from '../../actions/userAction.js';
import './Login.scss';


// const ownerPassword = '1234'

function _Login(props) {
    const [phone, setPhone] = React.useState('')
    const [password, setPassword] = useState('');
    const [togglePhoneValidation, setTogglePhoneValidation] = useState('visibility');
    const [phoneIsValid, setPhoneIsValid] = useState(false);

    useEffect(() => {
        checkValidation()
    }, [phone])

    // hide text validation if text is valid

    useEffect(() => {
        if ((phone.length > 8) && (phone.length < 11)) {
            setTogglePhoneValidation('visibility')
        }
    }, [phone])



    function handleChange({ target }) {
        const field = target.name;
        const value = target.value;
        switch (field) {
            case 'phone':
                setPhone(value)
                break;
            case 'password':
                setPassword(value)
                break;
            default:
                console.log('Err updating name/phone/email')
        }
    }


    function checkValidation() {
        setPhoneIsValid((phone.length > 8) && (phone.length < 11))
    }

    function toggleValidations() {
        if (!phoneIsValid) {
            setTogglePhoneValidation('')
        } else {
            setTogglePhoneValidation('visibility')
        }
    }


    async function setUser() {
        const userFromDb = await UserService.getUser(phone)
        //validation of owner phone number
        if (userFromDb) {
            if (!userFromDb.isAdmin) {
                //need to bring from mongo
                const { name, email, phone } = userFromDb
                StorageService.saveToStorage('tori-user', { name, email, phone })
                props.updateLoggedInUser(userFromDb)
                props.history.push('/treatments')
                // ('/${props.owner.workPlace}/treatments')
            }
            else {
                handleClickOpen()
            }
        } else {
            handleModalClickOpen()
        }
    }

    const [open, setOpen] = React.useState(false);
    const [dialogTitle, setDialogTitle] = React.useState(' הרשאת מנהל');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = async (close) => {
        const userFromDb = await UserService.getUser(phone)
        if (close !== 'close') {
            //ownerPassword 
            // routim
            if (password === props.owner.pass) {
                setOpen(false);
                const { name, email, phone } = userFromDb
                StorageService.saveToStorage('tori-user', { name, email, phone })
                props.updateLoggedInUser(userFromDb)
                props.history.push('/calendarAdmin')
            }
            else {
                setDialogTitle('ססמא שגויה!')
            }
        }
        else {
            setOpen(false);
            setDialogTitle('הרשאת מנהל')
        }
    };



    const [openModal, setOpenModal] = React.useState(false);

    const handleModalClickOpen = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
    };

    return (
        <main className="main-login-container log-in-page flex align-center  column">
            <motion.div
                className="motion-div"
                initial="out"
                exit="in"
                animate="in"
                variants={MotionService.getMotionStyle('pageVariants')}
                transition={MotionService.getMotionStyle('pageTransition')}
                style={{ width: "100%", height: "100%" }}
            >
    
                <div className="login-title">
                    אנא הכניסו מספר טלפון לזיהוי
                </div>
                <form className="main-form flex align-center column">

                    <div className="input-container">
                        <div className="form-title-container flex">
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
                </form>
            </motion.div>
            <Dialog open={open} onClose={() => handleClose('close')} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title"> {dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        הכנס סיסמה
          </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="סיסמה"
                        type="email"
                        fullWidth
                        value={password}
                        onChange={handleChange}
                        name="password"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose('close')} color="primary">
                        בטל
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        אשר
                   </Button>
                </DialogActions>
            </Dialog>
            {/* //second modal */}
            <Dialog
                open={openModal}
                onClose={handleModalClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {/* <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle> */}
                <DialogContent>
                    <DialogContentText id="alert-dialog-description row">
                        <div>
                            <div>
                                המספר שהוקש אינו קיים במערכת.
                                    </div>
                            <div className="flex">
                                <div>להרשמה לחץ</div>
                                <Link className="login-link flex align-center justify-center" to="/signup">
                                    {/* to="/${props.owner.workPlace}/signup" */}
                                    כאן
                                       </Link>
                            </div>
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose} color="primary" autoFocus>
                        ביטול
                         </Button>
                </DialogActions>
            </Dialog>
            <div className="save-btn-wrapper" onClick={toggleValidations}> </div>
            <button className="save-btn" onClick={setUser} disabled={!phoneIsValid}>התחבר</button>
        </main>
    );
}



function mapStateProps(state) {
    return {
        loggedInUser: state.UserReducer.loggedInUser,
        // routim
        owner:state.UserReducer.owner
    }
}

const mapDispatchToProps = {
    updateLoggedInUser
}

export const Login = connect(mapStateProps, mapDispatchToProps)(_Login)