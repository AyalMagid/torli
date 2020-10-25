import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { updateIsAdShown } from '../../actions/userAction';
import AdvertiseService from '../../services/AdvertiseService';
import StorageService from "../../services/StorageService";
import { motion } from 'framer-motion'
import './HomePage.scss';

// motion div style
const pageVariants = {
    in: {
        opacity: 1,
        x: 0,
        textAlign: 'center'
    },
    out: {
        opacity: 0,
        x: "50%"
    }
}

const pageTransition = {
    duration: 0.5,
    type: "spring",
    stiffness: 50
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" timeout={{ enter: 3000 }} ref={ref} {...props} />;
});

export function _HomePage(props) {
    const [isAdModalOpen, setIsAdModalOpen] = React.useState(false);

    function closeAdModal() {
        setModalInClass('')
       setTimeout(() => {
           setIsAdModalOpen(false)
       }, 1100);
    }

    function changeRoute(route) {
        (user) ? props.history.push(route) : props.history.push('/signupOrLogin')
    }

    const [user, setUser] = useState(StorageService.loadFromStorage('tori-user'));
    const [advertise, setAdvertise] = useState();
    const [modalInClass, setModalInClass] = useState('');
    const ownerPhone = '123456789'
    const wazeUrl = 'https://www.waze.com/ul?ll=32.07757250%2C34.82430500&navigate=yes'
    const facebook = 'bokeresh'
    const instagram = 'restylebar'

    useEffect(() => {
        (async () => {
            if (user) {
                let ad = await AdvertiseService.getAd()
                console.log(ad[0])
                ad = ad[0]
                if (user.phone !== '123456789') {
                    if (ad && ad.content) {
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
                        console.log('else')
                        AdvertiseService.createAd()
                    }
                }
            }
        })()
    }, [user]);


    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
                {isAdModalOpen &&
                    <>
                        <div className="ad-modal-screen" onClick={closeAdModal}> </div>
                        <div className={`ad-modal ${modalInClass}`}>
                            <div> {advertise}</div>
                        </div>
                     
                    </>
                }
            </main>
        </div>
    );
}

function mapStateProps(state) {
    return {
        isAdShown: state.UserReducer.isAdShown
    }
}

const mapDispatchToProps = {
    updateIsAdShown
}

export const HomePage = withRouter(connect(mapStateProps, mapDispatchToProps)(_HomePage))