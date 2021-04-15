import React from 'react';
import Layout from './components/layout/Layout';
import PageTitle from './components/layout/PageTitle';

/**
 * Top class for the application.
 * Everything else is under this.
 *
 * @class App
 * @extends {React.Component}
 */
 const App = () => {
    return (
        <div className="sv-app">
            <PageTitle/>
            <Layout/>
        </div>
    );
}

export default App;
