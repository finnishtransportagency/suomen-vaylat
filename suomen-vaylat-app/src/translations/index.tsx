import LocalizedStrings from 'react-localization';
import fi from './fi.json';
import en from './en.json';
import sv from './sv.json';

// first lang is default
const strings = new LocalizedStrings({
    fi,
    en,
    sv
});

export default strings;