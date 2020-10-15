import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { motion } from 'framer-motion'
import { Swipeable } from 'react-swipeable'
import { LoaderApp } from '../../cmps/LoaderApp/LoaderApp'
import DateFnsUtils from '@date-io/date-fns';
import heLocale from "date-fns/locale/he";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { createMuiTheme, Hidden } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import UtilsService from '../../services/UtilsService';
import CalendarService from '../../services/CalendarService';
import EventService from '../../services/EventService';
import EmailService from '../../services/EmailService';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { DatePicker } from "@material-ui/pickers";
import './CalendarAdmin.scss';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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


export function _CalendarAdmin(props) {
    //the date is irrelevant, its only for the formated function the hours wiil be given by the owner.
    const constrains = {
        start: "2020-10-12T05:00:00Z",
        end: "2020-10-12T16:30:00Z"
    }
    const [selectedDate, handleDateChange] = useState(new Date());
    const [timeSlots, setWorkingTimeSlots] = useState(getWorkingTimeSlots());
    const [tableCells, setTableCells] = useState([]);
    const [month, setMonth] = useState(UtilsService.getMonthByIdx(new Date().getMonth() + 1));
    const [eventsToDisplay, setEventsToDisplay] = useState(async () => {
        return await getWeeklyEvents()
    });
    const [daysForDisplay, setDaysForDisplay] = useState(() => {
        return getDailyDates(selectedDate)
    });
    const [loader, setLoader] = useState(true);

    let eventsIds = []
    useEffect(() => {
        (async () => {
            console.log(daysForDisplay);
            let weeklyEvents = await eventsToDisplay
            if (weeklyEvents) setLoader(false)
            if (weeklyEvents && timeSlots) {
                return setTableCells(
                    timeSlots.map(ts => {
                        return <tr>
                            <td className="td-hours">{ts}</td>
                            {
                                weeklyEvents.map((dailyEvents, dailyIdx) => {
                                    let counter = 0
                                    if (dailyEvents.length) {
                                        let cellIsRendered = false
                                        return dailyEvents.map((ev, eventIdx) => {
                                            let evenOrOdd = (dailyIdx % 2 === 0) ? 'even-event' : 'odd-event'
                                            if (counter > 2) counter = 0
                                            const range = UtilsService.checkIfTsInRange(ts, ev.start, ev.end, 30)
                                            if (range.occupied) {
                                                cellIsRendered = true
                                                if (!eventsIds.includes(ev.id)) {
                                                    eventsIds.push(ev.id)
                                                    return <td className={`occupied-cell ${evenOrOdd}-${(counter)}`} onClick={() => handleClickOpen(ev.id)} rowspan={range.rowspan} >
                                                        <div className="occupied-cell-content">
                                                            <div className="event-time">{(ev.start).slice(11, 16)}-{(ev.end).slice(11, 16)}</div>
                                                            <div className="event-desc">{ev.name}</div>
                                                        </div>
                                                    </td>

                                                } else return ''
                                            }
                                            else if ((dailyEvents.length === eventIdx + 1) && (!cellIsRendered)) {
                                                return <td className="available-cell">{}</td>
                                            }
                                            counter++
                                        })
                                    } else {
                                        return <td className="available-cell">{}</td>
                                    }
                                })
                            }
                        </tr>
                    })
                )
            }
        })()
    }, [eventsToDisplay]);



    function getDailyDates(date) {
        const days = UtilsService.getWeekIsosDatesForCalendar(date.getDay() + 1, date)
        return days.map(day => {
            return day.start.slice(8, 10)
        })
    }

    function cancelAppiontment(evId) {
        setEventsToDisplay(async () => {
            return await getWeeklyEvents(selectedDate)
        })
        CalendarService.removeEventFromCalendar(evId)
        // delete from mongo data base
        EventService.removeEventFromDB(evId)
        // EmailService.sendEmail(eventToRmove.name, eventToRmove.date, eventToRmove.email, false)
    }
    function getDatesWeeklyRange(date) {
        const days = UtilsService.getWeekIsosDatesForCalendar(date.getDay() + 1, date)
        const firstDay = UtilsService.convertDateToIsraelisDisplay(days[0].start.slice(0, 10))
        const lastDay = UtilsService.convertDateToIsraelisDisplay(days[days.length - 1].start.slice(0, 10))
        return `${lastDay} - ${firstDay}`
    }

    function getWorkingTimeSlots() {
        return UtilsService.getDailySlotsForPreview([constrains], 15)
    }

    async function getWeeklyEvents(date = new Date()) {
        return await Promise.all((UtilsService.getWeekIsosDatesForCalendar(date.getDay() + 1, date)).map(async isosDate => {
            return await CalendarService.getEventsFromCalendar(isosDate)
        }))
    }

    async function handleChange(date) {
        setDaysForDisplay(getDailyDates(date))
        setMonth(UtilsService.getMonthByIdx(date.getMonth() + 1))
        eventsIds = []
        setLoader(true)
        const weeklyEvents = await getWeeklyEvents(date)
        if (weeklyEvents) {
            setLoader(false)
        }
        setEventsToDisplay(weeklyEvents)
        handleDateChange(date)
    }
    function onSwipeDirection(direction) {
        if (!loader) {
            //need to change to normal way
            if ((direction === 'Left') && (selectedDate.getTime()) > (new Date().getTime())) {
                handleChange(new Date(selectedDate.setDate(selectedDate.getDate() - 7)));
            }
            else if (direction === 'Right') {
                handleChange(new Date(selectedDate.setDate(selectedDate.getDate() + 7)));
            }
            // else {
            //     if ((direction !== 'Up') && (direction !== 'Down')) {
            //         seTcalendarTitle('לא ניתן לבחור תאריך שעבר')
            //         setPickerRedTitle('picker-red-title')
            //         setTimeout(() => {
            //             seTcalendarTitle('בחרו תאריך ושעה, ניתן להחליק ימינה/שמאלה ');
            //             setPickerRedTitle('date-picker-title')
            //         }, 3000);
            //     }
            // }
        }
    }
    const [isOpen, setIsOpen] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [eventToRmoveId, setEventToRmove] = React.useState('');

    const handleClickOpen = (evId) => {
        setEventToRmove(evId)
        setOpen(true);
    };

    const handleClose = (isApproved) => {
        setOpen(false);
        if(isApproved) cancelAppiontment(eventToRmoveId)
    };
    return (
        <motion.div
            initial="out"
            exit="in"
            animate="in"
            variants={pageVariants}
            transition={pageTransition}
            style={{ width: "100%", height: "100%" }}
        >
            <main className="calendar-admin-container">


                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={heLocale} >
                    <ThemeProvider theme={materialTheme}>
                        <DatePicker
                            // disablePast={true}
                            variant="dialog"
                            okLabel="אישור"
                            cancelLabel="ביטול"
                            open={isOpen}
                            onOpen={() => setIsOpen(true)}
                            onClose={() => setIsOpen(false)}
                            format="MM/dd/yyyy"
                            id="date-picker-inline"
                            disableToolbar
                            value={selectedDate}
                            onChange={handleChange}
                            InputProps={{
                                disableUnderline: true,
                                style: { width: '0' }
                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </ThemeProvider>
                </MuiPickersUtilsProvider>
                <div className="date-display-container flex space-around" onClick={() => setIsOpen(true)}>
                    <div className="date-display">{getDatesWeeklyRange(selectedDate)}</div>
                    <i class="fas fa-calendar-week"></i>
                </div>
                <Swipeable onSwiped={(eventData) => onSwipeDirection(eventData.dir)} >
                    <div>
                        {
                            !loader ?
                                <div class="tableFixHead">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th >
                                                    <div className="month-name">  {month}</div>
                                                </th>
                                                <th>
                                                    <div className="daily-name">ראשון</div>
                                                    <div className="daily-num"> {daysForDisplay[0]}</div>
                                                </th>
                                                <th>
                                                    <div className="daily-name">שני</div>
                                                    <div className="daily-num"> {daysForDisplay[1]}</div>
                                                </th>
                                                <th>
                                                    <div className="daily-name">שלישי</div>
                                                    <div className="daily-num"> {daysForDisplay[2]}</div>
                                                </th>
                                                <th>
                                                    <div className="daily-name">רביעי</div>
                                                    <div className="daily-num"> {daysForDisplay[3]}</div>
                                                </th>
                                                <th>
                                                    <div className="daily-name">חמישי</div>
                                                    <div className="daily-num"> {daysForDisplay[4]}</div>
                                                </th>
                                                <th>
                                                    <div className="daily-name">שישי</div>
                                                    <div className="daily-num"> {daysForDisplay[5]}</div>
                                                </th>
                                                {/* <th>שבת</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (tableCells.length) &&
                                                tableCells
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                :
                                <LoaderApp />
                        }
                    </div>
                </Swipeable>

                <div>
                    <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">מחיקת תור</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                               האם את/ה בטוח/ה שברצונך למחוק תור זה?
                      </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={()=>handleClose(false)} color="primary">
                                ביטול
               </Button>
                            <Button onClick={()=>handleClose(true)} color="primary">
                                אישור
               </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </main>
        </motion.div>
    );
}

function mapStateProps(state) {
    return {

    }
}

const mapDispatchToProps = {

}

export const CalendarAdmin = connect(mapStateProps, mapDispatchToProps)(_CalendarAdmin)
