import { useState, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { ReactReduxContext, useSelector } from 'react-redux';
import LayerList from './LayerList';
import Layers from './Layers';
import ConfirmPopup from './ConfirmPopup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleDown,
    faCar,
    faHardHat, faLandmark, faMap, faRoad, faShip, faTrain
} from '@fortawesome/free-solid-svg-icons';
import { updateLayers } from '../../../utils/rpcUtil';
import Checkbox from '../../checkbox/Checkbox';



const OSKARI_LOCALSTORAGE = "oskari";

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
    background-color: ${props => props.theme.colors.mainWhite};
    margin: ${props => props.parentId === -1 && "10px 0px 10px 0px"};
    border-radius: 2px;
    &:last-child {
        ${props => props.parentId === -1 ? '1px solid '+props.theme.colors.maincolor2 : "none"};
    };
`;

const StyledMasterGroupName = styled.p`
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    color: ${props => props.theme.colors.black};
    margin: 0;
    padding-left: 10px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.1s ease-in;
    @media ${ props => props.theme.device.mobileL} {
        font-size: 13px;
    };
`;

const StyledMasterGroupHeader = styled.div`
    z-index: 1;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: ${props => props.theme.colors.maincolor3};
    padding-left: 5px;
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

const StyledRightContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledMasterGroupHeaderIcon = styled.div`
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: ${props => props.theme.colors.maincolor1};
    svg {
        font-size: 16px;
        color: ${props => props.theme.colors.mainWhite};
    };
`;

const StyledGroupHeader = styled.div`
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.1);
`;

const StyledGroupName = styled.p`
    max-width: 260px;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    padding-left: 0px;
    font-size: 13px;
    @media ${ props => props.theme.device.mobileL} {
        font-size: 12px;
    };
`;

const StyledSelectButton = styled.button`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    margin-right: 10px;
    border: none;
    svg {
        color: ${props => props.theme.colors.black};
        font-size: 23px;
        transition: all 0.5s ease-out;
    };
`;

const StyledLayerGroupContainer = styled.div`
    height: ${props => props.isOpen ? "auto" : "0px"};
    overflow: hidden;
`;

const StyledLayerGroup = styled.ul`
    list-style-type: none;
    margin: 0;
    padding-inline-start: ${props => props.parentId === -1 ? "10px" : "15px"};
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

export const LayerGroup = ({
    index,
    group,
    layers,
    hasChildren
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [warnActive, setWarnActive] = useState(false);
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel);
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

    const selectGroup = (e) => {
        e.stopPropagation();
        var localStorageWarn = localStorage.getItem(OSKARI_LOCALSTORAGE) ? localStorage.getItem(OSKARI_LOCALSTORAGE) : [] ;
        if (filteredLayers.length > 9 && !checked && !localStorageWarn.includes("multipleLayersWarning")) {
            setWarnActive(true);
        } else {
            groupLayersVisibility();
        }
    };

    const hideWarn = () => {
        setWarnActive(false);
    }

    const groupLayersVisibility = () => {
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
        updateLayers(store, channel);
    }

    return (
        <>
        {warnActive &&
            <ConfirmPopup filteredLayers={filteredLayers} indeterminate={indeterminate} hideWarn={() => hideWarn()} />
        }
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
                        >
                            <FontAwesomeIcon
                                icon={faAngleDown}
                                style={{
                                    transform:  isOpen && "rotate(180deg)"
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
                    <StyledGroupName>{group.name}</StyledGroupName>
                    <StyledRightContent>
                        <Checkbox
                                isChecked={checked}
                                handleClick={selectGroup}
                        />
                        <StyledSelectButton
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <FontAwesomeIcon
                                icon={faAngleDown}
                                style={{
                                    transform: isOpen && "rotate(180deg)"
                                }}
                            />
                        </StyledSelectButton>
                    </StyledRightContent>
                </StyledGroupHeader>
            )}
            <StyledLayerGroupContainer
                key={"slg_" + group.parentId + "_" + group.id}
                isOpen={isOpen}
            >
                <StyledLayerGroup parentId={group.parentId}>
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
        </>
    );
  };

  export default LayerGroup;