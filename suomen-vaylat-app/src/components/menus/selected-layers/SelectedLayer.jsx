import {  useState, useContext } from 'react';
import { faInfoCircle, faTimes, faCaretDown, faCaretUp, faGripLines, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext, useSelector } from 'react-redux';
import styled from 'styled-components';
import { clearLayerMetadata, getLayerMetadata, setLayerMetadata, setZoomTo } from '../../../state/slices/rpcSlice';
import { updateLayers } from '../../../utils/rpcUtil';
import { sortableHandle } from 'react-sortable-hoc';

import strings from '../../../translations';

const StyledLayerContainer = styled.li`
    z-index: 9999;
    height: 80px;
    display: flex;
    margin-bottom: 8px;
    background-color: #F5F5F5;
    box-shadow: 0px 1px 3px #0000001F;
`;

const StyledLayerContent = styled.div`
    position: relative;
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const StyledlayerHeader = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const StyledMidContent = styled.div`
    font-size: 12px;
`;

const StyledLayerName = styled.p`
    max-width: 220px;
    margin: 0;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    color: ${props => props.theme.colors.secondaryColor8};
`;

const StyledBottomContent = styled.div`
    display: flex;
    align-items: center;
    p {
        margin: 0;
        color: ${props => props.theme.colors.mainColor1};
        font-size: 12px;
    }
`;

const StyledLayerDeleteIcon = styled.div`
    position: absolute;
    top: 0px;
    right: 0px;
    min-width: 28px;
    min-height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    svg {
        color: ${props => props.theme.colors.mainColor1};
        font-size: 18px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.mainColor2};
        };
    }
`;

const StyledlayerOpacityControl = styled.input`
    width: 104px;
    height: 8px;
    user-select: auto;
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    background: linear-gradient(90deg, rgba(0,100,175,0) 0%, ${props => props.theme.colors.secondaryColor8} 100%);
    margin-left: 8px;
    border-radius: 5px;
    -webkit-transition: .2s;
    transition: opacity .2s;
    ::-webkit-slider-thumb {
        width: 16px;
        height: 16px;
        -webkit-appearance: none;
        appearance: none;
        cursor: pointer;
        background: ${props => props.theme.colors.mainWhite};
        border: 2px solid ${props => props.theme.colors.secondaryColor8};
        border-radius: 50%;
        box-sizing: border-box;
        transition: all 0.1s ease-out;
        &:hover{
            background: ${props => props.theme.colors.secondaryColor8};
        }
    }
`;

const StyledLayerGripControl = styled.div`
    height: 100%;
    width: 100%;
    max-width: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.1s ease-out;
    svg {
        font-size: 17px;
        color: ${props => props.theme.colors.mainColor1};
    };
    &:hover {
        transform: scale(1.1);
        svg {
            filter: drop-shadow(0px 1px 2px #00000026);
        }
    };
`;

const StyledLayerInfoIconWrapper = styled.div`
    cursor: pointer;

    padding-left: 8px;
    svg {
        color: ${props => props.theme.colors.mainColor1};
        font-size: 18px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.mainColor2};
        }
    }
`;

const StyledToggleOpacityIconWrapper = styled.div`
    cursor: pointer;
    margin-left: 10px;
    svg {
        color: ${props => props.theme.colors.mainColor1};
        transition: all 0.1s ease-out;
    };
    svg:hover {
        color: ${props => props.theme.colors.mainColor2};
    }
    `;

const StyledLayerInfoContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 18px;
`;

const StyledShowLayerButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    margin-right: 3px;
    color: #069;
    text-decoration: underline;
    cursor: pointer;
    display: flex;
    height: 10px;
    font:inherit;
`;

const DragHandle = sortableHandle(() => (
    <StyledLayerGripControl className="swiper-no-swiping">
        <FontAwesomeIcon
            icon={faCaretUp}
            style={{
                fontSize: '14px',
                marginBottom: '-4px'
            }}
        />
        <FontAwesomeIcon
            icon={faGripLines}
            style={{
                fontSize: '16px'
            }}
        />
        <FontAwesomeIcon
            icon={faCaretDown}
            style={{
                fontSize: '14px',
                marginTop: '-4px'
            }}
        />
    </StyledLayerGripControl>
));

export const SelectedLayer = ({
    layer,
    uuid,
    currentZoomLevel,
    sortIndex,
    opacityZero
}) => {
    const { store } = useContext(ReactReduxContext);
    const [opacity, setOpacity] = useState(layer.opacity);
    const [prevOpacity, setPrevOpacity] = useState(layer.opacity);
    const [isLayerVisible, setIsLayerVisible] = useState(true);
    const channel = useSelector(state => state.rpc.channel);

    const handleLayerRemoveSelectedLayer = (channel, layer) => {
        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, false]);
        updateLayers(store, channel);
    };

    const handleLayerOpacity = (channel, layer, value) => {
        channel.postRequest('ChangeMapLayerOpacityRequest', [layer.id, value]);
        setOpacity(value);
    };

    const handleLayerOpacityToggle = (channel, layer) => {
        setIsLayerVisible(!isLayerVisible);
        !opacityZero ? setPrevOpacity(layer.opacity) : setPrevOpacity(100);
        const newOpacity = opacityZero? prevOpacity: 0;
        channel.postRequest('ChangeMapLayerOpacityRequest', [layer.id, newOpacity]);
        setOpacity(newOpacity);
        updateLayers(store, channel);
    };

    const handleMetadataSuccess = (data, layer, uuid) => {
        if (data) {
            store.dispatch(setLayerMetadata({ data: data, layer: layer, uuid: uuid }));
        }
    };
    const handleMetadataError = () => {
        store.dispatch(clearLayerMetadata());
    };

    const handleLayerMetadata = (layer, uuid) => {
        store.dispatch(getLayerMetadata({ layer: layer, uuid: uuid, handler: handleMetadataSuccess, errorHandler: handleMetadataError }));
    };

    const isCurrentZoomTooFar = layer.maxZoomLevel && layer.minZoomLevel && currentZoomLevel <  layer.minZoomLevel;
    const isCurrentZoomTooClose = layer.maxZoomLevel && layer.minZoomLevel && currentZoomLevel >  layer.maxZoomLevel

    let layerInfoText = strings.layerlist.selectedLayers.layerVisible;
    if (isCurrentZoomTooFar) {
        layerInfoText = strings.layerlist.selectedLayers.zoomInToShowLayer;
    } else if (isCurrentZoomTooClose) {
        layerInfoText = strings.layerlist.selectedLayers.zoomOutToShowLayer;
    }

    return (
            <StyledLayerContainer>
                <DragHandle />
                <StyledLayerContent>
                    <StyledLayerDeleteIcon
                        className="swiper-no-swiping"
                        onClick={() => {
                            handleLayerRemoveSelectedLayer(channel, layer);
                        }}>
                        <FontAwesomeIcon
                            icon={faTimes}
                        />
                    </StyledLayerDeleteIcon>
                    <StyledlayerHeader>
                        <StyledLayerName>
                            {layer.name}
                        </StyledLayerName>
                        { uuid &&
                            <StyledLayerInfoIconWrapper
                                className="swiper-no-swiping"
                                uuid={uuid}
                                onClick={() => {
                                    handleLayerMetadata(layer, uuid);
                                }}
                            >
                                <FontAwesomeIcon icon={faInfoCircle} />
                            </StyledLayerInfoIconWrapper>
                        }
                    </StyledlayerHeader>
                    <StyledMidContent>
                        {isCurrentZoomTooFar || isCurrentZoomTooClose ? <StyledLayerInfoContainer>
                            <StyledShowLayerButton onClick={() => store.dispatch(setZoomTo(layer.minZoomLevel))}>
                                {isCurrentZoomTooFar? strings.tooltips.zoomIn : isCurrentZoomTooClose && strings.tooltips.zoomOut}
                            </StyledShowLayerButton> <p>{strings.layerlist.selectedLayers.toShowLayer}</p>
                        </StyledLayerInfoContainer>
                        : layerInfoText }
                    </StyledMidContent>
                    <StyledBottomContent>
                        <p>{strings.layerlist.selectedLayers.opacity}</p>
                        <StyledlayerOpacityControl
                            className="swiper-no-swiping"
                            type="range"
                            min="0"
                            max="100"
                            value={opacity}
                            onChange={event => handleLayerOpacity(channel, layer, event.target.value)}
                            onMouseUp={() => updateLayers(store, channel)}
                            onTouchEnd={() => updateLayers(store, channel)}
                        />
                        <StyledToggleOpacityIconWrapper onClick={() => handleLayerOpacityToggle(channel, layer)}>
                            <FontAwesomeIcon icon={isLayerVisible? faEye : faEyeSlash} />
                        </StyledToggleOpacityIconWrapper>
                    </StyledBottomContent>
                </StyledLayerContent>
            </StyledLayerContainer>
    );
};

export default SelectedLayer;