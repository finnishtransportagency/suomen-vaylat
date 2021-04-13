import React from 'react'
import './PublishedMap.scss';

/**
 * The class to handle application logic for the actual Map.
 * Map elements must be real React components.
 *
 * @class PublishedMap
 * @extends {React.Component}
 */
 class PublishedMap extends React.Component {
    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <div id="published-map-container">
                <iframe id="sv-iframe" title="Suomen Väylät" src={process.env.REACT_APP_PUBLISHED_MAP_URL} allow="geolocation">
                </iframe>
            </div>
        );
    }
 }

 export default PublishedMap;