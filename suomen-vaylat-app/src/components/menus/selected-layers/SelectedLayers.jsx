import { useContext } from "react";
import styled from 'styled-components';
import { setSelectedLayers } from '../../../state/slices/rpcSlice';
import { setIsSwipingDisabled } from '../../../state/slices/uiSlice';
import strings from '../../../translations';
import { updateLayers } from "../../../utils/rpcUtil";
import { ReactReduxContext, useSelector } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import {arrayMoveImmutable} from 'array-move';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import SelectedLayer from './SelectedLayer';


const StyledSelectedLayers = styled.div`
    background-color: ${props => props.theme.colors.mainWhite};
    margin-bottom: 5px;
`;

const StyledLayerGroupContainer = styled.div`
    overflow: hidden;
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 2px;
`;

const StyledLayerGroup = styled.ul`
    list-style-type: none;
    margin-bottom: 0px;
    padding-inline-start: 5px;
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
    svg {
        font-size: 16px;
    };
    p {
        padding-left: 10px;
        margin: 0;
        font-size: 15px;
    }
`;

const SortableItem = SortableElement(({value, suomenVaylatLayers}) =>
    <SelectedLayer
        key={value.id + 'selected'}
        layer={value}
        uuid={suomenVaylatLayers && suomenVaylatLayers.length > 0 ? suomenVaylatLayers.filter(l => l.id === value.id)[0].uuid : ''}
    />
);

const SortableList = SortableContainer(({items, suomenVaylatLayers}) => {
    return (
        <div>
            {items.map((value, index) => (
                <SortableItem
                    key={`item-${value.id}`}
                    index={index}
                    value={value}
                    suomenVaylatLayers={suomenVaylatLayers}/>
            ))}
        </div>
    );
});

export const SelectedLayers = ({ label, selectedLayers, suomenVaylatLayers }) => {
    const { store } = useContext(ReactReduxContext);

    const channel = useSelector(state => state.rpc.channel);

    const onSortEnd = (oldIndex) => {
        store.dispatch(setIsSwipingDisabled(false))
        channel.reorderLayers([selectedLayers[oldIndex.oldIndex].id, selectedLayers.length - oldIndex.newIndex], function () {});
        const newSelectedLayers = arrayMoveImmutable(selectedLayers, oldIndex.oldIndex, oldIndex.newIndex)
        store.dispatch(setSelectedLayers(newSelectedLayers))
    };

    const handleRemoveAllSelectedLayers = () => {
        selectedLayers.forEach(layer => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        });
        updateLayers(store, channel);
    };

    return (
        <StyledSelectedLayers>
            <StyledLayerGroupContainer
            >
                <StyledLayerGroup>
                    <SortableList
                        lockAxis={"y"}
                        transitionDuration={0}
                        items={selectedLayers}
                        onSortStart={() => store.dispatch(setIsSwipingDisabled(true))}
                        onSortEnd={onSortEnd}
                        suomenVaylatLayers={suomenVaylatLayers}
                    />
                    <StyledDeleteAllSelectedLayers
                        onClick={() => handleRemoveAllSelectedLayers()}
                    >
                        <FontAwesomeIcon
                                icon={faTrash}
                        />
                        <p>{strings.layerlist.layerlistLabels.removeAllSelectedLayers}</p>
                    </StyledDeleteAllSelectedLayers>
                </StyledLayerGroup>
            </StyledLayerGroupContainer>
        </StyledSelectedLayers>
    );
};

export default SelectedLayers;
