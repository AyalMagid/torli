import React, { useState, useEffect, useRef } from "react";
import StorageService from "../../services/StorageService";
import UtilsService from "../../services/UtilsService";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withRouter } from 'react-router-dom';
import './EditUser.scss';




const ownerPhone = '123456789'
const ownerPassword = '1234'

export function _EditUser(props) {
    const [credentials, setCredentials] = React.useState(StorageService.loadFromStorage('tori-user'))
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
                // checkPhoneValidation()
                console.log(isValid)
                break;
            case 'email':
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


    function setUser() {
        console.log(isValid)

        //validation of owner phone number
        if (credentials.phone !== ownerPhone) {
            StorageService.saveToStorage('tori-user', credentials)
            props.history.push('/')
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
                props.history.push('/')
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




    const [isNameEditing, setIsNameEditing] = useState(false);
    const [isNameDisabled, setIsNameDisabled] = useState(true);
    const [nameBorderBottom, setNameBorderBottom] = useState('thin-border-bottom');
    const nameFocus = useRef(null);
    useEffect(() => {
        if (isNameEditing) {
            nameFocus.current.focus();
        }
    }, [isNameEditing]);

    const [isPhoneEditing, setIsPhoneEditing] = useState(false);
    const [isPhoneDisabled, setIsPhoneDisabled] = useState(true);
    const [phoneBorderBottom, setPhoneBorderBottom] = useState('thin-border-bottom');
    const phoneFocus = useRef(null);
    useEffect(() => {
        if (isPhoneEditing) {
            phoneFocus.current.focus();
        }
    }, [isPhoneEditing]);

    const [isEmailEditing, setIsEmailEditing] = useState(false);
    const [isEmailDisabled, setIsEmailDisabled] = useState(true);
    const [emailBorderBottom, setEmailBorderBottom] = useState('thin-border-bottom');
    const emailFocus = useRef(null);
    useEffect(() => {
        if (isEmailEditing) {
            emailFocus.current.focus();
        }
    }, [isEmailEditing]);


    const toggleEditing = (value) => {
        if (value === 'name') {
            setIsNameEditing(!isNameEditing);
            setIsNameDisabled(!isNameDisabled)
            if (nameBorderBottom === 'thick-border-bottom') {
                setNameBorderBottom('thin-border-bottom')
            } else {
                setNameBorderBottom('thick-border-bottom')
            }
        }
        if (value === 'phone') {
            setIsPhoneEditing(!isPhoneEditing);
            setIsPhoneDisabled(!isPhoneDisabled)
            if (phoneBorderBottom === 'thick-border-bottom') {
                setPhoneBorderBottom('thin-border-bottom')
            } else {
                setPhoneBorderBottom('thick-border-bottom')
            }
        }
        if (value === 'email') {
            setIsEmailEditing(!isEmailEditing);
            setIsEmailDisabled(!isEmailDisabled)
            if (emailBorderBottom === 'thick-border-bottom') {
                setEmailBorderBottom('thin-border-bottom')
            } else {
                setEmailBorderBottom('thick-border-bottom')
            }
        }
    };






    return (
        <main className="main-edit-container flex align-center justify-center column">
            <div className="login-title">
                  לשינוי שדה לחצו על סמל העריכה בסיום לחצו 'שמור'.
                    <div className="login-title-sub">שדות המסומנים ב - *  הינם שדות חובה</div>
            </div>
            <form className="main-form flex align-center justify-center column">
                <div className="input-container">
                    <div className="form-title-container flex">
                        <div className="form-title">* שם מלא  </div>
                        <div className={`validation-text ${toggleNameValidation}`}>זהו שדה חובה, יש להכניס שם</div>
                    </div>
                    <div className={`input-edit-container ${nameBorderBottom} flex justify-center align-center`}>
                        <input className="input-edit-page name" disabled={isNameDisabled} ref={nameFocus} name="name" id="outlined-basic" variant="outlined" value={name} onChange={handleChange} />
                       {
                       (isNameEditing)?
                       <i className="edit-logo fas fa-edit" onClick={() => toggleEditing('name')}></i>
                       :
                        <i className="edit-logo far fa-edit" onClick={() => toggleEditing('name')}></i>
                       }
                    </div>
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
                    <div className={`input-edit-container ${phoneBorderBottom} flex justify-center align-center`}>
                        <input className="input-edit-page phone" disabled={isPhoneDisabled} ref={phoneFocus} name="phone" id="outlined-basic" variant="outlined" value={phone} onChange={handleChange} />
                        {
                       (isPhoneEditing)?
                       <i className="edit-logo fas fa-edit" onClick={() => toggleEditing('phone')}></i>
                       :
                        <i className="edit-logo far fa-edit" onClick={() => toggleEditing('phone')}></i>
                       }
                    </div>
                </div>
                <div className="input-container">
                    <div className="form-title-container flex">
                        <div className="form-title form-title-email">מייל </div>
                        <div className={`validation-text ${toggleEmailValidation}`}>האימייל שהוקש שגוי</div>
                    </div>
                    <div className={`input-edit-container ${emailBorderBottom} flex justify-center align-center`}>
                        <input className="input-edit-page email" disabled={isEmailDisabled} ref={emailFocus} name="email" id="outlined-basic" variant="outlined" value={email} onChange={handleChange} />
                        {
                       (isEmailEditing)?
                       <i className="edit-logo fas fa-edit" onClick={() => toggleEditing('email')}></i>
                       :
                        <i className="edit-logo far fa-edit" onClick={() => toggleEditing('email')}></i>
                       }
                    </div>
                </div>
            </form>

            <span className="save-btn-wrapper" onClick={toggleValidations}> <button className="save-btn" onClick={setUser} disabled={!isValid.phone || !isValid.email || !isValid.name}>שמור</button></span>

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
    );
}


export const EditUser = withRouter(_EditUser)
