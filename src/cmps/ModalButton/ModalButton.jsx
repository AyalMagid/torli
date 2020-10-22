import React, { Component } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import './ModalButton.scss';


function _ModalButton(props) {
    const location = useLocation()
    function checkBtnValidation() {
        const path = location.pathname
        let isValid = true
        switch (path) {
            case '/calendarAdmin/contacts':
                isValid = props.isClicked
                break;
            case '/calendarAdmin/treatments':
                isValid = (!props.pickedTreatmentsCount)||(!(props.duration<=props.availableDuration))
                break;
            case '/calendarAdmin/form':
                isValid = false
                break;
            case '/calendarAdmin/blockHours':
                isValid = props.isClicked
                break;
            default:
                console.log('Err updating button modal validation')
        }
        return isValid
    }
    return (
        <button className="calendar-admin-modal-btn" onClick={()=>props.handleModalRoute(props.duration)}
            disabled={checkBtnValidation()}>
            {
                (location.pathname === '/calendarAdmin/contacts') ?
                    'בחרו לקוח ולחצו כאן להמשך'
                    :
                    (location.pathname === '/calendarAdmin/treatments')
                    ?
                    'לחצו כאן להמשך'
                    :
                    'אישור'
            }
        </button>
    )
}

function mapStateProps(state) {
    return {
        pickedTreatmentsCount: state.TreatmentReducer.pickedTreatmentsCount,
        availableDuration: state.TreatmentReducer.availableDuration,
        duration: state.TreatmentReducer.duration
    }
}

const mapDispatchToProps = {

}

export const ModalButton = connect(mapStateProps, mapDispatchToProps)(_ModalButton)