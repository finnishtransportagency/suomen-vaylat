import {  useContext } from "react";
import { faInfo, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext, useSelector } from 'react-redux';
import ReactTooltip from "react-tooltip";
import styled from 'styled-components';
import { clearLayerMetadata, getLayerMetadata, setLayerMetadata } from '../../../state/slices/rpcSlice';
import strings from '../../../translations';
import { updateLayers } from "../../../utils/rpcUtil";


const StyledLayerContainer = styled.div`
    height: 40px;
    display: flex;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-out;
    &:nth-child(2n) {
        background-color: ${props => props.theme.colors.mainWhite};
    };
`;

const StyledlayerHeader = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const StyledLayerName = styled.p`
    max-width: 180px;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 5px;
    font-size: 13px;
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
    min-width: 28px;
    min-height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    svg {
        color: ${props => props.theme.colors.maincolor1};
        font-size: 16px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.maincolor2};
        };
    }
`;

const StyledlayerOpacityControl = styled.input`
    width: 60px;
    height: 6px;
    user-select: auto;
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    background: linear-gradient(90deg, rgba(0,100,175,0) 0%, rgba(0,100,175,1) 100%);
    margin-right: 5px;
    box-shadow: rgba(0, 0, 0, 0.048) 0px 1px 2px, rgba(0, 0, 0, 0.11) 0px 1px 2px;
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
        border: 3px solid ${props => props.theme.colors.maincolor1};
        border-radius: 50%;
        box-sizing: border-box;
        transition: all 0.1s ease-out;
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
        color: #0064af;
        font-size: 18px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: #009ae1;
        }
    }
`;


export const SelectedLayer = ({
    layer,
    uuid
}) => {

    const { store } = useContext(ReactReduxContext);

    const channel = useSelector(state => state.rpc.channel);

    const handleLayerVisibility = (channel, layer) => {
        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        updateLayers(store, channel);
    };

    const handleLayerOpacity = (channel, layer, value) => {
        channel.postRequest('ChangeMapLayerOpacityRequest', [layer.id, value]);
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

    return (
            <StyledLayerContainer>
                <ReactTooltip id={'opacity' + layer.id} place="top" type="dark" effect="solid">
                    <span>{strings.tooltips.opacity + ": " + layer.opacity}</span>
                </ReactTooltip>

                <ReactTooltip id={'metadata' + layer.id} place="top" type="dark" effect="solid">
                    <span>{strings.tooltips.metadata}</span>
                </ReactTooltip>
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
                            data-tip data-for={'opacity' + layer.id}
                            type="range"
                            min="0"
                            max="100"
                            value={layer.opacity}
                            onChange={event => handleLayerOpacity(channel, layer, event.target.value)}
                        />
                        <StyledLayerInfoIcon
                            data-tip data-for={'metadata' + layer.id}
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