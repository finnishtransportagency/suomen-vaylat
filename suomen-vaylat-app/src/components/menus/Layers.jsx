
import { Accordion, Card, Button, Nav , ListGroup } from 'react-bootstrap';
import React, { useState } from 'react';

export const Layers = ({ groupLayers, allLayers }) => {

    const [checked, setChecked] = useState([]);

    //Find matching layers from all layers and groups, then push this group's layers into 'filteredLayers'
    var filteredLayers = [];
    for (var i in groupLayers) {
        filteredLayers.push(allLayers.filter(layer => layer.id == groupLayers[i]));
    }
    return (
        <div>
            {filteredLayers.map((layer, index) => {
                return (
                    <div>
                        {layer[0].name}
                    </div>
            )})}
        </div>
    );
  };

export default Layers;