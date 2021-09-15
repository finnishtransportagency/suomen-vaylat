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
import { setAllLayers } from '../../../state/slices/rpcSlice';
import Layers from './Layers';

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
padding-left: 10px;
animation-delay: ${props => props.index * 0.025 + 's'};
animation-timing-function: ease-in-out;
animation-fill-mode: forwards;
animation-duration: 0.5s;
animation-name: ${fadeIn};
&:last-child {
    ${props => props.parentId === -1 ? '1px solid '+props.theme.colors.maincolor2 : "none"};
}
`;

const StyledGroupHeader = styled.div`
cursor: pointer;
display: flex;
align-items: center;
height: 40px;
`;

const StyledGroupName = styled.p`
user-select: none;
margin: 0;
font-size: 13px;
font-weight: 600;
padding-left: 0px;
color: ${props => props.theme.colors.mainWhite};
max-width: 260px;
@media ${ props => props.theme.device.mobileL} {
    font-size: 12px;
};
`;

const StyledGroupSelectButton = styled.div`
cursor: pointer;
align-items: center;
margin-right: 5px;
svg {
    transition: all 0.5s ease-out;
    color: ${props => props.theme.colors.mainWhite};
}
`;

const StyledLayerGroupContainer = styled.div`
height: ${props => props.isOpen ? "auto" : "0px"};
overflow: hidden;
`;

const StyledLayerGroup = styled.ul`
list-style-type: none;
`;

export const LayerList = ({ groups, layers, recurse = false}) => {
  const tagLayers = useAppSelector((state) => state.rpc.tagLayers);
  const tags = useSelector(state => state.rpc.tags)

  if (tagLayers.length > 0) {
    layers = layers.filter(layer => tagLayers.includes(layer.id));
  }
    return (
        <>
            {tagLayers.length > 0 ?
                <StyledLayerList>
                    {tags.map((tag, index) => {
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
                        if(group.groups) {
                            hasChildren = group.groups.length > 0;
                        }
                        return (
                            <>
                                { group.layers && (hasChildren || group.layers.length > 0) ? (
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
    const channel = useSelector(state => state.rpc.channel)
    const tagsWithLayers = useSelector(state => state.rpc.tagsWithLayers)
    const tagLayers = tagsWithLayers[tag];
    console.log(layers);
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
        channel.getAllLayers(function (data) {
            store.dispatch(setAllLayers(data));
        });
    }

    return (
                <StyledLayerGroups index={index}>
                    <StyledGroupHeader
                        key={"smgh_" + index + '_'}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <StyledGroupSelectButton
                            isOpen={isOpen}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <FontAwesomeIcon
                                icon={faAngleDown}
                                style={{
                                    transform: isOpen && "rotate(180deg)"
                                }}
                            />
                        </StyledGroupSelectButton>
                        <Checkbox
                            isChecked={checked}
                            handleClick={selectTag}
                            size={16}
                        />
                        <StyledGroupName>{tag}</StyledGroupName>
                    </StyledGroupHeader>
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