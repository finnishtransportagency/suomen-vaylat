import React from 'react'

import { Accordion } from 'react-bootstrap';

export const LayerGroupAccordion = (props) => {
    const { group, selectedLayerIds } = props;

    return (
        <div>
            <Accordion.Item eventKey={group.getId()}>
                <Accordion.Header>Accordion Item #1</Accordion.Header>
                <Accordion.Body>
                    TEST
                </Accordion.Body>
            </Accordion.Item>
        </div>
    );
 }

 export default CenterSpinner;