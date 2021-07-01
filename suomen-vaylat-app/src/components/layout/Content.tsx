import React from 'react';
import PublishedMap from '../published-map/PublishedMap.jsx';
import LayerListTEMP from '../menus/LayerListTEMP';
import MainMenu from '../menus/MainMenu';
import VesiMenu from '../menus/VesiMenu';
import RataMenu from '../menus/RataMenu';
import TieMenu from '../menus/TieMenu';

import ZoomMenu from '../zoom-features/ZoomMenu';
import './Content.scss';
import Search from '../search/Search';
import { ToastContainer } from 'react-toastify';

export const Content = () => {

    return (
        <div id="sv-content">
            <LayerListTEMP></LayerListTEMP>
            <ZoomMenu />
            <PublishedMap></PublishedMap>
            <Search></Search>
            <ToastContainer></ToastContainer>
        </div>
    );
 }

 export default Content;