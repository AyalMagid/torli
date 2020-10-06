import React from "react";
import StorageService from "../../services/StorageService";
import './Login.scss';

export function Login(props) {
    const [credentials, setCredentials] = React.useState({ name: '', phone: '', email: '' })
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

    function setUser() {
        StorageService.saveToStorage('tori-user', credentials)
        props.history.push('/treatments')
    }

    const { name, phone, email } = credentials
    return (
        <main className="main-login-container flex align-center justify-center column">
            <form className="main-form flex align-center justify-center column">
                <div className="input-container">
                    <div className="form-title">שם מלא :</div>
                    <input className="name"  name="name" id="outlined-basic" variant="outlined" value={name} onChange={handleChange} />
                </div>
                <div className="input-container">
                    <div className="form-title">טלפון :</div>
                    <input className="phone" name="phone" id="outlined-basic" variant="outlined" value={phone} onChange={handleChange} />
                </div>
                <div className="input-container">
                    <div className="form-title">מייל :</div>
                    <input className="email" name="email" id="outlined-basic" variant="outlined" value={email} onChange={handleChange} />
                </div>
            </form>
            <button className="save-btn" onClick={setUser} disabled={!name || !((phone.length > 8) && (phone.length < 11))}>שמור</button>
        </main>
    );
}
