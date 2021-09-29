import { useState, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import LayerGroup from './LayerGroup';
import { useAppSelector } from '../../../state/hooks';
import { ReactReduxContext, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import Checkbox from '../../checkbox/Checkbox';
import Layers from './Layers';
import { updateLayers } from '../../../utils/rpcUtil';

const StyledLayerList = styled.div`

`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const StyledLayerGroups = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    opacity: 0;
    animation-delay: ${props => props.index * 0.025 + 's'};
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    animation-duration: 0.5s;
    animation-name: ${fadeIn};
    margin: ${props => props.parentId === -1 && "10px 0px 10px 0px"};
    border-radius: 2px;
    background-color: ${props => props.theme.colors.mainWhite};
    &:last-child {
        ${props => props.parentId === -1 ? '1px solid '+props.theme.colors.maincolor2 : "none"};
    };
    margin-bottom: 10px;
`;

const StyledMasterGroupName = styled.p`
    user-select: none;
    transition: all 0.1s ease-in;
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    padding-left: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    color: ${props => props.theme.colors.black};
    @media ${ props => props.theme.device.mobileL} {
        font-size: 13px;
    };
`;

const StyledMasterGroupHeader = styled.div`
    z-index: 1;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding-left: 5px;
    transition: all 0.1s ease-in;
    border-radius: 2px;
    background-color: ${props => props.theme.colors.maincolor3};
    &:hover {
        background-color: ${props => props.theme.colors.maincolor2};
    };
    &:hover ${StyledMasterGroupName} {
        color: ${props => props.theme.colors.mainWhite};
    };
`;

const StyledRightContent = styled.div`
    display: flex;
    align-items: center;

`;

const StyledSelectButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    border: none;
    background-color: transparent;
    margin-right: 10px;
    svg {
        font-size: 23px;
        transition: all 0.5s ease-out;
        color: ${props => props.theme.colors.black};
    };
`;

const StyledLayerGroupContainer = styled.div`
    height: ${props => props.isOpen ? "auto" : "0px"};
    overflow: hidden;
`;

const StyledLayerGroup = styled.ul`
    padding-inline-start: ${props => props.parentId === -1 ? "10px" : "15px"};
    list-style-type: none;
    margin: 0;
`;

export const LayerList = ({ groups, layers, recurse = false}) => {
  const tagLayers = useAppSelector((state) => state.rpc.tagLayers);
  const tags = useSelector(state => state.rpc.tags);
    if (tagLayers.length > 0) {
        layers = layers.filter(layer => tagLayers.includes(layer.id));
    }
    return (
        <>
            {tagLayers.length > 0 ?
                <StyledLayerList>
                    {
                        tags.map((tag, index) => {
                            return (
                                <TagLayerList tag={tag} layers={layers} index={index} />
                            );
                        })
                    }
                </StyledLayerList>
                :
                <StyledLayerList>
                    {groups.map((group, index) => {
                        var hasChildren = false;
                        if (group.groups) {
                            hasChildren = group.groups.length > 0;
                        }
                        let isVisible = (group.layers && group.layers.length > 0) || hasChildren;
                        return (
                            <>
                                { isVisible ? (
                                    <LayerGroup
                                        key={group.id}
                                        index={index}
                                        group={group}
                                        layers={layers}
                                        hasChildren={hasChildren}
                                    />) : null}
                            </>
                        );
                    })
                    }
                </StyledLayerList>
            }

        </>
    );
  };

  const TagLayerList = ({tag, layers, index}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel);
    const tagsWithLayers = useSelector(state => state.rpc.tagsWithLayers);
    const tagLayers = tagsWithLayers[tag];
    let checked;
    let indeterminate;
    let visibleLayers = [];
    var filteredLayers = [];

    if (tagLayers) {
        tagLayers.forEach((tagLayerId) => {
            var layer = layers.find(layer => layer.id === tagLayerId);
            layer !== undefined && filteredLayers.push(layer);
        });
    };

    filteredLayers.map(layer => {
        layer.visible === true && visibleLayers.push(layer);
        return null;
    });

    if (filteredLayers.length === visibleLayers.length && visibleLayers.length > 0) {
        checked = true;
    } else if (visibleLayers.length > 0 ) {
        indeterminate = true;
    } else {
        checked = false;
        indeterminate = false;
    }

    const selectTag = (e) => {
        e.stopPropagation();
        if (!indeterminate) {
            filteredLayers.map(layer => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
                return null;
            });
        } else {
            filteredLayers.map(layer => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, false]);
                return null;
            });
        }
        updateLayers(store, channel);
    }

    return (
            <StyledLayerGroups index={index}>
                <StyledMasterGroupHeader
                    key={"smgh_" + index + '_'}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <StyledMasterGroupName>{tag.charAt(0).toUpperCase() + tag.slice(1)}</StyledMasterGroupName>
                    <StyledRightContent>
                        <Checkbox
                                isChecked={checked}
                                handleClick={selectTag}
                        />
                        <StyledSelectButton
                            isOpen={isOpen}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <FontAwesomeIcon
                                icon={faAngleDown}
                                style={{
                                    transform: isOpen && "rotate(180deg)"
                                }}
                            />
                        </StyledSelectButton>
                    </StyledRightContent>
                </StyledMasterGroupHeader>

                <StyledLayerGroupContainer
                    key={"slg_" + index + "_"}
                    isOpen={isOpen}
                >
                    <StyledLayerGroup>
                        <Layers layers={filteredLayers} isOpen={isOpen}/>
                    </StyledLayerGroup>
                </StyledLayerGroupContainer>
            </StyledLayerGroups>
    );
  };

  export default LayerList;