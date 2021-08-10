import { useState, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { ReactReduxContext, useSelector } from 'react-redux';
import { setAllLayers } from '../../../state/slices/rpcSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layers from './Layers';
import {
    faAngleUp
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
    color: #fff;
`;

const StyledMasterGroupHeader = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding-left: 5px;
    background-color: blue;
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    transition: all 0.1s ease-in;
    &:hover {
        background-color: blue;
    };
    &:hover ${StyledMasterGroupName} {
        color: #fff;
    };
`;

const StyledLeftContent = styled.div`
    display: flex;
    align-items: center;
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
    padding-inline-start: 15px;
    list-style-type: none;
`;

const StyledCheckbox = styled.input`
    margin-right: 7px;
`;

export const ThemeLayerList = ({allLayers, allThemes}) => {
    console.log(allThemes);
    return (
        <>
            {allThemes.map((theme, index) => {
                var filteredLayers = allLayers.filter(layer => theme.layers.includes(layer.id));
                return (
                    <ThemeGroup key={index} theme={theme} filteredLayers={filteredLayers} index={index}/>
                );
            })}
        </>
    );
  };

  export const ThemeGroup = ({theme, filteredLayers, index}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel)
    
    let checked;
    let indeterminate;
    let visibleLayers = [];
    
    filteredLayers.map(layer => {
        layer.visible == true && visibleLayers.push(layer);
    });
    
    if (filteredLayers.length == visibleLayers.length) {
        checked = true;
    } else if (visibleLayers.length > 0 ) {
        indeterminate = true;
    } else {
        checked = false;
        indeterminate = false;
    }

    const selectGroup = (e) => {
        e.stopPropagation();
        if (!indeterminate) {
            filteredLayers.map(layer => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
            });
        } else {
            filteredLayers.map(layer => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, false]);
        });
        }
        channel.getAllLayers(function (data) {
                store.dispatch(setAllLayers(data));
        });
    }

    return (
                    <StyledLayerGroups key={index} index={index}>
                            <StyledMasterGroupHeader
                                key={"smgh_" + index}
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <StyledLeftContent>
                                    <StyledMasterGroupName>{theme.name}</StyledMasterGroupName>
                                </StyledLeftContent>
                                <StyledSelectButton
                                    isOpen={isOpen}
                                >
                                    <StyledCheckbox
                                        name="groupSelected"
                                        type="checkbox"
                                        onClick={(event) => selectGroup(event)}
                                        readOnly
                                        checked={checked}
                                        ref={el => el && (el.indeterminate = indeterminate)}
                                    />

                                    <FontAwesomeIcon
                                        icon={faAngleUp}
                                        style={{
                                            transform: isOpen && "rotate(180deg)"
                                        }}
                                    />
                                </StyledSelectButton>
                            </StyledMasterGroupHeader>
                        <StyledLayerGroupContainer
                            key={"slg_" + index}
                            isOpen={isOpen}
                        >
                            <StyledLayerGroup>
                                <Layers layers={filteredLayers} isOpen={isOpen}/>
                            </StyledLayerGroup>
                        </StyledLayerGroupContainer>
                    </StyledLayerGroups>
    );
  };

  export default ThemeLayerList;