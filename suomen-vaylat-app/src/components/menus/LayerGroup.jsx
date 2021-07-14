
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import LayerList from './LayerList';
import Layers from './Layers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleUp,
    faCar,
    faHardHat,
    faShip,
    faLandmark,
    faTrain,
    faRoad,
    faMap
} from '@fortawesome/free-solid-svg-icons';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;


const StyledLayerGroups = styled.div`
    opacity: 0;
    animation-delay: ${props => props.index * 0.025 + 's'};
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    animation-duration: 0.5s;
    animation-name: ${fadeIn};
`;

const StyledMasterGroupName = styled.p`
    transition: all 0.1s ease-in;
    font-size: 14px;
    font-family: 'Exo 2';
    margin: 0;
    font-weight: 600;
    padding-left: 10px;
    color: #000;
`;

const StyledMasterGroupHeader = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding-left: 5px;
    background-color: ${props => props.color[1] || "#0091ff"};
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    transition: all 0.1s ease-in;
    &:hover {
        background-color: ${props => props.color[0]}
    };
    &:hover ${StyledMasterGroupName} {
        color: #fff;
    };
`;

const StyledLeftContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledMasterGroupHeaderIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.color[0]};
    width: 28px;
    height: 28px;
    border-radius: 50%;
    svg {
        color: #fff;
    }
`;

const StyledGroupHeader = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 30px;
`;

const StyledGroupName = styled.p`
    font-size: 14px;
    margin: 0;
    font-weight: 600;
    padding-left: 0px;
    color: #000;
`;

const StyledSelectButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    border: none;
    background-color: transparent;
    margin-right: 15px;
    svg {
        transition: all 0.5s ease-out;
        color: #000;
    };
    opacity: ${props => props.hasChildren ? "1" : "0.5"};
`;

const StyledGroupSelectButton = styled.div`
    cursor: pointer;
    align-items: center;
    margin-right: 15px;
    svg {
        transition: all 0.5s ease-out;
        color: #000;
    }
`;

const StyledLayerGroupContainer = styled.div`
    background-color: #fff;
    border-radius: 20px;
    box-shadow: ${props => props.parentId === -1 && "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"}; 
    height: ${props => props.isOpen ? "auto" : "0px"};
    margin-top: ${props => props.parentId !== -1 ? "0px" : "10px"};
    margin-bottom: ${props => props.isOpen ? "10px" : "0px"};
    overflow: hidden;
    padding: ${props => props.parentId === -1 && props.isOpen && "15px 10px 15px 5px"};
`;

const StyledLayerGroup = styled.ul`
    margin-bottom: 0px;
    padding-inline-start: 15px;
    list-style-type: none;
`;

const themeStyles = {
    100: {
        icon: faCar,
        color: [
            "#207a43",
            "#8dcb6d"
        ]
    },
    101: {
        icon: faShip,
        color: [
            "#0064af",
            "#49c2f1"
        ]
    },
    34: {
        icon: faHardHat,
        color: [
            "#f7931e",
            "#ffc300"
        ]
    },
    2: {
        icon: faTrain,
        color: [
            "#c73f00",
            "#ff5100"
        ]
    },
    199: {
        icon: faLandmark,
        color: [
            "#186ef0" // FIX LATER
        ]
    },
    265: {
        icon: faRoad,
        color: [
            "#186ef0" // FIX LATER
        ]
    },
    1: {
        icon: faMap,
        color: [
            "#186ef0" // FIX LATER
        ]
    },
}

export const LayerGroup = ({ index, group, layers, hasChildren }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <StyledLayerGroups index={index}>
            {group.parentId === -1 ? (
                <StyledMasterGroupHeader
                    key={"smgh_" + group.parentId + "_" + group.id}
                    onClick={() => setIsOpen(!isOpen)}
                    color={themeStyles.hasOwnProperty(group.id) && themeStyles[group.id].color}
                >
                    <StyledLeftContent>
                        <StyledMasterGroupHeaderIcon
                            color={themeStyles.hasOwnProperty(group.id) && themeStyles[group.id].color}
                    >
                            {
                                themeStyles.hasOwnProperty(group.id) &&
                                <FontAwesomeIcon
                                    icon={themeStyles[group.id].icon}
                                />
                            }
                        </StyledMasterGroupHeaderIcon>
                        <StyledMasterGroupName>{group.name}</StyledMasterGroupName>
                    </StyledLeftContent>
                    <StyledSelectButton
                        hasChildren={hasChildren}
                        //disabled={!hasChildren}
                        isOpen={isOpen}
                    >
                        <FontAwesomeIcon
                            size="lg"
                            icon={faAngleUp}
                            style={{
                                transform: isOpen && "rotate(180deg)"
                            }}
                        />
                    </StyledSelectButton>
                </StyledMasterGroupHeader>
            ) : (
                <StyledGroupHeader
                    key={"smgh_" +group.parentId + '_' + group.id}
                    onClick={() => setIsOpen(!isOpen)}
                >
                   <StyledGroupSelectButton
                        isOpen={isOpen}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <FontAwesomeIcon
                            icon={faAngleUp}
                            style={{
                                transform: isOpen && "rotate(180deg)"
                            }}
                        />
                    </StyledGroupSelectButton>
                    <StyledGroupName>{group.name}</StyledGroupName>
                </StyledGroupHeader>
            )}
            <StyledLayerGroupContainer
                key={"slg_" + group.parentId + "_" + group.id} 
                isOpen={isOpen}
                parentId={group.parentId}
            >
                <StyledLayerGroup>
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
            </StyledLayerGroupContainer>
        </StyledLayerGroups>
    );
  };

  export default LayerGroup;