import { useContext, useEffect, useState } from "react";
import styled from 'styled-components';
import { setSelectedLayers } from '../../../state/slices/rpcSlice';
import strings from '../../../translations';
import { updateLayers, resetThemeGroups, reArrangeRPCLayerOrder } from '../../../utils/rpcUtil';
import { ReactReduxContext, useSelector } from 'react-redux';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import {arrayMoveImmutable} from 'array-move';
import SelectedLayer from './SelectedLayer';

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

const SortableElement = sortableElement(({value, currentZoomLevel}) =>
    <SelectedLayer
        layer={value}
        uuid={value.metadataIdentifier}
        currentZoomLevel={currentZoomLevel}
        opacityZero={value.opacity === 0}
    />
);

const SortableContainer = sortableContainer(({children}) => {
  return <div>{children}</div>;
});


export const SelectedLayers = ({ selectedLayers, currentZoomLevel }) => {

    const { store } = useContext(ReactReduxContext);

    const {channel, allGroups} = useSelector(state => state.rpc);

    const [backgroundMaps, setBackgroundMaps] = useState([]);

    const getBackgroundMaps = (group) => {
        if(group?.groups) {
            group.groups.forEach(group => {
                getBackgroundMaps(group);
            });
        }
        if(group?.layers) {
            group.layers.forEach(layer => {
                selectedLayers.forEach(selectedLayer => {
                    if(selectedLayer.id === layer) {
                        if(backgroundMaps.length > 0) {
                            let layerIsDuplicate = backgroundMaps.find(map => map.id === layer);
                            !layerIsDuplicate && setBackgroundMaps(backgroundMaps => [...backgroundMaps, selectedLayer]);
                        }
                        else {
                            setBackgroundMaps(backgroundMaps => [...backgroundMaps, selectedLayer]);
                        }
                    }
                })
            });
        }
        else return;
    };

    useEffect(() => {
        backgroundMaps && backgroundMaps.forEach(map => {
            const isSelected = selectedLayers.find(sl => map.id === sl.id);
            !isSelected && setBackgroundMaps(backgroundMaps => backgroundMaps.filter(b => b.id !== map.id));
        });
        getBackgroundMaps(allGroups.find(group => group.id === 1));
    }, [selectedLayers]);


    const mapLayers = selectedLayers.filter(layer => {
        return !backgroundMaps.find(bm => bm.id === layer.id);
    });


/*
    const backgroundMaps = selectedLayers.filter(layer => {
        return layer.groups && layer.groups.includes(1);
        
    }); */

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
        setBackgroundMaps([]);
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
                    {mapLayers.map((item, index) => (
                        <SortableElement
                            key={'maplayer-' + item.id}
                            value={item}
                            index={index}
                            currentZoomLevel={currentZoomLevel}
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
                    {console.log("backgroundMaps kun mapataan : ", backgroundMaps)}
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
