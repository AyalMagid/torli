import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import UtilsService from "../../services/UtilsService";
import './TreatmentToEdit.scss';

function _TreatmentToEdit(props) {
    const [arr, setArr] = React.useState(UtilsService.getArray(1003, props.treatment.price))
    const [arr2, setArr2] = React.useState(UtilsService.getArray(10, props.treatment.duration))
    const [credentials, setCredentials] = React.useState({ name:props.treatment.name , min: '', amount: '' })
    const [minSelected, setMinSelected] = React.useState(0)
   
  
    function handleChange({ target }) {
        const field = target.name;
        const value = target.value;
        console.log(field,'field');
        console.log(value,'value');
        switch (field) {
            case 'min':
                    setCredentials({ ...credentials, min: (value === 0) ? arr2[0] : (value) * 30})
                    setMinSelected(value)
                break;
            case 'amount':
                setCredentials({ ...credentials, amount: value})
                break;
            case 'name':
                setCredentials({ ...credentials, name: value})
                break;
            default:
                console.log('Err updating name/amount/min')
        }
    }

    function printThat(){
        console.log(credentials);
    }

    return (
        <div>
            <div>
                <div>סוג טיפול</div>
                <input name="name" value={credentials.name} onChange={handleChange} />
            </div>
            <div>
                <div>משך זמן הטיפול</div>
                <select name="min" onChange={handleChange}>
                    {
                        arr2.map((ar, index) => {
                            let id = UtilsService.idGen()
                            return (
                                <option name="min" key={id} selected={(minSelected===index)?true :false} value={ (index)} >{(index === 0) ? arr2[0] : (index) * 30} דקות</option>
                            )
                        })
                    }
                </select>
            </div>

            <div>
                <div>מחיר הטיפול</div>
                <select name="amount" size="1" onChange={handleChange}>
                    {
                        arr.map((ar, index) => {
                            let id = UtilsService.idGen()
                            return (
                                <option name="amount" key={id} value={(index === 0) ? arr[0] : index}  >{(index === 0) ? arr[0] : index} ₪</option>
                            )
                        })
                    }
                </select>
            </div>
            <button onClick={printThat}>press</button>
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