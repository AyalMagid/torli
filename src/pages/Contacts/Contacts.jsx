import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { loadUsers, updateUsers, updateUserToSchedule,updateUserPhoneInContactSignup } from '../../actions/userAction.js';
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

    function transferTosignup() {
        props.history.push('/calendarAdmin/contacts/signup')
    }

    return (
        <main className="contacts-main-container">
            <div className="search-input-container flex align-center">
                <div className="back-arrow" onClick={()=>props.history.push('/calendarAdmin/appointmentOrBlock')}><i  class="fas fa-arrow-right"></i></div>
                <div className="search-wrapper flex align-center">
                    <input className="search-input" placeholder="חפש לפי שם או טלפון" name="term" value={searchTerm} onChange={handleChange} />
                    <i className="fas fa-search"></i>
                </div>
                <div className={'modal-header-cls-btn'}><i class="fas fa-times"></i></div>
            </div>
            <div className="users-container-warpper">
                <div className="users-container">
                    <div className="create-user flex align-center" onClick={transferTosignup} >
                        <div className="add-new-user flex justify-center align-center"><i class="fas fa-plus-circle"></i><div>לקוח חדש</div></div>
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
        </main>
    );
}


function mapStateProps(state) {
    return {
        users: state.UserReducer.users,
        userPhoneInContactSignup: state.UserReducer.userPhoneInContactSignup
    }
}

const mapDispatchToProps = {
    loadUsers,
    updateUsers,
    updateUserToSchedule,
    updateUserPhoneInContactSignup
}

export const Contacts = connect(mapStateProps, mapDispatchToProps)(_Contacts)