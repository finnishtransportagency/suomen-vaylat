import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { ReactReduxContext, useSelector } from 'react-redux';
import { motion } from "framer-motion";
import LayerList from './LayerList';
import Layers from './Layers';
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

import {
    setWarning,
} from "../../../state/slices/uiSlice";
import strings from "../../../translations";

const masterHeaderIconVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
};

const layerGroupIconVariants = {
    open: { rotate: 90 },
    closed: { rotate: 0 },
};

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

const StyledLayerGroups = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: ${props => props.parentId === -1 ? props.theme.colors.mainWhite : "#F2F2F2"};
    margin: 8px 0px 8px 0px;
    border-radius: 4px;

    &:last-child {
        ${props => props.parentId === -1 ? '1px solid '+props.theme.colors.mainColor2 : "none"};
    };
`;

const StyledMasterGroupHeader = styled.div`
    position: sticky;
    top: -8px;
    z-index: 1;
    min-height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: ${props => props.theme.colors.mainColor1};
    border-radius: 4px;
    padding-top: 8px;
    padding-bottom: 8px;
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
    @-moz-document url-prefix() {
        position: initial;
    };
`;

const StyledLeftContent = styled.div`
    display: flex;
    height: 100%;
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
    p {
        margin: 0;
        font-weight: bold;
        font-size: 22px;
        color: ${props => props.theme.colors.mainWhite};
    }
`;

const StyledMasterGroupTitleContent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const StyledMasterGroupName = styled.p`
    user-select: none;
    max-width: 240px;
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

const StyledSubHeader = styled.p`
    height: 30px;
    display: flex;
    align-items: center;
    color: ${props => props.theme.colors.mainColor1};
    margin: 0px;
    margin-top: 8px;
    padding-left: 8px;
    font-size: 13px;
    font-weight: bold;
`;

const StyledSubText = styled.p`
    color: ${props => props.theme.colors.black};
    transition: all 0.1s ease-in;
    margin: 0px;
    padding: 0px 8px 8px 8px;
    font-size: 12px;
    font-weight: 400;
`;

const StyledReadMoreButton = styled.span`
    cursor: pointer;
    color: ${props => props.theme.colors.mainColor1};
    font-size: 12px;
    font-weight: 400;
`;

const StyledLinkButton = styled.a`
    cursor: pointer;
    color: ${props => props.theme.colors.mainColor1};
    font-size: 12px;
    font-weight: 400;
`;

const StyledMasterGroupLayersCount = styled.p`
    margin: 0;
    padding: 0px;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
`;

const StyledSubGroupLayersCount = styled.p`
    margin: 0;
    padding: 0px;
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.theme.colors.mainColor2};
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
    min-height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    border-radius: 4px;
    padding: 8px 0px 8px 8px;
`;

const StyledGroupName = styled.p`
    max-width: 220px;
    user-select: none;
    margin: 0;
    padding-left: 0px;
    font-size: 14px;
    font-weight: bold;
    color: ${props => props.theme.colors.mainColor1};
    @media ${props => props.theme.device.mobileL} {
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


const StyledMotionIconWrapper = styled(motion.div)`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledLayerGroup = styled(motion.ul)`
    list-style-type: none;
    margin: 0;
    padding-inline-start: ${props => props.parentId === -1 ? "8px" : "25px"};
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
    group,
    layers,
    hasChildren
}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isExcerptOpen, setIsExcerptOpen] = useState(false);
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel);

    const [filteredLayers, setFilteredLayers] = useState([]);
    const [totalGroupLayersCount, setTotalGroupLayersCoun] = useState(0);
    const [totalVisibleGroupLayersCount, setTotalVisibleGroupLayersCount] = useState(0);
    const [visibleLayers, setVisibleLayers] = useState([]);

    //Find matching layers from all layers and groups, then push this group's layers into 'filteredLayers'
    useEffect(() => {

        if (group.layers) {
            var getLayers = [];
            // need use group.layers because it is layer name ordered list
            group.layers.forEach(gl => {
                var layer = layers.filter(l => l.id === gl);
                if (layer && layer[0]) {
                    getLayers.push(layer[0]);
                }
            });
            setFilteredLayers(getLayers);
            setVisibleLayers(getLayers.filter(layer => layer.visible === true));

        };

        var layersCount = 0;
        var visibleLayersCount = 0;
        const layersCounter = (group) => {
            if (group.hasOwnProperty("layers") && group.layers.length > 0) {
                visibleLayersCount += layers.filter(l => group.layers.includes(l.id) && l.visible === true).length;
                layersCount = layersCount + group.layers.length;
            };

            var hasGroups = group.hasOwnProperty("groups") && group.groups.length > 0;
            hasGroups && group.groups.forEach(group => {
                layersCounter(group);
            });
            setTotalGroupLayersCoun(layersCount);
            setTotalVisibleGroupLayersCount(visibleLayersCount);
        };
        layersCounter(group);
    },[group, layers]);

    const truncatedString = (string, characterAmount, text) => {
        return (
            string.length > characterAmount + 20 ? <>{string.substring(0, characterAmount)} <StyledReadMoreButton
                onClick={() => setIsExcerptOpen(!isExcerptOpen)}>{text}</StyledReadMoreButton></> : string
        )
    }

    const selectGroup = (e) => {
        e.stopPropagation();
        let invisibleLayers = filteredLayers.length - visibleLayers.length;
        if(filteredLayers.length > 9 && invisibleLayers > 9 && isChecked === false){
            store.dispatch(setWarning({
                title: strings.multipleLayersWarning,
                subtitle: null,
                cancel: {
                    text: strings.general.cancel,
                    action: () => store.dispatch(setWarning(null))
                },
                confirm: {
                    text: strings.general.continue,
                    action: () => {
                        groupLayersVisibility();
                        store.dispatch(setWarning(null));
                    }
                },
            }))
        } else {
            groupLayersVisibility();
        }
/*         var invisibleLayers = filteredLayers.length - visibleLayers.length;
        var localStorageWarn = localStorage.getItem(OSKARI_LOCALSTORAGE) ? localStorage.getItem(OSKARI_LOCALSTORAGE) : [] ;
        if (filteredLayers.length > 9 && invisibleLayers > 9 && isChecked === false && !localStorageWarn.includes("multipleLayersWarning")) {
            store.dispatch(setSelectError({show: true, type: 'multipleLayersWarning', filteredLayers: filteredLayers, isChecked: isChecked}));
        } else {
            groupLayersVisibility();
        } */
    };

    const groupLayersVisibility = () => {

        if(filteredLayers.length === visibleLayers.length){
            filteredLayers.forEach(layer => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, false]);
            });
            setIsChecked(false);
        } else if (isChecked === false){
            filteredLayers.forEach(layer => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, true]);
            });
            setIsChecked(true);
        } else {
            filteredLayers.forEach(layer => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, true]);
            });
            setIsChecked(true);
        }
        updateLayers(store, channel);
    };

    return (
        <>
        <StyledLayerGroups>
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
                                themeStyles.hasOwnProperty(group.id) ?
                                    <FontAwesomeIcon
                                        icon={themeStyles[group.id].icon}
                                    /> : <p>{group.name.charAt(0).toUpperCase()}</p>
                            }
                        </StyledMasterGroupHeaderIcon>
                        <StyledMasterGroupTitleContent>
                            <StyledMasterGroupName>
                                {group.name}
                            </StyledMasterGroupName>
                            <StyledMasterGroupLayersCount>
                                {
                                  totalVisibleGroupLayersCount +" / "+ totalGroupLayersCount
                                }
                            </StyledMasterGroupLayersCount>
                        </StyledMasterGroupTitleContent>

                    </StyledLeftContent>
                    <StyledRightContent>
                        <StyledSelectButton>
                            <StyledMotionIconWrapper
                                initial="closed"
                                animate={isOpen ? "open" : "closed"}
                                variants={masterHeaderIconVariants}
                                transition={{
                                    duration: 0.3,
                                    type: "tween"
                                }}
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
                        subGroup={true}
                    >
                        <StyledMotionIconWrapper
                            initial="closed"
                            animate={isOpen ? "open" : "closed"}
                            variants={layerGroupIconVariants}
                            transition={{
                                duration: 0.3,
                                type: "tween"
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faAngleRight}
                            />
                        </StyledMotionIconWrapper>
                    </StyledSelectButton>
                    <div>
                        <StyledGroupName>{group.name}</StyledGroupName>
                        <StyledSubGroupLayersCount>
                            {
                                totalVisibleGroupLayersCount +" / "+ totalGroupLayersCount
                            }
                        </StyledSubGroupLayersCount>
                    </div>
                </StyledLefContent>
                    <StyledRightContent>
                        <Switch
                            isSelected={
                                filteredLayers.length === visibleLayers.length ||
                                !visibleLayers.length === 0 ||
                                !visibleLayers.length > filteredLayers.length
                            }
                            action={selectGroup}
                        />
                    </StyledRightContent>
                </StyledGroupHeader>
            )}
                <StyledLayerGroup
                    parentId={group.parentId}
                    key={"slg_" + group.parentId + "_" + group.id}
                    initial="hidden"
                    animate={isOpen ? "visible" : "hidden"}
                    variants={listVariants}
                    transition={{
                        duration: 0.3,
                        type: "tween"
                    }}
                >
                        <div>
                            {group.parentId === -1 && strings.groupLayerList.hasOwnProperty(group.id) && strings.groupLayerList[group.id].title !== null &&
                                <>
                                    <StyledSubHeader>{strings.groupLayerList[group.id].title}</StyledSubHeader>
                                </>
                            }
                            {strings.groupLayerList.hasOwnProperty(group.id) && strings.groupLayerList[group.id].description !== null &&
                                <>
                                    <StyledSubText>
                                        {isExcerptOpen ? <> {strings.groupLayerList[group.id].description}
                                                {strings.groupLayerList[group.id].link_description &&
                                                    <><StyledLinkButton target={"_blank"} href={strings.groupLayerList[group.id].link}>{strings.groupLayerList[group.id].link_description}</StyledLinkButton><br /></>
                                                }
                                                <StyledReadMoreButton onClick={() => setIsExcerptOpen(!isExcerptOpen)}>{strings.groupLayerList.readLess}</StyledReadMoreButton></> :
                                                truncatedString(strings.groupLayerList[group.id].description,
                                                    135, '...' + strings.groupLayerList.readMore)}
                                    </StyledSubText>
                                </>
                            }
                        </div>
                    {hasChildren && (
                        <>
                            <LayerList
                                key={'layer-list'+group.id}
                                groups={group.groups}
                                layers={layers}
                                recurse={true}
                            />
                            <Layers
                                layers={filteredLayers}
                                isOpen={isOpen}
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