import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './HomePage.scss';
import StorageService from "../../services/StorageService";
export function _HomePage(props) {

    function changeRoute(route) {
        (user) ? props.history.push(route) : props.history.push('/login')
    }

    const [user, setUser] = useState(StorageService.loadFromStorage('tori-user'));
    const ownerPhone = '123456789'
    const wazeUrl = 'https://www.waze.com/ul?ll=32.07757250%2C34.82430500&navigate=yes'
    const facebook = 'bokeresh'
    const instagram = 'restylebar'
    return (
        <div className="home-page-wrapper">
            <main className="home-page">
                <img className="cover-photo" src={require('../../styles/img/oo.png')} />
                {(user) ?
                    (user.phone === ownerPhone) ?
                        <div className="login-container" onClick={() => props.history.push('/adminpage')}>
                            <div className="admin-logo"> <i className="fas fa-user-tie"></i></div>
                            <div>{user.name}</div>
                        </div>
                        :
                        //just for trying heroku need to be userpage
                        <div className="login-container" onClick={() => props.history.push('/calendarAdmin')}>
                            <div className="user-logo">  <i className="fas fa-user-tie"></i></div>
                            <div>{user.name}</div>
                        </div>
                    :
                    <div className="login-container" onClick={() => props.history.push('/login')}>
                        <div className="user-logo">  <i className="fas fa-user-tie"></i></div>
                        <div>התחבר</div>
                    </div>
                }
                <div className="profile-container">
                    <div className="profile-img"></div>
                    <div className="profile-text-container">
                        <div id="profile-title" className="profile-title">Dee Nail Salon</div>
                        <div className="profile-sub-title">מכון לבניית ציפורניים</div>
                    </div>
                </div>
                <div className="icons-container flex column align-center justify-center">
                    <div className="top-icons-container flex space-around">
                        <a className="facebook-container" href={`https://www.facebook.com/${facebook}/`} >
                            <div className="circle"><i class="fab fa-facebook-f"></i> </div>
                       פייסבוק
                        </a>
                        <a className="instagram-container" href={`https://www.instagram.com/${instagram}/`}>
                            <div className="circle"><i class="fab fa-instagram"></i></div>
                           אינסטגרם
                        </a>
                        <a className="waze-container" href={wazeUrl}>
                            <div className="circle"> <i className="fab fa-waze"></i></div>
                        נווטו אלינו
                        </a>
                    </div>
                    <div className="bottom-icons-container flex space-around">
                        <div className="queue-container" onClick={() => changeRoute('/treatments')}>
                            <div className="circle"><i class="fas fa-user-clock"></i></div>
                    קביעת תור
                    </div>
                        <div className="remove-queue-container" onClick={() => changeRoute('/cancelAppointment')}>
                            <div className="circle"><i class="fas fa-user-times"></i></div>
                    ביטול תור
                    </div>
                        <a className="phone" href="tel:0538281511">
                            <div className="circle"><i className="fas fa-phone-alt"></i></div>
                         חייגו אלינו
                    </a>
                    </div>
                </div>
                {/* <img className="footer-img" src={require('../../styles/img/footer2.png')} /> */}
            </main>
        </div>
    );
}

function mapStateProps(state) {
    return {
    }
}

const mapDispatchToProps = {
}

export const HomePage = withRouter(connect(mapStateProps, mapDispatchToProps)(_HomePage))