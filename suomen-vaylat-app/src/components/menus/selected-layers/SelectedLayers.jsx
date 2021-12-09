import React, { useState, useContext, useRef } from "react";
import styled from 'styled-components';
import { setSelectedLayers } from '../../../state/slices/rpcSlice';
import strings from '../../../translations';
import { updateLayers, resetThemeGroups, reArrangeRPCLayerOrder } from '../../../utils/rpcUtil';
import { ReactReduxContext, useSelector } from 'react-redux';
import { sortableContainer, sortableElement, arrayMove } from 'react-sortable-hoc';
import {arrayMoveImmutable} from 'array-move';


import SelectedLayer from './SelectedLayer';

const StyledSelectedLayers = styled.div`

`;

// const SortableContainer = sortableContainer(({items, currentZoomLevel}) => {
//     return (
//         <div ref={inputEl}>
//             {items.map((value, index) => (
//                 <SortableElement
//                     key={`item-${value.id}`}
//                     index={index}
//                     value={value}
//                     currentZoomLevel={currentZoomLevel}
//                 />
//             ))}
//         </div>
//     );
// });

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

const SortableElement = sortableElement(({value, currentZoomLevel}) =>
    <SelectedLayer
        layer={value}
        uuid={value.metadataIdentifier}
        currentZoomLevel={currentZoomLevel}
    />
);

const SortableContainer = sortableContainer(({children}) => {
  return <div>{children}</div>;
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

    const sortSelectedBackgroundLayers = (backgroundLayer) => {
        const newSelectedLayers = arrayMoveImmutable(selectedLayers,
            (backgroundLayer.oldIndex + selectedLayers.length) - backgroundMaps.length,
            (backgroundLayer.newIndex + selectedLayers.length) - backgroundMaps.length)
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
            <SortableContainer
                onSortEnd={sortSelectedLayers}
                useDragHandle
                lockAxis={"y"}
            >
                <ul
                    style={{paddingInlineStart: "0px"}}
                >
                    {mapLayers.map((item, i) => (
                        <SortableElement
                            key={item.id+" "+i}
                            value={item}
                            index={i}
                            currentZoomLevel={currentZoomLevel}
                        //collection={index}
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
                    {backgroundMaps.map((item, i) => (
                        <SortableElement
                            key={item.id+" "+i}
                            value={item}
                            index={i}
                            currentZoomLevel={currentZoomLevel}
                        //collection={index}
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
