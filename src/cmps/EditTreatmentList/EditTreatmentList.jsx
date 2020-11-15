import React from 'react';
import { EditTreatmentPreview } from '../EditTreatmentPreview/EditTreatmentPreview';
import UtilsService from '../../services/UtilsService';
import './EditTreatmentList.scss';

export function EditTreatmentList(props) {
    return (
        <div className="treatment-list main-container flex column">
            {
                props.treatments.map(treatment => {
                    let id=UtilsService.idGen()
                    return (
                        <div key={id}>
                            <EditTreatmentPreview  treatment={treatment} getTreatmentsToUpdate={props.getTreatmentsToUpdate} />
                        </div>
                    )
                })
            }
        </div>
    )
}
