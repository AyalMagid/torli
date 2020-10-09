import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import DateFnsUtils from '@date-io/date-fns';
import heLocale from "date-fns/locale/he";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { motion } from 'framer-motion'
import { NavBtns } from '../../cmps/NavBtns/NavBtns';
import { LoaderApp } from '../../cmps/LoaderApp/LoaderApp'
import { TimeslotList } from '../../cmps/TimeslotList/TimeslotList';
import { loadTimeSlots } from '../../actions/calendarActions.js';
import { Swipeable } from 'react-swipeable'
import './CalendarApp.scss';

// motion div style
const pageVariants = {
    in: {
        opacity: 1,
        x: 0,
        textAlign: 'center'
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

// material ui - date picker style
const materialTheme = createMuiTheme({
    overrides: {
        MuiPickersToolbar: {
            toolbar: {
                backgroundColor: '#e91e63',
            },
        },

        MuiPickersDay: {
            day: {
                color: 'black',
            },
            daySelected: {
                backgroundColor: '#e91e63',
            },
            dayDisabled: {
                color: '#e91e63',
            },
            current: {
                color: '#e91e63',
            },
        },
    },
});

export function _CalendarApp(props) {

    const [selectedDate, handleDateChange] = useState(new Date());
    const [loader, setLoader] = useState(false);
    const [calendarTitle, seTcalendarTitle] = useState(' בחרו תאריך ושעה');

    const { loadTimeSlots } = props
    useEffect(() => {
        loadTimeSlots()
        if (props.timeSlots) {
            setLoader(false)
        }
    }, [loadTimeSlots]);


    async function handleChange(date) {
        setLoader(true)
        handleDateChange(date)
        await props.loadTimeSlots(date)
        if (props.timeSlots) {
            setLoader(false)
        }
    }
    function onSwipeDirection(direction) {

        //need to change to normal way
        if (direction.length === 4) {
            handleChange(new Date(selectedDate.setDate(selectedDate.getDate() + 3)));
        }
        else if ((direction.length === 5) && (selectedDate.getTime()) > (new Date().getTime())) {
            handleChange(new Date(selectedDate.setDate(selectedDate.getDate() - 3)));
        }
        else {
            seTcalendarTitle('לא ניתן לבחור תאריך שעבר')
            setTimeout(() => {
                seTcalendarTitle(' בחרו תאריך ושעה')
            }, 3000);
        }
    }
    return (
        <>
            <motion.div
                initial="out"
                exit="in"
                animate="in"
                variants={pageVariants}
                transition={pageTransition}
                style={{ width: "100%" }}
            >
                <div className="calendar-picker-container">
                    <div className="date-picker-title">
                        {calendarTitle}
                    </div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={heLocale} >
                        <ThemeProvider theme={materialTheme}>
                            <KeyboardDatePicker
                                disableToolbar
                                // disablePast={true}
                                variant="dialog"
                                okLabel="אישור"
                                cancelLabel="ביטול"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                value={selectedDate}
                                onChange={handleChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </ThemeProvider>
                    </MuiPickersUtilsProvider>
                </div>
                <Swipeable onSwiped={(eventData) => onSwipeDirection(eventData.dir)} >
                    <div className="main-container time-slot-lists-container">
                        {(props.timeSlots && !loader) ? <TimeslotList date={selectedDate} timeSlots={props.timeSlots} duration={props.duration} />
                            : <div className="loaderContainer flex  justify-center"><LoaderApp /></div>}
                    </div>
                </Swipeable>
            </motion.div>
            <NavBtns />
        </>
    );
}

function mapStateProps(state) {
    return {
        timeSlots: state.CalendarReducer.timeSlots,
        duration: state.TreatmentReducer.duration
    }
}

const mapDispatchToProps = {
    loadTimeSlots
}

export const CalendarApp = connect(mapStateProps, mapDispatchToProps)(_CalendarApp)
