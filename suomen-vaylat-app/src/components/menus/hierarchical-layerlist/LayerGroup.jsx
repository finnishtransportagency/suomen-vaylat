import { useState, useContext, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { ReactReduxContext, useSelector } from 'react-redux';
import { motion } from "framer-motion";
import LayerList from './LayerList';
import Layers from './Layers';
import ConfirmPopup from './ConfirmPopup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleRight,
    faAngleDown,
    faCar,
    faHardHat,
    faLandmark,
    faMap,
    faRoad,
    faShip,
    faTrain,
    faGlobeEurope
} from '@fortawesome/free-solid-svg-icons';

import { updateLayers } from '../../../utils/rpcUtil';
//import Switch from '../../switch/Switch';
import Checkbox from '../../checkbox/Checkbox';

const OSKARI_LOCALSTORAGE = "oskari";

const listVariants = {
    visible: {
        height: "auto",
        opacity: 1
    },
    hidden: {
        height: 0,
        opacity: 0
    },
};

const masterHeaderIconVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
};

const layerGroupIconVariants = {
    open: { rotate: 90 },
    closed: { rotate: 0 },
};

const StyledLayerGroups = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    opacity: 1;
    background-color: ${props => props.parentId === -1 ? props.theme.colors.mainWhite : "#F2F2F2"};
    margin: 8px 0px 8px 0px;
    border-radius: 4px;
    
    &:last-child {
        ${props => props.parentId === -1 ? '1px solid '+props.theme.colors.mainColor2 : "none"};
    };
`;

const StyledMasterGroupHeader = styled.div`
    z-index: 1;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: ${props => props.theme.colors.mainColor1};
    border-radius: 4px;
    transition: all 0.1s ease-in;
`;

const StyledLeftContent = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
`;

const StyledMotionIconWrapper = styled(motion.div)`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledMasterGroupHeaderIcon = styled.div`
    width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        font-size: 20px;
        color: ${props => props.theme.colors.mainWhite};
    };
`;

const StyledMasterGroupTitleContent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const StyledMasterGroupName = styled.p`
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
    color: ${props => props.theme.colors.mainWhite};
    margin: 0;
    padding: 0px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.1s ease-in;

    @media ${ props => props.theme.device.mobileL} {
        //font-size: 13px;
    };
`;

const StyledMasterGroupLayersCount = styled.p`
    margin: 0;
    padding: 0px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
`;

const StyledLefContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledRightContent = styled.div`
    display: flex;
    align-items: center;
`;


const StyledGroupHeader = styled.div`
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    border-radius: 4px;
`;

const StyledGroupName = styled.p`
    max-width: 210px;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    padding-left: 0px;
    font-size: 14px;
    font-weight: bold;
    color: ${props => props.theme.colors.mainColor1};
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
    margin-right: 8px;
    border: none;
    svg {
        color: ${props => props.subGroup ? props.theme.colors.mainColor1 : props.theme.colors.mainWhite};
        font-size: 19px;
        transition: all 0.3s ease-out;
    };
`;

const StyledLayerGroup = styled(motion.ul)`
    list-style-type: none;
    margin: 0;
    padding-inline-start: ${props => props.parentId === -1 ? "8px" : "16px"};
    overflow: hidden;
    transition: max-height 0.3s ease-out;
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
    562: {
        icon: faGlobeEurope
    }
};

const StyledSwitchContainer = styled.div`
    position: relative;
    min-width: 32px;
    height: 16px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    background-color: ${props => props.isSelected ? "#8DCB6D" : "#AAAAAA"};
    cursor: pointer;
    margin-right: 16px;
`;

const StyledSwitchButton = styled.div`
    position: absolute;
    left: ${props => props.isSelected ? "15px" : "0px"};
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-left: 2px;
    margin-right: 2px;
    transition: all 0.3s ease-out;
    background-color: ${props => props.theme.colors.mainWhite};
`;

const Switch = ({ action, isSelected }) => {
    return (
        <StyledSwitchContainer
            isSelected={isSelected}
            onClick={event => {
                action(event);
            }}
        >
            <StyledSwitchButton isSelected={isSelected}/>
        </StyledSwitchContainer>
    );
};


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

    const refEl = useRef(null);

    refEl !== null && refEl.current && console.log(refEl.current.getElementsByClassName('list-layer').length);
    refEl !== null && refEl.current && console.log(refEl.current.getElementsByClassName('list-layer-active').length);
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
    };

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
    };

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
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                >
                    <StyledLeftContent>
                        <StyledMasterGroupHeaderIcon>
                            {
                                themeStyles.hasOwnProperty(group.id) &&
                                    <FontAwesomeIcon
                                        icon={themeStyles[group.id].icon}
                                    />
                            }
                        </StyledMasterGroupHeaderIcon>
                        <StyledMasterGroupTitleContent>
                            <StyledMasterGroupName>
                                {group.name}
                            </StyledMasterGroupName>
                            <StyledMasterGroupLayersCount>
                                {
                                    refEl !== null && refEl.current && refEl.current.getElementsByClassName('list-layer-active').length +"/"+ refEl.current.getElementsByClassName('list-layer').length
                                }
                            </StyledMasterGroupLayersCount>
                        </StyledMasterGroupTitleContent>

                    </StyledLeftContent>
                    <StyledRightContent>
                        <StyledSelectButton
                            hasChildren={hasChildren}
                        > 
                        <StyledMotionIconWrapper
                            initial="closed"
                            animate={isOpen ? "open" : "closed"}
                            variants={masterHeaderIconVariants}
                        >
                            <FontAwesomeIcon
                                icon={faAngleDown}
                            />
                        </StyledMotionIconWrapper>
                        </StyledSelectButton>
                    </StyledRightContent>
                </StyledMasterGroupHeader>
            ) : (
                <StyledGroupHeader
                    key={"smgh_" +group.parentId + '_' + group.id}
                    onClick={() => setIsOpen(!isOpen)}
                >
                <StyledLefContent>
                    <StyledSelectButton
                            onClick={() => setIsOpen(!isOpen)}
                            subGroup={true}
                    >
                        <StyledMotionIconWrapper
                            initial="closed"
                            animate={isOpen ? "open" : "closed"}
                            variants={layerGroupIconVariants}
                        >
                            <FontAwesomeIcon
                                icon={faAngleRight}
                            />
                        </StyledMotionIconWrapper>
                    </StyledSelectButton>
                    <StyledGroupName>{group.name}</StyledGroupName>
                </StyledLefContent>
                    <StyledRightContent>
                        {/* <Checkbox
                                isChecked={checked}
                                handleClick={selectGroup}
                        /> */}
                        <Switch 
                            isSelected={checked}
                            action={selectGroup}
                        />
                    </StyledRightContent>
                </StyledGroupHeader>
            )}
                <StyledLayerGroup
                    parentId={group.parentId}
                    key={"slg_" + group.parentId + "_" + group.id}
                    isOpen={isOpen}
                    initial="hidden"
                    animate={isOpen ? "visible" : "hidden"}
                    variants={listVariants}
                    ref={refEl}
                >
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
        </StyledLayerGroups>
        </>
    );
  };

  export default LayerGroup;