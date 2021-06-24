import React from 'react'
import PublishedMap from '../published-map/PublishedMap.jsx'
import MainMenu from '../menus/MainMenu';
import VesiMenu from '../menus/VesiMenu';
import RataMenu from '../menus/RataMenu';
import TieMenu from '../menus/TieMenu';
import ZoomMenu from '../zoom-features/ZoomMenu';
import './Content.scss';

export const Content = () => {

    return (
        <div id="sv-content">
            <div id="menus">
            </div>
            <ZoomMenu />
            <PublishedMap></PublishedMap>
        </div>
    );
 }

 export default Content;