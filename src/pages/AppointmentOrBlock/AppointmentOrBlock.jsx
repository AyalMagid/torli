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
                <div className={'modal-header-cls-btn-space'}></div>
            </header>
                <div className="routes-btn-container flex column space-around">
                    <div className="contacts-route-btn flex justify-center align-center column" onClick={() => props.history.push('/calendarAdmin/contacts')}>
                        <div className="app-or-block-title">קביעת תור ללקוח</div>
                        <i className="app-icon fas fa-user-clock"></i>
                    </div >
                    <div className="block-route-btn flex justify-center align-center column" onClick={() => props.history.push('/calendarAdmin/blockHours')}>
                        <div className="app-or-block-title">סגירת חלונות זמנים</div>
                        <i class="fas fa-ban"></i>
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
