import React from 'react'
import LanguageSelector from '../language-selector/LanguageSelector';

import './Header.scss';

export const Header = () => {

    return (
        <div id="sv-header">
            <LanguageSelector/>
        </div>
    );
 }

 export default Header;