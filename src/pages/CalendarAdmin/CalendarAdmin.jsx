import React, { useEffect, useState } from "react";
import { useLocation, HashRouter as Router, withRouter, Route } from 'react-router-dom';
import { connect} from 'react-redux';
import { motion } from 'framer-motion'
import MotionService from "../../services/MotionService";
import { Swipeable } from 'react-swipeable'
import { LoaderApp } from '../../cmps/LoaderApp/LoaderApp'
import DateFnsUtils from '@date-io/date-fns';
import heLocale from "date-fns/locale/he";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { createMuiTheme} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { updateAvailbleDuration, setTreatment } from '../../actions/treatmentActions.js';
import { updateHoursToBlock, updateIsDayFullyAvailable, updateTableModel} from '../../actions/calendarActions';
import { updateUserPhoneInContactSignup } from '../../actions/userAction.js';
import TreatmentService from "../../services/TreatmentService";
import UtilsService from '../../services/UtilsService';
import CalendarService from '../../services/CalendarService';
import EventService from '../../services/EventService';
import StoreService from '../../services/StoreService';
import { TreatmentApp } from '../TreatmentApp/TreatmentApp'
import { Contacts } from '../../pages/Contacts/Contacts.jsx'
import { AppointmentOrBlock } from '../../pages/AppointmentOrBlock/AppointmentOrBlock.jsx'
import { AppointmentFreq } from '../../pages/AppointmentFreq/AppointmentFreq.jsx'
import { BlockHours } from '../../pages/BlockHours/BlockHours.jsx'
import { BlockConfermation } from '../../pages/BlockConfermation/BlockConfermation.jsx'
import { SubmitForm } from '../../pages/SubmitForm/SubmitForm.jsx'
import { ModalButton } from '../../cmps/ModalButton/ModalButton.jsx'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { DatePicker } from "@material-ui/pickers";
import './CalendarAdmin.scss';
import { Signup } from "../Signup/Signup";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide timeout={5000} direction="down" ref={ref} {...props} />;
});

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

//"event_OW9xbGFtdXN2ZXFmMTMzYjhhbm8za3RoaDQ"
//"event_ZmQwbmt2czEydmU4aGNvMTNnc20zNHFqNGc"
//"event_OW9xbGFtdXN2ZXFmMTMzYjhhbm8za3RoaDRfMjAyMDEyMTNUMDYzMDAwWg"

let approvedCounter = 0

function _CalendarAdmin(props) {

    //the date is irrelevant, its only for the formated function the hours wiil be given by the owner.
    const location = useLocation()
    const constrains = {
        start: "2020-10-12T06:00:00Z",
        end: "2020-10-12T18:00:00Z"
    }
    const [selectedDate, handleDateChange] = useState(new Date());
    const [tempEventToRmoveId, setTempEventToRmoveId] = useState('');
    const [eventToRmoveId, setEventToRmove] = React.useState({});
    const [prevEventsToDisplay, setPrevEventsToDisplay] = React.useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [reccurenceBlock, setReccurenceBlock] = React.useState(false);
    const [modalSubJect, setModalSubJect] = React.useState('');
    const [modalContent, setModalContent] = React.useState({title:'הסרת חסימה ',text:'להסרת החסימה לחצו אישור'});
    const [isTempModeOn, setIsTempModeOn] = useState(false);
    const [weeklyDates, setWeeklyDates] = useState([]);
    const [timeSlots, setWorkingTimeSlots] = useState(getWorkingTimeSlots());
    const [isClicked, setIsClicked] = useState(true);
    const [tableCells, setTableCells] = useState([]);
    const [occDates, setOccupiedDates] = useState([]);
    const [month, setMonth] = useState(UtilsService.getMonthByIdx(new Date().getMonth() + 1));
    const [eventsToDisplay, setEventsToDisplay] = useState(async () => {
        return await getWeeklyEvents()
    });
    const [daysForDisplay, setDaysForDisplay] = useState(() => {
        return getDailyDates(selectedDate)
    });
    const [loader, setLoader] = useState(true);

    let eventsIds = []


    let weeklyRange = CalendarService.getDatesWeeklyRange(selectedDate)
    
    const [appointmentsModalIsOpen, setAppointmentsModalIsOpen] = React.useState(false);


    useEffect(() => {
        (async () => {

            let weeklyEvents = await eventsToDisplay
            let isTemp = false
            weeklyEvents.forEach(dailyEvents => {
                dailyEvents.forEach(ev => {
                    if (ev.isTemp) isTemp = true
                })
            })
            if (!isTemp) {
                setIsTempModeOn(false)
                setOpen(false)
            }

            if (!props.tableModel.length) {
                let table = CalendarService.buildWeeklyModel(timeSlots,await eventsToDisplay)
                props.updateTableModel(table)
            }

            if (weeklyEvents) setLoader(false)
            if (weeklyEvents && timeSlots) {
                console.log('calendaradmin recreated')

                return setTableCells(
                    timeSlots.map((ts, tsIdx) => {
                        if (tsIdx === timeSlots.length - 1) return
                        return <tr key={tsIdx}>
                            <td className="td-hours">{UtilsService.timeToDisplay(ts)}</td>
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
                                                    return <td className={`occupied-cell ${(ev.name === 'block - block') ? 'blocked-cell' : ''} ${evenOrOdd}-${(counter)} ${(ev.isTemp&&!ev.isCancelApp) ? 'temp-cell' : ''}`} key={eventIdx} onClick={() => handleClickOpen(ev)} rowSpan={range.rowspan}>
                                                        <div className="occupied-cell-content">
                                                            <div className="event-time-wrapper">
                                                                <div className="event-time">{UtilsService.timeToDisplay((ev.start).slice(11, 16))}-{UtilsService.timeToDisplay((ev.end).slice(11, 16))}</div>
                                                            </div>
                                                            {(ev.name === 'block - block')
                                                                ?
                                                                <div>
                                                                    סגור
                                                                </div>
                                                                :
                                                                <div className="event-desc">
                                                                    <div className="event-name">{UtilsService.getSplitedEventDesc(ev.name).name}</div>
                                                                    <div className="event-treatment">{UtilsService.getSplitedEventDesc(ev.name).treatment}</div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </td>

                                                } else return ''
                                            }
                                            else if ((dailyEvents.length === eventIdx + 1) && (!cellIsRendered)) {
                                                return <td className="available-cell" key={eventIdx} onClick={(isTemp) ? () => setOpen(true) : () => openAppointmentsModal({ tsIdx, dailyIdx }, ts)}>{<i className="fas fa-plus"></i>}</td>
                                            }
                                            counter++
                                        })
                                    } else {
                                        //all day available no event at this day
                                        return <td key={dailyIdx} className="available-cell" onClick={(isTemp) ? () => setOpen(true) : () => openAppointmentsModal({ tsIdx, dailyIdx }, ts, true)}>{<i className="fas fa-plus"></i>}</td>
                                    }
                                })
                            }
                        </tr>
                    })
                )
            }
        })()
    }, [eventsToDisplay, props.updateTableModel, props.tableModel]);

    useEffect(() => {
        checkIfClicked()
    }, [props.users, props.slotsRangeToBlock]);

    useEffect(() => {
        if (approvedCounter === 2){
            console.log(eventToRmoveId)
            cancelAppiontment()
            approvedCounter = 0
            setReccurenceBlock(false)
        }
    }, [eventToRmoveId]);

    useEffect(() => {
        (async () => {
                let table = CalendarService.buildWeeklyModel(timeSlots, await eventsToDisplay)
                props.updateTableModel(table)
        })()
    }, [eventsToDisplay]);

    function checkIfClicked() {
        if (location.pathname === '/calendarAdmin/contacts') {
            setIsClicked(!(props.users.find(user => user.isMarked)))
        }
        if (location.pathname === '/calendarAdmin/blockHours') {
            setIsClicked(!(props.slotsRangeToBlock.find(sr => sr.isMarked)))
        }
    }

    function openAppointmentsModal(cellPos, ts, isDayFullyAvailable = false) {
        props.updateIsDayFullyAvailable(isDayFullyAvailable)
        const dateToScheduale = weeklyDates[cellPos.dailyIdx].start
        props.setTreatment({
            time: ts,
            date: dateToScheduale.slice(0, 10),
            dailyIdx: cellPos.dailyIdx
        })
        const availableDuration = CalendarService.getAvailbleDuration(props.tableModel, cellPos)
        props.updateAvailbleDuration(availableDuration)
        props.updateHoursToBlock(CalendarService.getHoursToBlock(timeSlots, ts, availableDuration, dateToScheduale.slice(0, 10), isDayFullyAvailable))
        setAppointmentsModalIsOpen(true)
        props.history.push('/calendarAdmin/appointmentOrBlock')
    }


    function handleModalRoute(duration) {
        if (location.pathname === '/calendarAdmin/contacts') {
            props.history.push('/calendarAdmin/treatments')
            setIsClicked(true)
        }
        if (location.pathname === '/calendarAdmin/treatments') {
            props.history.push('/calendarAdmin/form')
            // props.history.push('/calendarAdmin/freq')
        }
        if (location.pathname === '/calendarAdmin/freq') {
        //  if (userToSchedule) {props.history.push('/calendarAdmin/form')}
        //  else {{props.history.push('/calendarAdmin/blockConfermation')}
            props.history.push('/calendarAdmin/blockConfermation')
        }
        if (location.pathname === '/calendarAdmin/form') {
            // setAppointment(duration, props.recurrence)
            setAppointment(duration)
            closeAppointmentsModal()
        }
        if (location.pathname === '/calendarAdmin/blockHours') {
            props.history.push('/calendarAdmin/freq')
            // props.history.push('/calendarAdmin/blockConfermation')
        }
        if (location.pathname === '/calendarAdmin/freq') {
            props.history.push('/calendarAdmin/blockConfermation')
        }
        if (location.pathname === '/calendarAdmin/blockConfermation') {
            blockSlotRange(props.recurrence)
            closeAppointmentsModal()
        }
    }

    function getDailyDates(date) {
        const days = UtilsService.getWeekIsosDatesForCalendar(date.getDay() + 1, date)
        setWeeklyDates(days)
        return days.map(day => {
            return day.start.slice(8, 10)
        })
    }

    async function cancelAppiontment() {
        setIsTempModeOn(true)
        console.log('eventToRmoveId', eventToRmoveId)
        console.log('tempEventToRmoveId', tempEventToRmoveId)
        let eventsToDisplayCopy = JSON.parse(JSON.stringify(await eventsToDisplay));
        eventsToDisplayCopy = eventsToDisplayCopy.map(dailyEvents => {
            return dailyEvents.filter(ev => ev.id !== tempEventToRmoveId)
        })
        eventsToDisplayCopy = eventsToDisplayCopy.map(dailyEvents => {
            return dailyEvents.map(ev => {
                ev.isTemp = true
                ev.isCancelApp = true
                return ev
            })
        })

        setEventsToDisplay(eventsToDisplayCopy)
        const confirmedDeletedEvent = await CalendarService.removeEventFromCalendar(eventToRmoveId.calendar)
        console.log('confiremdn deleted from calendar',confirmedDeletedEvent)
        if (!confirmedDeletedEvent) {
            console.log('problem deleting event')
            //need to put modal
            return
        }
        setEventsToDisplay(async () => {
            return await getWeeklyEvents(selectedDate)
        })
        // delete from mongo data base - for blocks which are recurrence there is only one mongo event 
        if (eventToRmoveId.mongo) {EventService.removeEventFromDB(eventToRmoveId.mongo)}
        // EmailService.sendEmail(eventToRmove.name, eventToRmove.date, eventToRmove.email, false)
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
        }
    }

    // "event_amYyZGNkMjUxaWNtZmptNzZzYmlwY3JzMmc"
    const handleClickOpen = async (ev) => {
        if (ev) {

            if (ev.name === 'block - block') {
                setModalSubJect('block')
            } else {
                 setModalSubJect('appointment')
            }

            if (ev.id.length > 60){
                // must be a reccurence event
                setReccurenceBlock(true)
            }
            setTempEventToRmoveId(ev.id)
            const mongoEvent = await EventService.getMongoEventByEventCalendarId(ev.id)
            console.log('mongo event',mongoEvent)
            if (mongoEvent) {setEventToRmove({ mongo: mongoEvent._id, calendar: ev.id })}
            else {setEventToRmove({ mongo: '', calendar: ev.id })}
        }
        setOpen(true);
    };


    // change to switch case with small functions
    // fermove is approved is for the second time - so we can delete all events or just single
    const handleClose = (isApproved) => {
        console.log(reccurenceBlock, 'reccurenceBlock')
        if (isApproved) {
            // isapproved - approval on the modal - true/false
            // counter to make sure how many times? 1? 2?
            approvedCounter ++
            console.log(approvedCounter, 'approvedCounter')
        if (reccurenceBlock) {
            // is it reccurence?
            console.log(reccurenceBlock, 'reccurenceBlock')
            setModalContent({title:'סגירה שחוזרת על עצמה', text:'למחיקת כל המופעים החוזרים של הסגירה, לחצו אישור. למחיקה בתאריך הספציפי שנבחר לחצו ביטול'})
            if (approvedCounter === 2) {
                // wants to delete the whole block reccurence
                cancelRecurrenceBlock()
                setOpen(false);
                setModalContent({title:'הסרת חסימה ',text:'להסרת החסימה לחצו אישור'})
                return
            }
            // means it is not modal after trying to scheduale on occupied dates but some kind of removal (either appointment or block)
        } else if (!prevEventsToDisplay) {
            // normal individual block
            setOpen(false)
            cancelAppiontment()
            approvedCounter = 0
            setModalContent({title:'הסרת חסימה ',text:'להסרת החסימה לחצו אישור'})
        } else {
            // must be modal after trying to schedaule reccurence block but dates are occupied
            setOpen(false)
            setEventsToDisplay(prevEventsToDisplay)
            setPrevEventsToDisplay(null)
        }
    } else if (!isApproved && approvedCounter){
        // wants to delete only ony specific block from the reccurence counter must be at least one from first click
    // meaning first click was approved (to delete the block and the second wasnt - want to delete only the specific one - not the whole thing)
        setOpen(false);
        approvedCounter = 0
        setReccurenceBlock(false)
        setModalContent({title:'הסרת חסימה ',text:'להסרת החסימה לחצו אישור'})
        if (!prevEventsToDisplay) {
            cancelAppiontment()
        } else {
            setEventsToDisplay(prevEventsToDisplay)
            setPrevEventsToDisplay(null)
        }
    } else {
        // tried to scheduale recuurence block on dates which are occupied than click bitul
        if (prevEventsToDisplay) {
            setEventsToDisplay(prevEventsToDisplay)
            setPrevEventsToDisplay(null)
        }
        setOpen(false)
    }
};

    async function cancelRecurrenceBlock () {
        const idToCompareWithMongo = eventToRmoveId.calendar.slice(0,40)
        const reccurenceMongoEvent = await EventService.getReccurenceMongoEventBySubStrId(idToCompareWithMongo)
        console.log(reccurenceMongoEvent,'reccurenceMongoEvent')
        setTempEventToRmoveId(reccurenceMongoEvent.eventId)
        setEventToRmove({ mongo: reccurenceMongoEvent._id, calendar: reccurenceMongoEvent.eventId })
    }

    async function setAppointment(duration) {
        setIsTempModeOn(true)
        const markedTreatmetns = TreatmentService.getMarkedTreatmentsStr(props.treatments)
        const { phone, email, name } = props.userToSchedule
        let time = UtilsService.changeTimeForDisplay(props.treatment.time, 0)
        const startTime = `${props.treatment.date}T${time}:00Z`
        time = UtilsService.calculateEndTime(time, duration)
        const endTime = `${props.treatment.date}T${time}:00Z`
        const tempEvent = {
            id: UtilsService.idGen(),
            name: `${name} - ${markedTreatmetns}`,
            start: startTime,
            end: endTime,
            isTemp: true
        }
        let eventsToDisplayCopy = JSON.parse(JSON.stringify(await eventsToDisplay));
        eventsToDisplayCopy[props.treatment.dailyIdx].push(tempEvent)
        setEventsToDisplay(eventsToDisplayCopy)
        const confirmedEvent = await CalendarService.setAppointment(markedTreatmetns, duration, phone, email, name, props.treatment)
        if (!confirmedEvent) {
            console.log('couldnt schduale appointment')
            //need to put modal
            return
        }

        setEventsToDisplay(await getWeeklyEvents(selectedDate))
    }

    async function blockSlotRange(recurrence) {
        setIsTempModeOn(true)
        let time1 = UtilsService.changeTimeForDisplay(props.slotToBlock.start, 0)
        let time2 = UtilsService.changeTimeForDisplay(props.slotToBlock.end, 0)
        let startTime = `${props.slotToBlock.date}T${time1}:00Z`
        let endTime = `${props.slotToBlock.date}T${time2}:00Z`
        let tempEvent = {
            id: UtilsService.idGen(),
            name: 'block - block',
            start: startTime,
            end: endTime,
            isTemp: true
        }
            let eventsToDisplayCopy = JSON.parse(JSON.stringify(await eventsToDisplay));
            eventsToDisplayCopy[props.treatment.dailyIdx].push(tempEvent)
        
            let startTimeTs = tempEvent.start.slice(11,16) 
            let startTimeTsIdx = timeSlots.findIndex(ts => ts === startTimeTs)
            let endTimeTs = tempEvent.end.slice(11,16)
            let endTimeTsIdx = timeSlots.findIndex(ts => ts === endTimeTs)
    
            for (var i=1; i<props.recurrence.count && props.recurrence.freq === 'DAILY'; i++){
              tempEvent = {...tempEvent}
              startTime = new Date (new Date(startTime).getTime() + (1000 * 60 * 60 * 24))
              startTime = startTime.toISOString()
              endTime = new Date (new Date(endTime).getTime() + (1000 * 60 * 60 * 24))
              endTime = endTime.toISOString()
              tempEvent.id = UtilsService.idGen()
              tempEvent.start = startTime
              tempEvent.end = endTime
            //   dailyIdx+i for the next day -- the j is for the ts (where exactly in the next day) => making sure there is not already an event there before pushing temp
            let isCellOccupied = false
            for (var j=startTimeTsIdx; j<endTimeTsIdx; j++) { 
                if (!props.tableModel[j][props.treatment.dailyIdx+i]){
                    isCellOccupied = true
                    console.log(timeSlots[j], 'is not availble at', props.treatment.dailyIdx+i)
                }
            }
                if (!isCellOccupied) { eventsToDisplayCopy[props.treatment.dailyIdx+i].push(tempEvent)}
        }
            let prevEvents = [... await eventsToDisplay]
            setEventsToDisplay(eventsToDisplayCopy)
            const confirmedBlockOrOccDates = await CalendarService.blockSlotRange(props.slotToBlock, 'block', recurrence)
        if (Array.isArray(confirmedBlockOrOccDates)) {
            setModalSubJect('occupied')
            setOccupiedDates (confirmedBlockOrOccDates)
            setPrevEventsToDisplay (prevEvents)
            setIsTempModeOn(false)
            setOpen(true)
            return
        } 
        console.log('confirmed eventId',confirmedBlockOrOccDates.id)
        setEventsToDisplay(async () => {
            return await getWeeklyEvents(selectedDate)
        })
    }

    function closeAppointmentsModal() {
        setAppointmentsModalIsOpen(false)
        // chagne semantics, because it represents the opposite - making sure btn will be disable after modal closed and reopen
        setIsClicked(true)
        props.updateUserPhoneInContactSignup('')
        StoreService.initApp()
        props.history.push('/calendarAdmin')
    }

    function disableDay(date) {
        return (date.getDay() === 6);
    }

    return (
        <>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={heLocale} >
                <ThemeProvider theme={materialTheme}>
                    <DatePicker
                        disablePast={true}
                        shouldDisableDate={disableDay}
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
                            style: { width: '0', height: '0px' }
                        }}
                        keyboardbuttonprops={{
                            'aria-label': 'change date',
                        }}
                    />
                </ThemeProvider>
            </MuiPickersUtilsProvider>
            <motion.div
                initial="out"
                exit="in"
                animate="in"
                variants={MotionService.getMotionStyle('pageVariantsWithTextAlign')}
                transition={MotionService.getMotionStyle('pageTransition')}
                style={{ width: "100%", height: "100%" }}
            >
                <main className="calendar-admin-container">
                    <div className="header-app flex justifiy-center align-center space-between" >
                        <div className="weekly-dates-container flex space-between align-center" onClick={() => setIsOpen(true)}>
                            <i className="calendar-icon fas fa-calendar-week"></i>
                            <div className="weekly-dates-text">{weeklyRange.firstDay}<br />{weeklyRange.lastDay} </div>
                        </div>
                        <div id="text2" onClick={() => props.history.push('/')} >Tori<i className="fas fa-tasks"></i></div>
                    </div>
                    <Swipeable onSwiped={(eventData) => onSwipeDirection(eventData.dir)} >
                        <header className="days-header-container flex space-between">
                            <div className="days-name-container month-container" >
                                <div className="month-name">{month}</div>
                            </div>
                            <div className="days-name-container">
                                <div className="daily-name">ראשון</div>
                                <div className="daily-num"> {daysForDisplay[0]}</div>
                            </div>
                            <div className="days-name-container">
                                <div className="daily-name">שני</div>
                                <div className="daily-num"> {daysForDisplay[1]}</div>
                            </div>
                            <div className="days-name-container">
                                <div className="daily-name">שלישי</div>
                                <div className="daily-num"> {daysForDisplay[2]}</div>
                            </div>
                            <div className="days-name-container">
                                <div className="daily-name">רביעי</div>
                                <div className="daily-num"> {daysForDisplay[3]}</div>
                            </div>
                            <div className="days-name-container">
                                <div className="daily-name">חמישי</div>
                                <div className="daily-num"> {daysForDisplay[4]}</div>
                            </div>
                            <div className="days-name-container">
                                <div className="daily-name">שישי</div>
                                <div className="daily-num"> {daysForDisplay[5]}</div>
                            </div>
                        </header>
                        <div>
                            {
                                !loader ?
                                    <div className="table-container">
                                        <table>
                                            <tbody>
                                                {
                                                    (tableCells.length) &&
                                                    tableCells
                                                }
                                            </tbody>
                                        </table>
                                        <footer className="calendar-footer flex align-center justify-center">
                                            <div className="footer-hours">20:00</div>
                                        </footer>
                                    </div>
                                    :
                                    <div className="loader-container flex justify-center align-center space-around">
                                        <LoaderApp />
                                    </div>
                            }
                        </div>
                    </Swipeable>



                    <div>
                        <Dialog
                            open={open}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={() => handleClose(false)}
                            aria-labelledby="alert-dialog-slide-title"
                            aria-describedby="alert-dialog-slide-description"
                        >
                            <DialogTitle id="alert-dialog-slide-title">
                                {
                                    (isTempModeOn) ?
                                        'ארעה שגיאה'
                                        :
                                        (modalSubJect === 'block')
                                            ?
                                            modalContent.title
                                            :
                                            (modalSubJect === 'appointment')?
                                            'ביטול תור'
                                            :
                                                (occDates.length>1)?
                                                 'התאריכים הנ״ל כבר תפוסים' 
                                                 :
                                                 (occDates.length===1)?
                                                 'התאריך הנ״ל כבר תפוס' 
                                                 :
                                                 ''
                            
                                }
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-slide-description">
                                    {
                                        (isTempModeOn) ?
                                            'סגרו את המודעה ונסו שנית'
                                            :
                                            (modalSubJect === 'block')
                                                ?
                                                modalContent.text
                                                :
                                                (modalSubJect === 'appointment')?
                                                ' לביטול התור לחצו אישור'
                                                :
                                                (occDates.length>1)?
                                                    `התאריכים - ${occDates.map(d=>UtilsService.convertDateTo4DigitsDisplay(d))} כבר תפוסים, הסגירות לא נקבעו!`
                                                    :
                                                    (occDates.length===1)?
                                                    `התאריך ${occDates.map
                                                    (d=>UtilsService.convertDateTo4DigitsDisplay(d))} כבר תפוס, הסגירות לא נקבעו!`
                                                    :
                                                    ''
                                           
                                        // (isTempModeOn) ?
                                        //     'סגרו את המודעה ונסו שנית'
                                        //     :
                                        //     (modalSubJect === 'block')
                                        //         ?
                                        //         'להסרת החסימה לחצו אישור'
                                        //         :
                                        //         ' לביטול התור לחצו אישור'
                                    }
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => handleClose(false)} color="primary">
                                    ביטול
                            </Button>
                                {
                                    (isTempModeOn)
                                        ?
                                        <Button onClick={() => handleClose(false)} color="primary">
                                            אישור
                             </Button>
                                        :
                                        <Button onClick={() => handleClose(true)} color="primary">
                                            אישור
                              </Button>
                                }
                            </DialogActions>
                        </Dialog>
                    </div>
                    {appointmentsModalIsOpen &&
                        <>
                            <div className="modal-screen" onClick={closeAppointmentsModal}>
                            </div>
                            <div className="apointments-modal">
                                <Router>
                                    <Route path="/calendarAdmin/contacts" exact component={Contacts} />
                                    <Route path="/calendarAdmin/contacts/signup" component={Signup} />
                                    <Route path="/calendarAdmin/treatments" component={TreatmentApp} />
                                    <Route path="/calendarAdmin/form" component={SubmitForm} />
                                    <Route path="/calendarAdmin/freq" component={AppointmentFreq} />
                                    <Route path="/calendarAdmin/appointmentOrBlock" component={AppointmentOrBlock} />
                                    <Route path="/calendarAdmin/blockHours" component={BlockHours} />
                                    <Route path="/calendarAdmin/blockConfermation" component={BlockConfermation} />
                                    {/* <Route path="/:workPlace/calendarAdmin/contacts" exact component={Contacts} />
                                    <Route path="/:workPlace/calendarAdmin/contacts/signup" component={Signup} />
                                    <Route path="/:workPlace/calendarAdmin/treatments" component={TreatmentApp} />
                                    <Route path="/:workPlace/calendarAdmin/form" component={SubmitForm} />
                                    <Route path="/:workPlace/calendarAdmin/freq" component={AppointmentFreq} />
                                    <Route path="/:workPlace/calendarAdmin/appointmentOrBlock" component={AppointmentOrBlock} />
                                    <Route path="/:workPlace/calendarAdmin/blockHours" component={BlockHours} />
                                    <Route path="/:workPlace/calendarAdmin/blockConfermation" component={BlockConfermation} /> */}
                                </Router>
                                {((location.pathname !== '/calendarAdmin/appointmentOrBlock') && (location.pathname !== '/calendarAdmin/contacts/signup')) && <ModalButton handleModalRoute={handleModalRoute} isClicked={isClicked} />}
                                <div className="close-admin-modal-btn" onClick={closeAppointmentsModal}><i class="fas fa-times"></i></div>
                            </div>
                        </>
                    }
                </main>
            </motion.div>
        </>
    );
}

function mapStateProps(state) {
    return {
        users: state.UserReducer.users,
        userToSchedule: state.UserReducer.userToSchedule,
        treatments: state.TreatmentReducer.treatments,
        treatment: state.TreatmentReducer.treatment,
        slotsRangeToBlock: state.CalendarReducer.slotsRangeToBlock,
        slotToBlock: state.CalendarReducer.slotToBlock,
        recurrence: state.CalendarReducer.recurrence,
        tableModel: state.CalendarReducer.tableModel
    }
}

const mapDispatchToProps = {
    updateAvailbleDuration,
    setTreatment,
    updateHoursToBlock,
    updateIsDayFullyAvailable,
    updateUserPhoneInContactSignup,
    updateTableModel
}

export const CalendarAdmin = withRouter(connect(mapStateProps, mapDispatchToProps)(_CalendarAdmin))
