import { useState } from "react";
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleUp,
    faCheck
} from '@fortawesome/free-solid-svg-icons';

import SelectedLayer from './SelectedLayer';

const StyledSelectedLayers = styled.div`
    
`;

const StyledMasterGroupName = styled.p`
    transition: all 0.1s ease-in;
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    padding-left: 10px;
    color: ${props => props.theme.colors.mainWhite};
`;

const StyledMasterGroupHeader = styled.div`
    position: sticky;
    top: 0px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding-left: 10px;
    border-radius: 2px;
    transition: all 0.1s ease-in;
    background-color: ${props => props.theme.colors.maincolor1};
    &:hover {
        background-color: ${props => props.theme.colors.maincolor2};
    };
    &:hover ${StyledMasterGroupName} {
        color: ${props => props.theme.colors.mainWhite};
    };
`;

const StyledMasterGroupHeaderIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    svg {
        color: ${props => props.theme.colors.mainWhite};
    };
`;

const StyledLeftContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledSelectedLayersCount = styled.div`
    width: 27px;
    height: 27px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
    color: ${props => props.theme.colors.mainWhite};
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
        color: ${props => props.theme.colors.mainWhite};
    };
`;

const StyledLayerGroupContainer = styled.div`
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 2px;
    height: ${props => props.isOpen ? "auto" : "0px"};
    overflow: hidden;
    //padding: ${props => props.isOpen && "15px 10px 15px 5px"};
`;

const StyledLayerGroup = styled.ul`
    margin-bottom: 0px;
    padding-inline-start: 5px;
    list-style-type: none;
`;

export const SelectedLayers = ({ label, layers, selectedLayers }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <StyledSelectedLayers>
            <StyledMasterGroupHeader
                onClick={() => setIsOpen(!isOpen)}
            >
                <StyledLeftContent>
                    <StyledMasterGroupHeaderIcon>
                        <FontAwesomeIcon
                            icon={faCheck}
                        />
                    </StyledMasterGroupHeaderIcon>
                    <StyledMasterGroupName>{label}</StyledMasterGroupName>
                </StyledLeftContent>
                <StyledExpandButton>
                    <StyledSelectedLayersCount>
                        {selectedLayers.length}
                    </StyledSelectedLayersCount>
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
        </StyledSelectedLayers>
    );
  };

export default SelectedLayers;