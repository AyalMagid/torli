import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import DateFnsUtils from '@date-io/date-fns';
import heLocale from "date-fns/locale/he";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { motion } from 'framer-motion'
import MotionService from "../../services/MotionService";
import { NavBtns } from '../../cmps/NavBtns/NavBtns';
import { LoaderApp } from '../../cmps/LoaderApp/LoaderApp'
import { TimeslotList } from '../../cmps/TimeslotList/TimeslotList';
import { loadTimeSlots } from '../../actions/calendarActions.js';
import { Swipeable } from 'react-swipeable'
import './CalendarApp.scss';

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
    const [calendarTitle, seTcalendarTitle] = useState('בחרו תאריך ושעה, ניתן להחליק ימינה/שמאלה ');
    const [pickerRedTitle, setPickerRedTitle] = useState('date-picker-title');

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

    function disableDay(date) {
        return  (date.getDay() === 6);
    }


    function onSwipeDirection(direction) {
        if(props.timeSlots&&!loader){
            const dateCopy = (new Date(selectedDate.setDate(selectedDate.getDate())))
        //need to change to normal way
        if ((direction === 'Left')&& (selectedDate.getTime()) > (new Date().getTime())) {
              // checking if there was an unworking day who should be skipped in the range (like saturday), and handle it by jumping one more
            if ((dateCopy.getDay() - 1 === -1) || (dateCopy.getDay() - 2 === -1) || (dateCopy.getDay() - 3 === -1)){
                handleChange(new Date(selectedDate.setDate(selectedDate.getDate() - 4)));
            } else {
                handleChange(new Date(selectedDate.setDate(selectedDate.getDate() - 3)));
            }
        }
        else if (direction === 'Right') {
            // checking if there was an unworking day who should be skipped in the range (like saturday), and handle it by jumping one more
            if ((dateCopy.getDay() + 1 === 6) || (dateCopy.getDay() + 2 === 6) || (dateCopy.getDay() + 3 === 6)){
                handleChange(new Date(selectedDate.setDate(selectedDate.getDate() + 4)));
            } else {
                handleChange(new Date(selectedDate.setDate(selectedDate.getDate() + 3)));
            }
        }
        else {
            if ((direction !== 'Up') && (direction !== 'Down')) {
                seTcalendarTitle('לא ניתן לבחור תאריך שעבר')
                setPickerRedTitle('picker-red-title')
                setTimeout(() => {
                    seTcalendarTitle('בחרו תאריך ושעה, ניתן להחליק ימינה/שמאלה ');
                    setPickerRedTitle('date-picker-title')
                }, 3000);
            }
        }
    }
    }
    return (
        <>
            <motion.div
                initial="out"
                exit="in"
                animate="in"
                variants={MotionService.getMotionStyle('pageVariants')}
                transition={MotionService.getMotionStyle('pageTransition')}
                style={{ width: "100%" }}
            >
                <div className="calendar-picker-container">
                    <div className={`${pickerRedTitle}`}>
                        {calendarTitle}
                    </div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={heLocale} >
                        <ThemeProvider theme={materialTheme}>
                            <KeyboardDatePicker
                                disableToolbar
                                disablePast={true}
                                shouldDisableDate={disableDay}
                                variant="dialog"
                                okLabel="אישור"
                                cancelLabel="ביטול"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                value={selectedDate}
                                onChange={handleChange}
                                keyboardbuttonprops={{
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
