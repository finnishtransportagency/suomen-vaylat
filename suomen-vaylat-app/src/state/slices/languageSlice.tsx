import { createSlice } from '@reduxjs/toolkit';
import strings from '../../translations';
import { getUrlParameter } from '../../utils/index';
import { Logger } from '../../utils/logger';

const LOG = new Logger('Language');

const langParam = getUrlParameter('lang');
const isSupported = (langParam != null && strings.getAvailableLanguages().indexOf(langParam) >= 0)
const defaultLang = strings.getAvailableLanguages()[0];

if (langParam == null) {
  LOG.warn('Language not setted as param, using default (' + defaultLang+ ').');
} else if (!isSupported) {
  LOG.warn('Language (' + langParam + ') not supported, using default (' + defaultLang+ ').');
}

const initialState = {
  current: (langParam && isSupported) ? langParam : defaultLang
};

if (langParam !== null && isSupported) {
  strings.setLanguage(langParam);
} else {
  strings.setLanguage(defaultLang);
}

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLocale: (state, action) => {
      state.current = action.payload;
      strings.setLanguage(action.payload);
    }
  }
});

export const { setLocale } = languageSlice.actions;

export default languageSlice.reducer;