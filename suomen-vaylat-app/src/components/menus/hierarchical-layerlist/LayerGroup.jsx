
import { useState } from 'react';
import styled from 'styled-components';
import LayerList from './LayerList';
import Layers from './Layers';
import { useAppSelector } from '../../../state/hooks';

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

const StyledSelectButton = styled.div`
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
    const [isOpen, setIsOpen] = useState(false);
    const selected = false ;
    /*
    const layerRows = group.getLayers().map((layer, index) => {
        const layerProps = {
            model: layer,
            even: index % 2 === 0,
            selected: Array.isArray(selectedLayerIds) && selectedLayerIds.includes(layer.id),
            controller
        };
        return layerProps;
    });*/
    console.log(isOpen);
    return (
        <>
            {group.parentId === -1 ? (
                <StyledMasterGroupHeader key={"smgh_" + group.parentId + "_" + group.id} onClick={() => setIsOpen(!isOpen)}>
                    <StyledGroupName>{group.name}</StyledGroupName>
                    { hasChildren && <StyledSelectButton isOpen={isOpen} onClick={() => console.log("tt")}/>}
                </StyledMasterGroupHeader>
            ) : (
                <StyledGroupHeader key={"smgh_" +group.parentId + '_' + group.id} onClick={() => setIsOpen(!isOpen)}>
                    <StyledGroupName>{group.name}</StyledGroupName>
                    { (hasChildren || group.layers !== undefined) && <StyledSelectButton isOpen={isOpen} onClick={() => console.log("jj")}/>}
                </StyledGroupHeader>
            )}
            <StyledLayerGroup key={"slg_" + group.parentId + "_" + group.id}  isOpen={isOpen}>
                {hasChildren && (
                    <>
                        <Layers groupLayers={group.layers} allLayers={layers} selected={selected} />
                        <LayerList groups={group.groups} layers={layers} recurse={true} />
                    </>
                )}
                {!hasChildren && (
                    <Layers groupLayers={group.layers} allLayers={layers} selected={selected} />
                )}
            </StyledLayerGroup>
        </>
    );
  };

  export default LayerGroup;