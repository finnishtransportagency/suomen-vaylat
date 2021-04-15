import strings from './../translations';
import * as types from './types';

const actions = {

    changeLanguage: (language: string) => {
        console.log('Kielisyys: ' + language);
        strings.setLanguage(language);
        return function (dispatch: (arg0: { type: string; payload: string; }) => void) {
            dispatch({ type: types.CHANGE_LANGUAGE, payload: language });
        };

    },

};

export default actions;