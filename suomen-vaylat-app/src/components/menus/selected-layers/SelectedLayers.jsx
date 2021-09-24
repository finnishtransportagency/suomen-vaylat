import React, { useState, useContext } from "react";
import styled from 'styled-components';
import { setAllLayers, setSelectedLayersOrder} from '../../../state/slices/rpcSlice';
import strings from '../../../translations';
import { ReactReduxContext, useSelector } from 'react-redux';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import {arrayMoveImmutable} from 'array-move';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faTrash } from '@fortawesome/free-solid-svg-icons';

import SelectedLayer from './SelectedLayer';
import SelectedLayersCount from './SelectedLayersCount';

const StyledSelectedLayers = styled.div`
    background-color: ${props => props.theme.colors.mainWhite};
    margin-bottom: 5px;
`;

const StyledMasterGroupName = styled.p`
    transition: all 0.1s ease-in;
    font-size: 14px;
    font-weight: 400;
    margin: 0;
    padding-left: 10px;
    color: ${props => props.theme.colors.maincolor1};
`;

const StyledMasterGroupHeader = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    border-radius: 2px;
    transition: all 0.1s ease-in;
    color: ${props => props.theme.colors.black};
    background-color: ${props => props.theme.colors.mainWhite};
`;

const StyledLeftContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledExpandButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    border: none;
    background-color: transparent;
    margin-right: 10px;
    svg {
        font-size: 30px;
        transition: all 0.5s ease-out;
        color: ${props => props.theme.colors.black};
    };
`;

const StyledLayerGroupContainer = styled.div`
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 2px;
    height: ${props => props.isOpen ? "auto" : "0px"};
    overflow: hidden;
    //padding: ${props => props.isOpen && "15px 10px 15px 5px"};
`;

const StyledLayerGroup = styled.ul`
    margin-bottom: 0px;
    padding-inline-start: 5px;
    list-style-type: none;
`;

const StyledDeleteAllSelectedLayers = styled.div`
    cursor: pointer;
    width: 250px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.colors.maincolor1};
    color: ${props => props.theme.colors.mainWhite};
    border-radius: 15px;
    margin: 20px auto 20px auto;
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
    />);


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
    const [isOpen, setIsOpen] = useState(false);

    const onSortEnd = (oldIndex) => {
        channel.reorderLayers([selectedLayers[oldIndex.oldIndex].id, oldIndex.newIndex], function () {});
        store.dispatch(setSelectedLayersOrder(arrayMoveImmutable(
            selectedLayers,
            oldIndex.oldIndex,
            oldIndex.newIndex)
        ))
    };

    const handleRemoveAllSelectedLayers = () => {
        selectedLayers.forEach(layer => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        });
        channel.getAllLayers(function (data) {
            store.dispatch(setAllLayers(data));
        });
    };

    return (
        <StyledSelectedLayers>
            <StyledMasterGroupHeader
                onClick={() => setIsOpen(!isOpen)}
            >
                <StyledLeftContent>
                    <StyledMasterGroupName>{label}</StyledMasterGroupName>
                    <SelectedLayersCount count={selectedLayers.length}/>
                </StyledLeftContent>
                <StyledExpandButton>
                    <FontAwesomeIcon
                        icon={faAngleUp}
                        style={{
                            transform: isOpen && "rotate(180deg)"
                        }}
                    />
                </StyledExpandButton>
            </StyledMasterGroupHeader>
            <StyledLayerGroupContainer
                isOpen={isOpen}
            >
                <StyledLayerGroup>
                    <SortableList
                        items={selectedLayers}
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