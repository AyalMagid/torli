import React, {useEffect} from "react";
import { DailySlots } from '../DailySlots/DailySlots';
import UtilsService from '../../services/UtilsService';
import './TimeslotList.scss';

export function TimeslotList(props) {

    useEffect(() => {
        //  console.log(props.date.toISOString())
        }, []);

    return (
        <div className="timeslot-list flex">
            {
                Object.keys(props.timeSlots).map(day => {
                    const isDateFullyBooked = (typeof props.timeSlots[day] == 'string') ? true : false
                    const date = isDateFullyBooked ? props.timeSlots[day].slice(0, 10) : (props.timeSlots[day])[0].start.slice(0, 10)
                    // running on each day
                    const slotsForPreview = isDateFullyBooked ? [] : UtilsService.getDailySlotsForPreview(props.timeSlots[day], props.duration)
                    return (
                        <div key={UtilsService.idGen()}>
                            <div className="date-container">
                                {
                                isDateFullyBooked?     
                                <div className="fully-booked">
                                    <div>{UtilsService.getDayByHebrewWord(new Date(date).getDay())}</div>
                                    <div>{UtilsService.convertDateToIsraelisDisplay(date)}</div>
                                    <br/>
                                    <div className="fully-booked-title">אין תור פנוי</div>
                                </div>
                                :
                                <div>
                                    <div>{UtilsService.getDayByHebrewWord(new Date((props.timeSlots[day])[0].start).getDay())}</div>
                                    <div>{UtilsService.convertDateToIsraelisDisplay(date)}</div>
                                </div>
                                }
                            </div>
                            <DailySlots timeSlots={slotsForPreview} date={date} />
                        </div>
                    )
                })
            }
        </div>
    )
}
