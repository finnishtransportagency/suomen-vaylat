import React from 'react';
import Layout from './components/layout/Layout';
import PageTitle from './components/layout/PageTitle';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { history, store } from './state/store'

/**
 * Top class for the application.
 * Everything else is under this.
 *
 * @class App
 * @extends {React.Component}
 */
 const App = () => {
    return (
        <Provider store={store}>
            <Router history={history}>
                <div className="sv-app">
                    <PageTitle/>
                    <Layout/>
                </div>
            </Router>
        </Provider>
    );
}

export default App;
