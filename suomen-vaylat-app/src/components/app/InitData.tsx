import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { initLanguageFromUrl, initReduxData } from '../../utils/init';
import { history } from '../../store/Store';

/**
 * Initialize Redux data once when entered the page. Component not rendering anything visible.
 */
const InitData = () => {
    useEffect(() => {
        initReduxData();
        initLanguageFromUrl(history.location);
    }, []);

    return null;
};

export default withRouter(InitData);