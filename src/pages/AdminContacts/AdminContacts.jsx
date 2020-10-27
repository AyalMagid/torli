import { func } from "prop-types";
import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { loadUsers, updateUsers, updateUserToSchedule } from '../../actions/userAction.js';
import { CancelAppointment } from '../CancelAppointment/CancelAppointment';
import './AdminContacts.scss';

export function _AdminContacts(props) {
    const [searchTerm, setSearchTerm] = useState('')
    const [userPhone, setUserPhone] = useState('')
    const [appointmentsModalIsOpen, setAppointmentsModalIsOpen] = useState(false);

    useEffect(() => {
        props.loadUsers()
    }, [props.loadUsers]);

    function handleChange({ target }) {
        const field = target.name;
        const value = target.value;
        switch (field) {
            case 'term':
                setSearchTerm(value)
                break;
            default:
                console.log('Err updating name/phone/email')
        }
    }


    function closeAppointmentsModal() {
        setAppointmentsModalIsOpen(false)
    }

    function saveClickedUserPhone(userPhone) {
        setUserPhone(userPhone)
        setAppointmentsModalIsOpen(true)
    }

    function handleClick(ev){
        ev.stopPropagation()
    }

    return (
        <main className="admin-contacts">
                   {appointmentsModalIsOpen &&
                    <>
                        <div className="modal-screen" onClick={closeAppointmentsModal}>
                        </div>
                        <div className="apointments-modal">
                             <header className="header-admin-contacts-modal"></header>
                            <CancelAppointment userPhone={userPhone}/>
                        </div>
                    </>
                }
            <div className="search-input-wrapper flex align-center">
                <input className="search-input-admin-contacts" placeholder="חפשו לפי שם או טלפון" name="term" value={searchTerm} onChange={handleChange} />
                <i className="fas fa-search"></i>
                <div onClick={() => props.history.push('/')} id="text" className="logo"> Tori<i className="fas fa-tasks"></i></div>
            </div>
            <div className="contacts-users-container-warpper">
                <div className="contacts-users-container">
                    {
                        (props.users) &&
                        props.users.map((user, idx) => {
                            return (
                                (user.name.includes(searchTerm) || user.phone.includes(searchTerm)) &&
                                (!user.isAdmin)
                                &&
                                <div className={`user-container flex align-center justify-center`} onClick={() => saveClickedUserPhone(user.phone)}  key={idx}>
                                    <div className="user-name user-attr">{user.name}</div>
                                    <div className="user-icons-container flex ">
                                        <a className="user-whatsapp user-attr" onClick={handleClick} href={`https://api.whatsapp.com/send?phone=+972${user.phone.slice(1,user.phone.length)}`}>
                                            <div><i class="fa fa-whatsapp"></i></div>
                                        </a>
                                        <a className="user-phone user-attr" onClick={handleClick}  href={`tel:${user.phone}`}>
                                             <div ><i class="fas fa-phone-alt"></i></div>
                                        </a>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

        </main>
    );
}


function mapStateProps(state) {
    return {
        users: state.UserReducer.users
    }
}

const mapDispatchToProps = {
    loadUsers,
    updateUsers,
    updateUserToSchedule
}

export const AdminContacts = connect(mapStateProps, mapDispatchToProps)(_AdminContacts)