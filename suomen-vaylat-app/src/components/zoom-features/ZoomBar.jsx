import React, { useContext } from 'react';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faSearchMinus, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import location from '../../theme/icons/my_location_white_24dp.svg';

import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import { isMobile } from '../../theme/theme';
import { setZoomIn, setZoomOut } from '../../state/slices/rpcSlice';
import strings from '../../translations';
import ZoomBarCircle from './ZoomBarCircle';

const StyledZoomBarContainer = styled.div`
    position: relative;
    pointer-events: none;
    cursor: pointer;
    display: flex;
    //flex-direction: column-reverse;
    flex-direction: column;
    align-items: center;
    &::before {
        z-index: -1;
        content: '';
        position: absolute;
        top: 0px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 100%;
        background-color: ${props => props.theme.colors.mainColor1};
    }
`;

const StyledZoomBarControlTop = styled.button`
    width: 46px;
    min-height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
    background-color: ${props => props.theme.colors.mainColor1};
    margin: 0px 3px 3px 3px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    border: none;
    border-radius: 50%;
    transition: all 0.1s ease-in;
   svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 20px;
    };
    &:hover {
        background-color: ${props => props.theme.colors.mainColor2};
    }
`;

const StyledZoomBarControlBottom = styled.button`
    width: 46px;
    min-height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
    cursor: pointer;
    background-color: ${props => props.theme.colors.mainColor1};
    margin: 3px 3px 0px 3px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    border: none;
    border-radius: 50%;
    transition: all 0.3s ease-out;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 20px;
    };
    &:hover {
        background-color: ${props => props.theme.colors.mainColor2};
    }
`;

const StyledZoombarCircles = styled(motion.div)`
    overflow: hidden;
`;

const StyledIcon = styled.img`
    width: 20px;
`;

const StyledMyLocationButton = styled.div`
    width: 45px;
    min-height: 46px;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.1s ease-out;
    background-color: ${props => props.theme.colors.mainColor1};
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 23px;
    };
    &:hover {
        background-color: ${props => props.theme.colors.mainColor2};
    };
    pointer-events: auto;
    cursor: pointer;
`;

const StyledMenuBarButton = styled.div`
    position: relative;
    pointer-events:auto;
    width: 46px;
    min-height: 46px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.1s ease-out;
    background-color: ${props => props.isActive ? props.theme.colors.mainColor2 : props.theme.colors.mainColor1};
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    border-radius: 50%;
    &:hover {
        background-color: ${props => props.theme.colors.mainColor2};
    };
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 18px;
    };
    @media ${props => props.theme.device.mobileL} {
        width: 40px;
        height: 40px;
    };

`;

const listVariants = {
    visible: {
        height: "auto",
        //opacity: 1
    },
    hidden: {
        height: 0,
        //opacity: 0
    },
};

const ZoomBar = ({
    zoomLevelsLayers,
    currentZoomLevel,
    isExpanded,
    setIsExpanded,
    setHoveringIndex
}) => {
    const { store } = useContext(ReactReduxContext);
    const rpc = useAppSelector((state) => state.rpc);

    return (
        <>
            <ReactTooltip disable={isMobile} id='zoomExpand' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.zoomExpand}</span>
            </ReactTooltip>

            <ReactTooltip disable={isMobile} id='zoomIn' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.zoomIn}</span>
            </ReactTooltip>

            <ReactTooltip disable={isMobile} id='zoomOut' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.zoomOut}</span>
            </ReactTooltip>

            <StyledZoomBarContainer>
                <StyledMenuBarButton
                    data-tip data-for='legend'
                    isActive={isExpanded}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <FontAwesomeIcon
                        icon={faListAlt}
                    />
                </StyledMenuBarButton>
                <StyledZoomBarControlTop
                    data-tip data-for='zoomIn'
                    disabled={currentZoomLevel === Object.values(zoomLevelsLayers).length - 1}
                    onClick={() => {
                        store.dispatch(setZoomIn());
                    }}
                >
                    <FontAwesomeIcon
                        icon={faSearchPlus}
                    />
                </StyledZoomBarControlTop>
                <StyledZoombarCircles
                    initial='hidden'
                    animate={isExpanded ? 'visible' : 'hidden'}
                    variants={listVariants}
                    transition={{
                        duration: 0.5,
                        type: "tween"
                    }}
                >
                    {Object.values(zoomLevelsLayers).map((layer, index) => {
                            return <ZoomBarCircle
                                key={index}
                                index={index}
                                layer={layer}
                                zoomLevel={currentZoomLevel}
                                setHoveringIndex={setHoveringIndex}
                            />
                    })}
                </StyledZoombarCircles>
                <StyledZoomBarControlBottom
                    data-tip data-for='zoomOut'
                    disabled={currentZoomLevel === 0}
                    onClick={() => {
                        store.dispatch(setZoomOut());
                    }}
                >
                    <FontAwesomeIcon
                        icon={faSearchMinus}
                    />
                </StyledZoomBarControlBottom>
                <StyledMyLocationButton
                    data-tip data-for='myLoc'
                    onClick={() => {
                        rpc.channel.postRequest('MyLocationPlugin.GetUserLocationRequest');
                    }}
                >
                    <StyledIcon src={location} />
                </StyledMyLocationButton>
            </StyledZoomBarContainer>
        </>
    );
};

export default ZoomBar;

