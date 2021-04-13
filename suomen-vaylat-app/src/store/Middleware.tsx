import strings from './../translations';

export const setLanguageMiddleware = () => (next: (arg0: { type: string; payload: any; }) => void) => (action: { type: string; payload: any; }) => {

    if (action.type === 'persist/REHYDRATE' && action.payload) {
        strings.setLanguage(strings.language.currentLanguage);
    }

    next(action);
};