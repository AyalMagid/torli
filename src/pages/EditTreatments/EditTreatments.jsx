import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { loadTreatments } from '../../actions/treatmentActions.js';
import { EditTreatmentList } from '../../cmps/EditTreatmentList/EditTreatmentList';
import { motion } from 'framer-motion'
import MotionService from "../../services/MotionService";
import { LoaderApp } from '../../cmps/LoaderApp/LoaderApp'
import './EditTreatments.scss';
import '../../styles/style.scss';

export function _EditTreatments(props) {
    const { loadTreatments, treatments} = props
    useEffect(() => {
        if (!treatments) loadTreatments()
    }, [loadTreatments, treatments]);

    if (!treatments) return <div className="loader"><LoaderApp /></div>
    return (
        <div className="treatment-app">
                    <motion.div
                        initial="out"
                        exit="in"
                        animate="in"
                        variants={MotionService.getMotionStyle('pageVariants')}
                        transition={MotionService.getMotionStyle('pageTransition')}
                    >
                        <EditTreatmentList treatments={treatments} />
                    </motion.div>
        </div>

    )
}

function mapStateProps(state) {
    return {
        treatments: state.TreatmentReducer.treatments
    }
}

const mapDispatchToProps = {
    loadTreatments
}

export const EditTreatments = connect(mapStateProps, mapDispatchToProps)(_EditTreatments)



