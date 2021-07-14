import LanguageSelector from '../language-selector/LanguageSelector';
import strings from './../../translations';

import './Header.scss';

import vaylaLogoFi from './images/vayla_sivussa_fi_white.svg';
import vaylaLogoEn from './images/vayla_sivussa_en_white.svg';
import vaylaLogoSv from './images/vayla_sivussa_sv_white.svg';

export const Header = () => {

    // FIXME Use localization (also check images)
    let vaylaLogo = vaylaLogoFi;
    const lang = strings.getLanguage();
    if (lang === 'en') {
        vaylaLogo = vaylaLogoEn;
    } else if (lang === 'sv') {
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