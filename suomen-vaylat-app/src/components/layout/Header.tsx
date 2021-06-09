import React from 'react'
import LanguageSelector from '../language-selector/LanguageSelector';

import './Header.scss';

export const Header = () => {

    return (
        <div id="sv-header">

            <div>
                <img alt="SuomenVäylät" src="/resources/images/suomen_vaylat.png" style={{height:'2.5em', marginLeft: '1em'}}/>
            </div>

            <div style={{marginLeft: 'auto'}}>
                <a href="https://www.vayla.fi" target="_blank">
                    <img alt="Väylä" src="/resources/images/vayla_sivussa_fi_sv_white.png" style={{height:'4em'}}/>
                </a>
            </div>
            <LanguageSelector/>
        </div>
    );
 }

 export default Header;