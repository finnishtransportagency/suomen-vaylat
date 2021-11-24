import { useContext } from "react";
import styled from 'styled-components';
import { setSelectedLayers } from '../../../state/slices/rpcSlice';
import strings from '../../../translations';
import { updateLayers, resetThemeGroups, reArrangeRPCLayerOrder } from '../../../utils/rpcUtil';
import { ReactReduxContext, useSelector } from 'react-redux';
import { SortableContainer, SortableElement} from 'react-sortable-hoc';
import {arrayMoveImmutable} from 'array-move';

import SelectedLayer from './SelectedLayer';

const StyledSelectedLayers = styled.div`

`;

const StyledDeleteAllSelectedLayers = styled.div`
    width: 250px;
    height: 30px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.mainColor1};
    margin: 20px auto 20px auto;
    border-radius: 15px;
    p {
        //padding-left: 10px;
        margin: 0;
        font-size: 12px;
        font-weight: bold;
    };
`;

const StyledListSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: ${props => props.theme.colors.mainColor1};
    padding: 0px 0px 16px 0px;
    font-size: 14px;
    svg {
      margin-left: 8px;
      font-size: 20px;
      transition: all 0.3s ease-out;
    };
`;

const SortableItem = SortableElement(({value,currentZoomLevel}) =>
    <SelectedLayer
        key={value.id + 'selected'}
        layer={value}
        uuid={value.metadataIdentifier && value.metadataIdentifier.length > 0 ? value.metadataIdentifier : ''}
        currentZoomLevel={currentZoomLevel}
    />
);

const SortableList = SortableContainer(({items, currentZoomLevel}) => {
    return (
        <div>
            {items.map((value, index) => (
                <SortableItem
                    key={`item-${value.id}`}
                    index={index}
                    value={value}
                    currentZoomLevel={currentZoomLevel}
                />
            ))}
        </div>
    );
});

export const SelectedLayers = ({ selectedLayers, currentZoomLevel }) => {
    const { store } = useContext(ReactReduxContext);

    const channel = useSelector(state => state.rpc.channel);

    const mapLayers = selectedLayers.filter(layer => {
        return !(layer.groups && layer.groups.includes(1));
    });

    const backgroundMaps = selectedLayers.filter(layer => {
        return layer.groups && layer.groups.includes(1);
    });

    const sortSelectedLayers = (selectedLayer) => {
        const newSelectedLayers = arrayMoveImmutable(selectedLayers, selectedLayer.oldIndex, selectedLayer.newIndex)
        reArrangeRPCLayerOrder(store, newSelectedLayers);
        store.dispatch(setSelectedLayers(newSelectedLayers));
    };

    const sortBackgroundLayers = (backgroundLayer) => {
        const newSelectedLayers = arrayMoveImmutable(selectedLayers, backgroundLayer.oldIndex + selectedLayers.length, backgroundLayer.newIndex + selectedLayers.length)
        reArrangeRPCLayerOrder(store, newSelectedLayers);
        store.dispatch(setSelectedLayers(newSelectedLayers));
    };

    const handleClearSelectedLayers = () => {
        mapLayers.forEach(layer => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        });
        resetThemeGroups(store);

        updateLayers(store, channel);
    };

    const handleClearSelectedBackgroundMaps = () => {
        backgroundMaps.forEach(layer => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        });
        updateLayers(store, channel);
    };

    return (
        <StyledSelectedLayers>
            <StyledListSubtitle>{strings.layerlist.layerlistLabels.mapLayers}</StyledListSubtitle>
            <SortableList
                lockAxis={"y"}
                distance={1}
                transitionDuration={300}
                items={mapLayers}
                onSortEnd={sortSelectedLayers}
                currentZoomLevel={currentZoomLevel}
            />
            <StyledDeleteAllSelectedLayers
                onClick={() => handleClearSelectedLayers()}
            >
                <p>{strings.layerlist.layerlistLabels.clearSelectedMapLayers}</p>
            </StyledDeleteAllSelectedLayers>
            <StyledListSubtitle>{strings.layerlist.layerlistLabels.backgroundMaps}</StyledListSubtitle>
            <SortableList
                lockAxis={"y"}
                distance={1}
                transitionDuration={300}
                items={backgroundMaps}
                onSortEnd={sortBackgroundLayers}
                currentZoomLevel={currentZoomLevel}
            />
            <StyledDeleteAllSelectedLayers
                onClick={() => handleClearSelectedBackgroundMaps()}
            >
                <p>{strings.layerlist.layerlistLabels.clearSelectedBackgroundMaps}</p>
            </StyledDeleteAllSelectedLayers>
        </StyledSelectedLayers>
    );
};

export default SelectedLayers;
