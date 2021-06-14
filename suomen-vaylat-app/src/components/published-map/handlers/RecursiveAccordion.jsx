
import { Accordion, Card, Button } from 'react-bootstrap';

export const RecursiveAccordion = ({ items, recurse = false }) => {
    console.log(items);
    return (
        <div>
        {items.map((item, index) => {
          var children = items.filter((i) => {
            return i.parentId === item.id;
          });
  
          var hasChildren = children.length > 0;
          /*

          var hasChildren = groups.length > 0;

          if (item.parentId === -1)
          */
  
          if (item.parentId === 0) {
            return (
                <Accordion>
                <Card>
                    <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey={item.id}>
                        {item.title}
                    </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={item.id}>
                        <Card.Body>
                            {hasChildren && (
                            <div>
                                <RecursiveAccordion items={children} recurse={true} />
                                { item.body }
                            </div>
                            )}
                            {!hasChildren && (
                            <div dangerouslySetInnerHTML={{ __html: item.body }} />
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
              <Accordion.Toggle as={Button} variant="link" eventKey={item.id}>
                  {item.title}
              </Accordion.Toggle>
              </Card.Header>
                <Accordion.Collapse eventKey={item.id}>
                <Card.Body>
                    {hasChildren && (
                    <div>
                        <RecursiveAccordion items={children} recurse={true} />
                        { item.body }
                    </div>
                    )}
                    {!hasChildren && (
                    <div dangerouslySetInnerHTML={{ __html: item.body }} />
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