import { store } from "../../store/Store";
import strings from "../../translations";

/**
 * Init data in redux.
 */
 export const initReduxData = async () => {
    /*const reduxState = store.getState();

    store.dispatch(await subjectActions.fetchSubjects());
    store.dispatch(actionsProperties.fetchProperties());

    if (!reduxState.channel.fetched) {
        store.dispatch(actionsChannel.fetchChannel());
    }
    if (!reduxState.type.fetched) {
        store.dispatch(actionsType.fetchType());
    }
    if (!reduxState.language.fetched) {
        store.dispatch(actionsLanguage.fetchLanguage());
    }*/
};

/**
 * Init translation language by url parameter if it is valid.
 *
 * @param location History location object.
 */
export const initLanguageFromUrl = (location: { search: string | string[][] | Record<string, string> | URLSearchParams | undefined; pathname: any; state: any; }) => {
    const searchParams = new URLSearchParams(location.search);
    const lang = searchParams.get('lang');
    if (!lang) {
        return;
    }
    if (['fi', 'en', 'sv'].includes(lang)) {
        strings.setLanguage(lang);
    }
};