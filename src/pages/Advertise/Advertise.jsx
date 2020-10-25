import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import AdvertiseService from '../../services/AdvertiseService';
import './Advertise.scss';

export function _Advertise(props) {

    const [advertiseContent, setAdvertiseContent] = React.useState('')

    function handleChange({ target }) {
        setAdvertiseContent(target.value)
    }

    function setAdvertise() {
        AdvertiseService.updateAd(advertiseContent)
    }

    return (
        <main>
            <textarea  cols="30" rows="10" value={advertiseContent} onChange={handleChange} >

            </textarea>
        <button onClick={setAdvertise()}>שמור</button>
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
