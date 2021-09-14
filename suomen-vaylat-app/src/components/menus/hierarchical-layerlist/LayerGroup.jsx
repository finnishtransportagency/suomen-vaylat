
import { useState, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { ReactReduxContext, useSelector } from 'react-redux';
import { setAllLayers } from '../../../state/slices/rpcSlice';
import LayerList from './LayerList';
import Layers from './Layers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleDown,
    faCar,
    faHardHat,
    faShip,
    faLandmark,
    faTrain,
    faRoad,
    faMap,
    faCircle
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
    margin: ${props => props.parentId === -1 && "10px 0px 10px 0px"};
    border-radius: 2px;
    background-color: ${props => props.theme.colors.mainWhite};
    &:last-child {
        ${props => props.parentId === -1 ? '1px solid '+props.theme.colors.maincolor2 : "none"};
    };
`;

const StyledMasterGroupName = styled.p`
    user-select: none;
    transition: all 0.1s ease-in;
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    padding-left: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    color: ${props => props.theme.colors.black};
    @media ${ props => props.theme.device.mobileL} {
        font-size: 13px;
    };
`;

const StyledMasterGroupHeader = styled.div`
    z-index: 1;
    position: sticky;
    top: 50px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding-left: 5px;
    transition: all 0.1s ease-in;
    border-radius: 2px;
    background-color: ${props => props.theme.colors.maincolor3};
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

const StyledRightContent = styled.div`
    display: flex;
    align-items: center;

`;

const StyledMasterGroupHeaderIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    background-color: ${props => props.theme.colors.maincolor1};
    border-radius: 50%;
    svg {
        font-size: 16px;
        color: ${props => props.theme.colors.mainWhite};
    }
`;

const StyledGroupHeader = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 30px;
`;

const StyledGroupName = styled.p`
    user-select: none;
    margin: 0;
    font-size: 13px;
    padding-left: 0px;
    color: ${props => props.theme.colors.black};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 260px;
    @media ${ props => props.theme.device.mobileL} {
        font-size: 12px;
    };
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
        font-size: 25px;
        transition: all 0.5s ease-out;
        color: ${props => props.theme.colors.black};
    };
`;

const StyledGroupSelectButton = styled.div`
    cursor: pointer;
    align-items: center;
    margin-right: 5px;
    svg {
        transition: all 0.5s ease-out;
        color: ${props => props.theme.colors.black};
    }
`;

const StyledLayerGroupContainer = styled.div`
    height: ${props => props.isOpen ? "auto" : "0px"};
    overflow: hidden;
`;

const StyledLayerGroup = styled.ul`
    padding-inline-start: ${props => props.parentId === -1 ? "10px" : "30px"};
    list-style-type: none;
`;

const StyledSubHeader = styled.p`
    display: flex;
    align-items: center;
    margin: 0px;
    margin-left: 10px;
    height: 30px;
    color: ${props => props.theme.colors.maincolor1};
    font-size: 12px;
`;

const themeStyles = {
    100: {
        icon: faCar
    },
    101: {
        icon: faShip
    },
    34: {
        icon: faHardHat
    },
    2: {
        icon: faTrain
    },
    199: {
        icon: faLandmark
    },
    265: {
        icon: faRoad
    },
    1: {
        icon: faMap
    },
}

export const LayerGroup = ({ index, group, layers, hasChildren }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel)
    //Find matching layers from all layers and groups, then push this group's layers into 'filteredLayers'
    var filteredLayers = [];
    if (group.layers) {
        group.layers.forEach((groupLayerId) => {
            var layer = layers.find(layer => layer.id === groupLayerId);
            layer !== undefined && filteredLayers.push(layer);
        });
    };

    let checked;
    let indeterminate;
    let visibleLayers = [];

    filteredLayers.map(layer => {
        layer.visible === true && visibleLayers.push(layer);
        return null;
    });

    if (filteredLayers.length === visibleLayers.length && visibleLayers.length > 0) {
        checked = true;
    } else if (visibleLayers.length > 0 ) {
        indeterminate = true;
    } else {
        checked = false;
        indeterminate = false;
    }

    console.log(filteredLayers);

    const selectGroup = (e) => {
        e.stopPropagation();
        if (!indeterminate) {
            filteredLayers.map(layer => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
                return null;
            });
        } else {
            filteredLayers.map(layer => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, false]);
                return null;
        });
        }
        channel.getAllLayers(function (data) {
            store.dispatch(setAllLayers(data));
        });
    }
    return (
        <StyledLayerGroups
                index={index}
                parentId={group.parentId}
            >
            {group.parentId === -1 ? (
                <StyledMasterGroupHeader
                    key={"smgh_" + group.parentId + "_" + group.id}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <StyledLeftContent>
                        <StyledMasterGroupHeaderIcon
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
                    <StyledRightContent>
                        <Checkbox
                                    isChecked={checked}
                                    handleClick={selectGroup}
                        />
                        <StyledSelectButton
                            hasChildren={hasChildren}
                            isOpen={isOpen}
                        >
                            <FontAwesomeIcon
                                icon={faAngleDown}
                                style={{
                                    transform: isOpen && "rotate(180deg)"
                                }}
                            />
                        </StyledSelectButton>
                    </StyledRightContent>
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
                            icon={faAngleDown}
                            style={{
                                transform: isOpen && "rotate(180deg)"
                            }}
                        />
                    </StyledGroupSelectButton>
                    <Checkbox
                            isChecked={checked}
                            handleClick={selectGroup}
                            size={16}
                    />
                    <StyledGroupName>{group.name}</StyledGroupName>
                </StyledGroupHeader>
            )}
            <StyledLayerGroupContainer
                key={"slg_" + group.parentId + "_" + group.id}
                isOpen={isOpen}
            >
                <StyledLayerGroup parentId={group.parentId}>
                {group.parentId === -1 && <StyledSubHeader>KARTTATASOT</StyledSubHeader>}
                        {hasChildren && (
                            <>
                                <Layers
                                    layers={filteredLayers}
                                    isOpen={isOpen}
                                />
                                <LayerList
                                    key={'layer-list'+index}
                                    groups={group.groups}
                                    layers={layers}
                                    recurse={true} 
                                />
                            </>
                        )}
                        {!hasChildren && (
                            <Layers layers={filteredLayers} isOpen={isOpen}/>
                        )}
                </StyledLayerGroup>
            </StyledLayerGroupContainer>
        </StyledLayerGroups>
    );
  };

  export default LayerGroup;