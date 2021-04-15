import React from 'react'
import Content from './Content';
import Header from './Header';

import './Layout.scss';

export const Layout = () => {

    return (
        <div id="sv-layout">
            <Header/>
            <Content/>
        </div>
    );
 }

 export default Layout;