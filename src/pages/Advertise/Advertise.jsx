import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import AdvertiseService from '../../services/AdvertiseService';
import './Advertise.scss';

export function _Advertise(props) {

    const [advertiseContent, setAdvertiseContent] = useState('')

    useEffect(() => {
        (async () => {
            let ad = await AdvertiseService.getAd()
            setAdvertiseContent(ad[0].content)
        })()
    }, []);

    function handleChange({ target }) {
        console.log(target.value)
        setAdvertiseContent(target.value)
    }

    function updateAdContent() {
        AdvertiseService.updateAd({ advertiseContent })
    }
    function stopAd() {
        AdvertiseService.updateAd({})
    }

    return (
        <main className="main-ad-container">
            <div className="ad-title">מלאו את פרטי המודעה ולחצו 'אישור'</div>
            <div className="textarea-container flex column align-center">
                <textarea className="ad-textearia" cols="30" rows="10" value={advertiseContent} onChange={handleChange} ></textarea>
                <button className="stop-ad-btn" onClick={stopAd}>לחצו להפסקת פרסום המודעה</button>
            </div>
            <button className="add-content-btn" onClick={updateAdContent}>אישור</button>
        </main>

    );
}

function mapStateProps(state) {
    return {

    }
}

const mapDispatchToProps = {
}

export const Advertise = connect(mapStateProps, mapDispatchToProps)(_Advertise)
