import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { updateActiveStep } from '../../actions/stepperActions';
import { withRouter } from 'react-router-dom';
import './NavBtns.scss';
function _NavBtns(props) {

    const [hideBtn, setHideBtn] = useState('');
    const [activeNextBtn, setActiveNextBtn] = useState('');
    const [activeBackBtn, setActiveBackBtn] = useState('');

    useEffect(() => {toggleBtnsStyle()});

    function toggleBtnsStyle() {
        if (props.activeStep !== 1) {setHideBtn('')}
        else {setHideBtn("hide-btn")}
        if (props.activeStep) {setActiveBackBtn('active-btn')}
        else {setActiveBackBtn('')}
        if ((props.activeStep === 2 && !props.treatment) || (props.duration) ){setActiveNextBtn('active-btn') 
        } else {setActiveNextBtn('')} 
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
        else if (props.activeStep === 1 && diff < 0) props.history.push('/')
    }

    return (

        <div className={`nav-btns-container flex align-center space-around `}>
          <div className="nav-btn-wrraper nav-btn-wrraper-back"> 
            <button className={`nav-btn ${activeBackBtn}`} disabled={props.activeStep === 0} onClick={() => changeStep(-1)} >
                חזור
            </button>
          </div>
          <div className={`nav-btn-wrraper nav-btn-wrraper-next ${hideBtn} `}>
            <button className={`nav-btn ${activeNextBtn}`} onClick={() => changeStep(1)} disabled={isNextBtnDisable()}>
                    {(props.activeStep === 2) ? 'אשר' : 'הבא'}
            </button>
          </div>
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
