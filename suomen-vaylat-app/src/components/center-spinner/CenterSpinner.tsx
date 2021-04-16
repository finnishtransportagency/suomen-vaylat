import React from 'react'

import './CenterSpinner.scss';

const Spinner = require('react-spinkit');

export const CenterSpinner = () => {

    return (
        <div id="center-spinner">
            <Spinner
                className="loading"
                name="line-scale-pulse-out"
                color="#0064af"
                fadeIn="quarter"
            />
        </div>
    );
 }

 export default CenterSpinner;