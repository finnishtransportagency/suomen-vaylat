import { useContext, useEffect, useState } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    changeLayerStyle,
    getLegends,
    setLegends,
    setMapLayerVisibility
} from '../../../state/slices/rpcSlice';
import { updateLayers } from '../../../utils/rpcUtil';
import LayerDownloadLinkButton from './LayerDownloadLinkButton';
import {setIsDownloadLinkModalOpen} from '../../../state/slices/uiSlice';
import LayerMetadataButton from './LayerMetadataButton';

const StyledLayerContainer = styled.li`
    background-color: ${props => props.themeStyle && "#F5F5F5"};
    overflow: hidden;
    min-height: 32px;
    display: flex;
    align-items: center;
    margin-top: ${props => props.themeStyle && "8px" };
    border-radius: 4px;
`;

const StyledlayerHeader = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`;

const StyledLayerName = styled.p`
    user-select: none;
    color: ${props => props.themeStyle ? props.theme.colors.secondaryColor2 : props.theme.colors.mainColor1};
    margin: 0px;
    font-size: 14px;
    padding-left: 8px;
`;

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

const Switch = ({ action, layer, isSelected }) => {
    return (
        <StyledSwitchContainer
        isSelected={isSelected}
        onClick={() => {
            action(layer);
        }}>
            <StyledSwitchButton isSelected={isSelected}/>
        </StyledSwitchContainer>
    );
};

export const Layer = ({ layer, theme, groupName }) => {

    const { store } = useContext(ReactReduxContext);
    const [layerStyle, setLayerStyle] = useState(null);
    const [themeSelected, setThemeSelected] = useState(false);

    const excludeGroups = ["Digiroad", "Tierekisteri (Poistuva)"];

    const {
        channel,
        selectedTheme
    } = useSelector(state => state.rpc);

    const handleLayerVisibility = (channel, layer) => {
        store.dispatch(setMapLayerVisibility(layer));
        updateLayers(store, channel);
    };

    const handleIsDownloadLinkModalOpen = () => {
        store.dispatch(setIsDownloadLinkModalOpen({ layerDownloadLinkModalOpen: true, layerDownloadLink: downloadLink, layerDownloadLinkName: layer.name }))
    }

    const updateLayerLegends = () => {
        // need use global window variable to limit legend updates
        clearTimeout(window.legendUpdateTimer);
        window.legendUpdateTimer = setTimeout(function() {
            store.dispatch(getLegends({handler: (data) => {
                store.dispatch(setLegends(data));
            }}));
        }, 1000);
    };

    useEffect(() => {
        // Clear the timeout when the component unmounts
        return () => clearTimeout(window.legendUpdateTimer);
      }, []);

    const themeStyle = theme || null;

    if (selectedTheme && selectedTheme.name && themeSelected === false) {
        setThemeSelected(true);
    }

    // needs only get new style or legends when toggling theme selection
    if (layer.visible && themeSelected) {
        channel.getLayerThemeStyle([layer.id, (selectedTheme && selectedTheme.name) ? selectedTheme.name : null], function(styleName) {
            if (styleName && styleName !== layerStyle) {
                setLayerStyle(styleName);
                store.dispatch(changeLayerStyle({layerId: layer.id, style:styleName}));
                // update layers legends
                updateLayerLegends();
            }
        });
    }

    let downloadLink = null;
    if (layer.config && layer.config.downloadLink) {
        downloadLink = layer.config.downloadLink;
    }

    return (
            <StyledLayerContainer
                themeStyle={themeStyle}
                className={`list-layer ${layer.visible && "list-layer-active"}`}
                key={'layer' + layer.id + '_' + theme}
            >
                <StyledlayerHeader>
                    <StyledLayerName
                        themeStyle={themeStyle}
                    >
                         {layer.name} 
                         {groupName && groupName !== 'Unknown' && !excludeGroups.includes(groupName) && ` (${groupName})`}
                    </StyledLayerName>
                </StyledlayerHeader>
                {layer.metadataIdentifier && <LayerMetadataButton layer={layer}/>}
                {downloadLink && <LayerDownloadLinkButton
                    handleIsDownloadLinkModalOpen={handleIsDownloadLinkModalOpen} />
                }
                <Switch
                    action={() => handleLayerVisibility(channel, layer)}
                    isSelected={layer.visible}
                    layer={layer}
                />
            </StyledLayerContainer>
    );
  };

export default Layer;