import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { loadUsers, updateUsers, updateUserToSchedule } from '../../actions/userAction.js';
import { Signup } from "../Signup/Signup.jsx";
import './Contacts.scss';

export function _Contacts(props) {
    const [searchTerm, setSearchTerm] = React.useState('')
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
    function markClickedUser(clickedUser) {
        let users = props.users.slice()
        if (clickedUser.isMarked) {
            users = users.map(user => {
                user.isMarked = false
                props.updateUserToSchedule(null)
                return user
            })
        } else {
            users = users.map(user => {
                if (user._id === clickedUser._id) {
                    user.isMarked = true
                    props.updateUserToSchedule(user)
                    return user
                } else {
                    user.isMarked = false
                    return user
                }
            })
        }
        props.updateUsers(users)
    }
    const [appointmentsModalIsOpen, setAppointmentsModalIsOpen] = React.useState(false);
    function closeAppointmentsModal() {
        setAppointmentsModalIsOpen(false)
    }
    function openAppointmentsModal() {
        setAppointmentsModalIsOpen(true)
    }

    return (
        <main className="contacts-main-container">
            <div className="search-input-container flex align-center">
                <input className="search-input" placeholder="חפש לפי שם או טלפון" name="term" value={searchTerm} onChange={handleChange} />
                <i className="fas fa-search"></i>
            </div>
            <div className="users-container-warpper">
                <div className="users-container">
                    <div className={`user-container } flex align-center justify-center`} onClick={ openAppointmentsModal} >
                        <div className="add-new-user flex justify-center align-center space-around"><i class="fas fa-plus-circle"></i><div>הוספת לקוח חדש</div></div>
                    </div>
                    {
                        (props.users) &&
                        props.users.map((user, idx) => {
                            return (
                                (user.name.includes(searchTerm) || user.phone.includes(searchTerm)) &&
                                (!user.isAdmin)
                                &&
                                <div className={`user-container ${(user.isMarked) ? 'user-clicked' : ''} flex align-center justify-center`} onClick={() => markClickedUser(user)} key={idx}>
                                    <div className="check-mark-container flex align-center">
                                        {
                                            (user.isMarked) && <i class="fas fa-check"></i>
                                        }
                                    </div>
                                    <div className="user-name user-attr">{user.name}</div>
                                    <div className="user-phone user-attr">{user.phone}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {appointmentsModalIsOpen &&
                    <>
                        <div className="modal-screen-in-contacts" onClick={closeAppointmentsModal}>
                        </div>
                        <div className="modal-in-contacts">
                        <Signup closeAppointmentsModal={closeAppointmentsModal}/>
                        </div>
                    </>
                }
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

export const Contacts = connect(mapStateProps, mapDispatchToProps)(_Contacts)