import React from 'react'
import LanguageSelector from '../language-selector/LanguageSelector';

import './Header.scss';

export const Header = () => {
    // FIXME Use localization
    return (
        <div id="sv-header">

            <div>
                <img className="logo" alt="SuomenVäylät" src="/resources/images/suomen_vaylat.png"/>
            </div>

            <div className="vayla-logo">
                <a href="https://www.vayla.fi" target="_blank" rel="noreferrer">
                    <img alt="Väylä" src="/resources/images/vayla_sivussa_fi_sv_white.png"/>
                </a>
            </div>
            <LanguageSelector/>
        </div>
    );
 }

 export default Header;