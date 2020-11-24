import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { loadTreatments } from '../../actions/treatmentActions.js';
import { setUserToSchedule, updateUserToSchedule } from '../../actions/userAction.js';
import { TreatmentList } from '../../cmps/TreatmentList/TreatmentList';
import { TreatmentTitle } from '../../cmps/TreatmentTitle/TreatmentTitle';
import { NavBtns } from '../../cmps/NavBtns/NavBtns';
import { motion } from 'framer-motion'
import MotionService from "../../services/MotionService";
import { LoaderApp } from '../../cmps/LoaderApp/LoaderApp'
import './TreatmentApp.scss';
import '../../styles/style.scss';

export function _TreatmentApp(props) {
    const location = useLocation()
    const { loadTreatments, treatments, setUserToSchedule, userToSchedule } = props
    useEffect(() => {
        // if (!treatments) loadTreatments()
        // routim
        if (!treatments) loadTreatments(props.owner.workPlace)
    }, [loadTreatments, treatments]);

    useEffect(() => {
        console.log(treatments)
    }, [treatments]);

    useEffect(() => {
        (async () => {
        if (!userToSchedule && !props.loggedInUser.isAdmin) setUserToSchedule()
    })()
    }, [setUserToSchedule, userToSchedule]);

    const [isClicked, setIsClicked] = useState(false);

    function updateTitleProp() {
        setIsClicked(true)
    }

    if (!treatments) return <div className="loader"><LoaderApp /></div>
    return (
        <div className="treatment-app">
            {
                (location.pathname !== '/calendarAdmin/treatments')
                    ?
                    <motion.div
                        initial="out"
                        exit="in"
                        animate="in"
                        variants={MotionService.getMotionStyle('pageVariants')}
                        transition={MotionService.getMotionStyle('pageTransition')}
                    >
                        <TreatmentTitle isClicked={isClicked} />
                        <TreatmentList treatments={treatments} />
                    </motion.div>
                    :
                    <div>
                        <TreatmentTitle isClicked={isClicked} />
                        <TreatmentList treatments={treatments} />
                    </div>
            }
            {
                (location.pathname !== '/calendarAdmin/treatments') &&
                <NavBtns updateTitleProp={updateTitleProp} />
            }
        </div>

    )
}

function mapStateProps(state) {
    return {
        treatments: state.TreatmentReducer.treatments,
        userToSchedule: state.UserReducer.userToSchedule,
        loggedInUser: state.UserReducer.loggedInUser,
        // routim
        owner:state.UserReducer.owner
    }
}

const mapDispatchToProps = {
    loadTreatments,
    setUserToSchedule,
    updateUserToSchedule
}

export const TreatmentApp = connect(mapStateProps, mapDispatchToProps)(_TreatmentApp)



