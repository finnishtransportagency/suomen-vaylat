import { useState, useContext } from "react";
import { ReactReduxContext, useSelector } from 'react-redux';
import { setAllLayers } from '../../../state/slices/rpcSlice';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleUp,
    faCheck,
    faEllipsisH
} from '@fortawesome/free-solid-svg-icons';

import SelectedLayer from './SelectedLayer';

const StyledMasterGroupName = styled.p`
    transition: all 0.1s ease-in;
    font-size: 14px;
    font-family: 'Exo 2';
    margin: 0;
    font-weight: 600;
    padding-left: 10px;
    color: #fff;
`;

const StyledMasterGroupHeader = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding-left: 5px;
    background-color: #0064af;
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    transition: all 0.1s ease-in;
    &:hover {
        background-color: #186ef0;
    };
    &:hover ${StyledMasterGroupName} {
        color: #fff;
    };
`;

const StyledMasterGroupHeaderIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #186ef0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    svg {
        color: #fff;
    }
`;

const StyledLeftContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledExpandButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    border: none;
    background-color: transparent;
    margin-right: 15px;
    svg {
        font-size: 23px;
        transition: all 0.5s ease-out;
        color: #fff;
    };
`;

const StyledLayerGroupContainer = styled.div`
    background-color: #fff;
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px; 
    height: ${props => props.isOpen ? "auto" : "0px"};
    margin-top: 10px;
    margin-bottom: ${props => props.isOpen ? "10px" : "0px"};
    overflow: hidden;
    padding: ${props => props.isOpen && "15px 10px 15px 5px"};
`;

const StyledLayerGroup = styled.ul`
    margin-bottom: 0px;
    padding-inline-start: 5px;
    list-style-type: none;
`;

export const SelectedLayers = ({ layers }) => {
    var selectedLayers = layers.filter(layer => layer.visible === true).sort((a, b) => a.name > b.name ? 1 : -1);
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <StyledMasterGroupHeader
                onClick={() => setIsOpen(!isOpen)}
            >
                <StyledLeftContent>
                    <StyledMasterGroupHeaderIcon>
                        <FontAwesomeIcon
                            icon={faCheck}
                        />
                    </StyledMasterGroupHeaderIcon>
                    <StyledMasterGroupName>Valitut tasot</StyledMasterGroupName>
                </StyledLeftContent>
                <StyledExpandButton>
                    <FontAwesomeIcon
                        icon={faAngleUp}
                        style={{
                            transform: isOpen && "rotate(180deg)"
                        }}
                    />
                </StyledExpandButton>
            </StyledMasterGroupHeader>
            <StyledLayerGroupContainer
                isOpen={isOpen}
            >
                <StyledLayerGroup>
                    {selectedLayers.map(layer => {
                    return ( 
                        <SelectedLayer
                            key={layer.id+'selected'}
                            layer={layer}
                        />
                    )
                    })}
                </StyledLayerGroup>
            </StyledLayerGroupContainer>
        </>
    );
  };

export default SelectedLayers;