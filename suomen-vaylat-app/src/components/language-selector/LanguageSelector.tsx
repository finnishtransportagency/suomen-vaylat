import React from 'react'
import { setLocale } from '../../state/slices/languageSlice';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import strings from './../../translations'

import './LanguageSelector.scss';

export const LanguageSelector = () => {
    const dispatch = useAppDispatch();
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
                return <button key={index} className={buttonClass(value)} id={buttonId(value)} onClick={() => dispatch(setLocale(value))}>{strings.getString('language.languageSelection.' + value)}</button>
            })}
        </div>
    );
 }

 export default LanguageSelector;