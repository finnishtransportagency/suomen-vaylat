
import { Accordion, Card, Button } from 'react-bootstrap';
import Layer from './Layer';

export const LayerList = ({groupLayers, allLayers}) => {
    var filteredLayers = [];
    console.log(allLayers);
    for (var i in groupLayers) {
        filteredLayers.push(allLayers.filter(layer => layer.id == groupLayers[i]));
    }
    console.log(filteredLayers);
    var layers = filteredLayers.map((layer) => 
        <Layer id={layer[0].id} name={layer[0].name} opacity={layer[0].opacity}></Layer>
    );
    return (
        <div>{layers}</div>
    )
}

export const RecursiveAccordion = ({ groups, layers, recurse = false }) => {
    console.log(layers);
    return (
        <div>
        {groups.map((group, index) => {
            var hasChildren = false;
            if(group.groups) {
                hasChildren = group.groups.length > 0;
            }
            console.log(layers);
          if (group.parentId === -1) {
            return (
                <Accordion>
                <Card>
                    <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey={group.id}>
                        {group.name}
                    </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={group.id}>
                        <Card.Body>
                            {hasChildren && (
                            <div>
                                <LayerList groupLayers={group.layers} allLayers={layers}></LayerList>
                                <RecursiveAccordion groups={group.groups} layers={layers} recurse={true} />
                            </div>
                            )}
                            {!hasChildren && (
                                <LayerList groupLayers={group.layers} allLayers={layers}></LayerList>
                            )}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                </Accordion>
            );
          }
  
          if (recurse) {
            return (
                
                <Accordion>
              <Card>
              <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey={group.id}>
                  {group.name}
              </Accordion.Toggle>
              </Card.Header>
                <Accordion.Collapse eventKey={group.id}>
                <Card.Body>
                    {hasChildren && (
                    <div>
                        <LayerList groupLayers={group.layers} allLayers={layers}></LayerList>
                        <RecursiveAccordion groups={group.groups} layers={layers} recurse={true} />
                    </div>
                    )}
                    {!hasChildren && (
                        <LayerList groupLayers={group.layers} allLayers={layers}></LayerList>
                    )}
                </Card.Body>
                </Accordion.Collapse>
              </Card>
              </Accordion>
            );
          }
        })}
        </div>
    );
  };

  export default RecursiveAccordion;