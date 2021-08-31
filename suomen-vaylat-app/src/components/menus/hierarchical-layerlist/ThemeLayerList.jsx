import { useState, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { ReactReduxContext, useSelector } from 'react-redux';
import { setAllLayers } from '../../../state/slices/rpcSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layers from './Layers';
import {
    faAngleUp
} from '@fortawesome/free-solid-svg-icons';

import Checkbox from '../../checkbox/Checkbox';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;


// const StyledLayerGroups = styled.div`
//     opacity: 0;
//     animation-delay: ${props => props.index * 0.025 + 's'};
//     animation-timing-function: ease-in-out;
//     animation-fill-mode: forwards;
//     animation-duration: 0.5s;
//     animation-name: ${fadeIn};
//     padding-top: 10px;
// `;

const StyledLayerGroups = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    opacity: 0;
    animation-delay: ${props => props.index * 0.025 + 's'};
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    animation-duration: 0.5s;
    animation-name: ${fadeIn};
    border-top: ${props => props.parentId === -1 ? '1px solid '+props.theme.colors.maincolor2 : "none"};
    &:last-child {
        ${props => props.parentId === -1 ? '1px solid '+props.theme.colors.maincolor2 : "none"};
    }
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
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding-left: 10px;
    border-radius: 2px;
    transition: all 0.1s ease-in;
    &:hover {
        background-color: ${props => props.theme.colors.maincolor2};
    };
    &:hover ${StyledMasterGroupName} {
        color: ${props => props.theme.colors.mainWhite};
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
        color: ${props => props.theme.colors.mainWhite};
    };
`;

const StyledLayerGroupContainer = styled.div`
    height: ${props => props.isOpen ? "auto" : "0px"};
    padding-inline-start: 20px;
    overflow: hidden;
`;

const StyledLayerGroup = styled.ul`
    margin-bottom: 0px;
    padding-inline-start: 15px;
    list-style-type: none;
`;

export const ThemeLayerList = ({allLayers, allThemes}) => {
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
        layer.visible === true && visibleLayers.push(layer);
        return true;
    });

    if (filteredLayers.length === visibleLayers.length) {
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
                return true;
            });
        } else {
            filteredLayers.map(layer => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, false]);
                return true;
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
                            {/* <StyledCheckbox
                                name="groupSelected"
                                type="checkbox"
                                onClick={(event) => selectGroup(event)}
                                readOnly
                                checked={checked}
                                ref={el => el && (el.indeterminate = indeterminate)}
                            /> */}
                            <Checkbox
                                    isChecked={checked}
                                    handleClick={selectGroup}
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
                        <Layers layers={filteredLayers} isOpen={isOpen} theme={theme.name}/>
                    </StyledLayerGroup>
                </StyledLayerGroupContainer>
            </StyledLayerGroups>
    );
  };

  export default ThemeLayerList;