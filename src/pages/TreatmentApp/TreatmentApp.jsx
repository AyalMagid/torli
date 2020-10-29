import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { loadTreatments } from '../../actions/treatmentActions.js';
import { setUserToSchedule, updateUserToSchedule } from '../../actions/userAction.js';
import { TreatmentList } from '../../cmps/TreatmentList/TreatmentList';
import { TreatmentTitle } from '../../cmps/TreatmentTitle/TreatmentTitle';
import { NavBtns } from '../../cmps/NavBtns/NavBtns';
import { motion } from 'framer-motion'
import { LoaderApp } from '../../cmps/LoaderApp/LoaderApp'
import UserService from "../../services/UserService";
import { _setUserToSchedule } from '../../actions/userAction.js';
import StorageService from '../../services/StorageService';
import './TreatmentApp.scss';
import '../../styles/style.scss';


// style motion div
const pageVariants = {
    in: {
        opacity: 1,
        x: "0"
    },
    out: {
        opacity: 0,
        x: "50%"
    }
}

const pageTransition = {
    duration: 0.5,
    type: "spring",
    stiffness: 50
}

export function _TreatmentApp(props) {
    const location = useLocation()
    const { loadTreatments, treatments, setUserToSchedule, userToSchedule } = props
    const user = StorageService.loadFromStorage('tori-user');
    useEffect(() => {
        if (!treatments) loadTreatments()
    }, [loadTreatments, treatments]);

    useEffect( () => {
        (async () => {
        if (!userToSchedule && (! await UserService.isAdmin(user))) setUserToSchedule()
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
                        variants={pageVariants}
                        transition={pageTransition}
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
    }
}

const mapDispatchToProps = {
    loadTreatments,
    setUserToSchedule,
    updateUserToSchedule
}

export const TreatmentApp = connect(mapStateProps, mapDispatchToProps)(_TreatmentApp)



