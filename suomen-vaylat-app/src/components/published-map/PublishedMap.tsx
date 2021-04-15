import React from 'react'
import { useAppSelector } from '../../state/hooks';
import strings from './../../translations'

import './PublishedMap.scss';

export const PublishedMap = () => {
    const lang = useAppSelector((state) => state.language);

    return (
        <div id="published-map-container">
            <iframe id="sv-iframe" title={strings.map.iframeTitle} src={process.env.REACT_APP_PUBLISHED_MAP_URL + "&lang=" + lang.current} allow="geolocation">
            </iframe>
        </div>
    );
 }

 export default PublishedMap;