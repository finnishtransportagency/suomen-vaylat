import { useState, useContext } from 'react';
import {
    faAngleDown,
    faMap
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import { motion } from "framer-motion";
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import strings from '../../../translations';
import { updateLayers } from '../../../utils/rpcUtil';
import Layers from './Layers';

import Intersection from './Intersection.jpg';

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
    open: {
        rotate: 180
    },
    closed: {
        rotate: 0
    },
};

const StyledLayerGroups = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: ${props => props.theme.colors.mainWhite};
    margin: 8px 0px 8px 0px;
    border-radius: 2px;
    &:last-child {
        ${props => props.parentId === -1 ? '1px solid '+props.theme.colors.mainColor2 : "none"};
    };
`;

const StyledMasterGroupName = styled.p`
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 230px;
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

const StyledMasterGroupHeader = styled.div`
    z-index: 1;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: ${props => props.theme.colors.secondaryColor2};
    //padding-left: 5px;
    border-radius: 4px;
    transition: all 0.1s ease-in;
`;

const StyledLeftContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledRightContent = styled.div`
    display: flex;
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

const StyledSelectButton = styled.button`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    margin-right: 8px;
    border: none;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 21px;
        transition: all 0.5s ease-out;
    };
`;

const StyledLayerGroupContainer = styled(motion.div)`
    overflow: hidden;
`;

const StyledLayerGroupImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;

`;

const StyledLayerGroup = styled.ul`
    list-style-type: none;
    padding-inline-start: 10px;
    margin: 0;
`;

const StyledSubHeader = styled.p`
    height: 30px;
    display: flex;
    align-items: center;
    color: ${props => props.theme.colors.secondaryColor2};
    margin: 0px;
    margin-top: 8px;
    padding-left: 8px;
    font-size: 13px;
    font-weight: bold;
`;

const StyledSubText = styled.p`
    color: ${props => props.theme.colors.black};
    margin: 0px;
    padding: 0px 8px 8px 8px;
    font-size: 12px;
    font-weight: 400;
`;

export const ThemeLayerList = ({
    allLayers,
    allThemes
}) => {
    return (
        <>
            {allThemes.map((theme, index) => {
                var filteredLayers = allLayers.filter(layer => theme.layers.includes(layer.id));
                   return <ThemeGroup
                        key={index}
                        theme={theme}
                        filteredLayers={filteredLayers}
                        index={index}
                    />
            })}
        </>
    );
  };

export const ThemeGroup = ({
    theme,
    filteredLayers,
    index
}) => {

    const { store } = useContext(ReactReduxContext);

    const { channel, selectedLayers } = useAppSelector((state) => state.rpc);
    const selectedTheme = useAppSelector((state) => state.ui.selectedTheme);

    const [isOpen, setIsOpen] = useState(false);
    const [isProgrammaticSelection, setIsProgrammaticSelection] = useState(false);

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
    };

    const selectGroup = (e) => {
        e && e.stopPropagation();

        if (!indeterminate) {
            filteredLayers.map(layer => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
                // Update layer orders to correct
                const position = selectedLayers.length + 1;
                channel.reorderLayers([layer.id, position], () => {});
                return true;
            });
        } else {
            filteredLayers.map(layer => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, false]);
                return true;
            });
        }
        updateLayers(store, channel);
    };
    
    if (encodeURIComponent(theme.name) === selectedTheme && isProgrammaticSelection === false) {
        selectGroup();
        setIsProgrammaticSelection(true);
    }

    return (
            <StyledLayerGroups index={index}>
                <StyledMasterGroupHeader
                    key={"smgh_" + index}
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                >
                    <StyledLeftContent>
                        <StyledMasterGroupHeaderIcon>
                            <FontAwesomeIcon
                                icon={faMap}
                            />
                        </StyledMasterGroupHeaderIcon>
                        <StyledMasterGroupName>{theme.name}</StyledMasterGroupName>
                    </StyledLeftContent>
                    <StyledRightContent>
                        {/* <Switch 
                            isSelected={checked}
                            action={selectGroup}
                        />
                        <ThemeGroupShareButton
                            color={"#ffffff"}
                            theme={theme.name}
                        /> */}
                        <StyledSelectButton> 
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
                <StyledLayerGroupContainer
                    key={"slg_" + index}
                    //isOpen={isOpen}
                    //initial="hidden"
                    animate={isOpen ? "visible" : "hidden"}
                    variants={listVariants}
                > 
                {strings.themelayerlist[theme.id].description !== null &&
                    <div> 
                        <StyledLayerGroupImage src={Intersection} alt=""/>
                        <StyledSubHeader>{strings.themelayerlist[theme.id].title}</StyledSubHeader>
                        <StyledSubText>{strings.themelayerlist[theme.id].description}</StyledSubText>
                    </div>
                }
                    <StyledLayerGroup>
                        <Layers layers={filteredLayers} isOpen={isOpen} theme={theme.name}/>
                    </StyledLayerGroup>
                </StyledLayerGroupContainer>
            </StyledLayerGroups>
    );
  };

  export default ThemeLayerList;