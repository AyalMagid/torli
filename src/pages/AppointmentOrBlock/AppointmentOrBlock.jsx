import React from "react";
import { connect } from 'react-redux';
import './AppointmentOrBlock.scss';

export function _AppointmentOrBlock(props) {

    return (
        <>
            <main className="main-appointment-or-block-container flex justify-center align-center column">
            <header className="header-in-apointment-or-block-modal">
                <div className="space-div-for-flex"></div>
                <div className="appointment-or-block-title-modal">בחרו בפעולה הרצויה</div>
                <div className={'modal-header-cls-btn'}><i class="fas fa-times"></i></div>
            </header>
                <div className="routes-btn-container flex column space-around">
                    <div className="contacts-route-btn flex justify-center align-center" onClick={() => props.history.push('/calendarAdmin/contacts')}>
                        <div>קביעת תור ללקוח</div>
                    </div >
                    <div className="block-route-btn flex justify-center align-center" onClick={() => props.history.push('/calendarAdmin/blockHours')}>
                        <div>סגירת חלונות זמנים</div>
                    </div>
                </div>
            <footer className="footer-in-apointment-or-block-modal"></footer>
            </main>
        </>
    );
}

function mapStateProps(state) {
    return {

    }
}

const mapDispatchToProps = {

}

export const AppointmentOrBlock = connect(mapStateProps, mapDispatchToProps)(_AppointmentOrBlock)
