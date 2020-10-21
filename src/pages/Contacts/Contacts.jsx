import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { loadUsers, updateUsers, updateUserToSchedule } from '../../actions/userAction.js';
import StorageService from "../../services/StorageService";
import UtilsService from "../../services/UtilsService";
import UserService from "../../services/UserService";
import { motion } from 'framer-motion'
import './Contacts.scss';


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


export function _Contacts(props) {
    const [searchTerm, setSearchTerm] = React.useState('')
    const [isUserClicked, setIsUserClicked] = React.useState(false)
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

    return (
        <main className="contacts-main-container">
            <div className="search-input-container flex align-center">
                <input className="search-input" placeholder="חפש לפי שם או טלפון" name="term" value={searchTerm} onChange={handleChange} />
                <i className="fas fa-search"></i>
            </div>
            <div className="users-container-warpper">
                <div className="users-container">
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
        users: state.UserReducer.users
    }
}

const mapDispatchToProps = {
    loadUsers,
    updateUsers,
    updateUserToSchedule
}

export const Contacts = connect(mapStateProps, mapDispatchToProps)(_Contacts)