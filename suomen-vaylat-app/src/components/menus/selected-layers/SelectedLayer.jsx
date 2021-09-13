import {  useContext } from "react";
import { ReactReduxContext, useSelector } from 'react-redux';
import { setAllLayers, getLayerMetadata, setLayerMetadata, clearLayerMetadata } from '../../../state/slices/rpcSlice';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faInfo } from '@fortawesome/free-solid-svg-icons';

//import LayerOptions from './LayerOptions';

const StyledLayerContainer = styled.div`
    transition: all 0.3s ease-out;
    overflow: hidden;
    display: flex;
    align-items: center;
    height: 40px;
    &:not(:last-child) {
        &:after {
            content: "";
            display: block;
            height: 1px;
            background-image: linear-gradient(90deg, rgba(0,100,175,0.1) 0%, rgba(0,100,175,0.5) 50%, rgba(0,100,175,0.1) 100%);
            background-repeat: no-repeat;
            background-position: center bottom;
        }
    };
`;

const StyledlayerHeader = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`;

const StyledLayerName = styled.p`
    font-size: 13px;
    margin: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const StyledLeftContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledRightContent = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-right: 10px;
`;

const StyledLayerDeleteIcon = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 28px;
    min-height: 28px;
    svg {
        transition: all 0.1s ease-out;
        font-size: 16px;
        color: ${props => props.theme.colors.maincolor1};
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.maincolor2};
        }
    }
`;

const StyledlayerOpacityControl = styled.input`
    user-select: auto;
    width: 60px;
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    border-radius: 5px;
    background: linear-gradient(90deg, rgba(0,100,175,0) 0%, rgba(0,100,175,1) 100%);
    box-shadow: rgba(0, 0, 0, 0.048) 0px 1px 2px, rgba(0, 0, 0, 0.11) 0px 1px 2px;
    outline: none;
    -webkit-transition: .2s;
    transition: opacity .2s;
    margin-right: 5px;

    ::-webkit-slider-thumb {
        transition: all 0.1s ease-out;
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border: 3px solid ${props => props.theme.colors.maincolor1};
        box-sizing: border-box;
        border-radius: 50%;
        background: ${props => props.theme.colors.mainWhite};
        cursor: pointer;
        &:hover{
            background: ${props => props.theme.colors.maincolor1};
        }
    }
`;

const StyledLayerInfoIcon = styled.button`
    opacity: ${props => props.uuid ? 1 : 0};
    background-color: transparent;
    border: none;
    font-size: 20px;
    svg {
        transition: all 0.1s ease-out;
        font-size: 18px;
        color: #0064af;
    };
    &:hover {
        svg {
            color: #009ae1;
        }
    }
`;


export const SelectedLayer = ({ layer, uuid }) => {
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel);

    const handleLayerVisibility = (channel, layer) => {
        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        channel.getAllLayers(function (data) {
            store.dispatch(setAllLayers(data));
        });
    };

    const handleLayerOpacity = (channel, layer, value) => {
        channel.postRequest('ChangeMapLayerOpacityRequest', [layer.id, value]);
        channel.getAllLayers(function (data) {
            store.dispatch(setAllLayers(data));
        });
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
                <StyledLeftContent>
                    <StyledLayerDeleteIcon
                        onClick={() => {
                            handleLayerVisibility(channel, layer);
                        }}>
                        <FontAwesomeIcon
                            icon={faTrash}
                        />
                    </StyledLayerDeleteIcon>
                    <StyledlayerHeader>
                        <StyledLayerName>
                            {layer.name}
                        </StyledLayerName>
                    </StyledlayerHeader>
                </StyledLeftContent>
                <StyledRightContent>
                    <StyledlayerOpacityControl
                        type="range"
                        min="0"
                        max="100"
                        value={layer.opacity}
                        onChange={event => handleLayerOpacity(channel, layer, event.target.value)}
                    />
                    <StyledLayerInfoIcon
                        disabled={uuid ? false : true}
                        uuid={uuid}
                        onClick={() => {
                            store.dispatch(getLayerMetadata({ layer: layer, uuid: uuid, handler: handleMetadataSuccess, errorHandler: handleMetadataError }));
                        }
                    }>
                        <FontAwesomeIcon icon={faInfo} />
                    </StyledLayerInfoIcon>
                </StyledRightContent>
        </StyledLayerContainer>
    );
};

export default SelectedLayer;