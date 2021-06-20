
import { Accordion, Card, Button } from 'react-bootstrap';
import Layers from './Layers';

export const LayerList = ({ groups, layers, recurse = false }) => {
    return (
        <div>
        {groups.map((group, index) => {
            var hasChildren = false;
            if(group.groups) {
                hasChildren = group.groups.length > 0;
            }
          if (group.parentId === -1) {
            return (
                <Accordion>
                <Card style={{borderRadius: "30px", marginBottom: "5px"}}>
                    <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey={group.id}>
                        {group.name}
                    </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={group.id}>
                        <Card.Body>
                            {hasChildren && (
                            <div>
                                <Layers groupLayers={group.layers} allLayers={layers}></Layers>
                                <LayerList groups={group.groups} layers={layers} recurse={true} />
                            </div>
                            )}
                            {!hasChildren && (
                                <Layers groupLayers={group.layers} allLayers={layers}></Layers>
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
              <Card style={{borderRadius: "30px", marginBottom: "5px"}}>
              <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey={group.id}>
                  {group.name}
              </Accordion.Toggle>
              </Card.Header>
                <Accordion.Collapse eventKey={group.id}>
                <Card.Body>
                    {hasChildren && (
                    <div>
                        <Layers groupLayers={group.layers} allLayers={layers}></Layers>
                        <LayerList groups={group.groups} layers={layers} recurse={true} />
                    </div>
                    )}
                    {!hasChildren && (
                        <Layers groupLayers={group.layers} allLayers={layers}></Layers>
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

  export default LayerList;