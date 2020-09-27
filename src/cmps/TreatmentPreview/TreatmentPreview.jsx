import React , { Component } from 'react';
import { connect } from 'react-redux';
import { updateDuration, updateTreatments} from '../../actions/treatmentActions';
import { SwitchApp } from '../SwitchApp/SwitchApp';
import UtilService from '../../services/UtilsService'
import TreatmentService from '../../services/TreatmentService';
import './TreatmentPreview.scss';


class _TreatmentPreview extends Component {

    state = {
        updatedTreatment: this.props.treatment,
        // treatmentsToUpdate: [...this.props.treatments]
        treatmentsToUpdate: this.props.treatments
    }

    updateDuration = (isMarked) => {
        if (isMarked) {
            this.props.updateDuration(+this.props.treatment.duration)
        } else {
            this.props.updateDuration((+this.props.treatment.duration) * -1)
        }
    }

    // mark the treatment
    updatePickedTreatments = (isMarked) => {
            this.setState({updatedTreatment:{...this.state.updatedTreatment,marked:isMarked}}, ()=>{
            const treatments = TreatmentService.updateTreatments(this.state.treatmentsToUpdate,this.state.updatedTreatment)
            this.setState({treatmentsToUpdate:treatments})
            //     ()=>{
            //     this.props.updateTreatments(this.state.treatmentsToUpdate)
            // }) 
        })
    }

    render() {
        const {updatedTreatment} = this.state
        return (
            <div className={`treatment-preview ${(updatedTreatment.marked)?'marked-by-switch':""}`}>
                {updatedTreatment &&
                    <div className=" preview-container flex align-center space-between">
                        <div className="align-col-name">
                            {updatedTreatment.name}
                        </div>
                        <div className="align-col">{'₪' + updatedTreatment.price}</div>
                        <div className="align-col">{updatedTreatment.duration + UtilService.englishToHebrew('minutes')}</div>
                        <SwitchApp className="align-col" marked={updatedTreatment.marked} updateDuration={this.updateDuration} updatePickedTreatments={this.updatePickedTreatments} />
                    </div>
                }
            </div>
        )
      }
}
    
function mapStateProps(state) {
    return {
        duration: state.TreatmentReducer.duration,
        treatments: state.TreatmentReducer.treatments
    }
}

const mapDispatchToProps = {
    updateDuration,
    updateTreatments
}

export const TreatmentPreview = connect(mapStateProps, mapDispatchToProps)(_TreatmentPreview)