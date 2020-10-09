import React from 'react';
import { connect } from 'react-redux';
import UtilsService from '../../services/UtilsService';
import './TreatmentTitle.scss';


function _TreatmentTitle(props) {
    return (
        <div className="treatment-title">
            {
                (props.pickedTreatmentsCount) ?

                (props.pickedTreatmentsCount===1)?
                `נבחר טיפול  ${UtilsService.convertNumberToWords(props.pickedTreatmentsCount)}     `
                :
                   `נבחרו ${UtilsService.convertNumberToWords(props.pickedTreatmentsCount)} טיפולים `

                    :
                    (props.isClicked)?
                     <span className="red-title">לא נבחרו טיפולים!</span>
                    :
                    "  בחרו  סוג  טיפול  אחד  או  יותר  ולחצו  'הבא'"
            }
        </div>
    )
}

function mapStateProps(state) {
    return {
        pickedTreatmentsCount: state.TreatmentReducer.pickedTreatmentsCount
    }
}

const mapDispatchToProps = {
}

export const TreatmentTitle = connect(mapStateProps, mapDispatchToProps)(_TreatmentTitle)