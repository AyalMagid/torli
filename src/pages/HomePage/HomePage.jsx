import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { updateIsAdShown, setOwner} from '../../actions/userAction';
import { updateIsModalOpen } from '../../actions/modalAction.js';
import { Modal } from '../../cmps/Modal/Modal';
import AdvertiseService from '../../services/AdvertiseService';
import UserService from '../../services/UserService';
// routim
import { useParams } from "react-router";
import './HomePage.scss';

export function _HomePage(props) {
    function changeRoute(route) {
        (props.loggedInUser) ? props.history.push(route) : props.history.push('/signupOrLogin')
    }
    const [advertise, setAdvertise] = useState();
    // routim
    let { workPlace } = useParams();
    let wazeUrl = 'https://www.waze.com/ul?ll=32.07757250%2C34.82430500&navigate=yes'
    let facebook = 'adi.leybovich.5'
    let instagram = 'restylebar'
    let owner 

    useEffect(() => {
        (async () => {
                // routim
                console.log('workPlace', workPlace)
                if (!props.owner) {
                // loader until owner ? or start ffrom login/signup page
                owner = await UserService.getOwner(workPlace)
                console.log('owner',owner)
                updateByWorkPlace (owner)
                props.setOwner(owner)
                // useLayoutEffect => might be better to use
                let ad = await AdvertiseService.getAd(owner.workPlace)
                ad = ad[0]
                if (props.loggedInUser&&(!props.loggedInUser.isAdmin)) {
                    if (ad && ad.content && ad.isAdModeOn) {
                        if (!props.isAdShown) {
                            setAdvertise(ad.content)
                            props.updateIsModalOpen(true)
                            props.updateIsAdShown(true)
                        }
                    }
                } else {
                    if (ad) return
                    else {
                        AdvertiseService.createAd(owner.workPlace)
                    }
                }
            }
        })()
    }, [props.loggedInUser]);

    // useEffect(() => {
    //     if (props.owner) {
    //      updateByWorkPlace ()
    //     }
    // }, [props.owner])
  
    function updateByWorkPlace(owner) {
        // routim
        wazeUrl = owner.wazeUrl
        facebook = owner.facebook
        instagram = owner.instagram
        // let profileImgEl = document.getElementsByClassName("profile-img");

        // console.log(profileImgEl)
        // profileImgEl.style.src = props.owner.profileImgUrl;
   
        // let coverPhotoEl = document.getElementsByClassName("cover-photo");
        // coverPhotoEl.style.src = props.owner.coverImgUrl
    }

/* routim to=`/${workPlace}/editUser` */
  /* routim to=`/${workPlace}/signupOrLogin` */
   /* routim to=`/${workPlace}/treatments` */
     /* routim to=`/${workPlace}/cancelAppointment` */
       /* routim to=`/${workPlace}/calendarAdmin` */
         /* routim to=`/${workPlace}/adminContacts` */
           /* routim to=`/${workPlace}/advertise` */
             /* routim to=`/${workPlace}/treatments` */
               /* routim to=`/${workPlace}/cancelAppointment` */
                 /* routim href=`tel:${props.owner.phone}`   */
   
    return (
        // routim
        props.owner &&
        <div className="home-page-wrapper">
            <main className="home-page">
                <img className="cover-photo" src={require('../../styles/img/oo.png')} />
                {(props.loggedInUser) ?
                    <div className="login-container" onClick={() => props.history.push('/editUser')}>
                        <div className="admin-logo"> <i className="fas fa-user-tie"></i></div>
                        <div>{props.loggedInUser.name}</div>
                    </div>
                    :
                    <div className="login-container" onClick={() => props.history.push('/signupOrLogin')}>
                        <div className="user-logo">  <i className="fas fa-user-tie"></i></div>
                        <div>הרשם/</div>
                        <div>התחבר</div>
                    </div>
                }
               {
                //    routim
                //    props.owner &&
                // style={{backgroundImage:`url(${require(props.owner.profileImgUrl)}`}}
                <div className="profile-container">
                    <div className="profile-img" ></div>
                    <div className="profile-text-container">
                        <div id="profile-title" className="profile-title">{props.owner.workPlaceTitle}</div>
                        <div className="profile-sub-title">{props.owner.workPlaceSubTitle}</div>
                    </div>
                </div> 
}
                <div className="icons-container flex column align-center justify-center">
                {((props.loggedInUser ) && !props.loggedInUser.isAdmin)
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
                        props.loggedInUser
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
                 <Modal modalContent={advertise} />  
            </main>
        </div >
    );
}

function mapStateProps(state) {
    return {
        isAdShown: state.UserReducer.isAdShown,
        loggedInUser: state.UserReducer.loggedInUser,
        // routim
        owner:state.UserReducer.owner
    }
}

const mapDispatchToProps = {
    updateIsAdShown,
    updateIsModalOpen,
    // routim
    setOwner
}

export const HomePage = connect(mapStateProps, mapDispatchToProps)(_HomePage)