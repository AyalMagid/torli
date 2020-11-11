import React from "react";
import { connect } from 'react-redux';
import { updateRecurrence } from '../../actions/calendarActions';
import './AppointmentFreq.scss';

export function _AppointmentFreq(props) {

    function updateRecurrence(freqOrCount){
        freqOrCount = freqOrCount.target.value 
        let recurrenceCopy = {...props.recurrence}
        recurrenceCopy.isRecurrence = true
        if (freqOrCount.length > 2) {recurrenceCopy.freq = freqOrCount}
        else  {recurrenceCopy.count = freqOrCount}
        props.updateRecurrence(recurrenceCopy)
    }

    return (
        <>
            <main className="appointment-freq flex justify-center align-center column">
            <header className="header-in-appointment-freq-modal">
                <div className="back-arrow" onClick={() => props.history.push('/calendarAdmin/blockHours')}><i class="fas fa-arrow-right"></i></div>
                <div className="appointment-freq-title-modal">קבעו את תדירות הסגירה</div>
                <div className={'modal-header-cls-btn-space'}></div>
            </header>
            <div className="appointment-freq-main-contianer">
                <div className="appointment-freq-exmple-container">
                    <br/>
                    <div className="">בחרו את מספר הסגירות,</div>
                    <div className="">ואחת לכמה זמן תופיע הסגירה.</div>
                    <br/>
                    <div>לדוגמא: </div>
                    <br/>
                    <div>נניח שמספר הסגירות הוא שתיים,</div>
                    <div>ובחרתם סגירות על בסיס שבועי.</div>
                    <br/>
                    <div>יקבעו שתי סגירות!</div>
                    <br/>
                    <div> הראשונה ביום הנבחר,</div>
                    <div>והשנייה בדיוק שבוע לאחר מכן.</div>
                    <br/>
                    <div className="one-time-appointment">לסגירה רגילה וחד פעמית.</div>
                    <div className="one-time-appointment">אין צורך לבחור, פשוט לחצו אישור.</div>
                    <br/>
                </div>
                <div className="appointment-freq-selects-wrapper">
                    <div className="count-container flex space-between">
                        <div className="count-title" for="count">מספר החזרות הרצוי:</div>
                            <select className="count-select" id="count" name="count" onChange={updateRecurrence}>
                                <option value={1} selected={(props.recurrence.count === '1')? true : false }>אחת</option>
                                <option value={2} selected={(props.recurrence.count === '2')? true : false }>שתיים</option>
                                <option value={3} selected={(props.recurrence.count === '3')? true : false }>שלוש</option>
                                <option value={4} selected={(props.recurrence.count === '4')? true : false }>ארבע</option>
                                <option value={5} selected={(props.recurrence.count === '5')? true : false }>חמש</option>
                                <option value={6} selected={(props.recurrence.count === '6')? true : false }>שש</option>
                                <option value={7} selected={(props.recurrence.count === '7')? true : false }>שבע</option>
                                <option value={8} selected={(props.recurrence.count === '8')? true : false }>שמונה</option>
                                <option value={9} selected={(props.recurrence.count === '9')? true : false }>תשע</option>
                                <option value={10} selected={(props.recurrence.count === '10')? true : false }>עשר</option>
                                <option value={11} selected={(props.recurrence.count === '11')? true : false }>אחת-עשרה</option>
                                <option value={12} selected={(props.recurrence.count === '12')? true : false }>שתיים-עשרה</option>
                                <option value={13} selected={(props.recurrence.count === '13')? true : false }>שלוש-עשרה</option>
                                <option value={14} selected={(props.recurrence.count === '14')? true : false }>ארבע-עשרה</option>
                                <option value={15} selected={(props.recurrence.count === '15')? true : false }>חמש-עשרה</option>
                                <option value={16} selected={(props.recurrence.count === '16')? true : false }>שש-עשרה</option>
                                <option value={17} selected={(props.recurrence.count === '17')? true : false }>שבע-עשרה</option>
                                <option value={18} selected={(props.recurrence.count === '18')? true : false }>שמונה-עשרה</option>
                                <option value={19} selected={(props.recurrence.count === '19')? true : false }>תשע-עשרה</option>
                                <option value={20} selected={(props.recurrence.count === '20')? true : false }>עשרים</option>
                            </select>
                    </div>
                    <br/>
                            <div className="freq-container flex space-between">
                                <div className="freq-title" for="freq">חזרתיות על בסיס:</div>
                                <select className="appointment-freq-select" name="freq" id="freq" onChange={updateRecurrence}>
                                    <option value="DAILY" selected={(props.recurrence.freq === 'DAILY')? true : false }>יומי</option>
                                    <option value="WEEKLY" selected={(props.recurrence.freq === 'WEEKLY')? true : false }>שבועי</option>
                                </select>
                            </div>
                    </div>
                </div>
            </main>
        </>
    );
}

function mapStateProps(state) {
    return {
        recurrence: state.CalendarReducer.recurrence,
        userToSchedule: state.UserReducer.userToSchedule
    }
}

const mapDispatchToProps = {
    updateRecurrence
}

export const AppointmentFreq = connect(mapStateProps, mapDispatchToProps)(_AppointmentFreq)
