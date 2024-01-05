import React, { useState } from 'react';
import WaterwayList from './WaterwayList';

const WaterwayContent = ({ layers }) => {
    // console.log('Rendering WaterwayContent with layers:', layers);
    return (
        <div>
            <WaterwayList layers={layers} />
        </div>
    );
};
  
  export default WaterwayContent;
  
