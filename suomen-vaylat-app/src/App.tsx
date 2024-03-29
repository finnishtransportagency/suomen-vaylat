import './_colors.scss';
import './custom.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';
import SimpleReactLightbox from 'simple-react-lightbox';
import styled from 'styled-components';
import Layout from './components/layout/Layout';
import PageTitle from './components/layout/PageTitle';
import { HandleSharedWebSiteLink } from './components/share-web-site/HandleSharedWebSiteLink';
import { history, store } from './state/store';
import Theme from './theme/theme';

const StyledAppContainer = styled.div`
    width: 100%;
    height: var(--app-height);
    margin: 0;
    padding: 0;

    a {
        color: #0064af;
    }
`;

/**
 * Top class for the application.
 * Everything else is under this.
 *
 * @class App
 * @extends {React.Component}
 */
const App = () => {

    let routerPrefix = '/';
    if (process.env.REACT_APP_ROUTER_PREFIX) {
        routerPrefix = process.env.REACT_APP_ROUTER_PREFIX;
    }

    const appContainer = <StyledAppContainer>
        <HandleSharedWebSiteLink />
        <PageTitle />
        <Layout />
        </StyledAppContainer>;

    return (
        <SimpleReactLightbox>
            <Provider store={store}>
                <Router history={history}>
                    <Theme>
                        <Route exact path={routerPrefix} render={() =>
                            <StyledAppContainer>
                                <PageTitle />
                                <Layout />
                            </StyledAppContainer>
                        }/>
                        <Route exact path={routerPrefix + 'theme/:zoom/:x/:y/:themeId/:lang?'} render={() => {
                            return (appContainer);
                        }}/>

                        <Route exact path={routerPrefix + 'link/:zoom/:x/:y/:maplayers/:lang?'} render={() => {
                            return (appContainer);
                        }}/>
                    </Theme>
                </Router>
            </Provider>
        </SimpleReactLightbox>
    );
}

export default App;
