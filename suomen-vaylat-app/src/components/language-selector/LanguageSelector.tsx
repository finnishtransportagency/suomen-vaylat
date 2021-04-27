import React from 'react';
import { useAppSelector } from '../../state/hooks';
import strings from './../../translations';

import './LanguageSelector.scss';

export const LanguageSelector = () => {
    const lang = useAppSelector((state) => state.language);

    const buttonClass = (locale: string) => {
        if (lang.current === locale) {
            return 'language-selection language-selection-' + locale + ' active';
        } else {
            return 'language-selection language-selection-' + locale;
        }
    }

    const buttonId = (locale: string) => {
        return 'lang-' + locale;
    }

    return (
        <div id="language-selector">
            {strings.getAvailableLanguages().map((value, index) => {
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                return <a key={index} className={buttonClass(value)} id={buttonId(value)} href={'?lang=' + value}>{strings.getString('language.languageSelection.' + value)}</a>
            })}
        </div>
    );
 }

 export default LanguageSelector;