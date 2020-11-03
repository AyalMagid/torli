import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { updateIsAdShown} from '../../actions/userAction';
import AdvertiseService from '../../services/AdvertiseService';
import './HomePage.scss';

export function _HomePage(props) {
    const [isAdModalOpen, setIsAdModalOpen] = React.useState(false);

    document.addEventListener('wheel', function(e) {
        e.preventDefault();
    }, { passive: false });

    function closeAdModal() {
        setModalInClass('')
        setTimeout(() => {
            setIsAdModalOpen(false)
        }, 1100);
    }

    function changeRoute(route) {
        (props.logedinUser) ? props.history.push(route) : props.history.push('/signupOrLogin')
    }

    const [advertise, setAdvertise] = useState();
    const [modalInClass, setModalInClass] = useState('');
    const wazeUrl = 'https://www.waze.com/ul?ll=32.07757250%2C34.82430500&navigate=yes'
    const facebook = 'bokeresh'
    const instagram = 'restylebar'

    useEffect(() => {
        (async () => {
                let ad = await AdvertiseService.getAd()
                ad = ad[0]
                if (props.logedinUser&&(!props.logedinUser.isAdmin)) {
                    if (ad && ad.content && ad.isAdModeOn) {
                        if (!props.isAdShown) {
                            setAdvertise(ad.content)
                            setIsAdModalOpen(true)
                            setTimeout(() => {
                                setModalInClass('ad-modal-in')
                            }, 1000);

                            props.updateIsAdShown(true)
                        }
                    }
                } else {
                    if (ad) return
                    else {
                        AdvertiseService.createAd()
                    }
                }
        })()
    }, [props.logedinUser]);


    return (
        <div className="home-page-wrapper">
            <main className="home-page">
                <img className="cover-photo" src={require('../../styles/img/oo.png')} />
                {(props.logedinUser) ?
                    <div className="login-container" onClick={() => props.history.push('/editUser')}>
                        <div className="admin-logo"> <i className="fas fa-user-tie"></i></div>
                        <div>{props.logedinUser.name}</div>
                    </div>
                    :
                    <div className="login-container" onClick={() => props.history.push('/signupOrLogin')}>
                        <div className="user-logo">  <i className="fas fa-user-tie"></i></div>
                        <div>הרשם/</div>
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
                {((props.logedinUser ) && !props.logedinUser.isAdmin)
                        ?
                        < div className="bottom-icons-container flex space-around">
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
                        :
                        props.logedinUser
                            ?
                            < div className="bottom-icons-container flex space-around">
                                <div className="queue-container" onClick={() => changeRoute('/calendarAdmin')}>
                                    <div className="circle"><i class="far fa-calendar-alt"></i></div>
                     יומן
                       </div>
                                <div className="remove-queue-container" onClick={() => changeRoute('/adminContacts')}>
                                    <div className="circle"><i class="fas fa-users"></i> </div>
                    לקוחות
                      </div>
                                <div className="remove-queue-container" onClick={() => changeRoute('/advertise')}>
                                    <div className="circle"><i class="far fa-comment-alt"></i></div>
                    פרסומים
                      </div>
                            </div>
                            :
                            < div className="bottom-icons-container flex space-around">
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
                    }
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
                   
                </div>
                {isAdModalOpen &&
                    <>
                        <div className="ad-modal-screen" onClick={closeAdModal}> </div>
                        <div className={`ad-modal ${modalInClass}`}>
                            <div className="advertise-content"> {advertise}</div>
                            <button className="ad-modal-btn" onClick={closeAdModal}> אישור</button>
                        </div>

                    </>
                }
            </main>
        </div >
    );
}

function mapStateProps(state) {
    return {
        isAdShown: state.UserReducer.isAdShown,
        logedinUser: state.UserReducer.logedinUser
    }
}

const mapDispatchToProps = {
    updateIsAdShown,
}

export const HomePage = connect(mapStateProps, mapDispatchToProps)(_HomePage)