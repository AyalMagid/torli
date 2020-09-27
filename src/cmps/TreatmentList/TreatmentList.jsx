import React from 'react';
import { TreatmentPreview } from '../TreatmentPreview/TreatmentPreview';
import UtilsService from '../../services/UtilsService';
import './TreatmentList.scss';

export function TreatmentList(props) {
    return (
        <div className="treatment-list main-container flex column">
            {
                props.treatments.map(treatment => {
                    let id=UtilsService.idGen()
                    return (
                        <div key={id}>
                            <TreatmentPreview treatment={treatment} getTreatmentsToUpdate={props.getTreatmentsToUpdate} />
                        </div>
                    )
                })
            }
        </div>
    )
}
