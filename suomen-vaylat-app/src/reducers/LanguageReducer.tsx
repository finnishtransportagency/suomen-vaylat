import * as types from '../actions/types';
import jsonParser from '../utils/jsonParser';

export default function reducer(state = {
    language: [],
    fetching: false,
    languageChanged: false,
    fetched: false,
    error: null,

}, action: { type: any; payload: any; }) {

    switch (action.type) {

        case types.FETCH_LANGUAGE:
            return {
                ...state,
                fetching: true,
            };

        case types.FETCH_LANGUAGE_REJECTED:
            return {
                ...state,
                fetching: false,
                error: action.payload,
            };

        case types.FETCH_LANGUAGE_FULFILLED:
            return {
                ...state,
                fetching: false,
                fetched: true,
                language: action.payload,
                languageParsed: jsonParser.languages(action.payload),
            };

        case types.CHANGE_LANGUAGE:
            return {
                ...state,
                languageChanged: !state.languageChanged,
            };

        default:
            return state;
    }
}