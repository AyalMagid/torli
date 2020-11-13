import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './TreatmentToEdit.scss';

function _TreatmentToEdit(props) {
    const [name, setName] = React.useState(props.treatment.name)

    function handleChange({ target }) {
        setName(target.value)
    }

    return (
        <div>
            <div>
                <div>סוג טיפול</div>
                <input name="name"  value={name} onChange={handleChange} />
            </div>
        </div>
    )
}



function mapStateProps(state) {
    return {
        treatment: state.TreatmentReducer.treatment
    }
}

const mapDispatchToProps = {
}

export const TreatmentToEdit = withRouter(connect(mapStateProps, mapDispatchToProps)(_TreatmentToEdit))