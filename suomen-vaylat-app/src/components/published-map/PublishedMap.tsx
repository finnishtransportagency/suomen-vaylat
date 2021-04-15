import React from 'react'
import { setLocale } from '../../features/language/languageSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import strings from './../../translations'

import './PublishedMap.scss';

/**
 * The class to handle application logic for the actual Map.
 * Map elements must be real React components.
 *
 * @class PublishedMap
 * @extends {React.Component}
 */
 export const PublishedMap = () => {
    const dispatch = useAppDispatch();
    const lang = useAppSelector((state) => state.language);

    const buttonClass = (locale: string) => {
        if (lang.current === locale) {
            return 'language-selection language-selection-' + locale + ' active';
        } else {
            return 'language-selection language-selection-' + locale;
        }
    }

    return (
        <div>
            <div id="language-selector">
                <button title={strings.map.iframeTitle} className={buttonClass('fi')} id="lang-fi" onClick={() => dispatch(setLocale('fi'))}>{strings.map.iframeTitle}</button>
                <button title={strings.map.iframeTitle} className={buttonClass('en')} id="lang-en" onClick={() => dispatch(setLocale('en'))}>{strings.language.languageSelection.en}</button>
                <button title={strings.map.iframeTitle} className={buttonClass('sv')} id="lang-sv" onClick={() => dispatch(setLocale('sv'))}>{strings.language.languageSelection.sv}</button>
            </div>
            <div id="published-map-container">
                <iframe id="sv-iframe" title={strings.map.iframeTitle} src={process.env.REACT_APP_PUBLISHED_MAP_URL + "&lang=" + lang.current} allow="geolocation">
                </iframe>
            </div>
        </div>
    );
 }

 export default PublishedMap;