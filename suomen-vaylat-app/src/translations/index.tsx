import LocalizedStrings from 'react-localization';
import fi from './fi';
import en from './en';
import sv from './sv';

// first lang is default
const strings = new LocalizedStrings({
    fi,
    en,
    sv
});

export default strings;