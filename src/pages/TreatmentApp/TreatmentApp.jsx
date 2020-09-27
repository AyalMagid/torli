import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { loadTreatments } from '../../actions/treatmentActions.js';
import { TreatmentList } from '../../cmps/TreatmentList/TreatmentList';
import { NavBtns } from '../../cmps/NavBtns/NavBtns';
import { motion } from 'framer-motion'
import './TreatmentApp.scss';
import '../../styles/style.scss';

// style motion div
const pageVariants={
    in:{
        opacity: 1 ,
        x:"0"
    },
    out:{
        opacity: 0,
        x:"50%"
    }
}

const pageTransition={
    duration:1.3,
    type:"spring",
    stiffness:50
}

export function _TreatmentApp(props) {
    const { loadTreatments,treatments } = props
    useEffect(() => {
        if (!treatments) loadTreatments()
    },[loadTreatments,treatments]);

    if (!treatments) return 'loading...'
    return (
    <>
        <motion.div
            initial="out"
            exit="in"
            animate="in"
            variants={pageVariants}
            transition={pageTransition}
        >
            <TreatmentList treatments={treatments}  />
        </motion.div>
    <NavBtns />
    </>
    )
}

function mapStateProps(state) {
    return {
        treatments: state.TreatmentReducer.treatments,
    }
}

const mapDispatchToProps = {
    loadTreatments
}

export const TreatmentApp = connect(mapStateProps, mapDispatchToProps)(_TreatmentApp)
