import React from 'react'
import PublishedMap from '../published-map/PublishedMap.jsx'
import MainMenu from '../menus/MainMenu';
import VesiMenu from '../menus/VesiMenu';
import RataMenu from '../menus/RataMenu';
import TieMenu from '../menus/TieMenu';
import './Content.scss';
import Search from '../search/Search';


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
            <Search></Search>
        </div>
    );
 }

 export default Content;