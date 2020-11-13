import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setTreatment } from '../../actions/treatmentActions';
import UtilService from '../../services/UtilsService'
import './EditTreatmentPreview.scss';

class _EditTreatmentPreview extends Component {
    state = {
        treatment: this.props.treatment,
    }

    pickedTreatment = () => {
        this.props.setTreatment(this.props.treatment)
        this.props.history.push('/treatmentToEdit')
    }

    render() {
        const { treatment } = this.state
        return (
            <div className={`treatment-preview ${(treatment.marked) ? 'marked-by-switch' : ""}`}>
                {treatment &&
                    <div onClick={this.pickedTreatment} className=" preview-container flex align-center space-between">
                        <div className="align-col-name">
                            {treatment.name}
                        </div>
                        <div className="align-col">{'₪' + treatment.price}</div>
                        <div className="align-col">{treatment.duration + UtilService.englishToHebrew('minutes')}</div>
                    </div>
                }
            </div>
        )
    }
}

function mapStateProps(state) {
    return {
        treatments: state.TreatmentReducer.treatments
    }
}

const mapDispatchToProps = {
    setTreatment
}

export const EditTreatmentPreview = withRouter(connect(mapStateProps, mapDispatchToProps)(_EditTreatmentPreview))