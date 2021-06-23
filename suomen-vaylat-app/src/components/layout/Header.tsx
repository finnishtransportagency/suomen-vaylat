import React from 'react';
import LanguageSelector from '../language-selector/LanguageSelector';
import strings from './../../translations';

import './Header.scss';

import logoFi from './images/suomen_vaylat_fi.png';
import logoEn from './images/suomen_vaylat_en.png';
import logoSv from './images/suomen_vaylat_sv.png';


import vaylaLogoFi from './images/vayla_sivussa_fi.png';
import vaylaLogoEn from './images/vayla_sivussa_en.png';
import vaylaLogoSv from './images/vayla_sivussa_sv.png';

export const Header = () => {

    console.log(strings);
    // FIXME Use localization (also check images)
    let logo = logoFi;
    let vaylaLogo = vaylaLogoFi;
    const lang = strings.getLanguage();
    if (lang === 'en') {
        logo = logoEn;
        vaylaLogo = vaylaLogoEn;
    } else if (lang === 'sv') {
        logo = logoSv;
        vaylaLogo = vaylaLogoSv;
    }
    return (
        <div id="sv-header">

            <h3 id="sv-header-title">
                {strings.title.toUpperCase()}
                {/* <img className="logo" alt="SuomenVäylät" src={logo}/> */}
            </h3>

            <div className="vayla-logo">
                <a href="https://www.vayla.fi" target="_blank" rel="noreferrer">
                    <img alt="Väylä" src={vaylaLogo}/>
                </a>
            </div>
            <LanguageSelector/>
        </div>
    );
 }

 export default Header;