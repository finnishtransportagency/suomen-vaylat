import { useContext } from 'react';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import strings from '../../../translations';
import { selectGroup } from '../../../utils/rpcUtil';
import Layers from './Layers';
//import { reArrangeSelectedMapLayers } from '../../../state/slices/rpcSlice';

import hankekartta from './hankekartta.JPG';
import intersection from './Intersection.jpg';
import siltarajoituskartta from './siltarajoituskartta.jpg';
import tienumerokartta from './tienumerokartta.jpg';
import kuntokartta from './kuntokartta.jpg';

const listVariants = {
    visible: {
        height: 'auto',
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
    background-color: ${props => props.theme.colors.mainWhite};
    margin: 8px 0px 8px 0px;
    border-radius: 2px;
    &:last-child {
        ${props => props.parentId === -1 ? '1px solid '+props.theme.colors.mainColor2 : 'none'};
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

const StyledSelectButton = styled.div`
    position: relative;
    width: 18px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    margin-right: 16px;
    border: 2px solid white;
    border-radius: 50%;
    &:before {
        position: absolute;
        content: '';
        width: 10px;
        height: 10px;
        background-color: ${props => props.isOpen ? props.theme.colors.mainWhite : 'transparent'};
        border-radius: 50%;
        transition: background-color 0.3s ease-out;
    }
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

const themeImages = {
    0: hankekartta,
    1: intersection,
    2: siltarajoituskartta,
    3: tienumerokartta,
    4: kuntokartta

};

export const ThemeLayerList = ({
    allLayers,
    allThemes
}) => {

    const { store } = useContext(ReactReduxContext);

    const { channel, selectedTheme,  lastSelectedTheme, selectedThemeIndex} = useAppSelector((state) => state.rpc);

    const handleSelectGroup = (index, theme) => {
        selectGroup(store, channel, index, theme, lastSelectedTheme, selectedThemeIndex);
    };

    return (
        <>
            {allThemes.map((theme, index) => {
                var filteredLayers = allLayers.filter(layer => theme.layers.includes(layer.id));
                   return <ThemeGroup
                        key={index}
                        theme={theme}
                        filteredLayers={filteredLayers}
                        index={index}
                        selectedTheme={selectedTheme}
                        selectGroup={handleSelectGroup}
                        selectedThemeIndex={selectedThemeIndex}
                    />
            })}
        </>
    );
  };

export const ThemeGroup = ({
    theme,
    filteredLayers,
    index,
    selectedThemeIndex,
    selectGroup
}) => {

    const isOpen = selectedThemeIndex === index;

    return (
        <StyledLayerGroups index={index}>
            <StyledMasterGroupHeader
                key={'smgh_' + theme.id}
                onClick={() => {
                    selectGroup(index, theme);
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
                    <StyledSelectButton
                        isOpen={isOpen}
                    >
                    </StyledSelectButton>
                </StyledRightContent>
            </StyledMasterGroupHeader>
            <StyledLayerGroupContainer
                key={'slg_' + index}
                initial='hidden'
                animate={isOpen ? 'visible' : 'hidden'}
                variants={listVariants}
                transition={{
                    duration: 0.3,
                }}
            >
                <div>
                    {themeImages[theme.id] && <StyledLayerGroupImage src={themeImages[theme.id]} alt=''/>}
                    {strings.themelayerlist[theme.id].description !== null &&
                    <>
                        <StyledSubHeader>{strings.themelayerlist[theme.id].title}</StyledSubHeader>
                        <StyledSubText>{strings.themelayerlist[theme.id].description}</StyledSubText>
                    </>
                    }
                </div>
                <StyledLayerGroup>
                    <Layers layers={filteredLayers} isOpen={isOpen} theme={theme.name}/>
                </StyledLayerGroup>
            </StyledLayerGroupContainer>
        </StyledLayerGroups>
    );
  };

  export default ThemeLayerList;