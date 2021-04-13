import { combineReducers } from 'redux';
import languageReducer from './LanguageReducer';


export const combinedRecuders = combineReducers({
    language: languageReducer
});