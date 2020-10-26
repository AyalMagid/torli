import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import AdvertiseService from '../../services/AdvertiseService';
import './Advertise.scss';

export function _Advertise(props) {

    const [advertiseContent, setAdvertiseContent] = useState('')
    // boolean shows if the returned ad should be shown and make the opposite to backend if btn clicked
    const [isAdModeOn, setIsAdModeOn] = useState('')

    useEffect(() => {
        (async () => {
            let ad = await AdvertiseService.getAd()
            setIsAdModeOn(ad[0].isAdModeOn)
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
    
    function toggleAdMode() {
        console.log(isAdModeOn)
        AdvertiseService.toggleAdMode({isAdModeOn:!isAdModeOn})
        setIsAdModeOn(!isAdModeOn)
    }

    return (
        <main className="main-ad-container">
            {
                <div className="ad-title">ערכו את המודעה ולחצו 'שמור טקסט'</div>
            }
            {
                isAdModeOn?
                <div className="ad-title ad-sub-title">לעצירת הפרסום לחצו 'הפסק פרסום'</div>:
                <div className="ad-title ad-sub-title">לחצו 'המשך פרסום' כדי להפעילה</div>
            }
                <div className="textarea-container">
                    <textarea className="ad-textarea" cols="30" rows="10" value={advertiseContent} onChange={handleChange} ></textarea>
                    <div className="ad-btn-container flex column">
                        {
                            isAdModeOn?
                            <button className="ad-btn stop-ad-btn" onClick={toggleAdMode}> הפסק פרסום</button>
                            :
                            <button className="ad-btn run-ad-btn" onClick={toggleAdMode}> המשך פרסום</button>
                        }
                    </div>
                </div>
            <button className="ad-content-btn" onClick={updateAdContent}>שמור טקסט</button>
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
