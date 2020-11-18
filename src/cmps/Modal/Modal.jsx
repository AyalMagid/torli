import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { updateIsModalOpen } from '../../actions/modalAction.js';
import StoreService from '../../services/StoreService';
import './Modal.scss';

export default function _Modal(props) {
    const location = useLocation()
    const [modalClass, setModalClass] = useState('');
    let isAdminContacts = (location.pathname === '/adminContacts')
    useEffect(() => {
        if (!isAdminContacts) setModalClass('ad-modal-in')
        else setModalClass('ad-modal-in-in-admin-contacts')
    }, []);

    const handleClose = () => {
        if (!isAdminContacts) setModalClass('ad-modal-out')
        else setModalClass('ad-modal-out-in-admin-contacts')
        setTimeout(() => {
            props.updateIsModalOpen(false)
            if (!isAdminContacts) setModalClass('ad-modal-in')
            else setModalClass('ad-modal-in-in-admin-contacts')
            // here, so when modal is closing it will not be the homepage modal - there is the setitmeout delay.
            if (location.pathname === '/form') props.history.push('/')
            if (location.pathname === '/form' || location.pathname === '/cancelAppointment') StoreService.initApp()
        }, 500);
    }

    return (
        <>
            {
                props.isModalOpen &&
                <div className="main-modal-container">
                    <div className={`ad-modal-screen ${(isAdminContacts) ? 'modal-screen-admin-contacts' : ''}`} onClick={handleClose}> </div>
                    <div className={`ad-modal ${modalClass}`}>
                        <div className="advertise-content">{props.modalContent}</div>
                        <button className="ad-modal-btn" onClick={handleClose}> אישור</button>
                    </div>
                </div>
            }
        </>
    );
}



function mapStateProps(state) {
    return {
        isModalOpen: state.ModalReducer.isModalOpen
    }
}

const mapDispatchToProps = {
    updateIsModalOpen
}

export const Modal = withRouter(connect(mapStateProps, mapDispatchToProps)(_Modal))
