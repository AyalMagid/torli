import React from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import UtilsService from '../../services/UtilsService';
import './TreatmentTitle.scss';


function _TreatmentTitle(props) {
    const location = useLocation()
    let isCalendarAdmin=( location.pathname === '/calendarAdmin/treatments')
    let isDurationValid=(props.duration>props.availableDuration)
    return (
        <div className={`treatment-title ${isCalendarAdmin?'treatment-title-in-modal':''} 
         ${isCalendarAdmin&&isDurationValid?'red-title':''}`}>
            {
               (isDurationValid&&isCalendarAdmin) ?
                  'משך זמן הטיפולים ארוך מידי ! '
                :
                (props.pickedTreatmentsCount) ?

                (props.pickedTreatmentsCount===1)?
                `נבחר טיפול  ${UtilsService.convertNumberToWords(props.pickedTreatmentsCount)}     `
                :
                   `נבחרו ${UtilsService.convertNumberToWords(props.pickedTreatmentsCount)} טיפולים `

                    :
                    (props.isClicked)?
                     <span className="red-title">לא נבחרו טיפולים!</span>
                    :
                    isCalendarAdmin
                    ?
                    "בחרו סוג טיפול אחד או יותר"
                    :
                    "  בחרו  סוג  טיפול  אחד  או  יותר  ולחצו  'הבא'"
            
                }
        </div>
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

export const TreatmentTitle = connect(mapStateProps, mapDispatchToProps)(_TreatmentTitle)