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
 class App extends React.Component {
  componentDidMount() {
    // TODO
  }

  render() {
    return (
        <div>
            <PublishedMap/>
        </div>
    );
  }
}

export default App;
