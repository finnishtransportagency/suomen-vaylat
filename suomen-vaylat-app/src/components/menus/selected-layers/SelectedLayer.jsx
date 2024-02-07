import { useEffect, useState, useContext, useCallback } from 'react';
import { faInfoCircle, faTimes, faCaretDown, faCaretUp, faGripLines, faEye, faEyeSlash, faLayerGroup, faMap, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext, useSelector } from 'react-redux';
import styled from 'styled-components';
import { clearLayerMetadata, getLayerMetadata, setLayerMetadata, setZoomTo, setFilteringInfo, setFilters } from '../../../state/slices/rpcSlice';
import { updateLayers } from '../../../utils/rpcUtil';
import { sortableHandle } from 'react-sortable-hoc';
import ReactTooltip from "react-tooltip";
import {
   setMinimizeFilterModal
  } from "../../../state/slices/uiSlice";

import strings from '../../../translations';
import { useAppSelector } from '../../../state/hooks';
import { theme, isMobile } from '../../../theme/theme';

const StyledLayerContainer = styled.li`
    z-index: 9999;
    display: flex;
    margin-bottom: 8px;
    background-color: #F5F5F5;
    box-shadow: 0px 1px 3px #0000001F;
`;

const StyledLayerContent = styled.div`
    position: relative;
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const StyledlayerHeader = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-items: center;
`;

const StyledMidContent = styled.div`
    font-size: 12px;
`;

const StyledLayerName = styled.p`
    display: inline-block;
    max-width: 210px;
    margin: 0;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    color: ${props => props.theme.colors.mainColor1};
`;

const StyledBottomContent = styled.div`
    display: flex;
    align-items: center;
    p {
        margin: 0;
        color: ${props => props.theme.colors.mainColor1};
        font-size: 12px;
    }
`;

const StyledlayerOpacityControl = styled.input`
    width: 104px;
    height: 8px;
    user-select: auto;
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    background: linear-gradient(90deg, rgba(0,100,175,0) 0%, ${props => props.theme.colors.secondaryColor8} 100%);
    margin-left: 8px;
    border-radius: 5px;
    -webkit-transition: .2s;
    transition: opacity .2s;
    ::-webkit-slider-thumb {
        width: 16px;
        height: 16px;
        -webkit-appearance: none;
        appearance: none;
        cursor: pointer;
        background: ${props => props.theme.colors.mainWhite};
        border: 2px solid ${props => props.theme.colors.secondaryColor8};
        border-radius: 50%;
        box-sizing: border-box;
        transition: all 0.1s ease-out;
        &:hover{
            background: ${props => props.theme.colors.secondaryColor8};
        }
    }
`;

const StyledLayerGripControl = styled.div`
    width: 100%;
    max-width: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.1s ease-out;
    svg {
        font-size: 17px;
        color: ${props => props.theme.colors.secondaryColor8};
    };
    &:hover {
        transform: scale(1.1);
        svg {
            filter: drop-shadow(0px 1px 2px #00000026);
        }
    };
`;

const StyledIconsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    padding: 8px 0px;
`;

const StyledIconWrapper = styled.button`
    border: none;
    background: none;
    cursor: pointer;
    svg {
        color: ${props => props.theme.colors.mainColor1};
        font-size: 18px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.mainColor2};
        }
    }
`;

const StyledToggleOpacityIconWrapper = styled.div`
    cursor: pointer;
    margin-left: 10px;
    svg {
        color: ${props => props.theme.colors.mainColor1};
        transition: all 0.1s ease-out;
    };
    svg:hover {
        color: ${props => props.theme.colors.mainColor2};
    }
    `;

const StyledLayerInfoContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 18px;
`;

const StyledShowLayerButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    margin-right: 3px;
    color: #069;
    text-decoration: underline;
    cursor: pointer;
    display: flex;
    height: 10px;
    font:inherit;
`;

const DragHandle = sortableHandle(() => (
    <StyledLayerGripControl className="swiper-no-swiping">
        <FontAwesomeIcon
            icon={faCaretUp}
            style={{
                fontSize: '14px',
                marginBottom: '-4px'
            }}
        />
        <FontAwesomeIcon
            icon={faGripLines}
            style={{
                fontSize: '16px'
            }}
        />
        <FontAwesomeIcon
            icon={faCaretDown}
            style={{
                fontSize: '14px',
                marginTop: '-4px'
            }}
        />
    </StyledLayerGripControl>
));

const StyledFloatingSpan = styled.div`
    float: right;
    margin-left: 6px;
`;

export const SelectedLayer = (
    {
        layer,
        uuid,
        currentZoomLevel,
    }
) => {
    const { store } = useContext(ReactReduxContext);
    const [opacity, setOpacity] = useState(layer.opacity);
    const [prevOpacity, setPrevOpacity] = useState(layer.opacity);
    const [isLayerVisible, setIsLayerVisible] = useState(layer.opacity !== 0);
    const { channel, filters, filteringInfo, allSelectedThemeLayers } = useAppSelector(
        (state) => state.rpc
      );

    const { minimizeFilter } = useAppSelector(state => state.ui);

    const isFilterable = typeof layer.config?.gfi?.filterFields !== "undefined" && layer.config?.gfi?.filterFields.length > 0 ;

    useEffect(() => {
        setOpacity(layer.opacity);
        layer.opacity === 0 ? setIsLayerVisible(false) : setIsLayerVisible(true)
    }, [layer.opacity])

    const handleOpenFilteringModal = (layer) => {
        if (filteringInfo.filter(f => f.layer.id === layer.id).length === 0) {
            var filterColumnsArray = [];
            layer.config?.gfi?.filterFields &&
            layer.config?.gfi?.filterFields.forEach((column) => {
              if (column.field && column.type) {
                filterColumnsArray.push({
                  key: column.field,
                  title: column.field,
                  type: column.type,
                  default: column.default || false
                });
              }
            });
    
            const updateFilter = [...filteringInfo]
            updateFilter.push({
                modalOpen: true,
                layer: {
                  id: layer.id,
                  title: layer.name,
                  filterFieldsInfo: layer.config?.gfi?.filterFieldsInfo || null,
                  filterColumnsArray: filterColumnsArray
                }
            }
            )
            store.dispatch(setFilteringInfo(updateFilter));
            minimizeFilter && store.dispatch(setMinimizeFilterModal({minimized: false, layer: layer.id}))
        } else {
            minimizeFilter && store.dispatch(setMinimizeFilterModal({minimized: false, layer: layer.id}))
        }
    };
    
    const handleLayerRemoveSelectedLayer = (channel, layer) => {
        // Remove possible filters
        store.dispatch(setFilters(filters.filter(f => f.layer !== layer.id)));
        const updatedFilterInfo = filteringInfo.filter(f => f.layer.id !== layer.id);
        store.dispatch(setFilteringInfo(updatedFilterInfo));
        updatedFilterInfo.length === 0 && store.dispatch(setMinimizeFilterModal({minimized: false}));
        channel && channel.postRequest(
            'MapModulePlugin.MapLayerUpdateRequest',
            [layer.id, true, { 'CQL_FILTER': null }]
            );

        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, false]);
        updateLayers(store, channel);
    };

    const handleLayerOpacity = (channel, layer, value) => {
        parseInt(value) === 0 ? setIsLayerVisible(false) : setIsLayerVisible(true);
        channel.postRequest('ChangeMapLayerOpacityRequest', [layer.id, value]);
        setOpacity(value);
    };

    const handleLayerOpacityToggle = (channel, layer) => {
        setIsLayerVisible(!isLayerVisible);
        let newOpacity = opacity === 0 ? prevOpacity: 0;
        if(opacity === 0 && prevOpacity) {
            newOpacity = prevOpacity;
        };
        if(opacity === 0 && !prevOpacity) {
            newOpacity = 100
        }
        setOpacity(newOpacity);
        channel.postRequest('ChangeMapLayerOpacityRequest', [layer.id, newOpacity]);
        opacity !== 0 ? setPrevOpacity(layer.opacity) : setPrevOpacity(100);
        updateLayers(store, channel);
    };

    const handleMetadataSuccess = (data, layer, uuid) => {
        if (data) {
            store.dispatch(setLayerMetadata({ data: data, layer: layer, uuid: uuid }));
        }
    };
    const handleMetadataError = () => {
        store.dispatch(clearLayerMetadata());
    };

    const handleLayerMetadata = (layer, uuid) => {
        store.dispatch(getLayerMetadata({ layer: layer, uuid: uuid, handler: handleMetadataSuccess, errorHandler: handleMetadataError }));
    };

    const isCurrentZoomTooFar = layer.maxZoomLevel && layer.minZoomLevel && currentZoomLevel <  layer.minZoomLevel;
    const isCurrentZoomTooClose = layer.maxZoomLevel && layer.minZoomLevel && currentZoomLevel >  layer.maxZoomLevel

    let layerInfoText = strings.layerlist.selectedLayers.layerVisible;
    if (isCurrentZoomTooFar) {
        layerInfoText = strings.layerlist.selectedLayers.zoomInToShowLayer;
    } else if (isCurrentZoomTooClose) {
        layerInfoText = strings.layerlist.selectedLayers.zoomOutToShowLayer;
    }

    const isLayerSelectedThemeLayer = allSelectedThemeLayers.find(themeLayer => themeLayer === layer.id);
    return (
            <StyledLayerContainer>
                <DragHandle />
                <StyledLayerContent>
                    <StyledlayerHeader>
                        <StyledLayerName style={{color: isLayerSelectedThemeLayer ? theme.colors.secondaryColor2 : theme.colors.mainColor1}}>
                        <FontAwesomeIcon style={{marginRight: '4px', color: isLayerSelectedThemeLayer ? theme.colors.secondaryColor2 : theme.colors.mainColor1 }} icon={isLayerSelectedThemeLayer ? faMap : faLayerGroup} />
                            {layer.name}
                        </StyledLayerName>

                        <StyledIconsWrapper>
                { uuid &&
                    <StyledIconWrapper
                        className="swiper-no-swiping"
                        uuid={uuid}
                        onClick={() => {
                            handleLayerMetadata(layer, uuid);
                        }}
                    >
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </StyledIconWrapper>
                }
                    <StyledIconWrapper
                        className="swiper-no-swiping"
                        onClick={() => {
                            handleLayerRemoveSelectedLayer(channel, layer);
                        }}>
                        <FontAwesomeIcon
                            icon={faTimes}
                        />
                    </StyledIconWrapper>
                </StyledIconsWrapper>


                    </StyledlayerHeader>
                    <StyledMidContent>
                
                        {isCurrentZoomTooFar || isCurrentZoomTooClose ? <StyledLayerInfoContainer>
                            <StyledShowLayerButton onClick={() => store.dispatch(setZoomTo(layer.minZoomLevel))}>
                                {isCurrentZoomTooFar? strings.tooltips.zoomIn : isCurrentZoomTooClose && strings.tooltips.zoomOut}
                            </StyledShowLayerButton> <p>{strings.layerlist.selectedLayers.toShowLayer}</p>
                        </StyledLayerInfoContainer>
                        : layerInfoText }
                    </StyledMidContent>
                    <StyledBottomContent>
                        <p>{strings.layerlist.selectedLayers.opacity}</p>
                        <StyledlayerOpacityControl
                            className="swiper-no-swiping"
                            type="range"
                            min="0"
                            max="100"
                            value={opacity}
                            onChange={event => handleLayerOpacity(channel, layer, event.target.value)}
                            onMouseUp={() => updateLayers(store, channel)}
                            onTouchEnd={() => updateLayers(store, channel)}
                        />
                        <StyledToggleOpacityIconWrapper onClick={() => handleLayerOpacityToggle(channel, layer)}>
                            <FontAwesomeIcon icon={isLayerVisible? faEye : faEyeSlash} />
                        </StyledToggleOpacityIconWrapper>

                        { isFilterable &&
                            <>
                            <ReactTooltip
                                backgroundColor={theme.colors.mainColor1}
                                textColor={theme.colors.mainWhite}
                                disable={isMobile}
                                id="filter"
                                place="top"
                                type="dark"
                                effect="float"
                            >
                                <span>{strings.tooltips.layerlist.filter}</span>
                            </ReactTooltip>
                            <StyledIconWrapper
                                onClick={() => {
                                    handleOpenFilteringModal(layer);
                                }}
                                data-tip
                                data-for={"filter"}
                            >
                                <StyledFloatingSpan><FontAwesomeIcon icon={faFilter}  style={{ color: filters.filter(f => f.layer === layer.id).length > 0 ? theme.colors.secondaryColor8 : theme.colors.primaryColor1 }}/></StyledFloatingSpan>
                            </StyledIconWrapper> 
                            </>
                        }
                    </StyledBottomContent>
                </StyledLayerContent>
            </StyledLayerContainer>
    );
};

export default SelectedLayer;