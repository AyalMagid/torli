import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { updateActiveStep } from '../../actions/stepperActions';
import { withRouter, useLocation } from 'react-router-dom';
import './NavBtns.scss';
function _NavBtns(props) {

    const location = useLocation()
    const [activeBtn, setActiveBtn] = useState('');

    useEffect(() => {toggleBtnsStyle()});

    function toggleBtnsStyle() {
        if ((props.activeStep === 2 && !props.treatment) || (props.duration) ){setActiveBtn('active-btn') 
        } else {setActiveBtn('')} 
    }

    function isNextBtnDisable() {
        if (!props.duration) return true
        if (props.activeStep === 2 && !props.treatment) return true
    }

    function changeStep(diff) {

        if (props.activeStep + diff === 3) {
            props.setAppointment()
            props.handleOpen()
        }
        props.updateActiveStep(props.activeStep + diff)
        if (!props.activeStep && diff > 0){
            props.history.push('/calendar')
        }    
        else if (props.activeStep === 1 && diff > 0) props.history.push('/form')
        else if (props.activeStep === 2 && diff < 0) props.history.push('/calendar')
        else if (props.activeStep === 1 && diff < 0) props.history.push('/treatments')
    }

    return (

        <div className={`nav-btns-container`}>
        {
          (location.pathname === '/treatments')?
          <div className={`nav-btn-wrraper`}>
            <button className={`nav-btn ${activeBtn}`} onClick={() => changeStep(1)} disabled={isNextBtnDisable()}>
                הבא
            </button>
          </div>
            :
             (location.pathname !== '/form')?
            <div className="nav-btn-wrraper"> 
                <button className={`nav-btn active-btn`} disabled={props.activeStep === 0} onClick={() => changeStep(-1)} >
                    חזור
                </button>
            </div>
            :
            <div className="flex btns-wrraper">
                <div className="nav-btn-wrraper"> 
                    <button className={`nav-btn active-btn`} disabled={props.activeStep === 0} onClick={() => changeStep(-1)} >
                        חזור
                    </button>
                </div>
                <div className={`nav-btn-wrraper`}>
                <button className={`nav-btn ${activeBtn}`} onClick={() => changeStep(1)} disabled={isNextBtnDisable()}>
                    אשר
                </button>
                </div>
            </div>
        }
        </div>

    )
}

function mapStateProps(state) {
    return {
        steps: state.StepperReducer.steps,
        activeStep: state.StepperReducer.step,
        duration: state.TreatmentReducer.duration,
        treatment: state.TreatmentReducer.treatment,

    }
}

const mapDispatchToProps = {
    updateActiveStep
}

export const NavBtns = withRouter(connect(mapStateProps, mapDispatchToProps)(_NavBtns))
