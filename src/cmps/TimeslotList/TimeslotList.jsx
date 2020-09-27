import React from "react";
import { DailySlots } from '../DailySlots/DailySlots';
import UtilsService from '../../services/UtilsService';
import './TimeslotList.scss';

export function TimeslotList(props) {
    console.log(props.timeSlots);
    return (
        <div className="timeslot-list flex">
            {
                Object.keys(props.timeSlots).map(day => {
                    const date = (props.timeSlots[day])[0].start.slice(0, 10)
                    // running on each day
                    const slotsForPreview = UtilsService.getDailySlotsForPreview(props.timeSlots[day], 30)
                    return (
                        <div key={UtilsService.idGen()}>
                            <div className="date-container">
                                <div>
                                    {UtilsService.getDayByHebrewWord(new Date((props.timeSlots[day])[0].start).getDay())}
                                </div>
                                {UtilsService.convertDateToIsraelisDisplay(date)}
                            </div>
                            <DailySlots timeSlots={slotsForPreview} date={date} />
                        </div>
                    )
                })
            }
        </div>
    )
}
