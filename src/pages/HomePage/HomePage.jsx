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
import AdvertiseService from '../../services/AdvertiseService';
import StorageService from "../../services/StorageService";
import './HomePage.scss';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide timeout={5000} direction="dwon" ref={ref} {...props} />;
});

export function _HomePage(props) {


    function changeRoute(route) {
        (user) ? props.history.push(route) : props.history.push('/signupOrLogin')
    }

    const [user, setUser] = useState(StorageService.loadFromStorage('tori-user'));
    const ownerPhone = '123456789'
    const wazeUrl = 'https://www.waze.com/ul?ll=32.07757250%2C34.82430500&navigate=yes'
    const facebook = 'bokeresh'
    const instagram = 'restylebar'

    useEffect(async () => {
        if (user) {
            const ad = await AdvertiseService.getAd()
            if (user.phone !== '123456789') {
              if(ad&&ad.content){
                handleClickOpen(true)
              }  
            } else {
               if(ad)return
               else AdvertiseService.createAd()
            }
        }
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
                {/* <img className="footer-img" src={require('../../styles/img/footer2.png')} /> */}
                {/* /// modal */}

                <div>
                    <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                        Slide in alert dialog
      </Button>
                    <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">{"Use Google's location service?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                {/* // will come from mongo */}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Disagree
          </Button>
                            <Button onClick={handleClose} color="primary">
                                Agree
          </Button>
                        </DialogActions>
                    </Dialog>
                </div>
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