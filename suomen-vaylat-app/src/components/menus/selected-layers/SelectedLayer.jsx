import {  useState, useContext } from "react";
import { faInfoCircle, faTimes, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext, useSelector } from 'react-redux';
import styled from 'styled-components';
import { clearLayerMetadata, getLayerMetadata, setLayerMetadata } from '../../../state/slices/rpcSlice';
import { updateLayers } from "../../../utils/rpcUtil";
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import strings from '../../../translations';

const StyledLayerContainer = styled.div`
    z-index: 9999;
    height: 80px;
    display: flex;
    margin-bottom: 8px;
`;

const StyledLayerContent = styled.div`
    position: relative;
    width: 100%;
    padding: 8px;
    background-color: #F5F5F5;
    box-shadow: 0px 1px 3px #0000001F;
    border-radius: 4px;
`;

const StyledlayerHeader = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const StyledMidContent = styled.div`
    font-size: 10px;
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
    justify-content: space-between;
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
        font-size: 20px;
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
    margin-right: 5px;
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
    width: 24px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    svg {
        font-size: 17px;
        color: ${props => props.theme.colors.mainColor1}; 
    }
`;

const StyledLayerInfoIconWrapper = styled.div`
    cursor: pointer;
    width: 30px;
    padding-left: 8px;
    opacity: ${props => props.uuid ? 1 : 0};
    font-size: 20px;
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

const DragHandle = SortableHandle(() => (
    <StyledLayerGripControl className="swiper-no-swiping">
        <FontAwesomeIcon icon={faGripVertical} />
    </StyledLayerGripControl>
));

export const SelectedLayer = ({
    layer,
    uuid
}) => {

    const { store } = useContext(ReactReduxContext);
    const [opacity, setOpacity] = useState(layer.opacity)
    const channel = useSelector(state => state.rpc.channel);

    const handleLayerVisibility = (channel, layer) => {
        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        updateLayers(store, channel);
    };

    const handleLayerOpacity = (channel, layer, value) => {
        channel.postRequest('ChangeMapLayerOpacityRequest', [layer.id, value]);
        setOpacity(value);
    };

    const handleMetadataSuccess = (data, layer, uuid) => {
        if (data) {
            store.dispatch(setLayerMetadata({ data: data, layer: layer, uuid: uuid }));
        }
    };
    const handleMetadataError = () => {
        store.dispatch(clearLayerMetadata());
    };
    
    return (
            <StyledLayerContainer>
                <StyledLayerContent>
                    <StyledLayerDeleteIcon
                        onClick={() => {
                            handleLayerVisibility(channel, layer);
                        }}>
                        <FontAwesomeIcon
                            icon={faTimes}
                        />
                    </StyledLayerDeleteIcon>
                    <StyledlayerHeader>
                        <StyledLayerName>
                            {layer.name}
                        </StyledLayerName>
                        <StyledLayerInfoIconWrapper
                            //data-tip data-for={'metadata' + layer.id}
                            disabled={uuid ? false : true}
                            uuid={uuid}
                            onClick={() => {
                                store.dispatch(getLayerMetadata({ layer: layer, uuid: uuid, handler: handleMetadataSuccess, errorHandler: handleMetadataError }));
                            }}
                        >
                            <FontAwesomeIcon icon={faInfoCircle} />
                        </StyledLayerInfoIconWrapper>
                    </StyledlayerHeader>
                    <StyledMidContent>
                        Lähennä nähdäksesi taso
                    </StyledMidContent>
                    <StyledBottomContent>
                        <p>Läpinäkyvyys</p>
                        <StyledlayerOpacityControl
                            className="swiper-no-swiping"
                            //data-tip data-for={'opacity' + layer.id}
                            type="range"
                            min="0"
                            max="100"
                            value={opacity}
                            onChange={event => handleLayerOpacity(channel, layer, event.target.value)}
                        />
                    </StyledBottomContent>
                </StyledLayerContent>
                <DragHandle />
            </StyledLayerContainer>
    );
};

export default SelectedLayer;