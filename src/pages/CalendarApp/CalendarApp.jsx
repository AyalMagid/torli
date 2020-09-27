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
import './CalendarApp.scss';

// motion div style
const pageVariants={
    in:{
        opacity: 1 ,
        x:0,
        textAlign: 'center'
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
    const [loader, setLoader] = useState(true);

    const { loadTimeSlots } = props
    useEffect(() => { loadTimeSlots() }, [loadTimeSlots]);

    async function handleChange(date) {
        setLoader(false)
        handleDateChange(date)
        await props.loadTimeSlots(date)
        setLoader(true)
    }

    return (
       <>
            <motion.div
                initial="out"
                exit="in"
                animate="in"
                variants={pageVariants}
                transition={pageTransition}
            >
                <div className="calendar-picker-container">
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={heLocale} >
                    <ThemeProvider theme={materialTheme}>
                        <KeyboardDatePicker
                            disableToolbar
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
                <div className="main-container time-slot-lists-container">
                    {(props.timeSlots && loader) ? <TimeslotList timeSlots={props.timeSlots} />
                        :<div className="loaderContainer flex  justify-center"><LoaderApp/></div>}
                </div>
            </motion.div>
         <NavBtns />
        </>
    );
}

function mapStateProps(state) {
    return {
        timeSlots: state.CalendarReducer.timeSlots
    }
}

const mapDispatchToProps = {
    loadTimeSlots
}

export const CalendarApp = connect(mapStateProps, mapDispatchToProps)(_CalendarApp)
