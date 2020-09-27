import './DailySlots.scss';
import React from "react";
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import {setTreatment} from '../../actions/treatmentActions';
import {updateActiveStep} from '../../actions/stepperActions';
import UtilsService from '../../services/UtilsService';

 function _DailySlots(props) {

    function onAppointmentChoice(ts, date, diff) {
        props.updateActiveStep(props.activeStep + diff)
        let treatment = {
            time: ts,
            date
        }
        props.setTreatment(treatment)
        props.history.push('/form')
    }

    return (

        <div className="daily-slots flex column align-center space-between">
            {props.timeSlots.map(ts => <button onClick={() => onAppointmentChoice(ts, props.date, 1)}
                className="timeslot-btn" key={UtilsService.idGen()}>{ts}</button>)}
        </div>
    )
}


function mapStateProps(state) {
    return {
        treatment: state.TreatmentReducer.treatment,
        activeStep: state.StepperReducer.step
    }
}

const mapDispatchToProps = {
    setTreatment,
    updateActiveStep
}

export const DailySlots = withRouter(connect(mapStateProps, mapDispatchToProps)(_DailySlots))
