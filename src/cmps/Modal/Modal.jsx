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
        setTimeout(() => {
            if(!isAdminContacts)  setModalClass('ad-modal-in')
            else setModalClass('ad-modal-in-in-admin-contacts')
        }, 2000);
    }, [props.isModalOpen]);

    const handleClose = () => {
        setModalClass('')
        setTimeout(() => {
            props.updateIsModalOpen(false)
        }, 2000);
        if (location.pathname === '/form' || location.pathname === '/cancelAppointment') StoreService.initApp()
        if (location.pathname === '/form') props.history.push('/treatments')
    }

    return (
        <>
            {
                props.isModalOpen &&
                <div className="main-modal-container">
                    <div className={`ad-modal-screen ${(isAdminContacts) ? 'modal-in-admin-contacts' : ''}`} onClick={handleClose}> </div>
                    <div className={`ad-modal ${modalClass} ${(isAdminContacts&&!modalClass) ? 'ad-modal-in-admin-contacts' : ''}`}>
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
