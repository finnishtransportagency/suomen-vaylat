import { useContext, useEffect, useRef, useState } from "react";
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getLegends, setLegends, setMapLayerVisibility } from '../../../state/slices/rpcSlice';
import { updateLayers } from "../../../utils/rpcUtil";

const StyledLayerContainer = styled.li`
    overflow: hidden;
    display: flex;
    align-items: center;
    margin: 0;
`;

const StyledlayerHeader = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`;

const StyledLayerName = styled.p`
    user-select: none;
    color: ${props => props.theme.colors.black};
    margin: 5px;
    font-size: 13px;
    @media ${ props => props.theme.device.mobileL} {
        font-size: 12px;
    };
`;

const StyledCheckbox = styled.div`
    cursor: pointer;
    min-width: 20px;
    min-height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.colors.mainWhite};
    margin-right: 36px;
    border: 2px solid ${props => props.theme.colors.maincolor1};
    border-radius: 30%;
    box-sizing: border-box;
    svg {
        color: ${props => props.theme.colors.maincolor1};
        font-size: 12px;
    };
`;

export const Layer = ({ layer, theme }) => {

    const { store } = useContext(ReactReduxContext);

    const [layerStyle, setLayerStyle] = useState(null);

    const {
        channel,
        selectedLayers
    } = useSelector(state => state.rpc);

    const handleLayerVisibility = (channel, layer) => {
        store.dispatch(setMapLayerVisibility(layer));
        //channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        // Update layer orders to correct
        const position = selectedLayers.length + 1;
        channel.reorderLayers([layer.id, position], () => {});
        updateLayers(store, channel);
    };

    const timerRef = useRef(null);

    const updateLayerLegends = () => {
        timerRef.current = setTimeout(() => {
            store.dispatch(getLegends({handler: (data) => {
                store.dispatch(setLegends(data));
            }}));
        }, 500);
    };

    useEffect(() => {
        // Clear the interval when the component unmounts
        return () => clearTimeout(timerRef.current);
      }, []);

    if (layer.visible) {
        const themeStyle = theme || null;
        channel.getLayerThemeStyle([layer.id, themeStyle], function(styleName) {
            if (styleName) {

                if (styleName !== layerStyle) {
                    setLayerStyle(styleName);
                    channel.changeLayerStyle([layer.id, styleName], function() {
                        // update layers legends
                        updateLayerLegends();
                    });
                }
            }
        });
    }

    return (
            <StyledLayerContainer
                key={'layer' + layer.id + '_' + theme}
            >
                <StyledlayerHeader>
                    <StyledLayerName>
                        {layer.name}
                    </StyledLayerName>
                </StyledlayerHeader>
                <StyledCheckbox
                    isChecked={layer.visible}
                    onClick={() => handleLayerVisibility(channel, layer)}
                >
                {
                    layer.visible && <FontAwesomeIcon
                        icon={faCheck}
                    />
                    }
                </StyledCheckbox>
            </StyledLayerContainer>
    );
  };

export default Layer;