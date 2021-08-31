import { useState, useContext } from "react";
import { ReactReduxContext, useSelector } from 'react-redux';
import { setAllLayers } from '../../../state/slices/rpcSlice';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCog } from '@fortawesome/free-solid-svg-icons';

import LayerOptions from './LayerOptions';

const StyledLayerContainer = styled.div`
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

const StyledTopContent = styled.li`
    transition: all 0.3s ease-out;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    height: 30px;
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



const StyledLayerInfo = styled.div`
    display: flex;
    align-items: center;
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
        font-size: 18px;
        color: ${props => props.theme.colors.maincolor1};
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.maincolor2};
        }
    }
`;

const StyledLayerOptionsButton = styled.button`
    background-color: transparent;
    border: none;
    font-size: 20px;
    svg {
        color: #464646;
    };
    &:hover {
        svg {
            color: #838383;   
        }
    };
`;

export const SelectedLayer = ({ isOpen, layer }) => {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel);
    
    const handleLayerVisibility = (channel, layer) => {
        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        channel.getAllLayers(function (data) {
            store.dispatch(setAllLayers(data));
        });
    };

    return (
        <StyledLayerContainer>
            <StyledTopContent
                    key={layer.id}
            >
                <StyledLayerInfo>
                    <StyledLayerDeleteIcon
                    onClick={() => {
                            layer.visible && setIsOptionsOpen(false);
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
                </StyledLayerInfo>
                    <StyledLayerOptionsButton
                        onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                    >
                        <FontAwesomeIcon
                            icon={faCog}
                        />
                    </StyledLayerOptionsButton>
            </StyledTopContent>
            {isOptionsOpen && <LayerOptions layer={layer} isOpen={isOpen} isOptionsOpen={isOptionsOpen}/>}
        </StyledLayerContainer>
    );
  };

export default SelectedLayer;