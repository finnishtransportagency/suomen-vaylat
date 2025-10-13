import { createSlice } from '@reduxjs/toolkit';
import strings from '../../translations';
import { getUrlParameter } from '../../utils/index';
import { Logger } from '../../utils/logger';
import { IS_EXTRANET } from '../../utils/appInfoUtil';

const LOG = new Logger('Language');
if (IS_EXTRANET) {
  LOG.warn('Running in EXTRANET mode - language will be restricted to "fi".');
}

const availableLanguages = strings.getAvailableLanguages() || [];

// If extranet, restrict available languages to only 'fi' (if 'fi' exists)
const allowedLanguages = IS_EXTRANET
  ? availableLanguages.filter(l => l === 'fi')
  : availableLanguages.slice(); // copy

// Fallback default language (first allowed, or 'fi' as ultimate fallback)
const defaultLang = allowedLanguages[0] || 'fi';

const langParam = getUrlParameter('lang');

// isSupported: param is non-null, in the general availableLanguages
const isParamSupported = (langParam != null && availableLanguages.indexOf(langParam) >= 0);

// additionally require it's within allowedLanguages
const isAllowed = (langParam != null && allowedLanguages.indexOf(langParam) >= 0);

if (langParam == null) {
  LOG.warn('Language not set as param, using default (' + defaultLang + ').');
} else if (!isParamSupported) {
  LOG.warn('Language (' + langParam + ') not supported, using default (' + defaultLang + ').');
} else if (!isAllowed) {
  LOG.warn('Language (' + langParam + ') is not allowed in current mode, using default (' + defaultLang + ').');
}

const initialLang = (langParam && isParamSupported && isAllowed) ? langParam : defaultLang;

// Remove `lang` URL parameter if it was present, so it won't persist in URL or be reused unintentionally.
// This will not reload the page; it uses history.replaceState where available.
if (IS_EXTRANET && langParam !== null && typeof window !== 'undefined' && typeof window.history !== 'undefined' && typeof URL !== 'undefined') {
  try {
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has('lang')) {
      currentUrl.searchParams.delete('lang');
      // Build new URL string preserving pathname, other query params and hash
      const newUrl = currentUrl.pathname + (currentUrl.search ? currentUrl.search : '') + (currentUrl.hash ? currentUrl.hash : '');
      window.history.replaceState({}, document.title, newUrl);
      LOG.warn('Removed lang param from URL to avoid persisted language param.');
    }
  } catch (e) {
    // Safe fallback: try a simple search+replace on href if URL is not supported for some reason
    try {
      const href = window.location.href;
      // remove ?lang=... or &lang=... occurrences
      const newHref = href
        .replace(/[?&]lang=[^&]*(&|$)/, (match, p1) => (p1 === '&' ? '?' : ''))
        .replace(/\?$/, ''); // cleanup trailing ?
      if (newHref !== href) {
        window.history.replaceState({}, document.title, newHref);
        LOG.warn('Removed lang param from URL (fallback method).');
      }
    } catch (err) {
      LOG.warn('Could not remove lang param from URL: ' + (err));
    }
  }
}

const initialState = {
  current: initialLang
};

// Set strings language accordingly
strings.setLanguage(initialLang);

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLocale: (state, action) => {
      const newLocale = action.payload;

      // validate against allowed languages
      if (allowedLanguages.indexOf(newLocale) === -1) {
        LOG.warn(`Attempt to set locale to "${newLocale}" which is not allowed in current mode. Keeping "${state.current}".`);
        return;
      }

      state.current = newLocale;
      strings.setLanguage(newLocale);
    }
  }
});

export const { setLocale } = languageSlice.actions;

export default languageSlice.reducer;