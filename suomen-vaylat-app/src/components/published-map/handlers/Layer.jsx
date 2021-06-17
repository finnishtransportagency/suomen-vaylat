
import { Accordion, Card, Button, Form } from 'react-bootstrap';
import React, { useState } from 'react';
export const Layer = ({ id, name, opacity }) => {
    
    var filteredLayers = [];
    console.log(allLayers);
    for (var i in groupLayers) {
        filteredLayers.push(allLayers.filter(layer => layer.id == groupLayers[i]));
    }
    console.log(filteredLayers);
    var layers = filteredLayers.map((layer) => 
        <Layer id={layer[0].id} name={layer[0].name} opacity={layer[0].opacity}></Layer>
    );

    const [checked, setChecked] = useState(false);
    return (
        <div>
            {}
            <ListGroup defaultActiveKey="#link1">
            <ListGroup.Item action href={index} onClick={alertClicked}>
                This one is a button
            </ListGroup.Item>
            </ListGroup>
            {name}
        </div>
    );
  };

export default Layer;