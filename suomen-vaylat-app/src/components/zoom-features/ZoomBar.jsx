import { useContext, useState } from "react";
import { faSearchLocation, faListAlt, faSearchMinus, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import location from '../../theme/icons/my_location_white_24dp.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import ReactTooltip from "react-tooltip";
import { isMobile } from '../../theme/theme';
import styled from 'styled-components';
import { setZoomIn, setZoomOut } from '../../state/slices/rpcSlice';
import strings from '../../translations';
import ZoomBarCircle from './ZoomBarCircle';
import {Legend} from "../legend/Legend";
import {useAppSelector} from "../../state/hooks";

const StyledZoomBarContainer = styled.div`
    position: relative;
    pointer-events: none;
    cursor: pointer;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
`;

const StyledZoomBarControlTop = styled.button`
    width: 46px;
    height: 46px;
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
    height: 46px;
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

const StyledCenterLine = styled.div`
    z-index: -1;
    position: absolute;
    width: 4px;
    height: 100%;
    background-color: ${props => props.theme.colors.mainColor1};
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
`;

const StyledZoomBarLayersInfo = styled.div`
    position: absolute;
    left: ${props => props.isExpanded ? '-240px' : '-230px' };
    width: 240px;
    height: 100%;
    overflow: hidden;
    display: ${props => props.isExpanded ? 'block' : 'none'};
    transition-delay: 0.6s;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    border-radius: 15px;
    transition: all 0.3s ease-out;
`;

const StyledLayerInfoContainer = styled.div`
    overflow-y: auto;
    height: 100%;
`;

const StyledIcon = styled.img`
    width: 1.3rem;
    color: ffffff;
`;

const StyledMyLocationButton = styled.div`
    width: 45px;
    height: 45px;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.1s ease-out;
    background-color: ${props => props.theme.colors.mainColor1};
    // margin-bottom: 50px;
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
    // cursor: pointer;
    width: 46px;
    height: 46px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.isActive ? props.theme.colors.mainColor2 : props.theme.colors.mainColor1};
    // margin-top: 10px;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 18px;
    };
    @media ${props => props.theme.device.mobileL} {
        width: 40px;
        height: 40px;
    };

`;

const ZoomBar = ({
    zoomLevelsLayers,
    currentZoomLevel,
    selectedLayers
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hoveringIndex, setHoveringIndex] = useState(null);
    const { store } = useContext(ReactReduxContext);
    const rpc = useAppSelector((state) => state.rpc);

    return (
        <>
            <ReactTooltip disable={isMobile} id='zoomExpand' place="top" type="dark" effect="float">
                <span>{strings.tooltips.zoomExpand}</span>
            </ReactTooltip>

            <ReactTooltip disable={isMobile} id='zoomIn' place="top" type="dark" effect="float">
                <span>{strings.tooltips.zoomIn}</span>
            </ReactTooltip>

            <ReactTooltip disable={isMobile} id='zoomOut' place="top" type="dark" effect="float">
                <span>{strings.tooltips.zoomOut}</span>
            </ReactTooltip>

            <StyledZoomBarContainer>
            <StyledZoomBarLayersInfo isExpanded={isExpanded}>
                <StyledLayerInfoContainer>
                    <Legend
                        currentZoomLevel={currentZoomLevel}
                        selectedLayers={selectedLayers}
                        zoomLevelsLayers={zoomLevelsLayers}
                        hoveringIndex={hoveringIndex}
                    />
                </StyledLayerInfoContainer>

            </StyledZoomBarLayersInfo>
                <StyledMyLocationButton
                    data-tip data-for='myLoc'
                    onClick={() => {
                        rpc.channel.postRequest('MyLocationPlugin.GetUserLocationRequest');
                    }}
                >
                    <StyledIcon src={location} />

                    {/*<FontAwesomeIcon*/}
                    {/*    icon={location}*/}
                    {/*/>*/}
                </StyledMyLocationButton>
                <StyledCenterLine />
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
                {Object.values(zoomLevelsLayers).map((layer, index) => {
                    return <ZoomBarCircle
                        key={index}
                        index={index}
                        layer={layer}
                        zoomLevel={currentZoomLevel}
                        isExpanded={isExpanded}
                        setHoveringIndex={setHoveringIndex}
                    />
                })}
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
                <StyledMenuBarButton
                    data-tip data-for='legend'
                    isActive={isExpanded}
                    onClick={() => setIsExpanded(!isExpanded)}>
                    <FontAwesomeIcon
                        icon={faListAlt}
                    />
                </StyledMenuBarButton>
            </StyledZoomBarContainer>
        </>
    );
};

export default ZoomBar;

