import { useState, useContext } from "react";
import styled from 'styled-components';
import { setAllLayers, setSelectedLayers } from '../../../state/slices/rpcSlice';
import { setIsSwipingDisabled } from '../../../state/slices/uiSlice';
import strings from '../../../translations';
import { updateLayers } from "../../../utils/rpcUtil";
import { ReactReduxContext, useSelector } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import {arrayMoveImmutable} from 'array-move';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faTrash } from '@fortawesome/free-solid-svg-icons';

import SelectedLayer from './SelectedLayer';
import SelectedLayersCount from './SelectedLayersCount';


const StyledSelectedLayers = styled.div`
    background-color: ${props => props.theme.colors.mainWhite};
    margin-bottom: 5px;
`;

const StyledMasterGroupName = styled.p`
    color: ${props => props.theme.colors.mainColor1};
    margin: 0;
    padding-left: 10px;
    font-size: 14px;
    font-weight: 400;
    transition: all 0.1s ease-in;
`;

const StyledMasterGroupHeader = styled.div`
    position: sticky;
    top: 0px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    color: ${props => props.theme.colors.black};
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 2px;
    transition: all 0.1s ease-in;
`;

const StyledLeftContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledExpandButton = styled.button`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    margin-right: 10px;
    border: none;
    svg {
        color: ${props => props.theme.colors.black};
        font-size: 30px;
        transition: all 0.5s ease-out;
    };
`;

const StyledLayerGroupContainer = styled.div`
    //height: ${props => props.isOpen ? "auto" : "0px"};
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
            {/* <StyledMasterGroupHeader
                onClick={() => setIsOpen(!isOpen)}
            >
                <StyledLeftContent>
                    <StyledMasterGroupName>{label}</StyledMasterGroupName>
                    <SelectedLayersCount count={selectedLayers.length}/>
                </StyledLeftContent>
                <StyledExpandButton>
                    <FontAwesomeIcon
                        icon={faAngleDown}
                        style={{
                            transform: isOpen && "rotate(180deg)"
                        }}
                    />
                </StyledExpandButton>
            </StyledMasterGroupHeader> */}
            <StyledLayerGroupContainer
                //isOpen={isOpen}
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
