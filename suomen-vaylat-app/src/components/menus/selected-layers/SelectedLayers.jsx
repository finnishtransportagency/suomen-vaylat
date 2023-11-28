import { useContext, useEffect} from "react";
import styled from 'styled-components';
import { setBackgroundMaps, setMapLayers } from '../../../state/slices/rpcSlice';
import strings from '../../../translations';
import { updateLayers, resetThemeGroups, reArrangeRPCLayerOrder, showNonThemeLayers } from '../../../utils/rpcUtil';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from "../../../state/hooks";
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import {arrayMoveImmutable} from 'array-move';
import SelectedLayer from './SelectedLayer';
import { filter } from "lodash";

const StyledSelectedLayers = styled.div`

`;

const StyledDeleteAllSelectedLayers = styled.div`
    width: 250px;
    height: 40px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.mainColor1};
    margin: 20px auto 20px auto;
    border-radius: 20px;
    box-shadow: 0px 1px 3px #0000001F;
    p {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
    }
`;

const StyledListSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: ${props => props.theme.colors.mainColor1};
    padding: 0px 0px 16px 0px;
    font-size: 16px;
    font-weight: 600;
    svg {
      margin-left: 8px;
      font-size: 20px;
      transition: all 0.3s ease-out;
    };
`;


const SortableElement = sortableElement((props) => {
    const {value, currentZoomLevel, filtersEnabled} = props;
    return <SelectedLayer
        layer={value}
        uuid={value.metadataIdentifier}db
        currentZoomLevel={currentZoomLevel}
        filtersEnabled={filtersEnabled}
    />
}
    
);

const SortableContainer = sortableContainer(({children}) => {
  return <div>{children}</div>;
});


export const SelectedLayers = (props) => {
    const { selectedLayers, currentZoomLevel } = props;
    const { store } = useContext(ReactReduxContext);
    const {channel, selectedLayersByType, allSelectedThemeLayers, selectedTheme, filters} = useAppSelector(state => state.rpc);
    let backgroundMaps = selectedLayersByType.backgroundMaps;
    let mapLayers = selectedLayersByType.mapLayers;

    const sortSelectedLayers = (selectedLayer) => {
        const newSelectedLayers = arrayMoveImmutable(mapLayers, selectedLayer.oldIndex, selectedLayer.newIndex)
        store.dispatch(setMapLayers(newSelectedLayers));
        reArrangeRPCLayerOrder(store, newSelectedLayers);
    };

    const sortSelectedBackgroundLayers = (backgroundLayer) => {
        const newSelectedLayers = arrayMoveImmutable(backgroundMaps, backgroundLayer.oldIndex, backgroundLayer.newIndex);
        store.dispatch(setBackgroundMaps(newSelectedLayers));
        reArrangeRPCLayerOrder(store, newSelectedLayers);
    };

    const handleClearSelectedLayers = () => {
        mapLayers.forEach(layer => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        });
        resetThemeGroups(store);
        store.dispatch(setMapLayers([]));
        updateLayers(store, channel);
    };

    const handleClearSelectedBackgroundMaps = () => {
        backgroundMaps.forEach(layer => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        });
        store.dispatch(setBackgroundMaps([]));
        updateLayers(store, channel);
    };

    useEffect(() => {
        if(selectedTheme && !selectedLayers.some(layer => allSelectedThemeLayers.includes(layer.id))) {
            resetThemeGroups(store);
            showNonThemeLayers(store, channel);
        }
    }, [selectedLayers])

    return (
        <StyledSelectedLayers>
            <StyledListSubtitle>{strings.layerlist.layerlistLabels.mapLayers}</StyledListSubtitle>
            <SortableContainer
                onSortEnd={sortSelectedLayers}
                useDragHandle
                lockAxis={"y"}
            >
                <ul
                    style={{paddingInlineStart: "0px"}}
                >
                    {mapLayers.map((item, index) => (
                        <SortableElement
                            key={'maplayer-' + item.id} 
                            value={item}
                            index={index}
                            currentZoomLevel={currentZoomLevel}
                            filtersEnabled={filters && filters.length > 0 && filters.some(filter => (filter.layer ===  item.id))}
                        />
                    ))}
                </ul>
            </SortableContainer>
            <StyledDeleteAllSelectedLayers
                onClick={() => handleClearSelectedLayers()}
            >
                <p>{strings.layerlist.layerlistLabels.clearSelectedMapLayers}</p>
            </StyledDeleteAllSelectedLayers>
            <StyledListSubtitle>{strings.layerlist.layerlistLabels.backgroundMaps}</StyledListSubtitle>
            <SortableContainer
                onSortEnd={sortSelectedBackgroundLayers}
                useDragHandle
                lockAxis={"y"}
            >
                <ul
                    style={{paddingInlineStart: "0px"}}
                >
                    {backgroundMaps && backgroundMaps.map((item, index) => (
                        <SortableElement
                            key={'background-maplayer-' + item.id}
                            value={item}
                            index={index}
                            currentZoomLevel={currentZoomLevel}
                        />
                    ))}
                </ul>
            </SortableContainer>
            <StyledDeleteAllSelectedLayers
                onClick={() => handleClearSelectedBackgroundMaps()}
            >
                <p>{strings.layerlist.layerlistLabels.clearSelectedBackgroundMaps}</p>
            </StyledDeleteAllSelectedLayers>
        </StyledSelectedLayers>
    );
};

export default SelectedLayers;
