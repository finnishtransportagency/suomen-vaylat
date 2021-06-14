
import { Accordion } from 'react-bootstrap';

var baseItems = [
    { id: 1, title: "Land", body: "", parentId: 0 },
    { id: 2, title: "Sea", body: "Submarine", parentId: 0 },
    { id: 3, title: "Cars", body: "", parentId: 1 }
  ];

export const RecursiveAccordion = ({ items, recurse = false }) => {
    console.log(items);
    return (
      <Accordion>
        {items.map((item, index) => {
          var children = baseItems.filter((i) => {
            return i.parentId === item.id;
          });
  
          var hasChildren = children.length > 0;
  
          if (item.parentId === 0) {
            return (
              <Accordion.Item eventKey={index}>
              <Accordion.Header>{item.title}</Accordion.Header>
              <Accordion.Body>
                {hasChildren && (
                  <div>
                    <RecursiveAccordion items={children} recurse={true} />
                    { item.body }
                  </div>
                )}
                {!hasChildren && (
                  <div dangerouslySetInnerHTML={{ __html: item.body }} />
                )}
                </Accordion.Body>
              </Accordion.Item>
            );
          }
  
          if (recurse) {
              console.log(recurse);
            return (
              <Accordion.Item eventKey={index}>
              <Accordion.Header>{item.title}</Accordion.Header>
              <Accordion.Body>
                {hasChildren && (
                  <div>
                    <RecursiveAccordion items={children} recurse={true} />
                    { item.body }
                  </div>
                )}
                {!hasChildren && (
                  <div dangerouslySetInnerHTML={{ __html: item.body }} />
                )}
                </Accordion.Body>
              </Accordion.Item>
            );
          }
        })}
      </Accordion>
    );
  };

  export default RecursiveAccordion;