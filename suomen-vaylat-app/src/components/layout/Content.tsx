import React from 'react'
import PublishedMap from '../published-map/PublishedMap'
import MainMenu from '../menus/MainMenu';
import VesiMenu from '../menus/VesiMenu';
import RataMenu from '../menus/RataMenu';
import TieMenu from '../menus/TieMenu';
import './Content.scss';


export const Content = () => {

    return (
        <div id="sv-content">
            <div id="menus">
                <MainMenu></MainMenu>
                <RataMenu></RataMenu>
                <VesiMenu></VesiMenu>
                <TieMenu></TieMenu>
            </div>
            <PublishedMap></PublishedMap>
        </div>
    );
 }

 export default Content;