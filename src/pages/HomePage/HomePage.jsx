import React, { useEffect } from "react";
import { connect } from 'react-redux';
import UtilsService from "../../services/UtilsService";
import { withRouter } from 'react-router-dom';
import './HomePage.scss';

export function _HomePage(props) {
    const wazeUrl = 'https://www.waze.com/ul?ll=32.07757250%2C34.82430500&navigate=yes'
    const facebook = 'bokeresh'
    const instagram = 'restylebar'
    return (
        <main className="home-page flex align-center justify-center">
            <div className="icons-container flex align-center justify-center">
                <div>
                    <div className="flex space-aruond">
                        <a href={`https://www.facebook.com/${facebook}/`} className="facebook-container"><img className="icon-img" src={require('../../styles/img/facebook.svg')} /></a>
                        <a href={`https://www.instagram.com/${instagram}/`} className="instagram-container"><img className="icon-img" src={require('../../styles/img/instagram.svg')} /></a>
                        <div className="waze-container flex column align-center jutify-center">
                            <a href={wazeUrl} className="flex column align-center jutify-center"><img className="icon-img" src={require('../../styles/img/waze.svg')} />
                            <div className="waze-title">ניווט לבית
                        <br />
                                <span >העסק</span>
                            </div>
                            </a>
                        </div>
                    </div>
                    <div className="flex space-aruond">
                        <div onClick={() => props.history.push('/treatments')} className="queue-container"><img className="icon-img" src={require('../../styles/img/user.svg')} /></div>
                        <div onClick={() => props.history.push('/cancelAppointment')} className="remove-queue-container"><img className="remove-img" src={require('../../styles/img/browser.svg')} /></div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function mapStateProps(state) {
    return {
    }
}

const mapDispatchToProps = {
}

export const HomePage = withRouter(connect(mapStateProps, mapDispatchToProps)(_HomePage))