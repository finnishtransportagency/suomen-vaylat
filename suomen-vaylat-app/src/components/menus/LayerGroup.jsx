
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Accordion, Card, Button } from 'react-bootstrap';
import LayerList from './LayerList';
import Layers from './Layers';

const StyledMasterGroupHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding-left: 10px;
    background-color: #0064af;
`;


const StyledGroupHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    background-color: green;
`;

const StyledGroupName = styled.h6`
    margin: 0;
    //font-weight: bold;
`;

const StyledExpandButton = styled.div`
    width: 20px;
    height: 20px;
    border: 1px solid black;
    margin-right: 10px;
    background-color: ${props => props.isOpen ? "blue" : "white"};
`;

const StyledLayerGroup = styled.ul`
    height: ${props => props.isOpen ? "auto" : "0px"};
    margin-bottom: 0;
    overflow: hidden;
    transition: all 0.5s ease-out;
    padding-inline-start: 15px;
    background-color: #fff;
    list-style-type: none;
`;

export const LayerGroup = ({ group, layers, hasChildren }) => {
    group.layers !== undefined && console.log(group.layers.length);
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            {group.parentId === -1 ? (
                <StyledMasterGroupHeader onClick={() => setIsOpen(!isOpen)}>
                    <StyledGroupName>{group.name}</StyledGroupName>
                    { hasChildren && <StyledExpandButton isOpen={isOpen}/>}
                </StyledMasterGroupHeader> 
            ) : (
                <StyledGroupHeader onClick={() => setIsOpen(!isOpen)}>
                    <StyledGroupName>{group.name}</StyledGroupName>
                    { hasChildren || group.layers !== undefined && <StyledExpandButton isOpen={isOpen} />}
                </StyledGroupHeader> 
            )}
            <StyledLayerGroup key={group.id} isOpen={isOpen}>
                {hasChildren && (
                    <>
                        <Layers groupLayers={group.layers} allLayers={layers} isOpen={isOpen}/>
                        <LayerList groups={group.groups} layers={layers} recurse={true} />
                    </>
                )}
                {!hasChildren && (
                    <Layers groupLayers={group.layers} allLayers={layers} isOpen={isOpen}/>
                )}
            </StyledLayerGroup>
        </>
    );
  };

  export default LayerGroup;