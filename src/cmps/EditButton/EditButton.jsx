import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import './EditButton.scss';




function _EditButton(props) {
    const location = useLocation()
    const isContactsPath = (location.pathname === '/calendarAdmin/contacts/signup')
    return (
        <>
        <div className="save-btn-wrapper" onClick={() => props.toggleValidations()}> </div>
            <button className={`save-btn ${isContactsPath?'save-btn-in-contact-path' :''}`} onClick={() => props.setUser()} disabled={!props.isValid.phone || !props.isValid.email || !props.isValid.name}>שמור</button>
        </>
    );
}



function mapStateProps(state) {
    return {

    }
}

const mapDispatchToProps = {

}

export const EditButton = connect(mapStateProps, mapDispatchToProps)(_EditButton)