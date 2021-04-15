import React from 'react';

import './App.css';
import PublishedMap from '../published-map/PublishedMap';

/**
 * Top class for the application.
 * Everything else is under this.
 *
 * @class App
 * @extends {React.Component}
 */
 const App = () => {
    return (
        <div>
            <PublishedMap/>
        </div>
    );
}

export default App;
