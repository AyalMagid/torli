import React, { useState, useEffect } from "react";
import StorageService from "../../services/StorageService";
import UtilsService from "../../services/UtilsService";
import { motion } from 'framer-motion'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './Login.scss';



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

const ownerPhone = '123456789'
const ownerPassword = '1234'

export function Login(props) {
    const [credentials, setCredentials] = React.useState({ name: '', phone: '', email: '' })
    const { name, phone, email } = credentials
    const [password, setPassword] = useState('');
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

    function handleChange({ target }) {
        const field = target.name;
        const value = target.value;
        switch (field) {
            case 'name':
                if(name) setToggleNameValidation('visibility')
                setCredentials({ ...credentials, name: value })
                break;
            case 'phone':
                if((phone.length > 8) && (phone.length < 11) ) setTogglePhoneValidation('visibility')
                setCredentials({ ...credentials, phone: value })
                // checkPhoneValidation()
                console.log(isValid)
                break;
            case 'email':
               if( UtilsService.validateEmail(email)) setToggleEmailValidation('visibility')
                setCredentials({ ...credentials, email: value })
                // checkEmailValidation()
                console.log(isValid)
                break;
            case 'password':
                console.log(value)
                setPassword(value)
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

    function toggleValidations(){
        if(!isValid.name){
            setToggleNameValidation('')
        } else{
            setToggleNameValidation('visibility')
        }
        if(!isValid.phone){
            setTogglePhoneValidation('')
        }else{
            setTogglePhoneValidation('visibility')
        }
        if(!isValid.email){
            setToggleEmailValidation('')
        }else{
            setToggleEmailValidation('visibility')
        }
    }
    

    function setUser() {
        console.log(isValid)
       
        //validation of owner phone number
        if (credentials.phone !== ownerPhone) {
            StorageService.saveToStorage('tori-user', credentials)
            props.history.push('/treatments')
        }
        else {
            handleClickOpen()
        }

    }

    const [open, setOpen] = React.useState(false);
    const [dialogTitle, setDialogTitle] = React.useState(' הרשאת מנהל');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (close) => {
        if (close !== 'close') {
            //owner password
            if (password === ownerPassword) {
                setOpen(false);
                StorageService.saveToStorage('tori-user', credentials)
                props.history.push('/treatments')
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
               
               <span className="save-btn-wrapper" onClick={toggleValidations}> <button  className="save-btn" onClick={setUser} disabled={!isValid.phone || !isValid.email || !isValid.name}>שמור</button></span>

                <div>
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
                </div>

            </main>
        </motion.div>
    );
}
