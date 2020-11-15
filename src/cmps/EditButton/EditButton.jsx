import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import './EditButton.scss';




function _EditButton(props) {
    return (
        <>
        <div className="save-btn-wrapper" onClick={() => props.toggleValidations()}> </div>
            <button className="save-btn" onClick={() => props.setUser()} disabled={!props.isValid.phone || !props.isValid.email || !props.isValid.name}>שמור</button>
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