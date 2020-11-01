import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { updateHoursToBlock, updateSlotToBlock } from '../../actions/calendarActions';
import './BlockHours.scss';

export function _BlockHours(props) {

    function markClickedUser(clickedSlotRange) {
        let slotsRange = props.slotsRangeToBlock.slice()
        if (clickedSlotRange.isMarked) {
            slotsRange = slotsRange.map(slotRange => {
                slotRange.isMarked = false
                props.updateSlotToBlock(null)
                return slotRange
            })
        } else {
            slotsRange = props.slotsRangeToBlock.map(slotRange => {
                if (slotRange.end === clickedSlotRange.end) {
                    slotRange.isMarked = true
                    props.updateSlotToBlock(slotRange)
                    return slotRange
                } else {
                    slotRange.isMarked = false
                    return slotRange
                }
            })
        }
        props.updateHoursToBlock(slotsRange)
    }

    return (
        <main className="hours-main-container">
            <header className="header-in-block-hours-modal">
                בחרו חלון זמנים ולחצו אישור להמשך
            </header>
            <div className="hours-container-warpper">
                <div className="hours-container">
                    {
                        (props.slotsRangeToBlock) &&
                        props.slotsRangeToBlock.map((slotRange, idx) => {
                            return (
                                (props.isDayFullyAvailable && (idx === 0))
                                    ?
                                    <div className={`hour-container ${(slotRange.isMarked) ? 'hour-clicked' : ''} flex align-center justify-center`} onClick={() => markClickedUser(slotRange)} key={idx}>
                                        <div className="check-mark-container flex align-center">
                                            {
                                                (slotRange.isMarked) && <i class="fas fa-check"></i>
                                            }
                                        </div>
                                        <div>סגירת יום שלם</div>
                                    </div>
                                    :
                                    <div className={`hour-container ${(slotRange.isMarked) ? 'hour-clicked' : ''} flex align-center justify-center`} onClick={() => markClickedUser(slotRange)} key={idx}>
                                        <div className="check-mark-container flex align-center">
                                            {
                                                (slotRange.isMarked) && <i class="fas fa-check"></i>
                                            }
                                        </div>
                                        <div className="hour-end user-attr">{slotRange.end}</div>
                                        <div className="hours-dash">-</div>
                                        <div className="hour-start user-attr">{slotRange.start}</div>
                                    </div>
                            )
                        })
                    }
                </div>
            </div>
        </main>
    );
}

function mapStateProps(state) {
    return {
        slotsRangeToBlock: state.CalendarReducer.slotsRangeToBlock,
        isDayFullyAvailable: state.CalendarReducer.isDayFullyAvailable
    }
}

const mapDispatchToProps = {
    updateHoursToBlock,
    updateSlotToBlock
}

export const BlockHours = connect(mapStateProps, mapDispatchToProps)(_BlockHours)
