// SelectedLayer.jsx
import React, { useContext, useEffect, useState } from 'react';
import { faInfoCircle, faTimes, faCaretDown, faCaretUp, faGripLines, faFilter, faEye, faEyeSlash, faLayerGroup, faMap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { ReactReduxContext } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import strings from '../../../../translations';
import { clearLayerMetadata, getLayerMetadata, setLayerMetadata, setZoomTo, setFilteringInfo, setFilters } from '../../../../state/slices/rpcSlice';
import { updateLayers } from '../../../../utils/rpcUtil';
import { theme, isMobile } from '../../../../theme/theme';
import { setMinimizeFilterDialog } from '../../../../state/slices/uiSlice';
import { useAppSelector } from '../../../../state/hooks';

const StyledLayerContainer = styled.li`
    z-index: 9999;
    display: flex;
    margin-bottom: 8px;
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 4px;
    box-shadow: 0px 1px 3px #0000001F;
    list-style: none;
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
    background: linear-gradient(90deg, rgba(0,100,175,0) 0%, ${props => props.theme.colors.secondaryColorPink} 100%);
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
        border: 2px solid ${props => props.theme.colors.secondaryColorPink};
        border-radius: 50%;
        box-sizing: border-box;
        transition: all 0.1s ease-out;
        &:hover{
            background: ${props => props.theme.colors.secondaryColorPink};
        }
    }
`;

const StyledLayerGripControl = styled.div`
    width: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: grab;
    transition: all 0.1s ease-out;
    svg {
        font-size: 17px;
        color: ${props => props.theme.colors.secondaryColorPink};
    };
    &:hover {
        transform: scale(1.05);
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

const StyledFloatingSpan = styled.div`
    float: right;
    margin-left: 6px;
`;

const SelectedLayer = ({ layer, uuid, currentZoomLevel, handleProps = null, filtersEnabled }) => {
  const { store } = useContext(ReactReduxContext);
  const [opacity, setOpacity] = useState(parseInt(layer.opacity));
  const [prevOpacity, setPrevOpacity] = useState(parseInt(layer.opacity));
  const { channel, filters, filteringInfo, allSelectedThemeLayers } = useAppSelector(state => state.rpc);
  const { minimizeFilter } = useAppSelector(state => state.ui);
    const [localfilterenabled, setLocalfilterenabled] = useState(false)

  useEffect(() => setOpacity(parseInt(layer.opacity)), [layer.opacity]);

    useEffect(() => {
        setLocalfilterenabled(filtersEnabled)
    }, [filtersEnabled])
    
  const isFilterable = typeof layer.config?.gfi?.filterFields !== 'undefined' && layer.config?.gfi?.filterFields.length > 0;

  const handleOpenFilteringDialog = (layerArg) => {
        if (filteringInfo.filter(f => f.layer.id === layerArg.id).length === 0) {
            var filterColumnsArray = [];
            layerArg.config?.gfi?.filterFields &&
            layerArg.config?.gfi?.filterFields.forEach((column) => {
              if (column.field && column.type) {
                filterColumnsArray.push({
                  key: column.field,
                  title: column.field,
                  type: column.type,
                  default: column.default || false
                });
              }
            });

            const updateFilter = [...filteringInfo];
            updateFilter.push({
                dialogOpen: true,
                layer: {
                  id: layerArg.id,
                  title: layerArg.name,
                  filterFieldsInfo: layerArg.config?.gfi?.filterFieldsInfo || null,
                  filterColumnsArray: filterColumnsArray
                }
            });
            store.dispatch(setFilteringInfo(updateFilter));
            minimizeFilter && store.dispatch(setMinimizeFilterDialog({minimized: false, layer: layerArg.id}));
        } else {
            minimizeFilter && store.dispatch(setMinimizeFilterDialog({minimized: false, layer: layerArg.id}));
        }
    };

    const handleLayerRemoveSelectedLayer = (channelArg, layerArg) => {
        store.dispatch(setFilters(filters.filter(f => f.layer !== layerArg.id)));
        const updatedFilterInfo = filteringInfo.filter(f => f.layer.id !== layerArg.id);
        store.dispatch(setFilteringInfo(updatedFilterInfo));
        updatedFilterInfo.length === 0 && store.dispatch(setMinimizeFilterDialog({minimized: false}));
        channelArg && channelArg.postRequest('MapModulePlugin.MapLayerUpdateRequest', [layerArg.id, true, { 'CQL_FILTER': null }]);
        channelArg.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerArg.id, false]);
        updateLayers(store, channelArg);
    };

  const handleLayerOpacity = (channelArg, layerArg, value) => {
    channelArg.postRequest('ChangeMapLayerOpacityRequest', [layerArg.id, value]);
    setOpacity(value);
  };

  const handleLayerOpacityToggle = (channelArg, layerArg) => {
        let newOpacity = opacity === 0 ? prevOpacity: 0;
        if(opacity === 0 && prevOpacity) {
            newOpacity = prevOpacity;
        };
        if(opacity === 0 && !prevOpacity) {
            newOpacity = 100;
        }
        setOpacity(newOpacity);
        channelArg.postRequest('ChangeMapLayerOpacityRequest', [layerArg.id, newOpacity]);
        opacity !== 0 ? setPrevOpacity(opacity) : setPrevOpacity(100);
  };

  const handleMetadataSuccess = (data) => {
    if (data) store.dispatch(setLayerMetadata({ data, layer, uuid }));
  };
  const handleMetadataError = () => store.dispatch(clearLayerMetadata());
  const handleLayerMetadata = () => store.dispatch(getLayerMetadata({ layer, layerId: layer.id, handler: handleMetadataSuccess, errorHandler: handleMetadataError }));

  const isCurrentZoomTooFar = layer.minZoomLevel && layer.minZoomLevel !== -1 && currentZoomLevel <= layer.minZoomLevel;
  const isCurrentZoomTooClose = layer.maxZoomLevel && layer.maxZoomLevel !== -1 && currentZoomLevel >= layer.maxZoomLevel;
    let layerInfoText = strings.layerlist.selectedLayers.layerVisible;
    if (isCurrentZoomTooFar) {
        layerInfoText = strings.layerlist.selectedLayers.zoomInToShowLayer;
    } else if (isCurrentZoomTooClose) {
        layerInfoText = strings.layerlist.selectedLayers.zoomOutToShowLayer;
    }

  const isLayerSelectedThemeLayer = allSelectedThemeLayers.find(themeLayer => themeLayer === layer.id);

  return (
    <StyledLayerContainer>
      <StyledLayerContent>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{display:'flex', alignItems:'center'}}>
            <div style={{marginRight: 8}}>
              {/* Apply drag handle props to the grip if available */}
              <StyledLayerGripControl
                {...(handleProps ? { ...handleProps } : {})}
                aria-label={strings.accessibility.reorderLayer}
                title={strings.accessibility.reorderLayer}
              >
                <FontAwesomeIcon icon={faCaretUp} style={{fontSize:'14px', marginBottom:'-4px'}} />
                <FontAwesomeIcon icon={faGripLines} style={{fontSize:'16px'}} />
                <FontAwesomeIcon icon={faCaretDown} style={{fontSize:'14px', marginTop:'-4px'}} />
              </StyledLayerGripControl>
            </div>

            {/* Layer name */}
            <StyledLayerName /* can be kept as StyledLayerName */ style={{display: 'inline-block', maxWidth: 210, margin:0, userSelect: 'none', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontSize:14, color: isLayerSelectedThemeLayer ? theme.colors.secondaryColorGreen : theme.colors.mainColor1}}>
              <FontAwesomeIcon style={{marginRight:'4px', color: isLayerSelectedThemeLayer ? theme.colors.secondaryColorGreen : theme.colors.mainColor1}} icon={isLayerSelectedThemeLayer ? faMap : faLayerGroup} />
                            {layer.name} {localfilterenabled} {filtersEnabled} {localfilterenabled}
            </StyledLayerName>
                        { localfilterenabled && 
                            (
                                <StyledIconWrapper>
                                    <StyledFloatingSpan><FontAwesomeIcon icon={faFilter}  style={{ color: theme.colors.secondaryColorPurple }}/></StyledFloatingSpan>
                                </StyledIconWrapper>
                            )
                        }  
          </div>

          <StyledIconsWrapper style={{display:'flex', alignItems:'center'}}>
            { uuid &&
              <StyledIconWrapper aria-label={strings.accessibility.layerInfo} className="swiper-no-swiping" onClick={handleLayerMetadata}>
                <FontAwesomeIcon icon={faInfoCircle} />
              </StyledIconWrapper>
            }
            <StyledIconWrapper aria-label={strings.accessibility.closeLayer} className="swiper-no-swiping" onClick={() => handleLayerRemoveSelectedLayer(channel, layer)}>
              <FontAwesomeIcon icon={faTimes} />
            </StyledIconWrapper>
          </StyledIconsWrapper>
        </div>

        {/* mid content */}
        <StyledMidContent>
          {isCurrentZoomTooFar || isCurrentZoomTooClose ? (
            <StyledLayerInfoContainer>
              <StyledShowLayerButton onClick={() => isCurrentZoomTooFar ? store.dispatch(setZoomTo(layer.minZoomLevel + 1)) : store.dispatch(setZoomTo(layer.maxZoomLevel - 1))}>
                {isCurrentZoomTooFar ? strings.tooltips.zoomIn : isCurrentZoomTooClose && strings.tooltips.zoomOut}
              </StyledShowLayerButton>
              <p>{strings.layerlist.selectedLayers.toShowLayer}</p>
            </StyledLayerInfoContainer>
          ) : (
            layerInfoText
          )}
        </StyledMidContent>

        {/* bottom content */}
        <StyledBottomContent style={{display:'flex', alignItems:'center'}}>
          <p style={{margin:0, color: theme.colors.mainColor1, fontSize: 12}}>{strings.layerlist.selectedLayers.opacity}</p>

          <StyledlayerOpacityControl
            aria-label={strings.accessibility.opacitySlider}
            className="swiper-no-swiping"
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={event => handleLayerOpacity(channel, layer, parseInt(event.target.value))}
            style={{marginLeft: 8}}
          />

          <StyledToggleOpacityIconWrapper onClick={() => handleLayerOpacityToggle(channel, layer)} style={{marginLeft: 10, cursor: 'pointer'}}>
            <FontAwesomeIcon icon={opacity > 0 ? faEye : faEyeSlash} />
          </StyledToggleOpacityIconWrapper>

          { isFilterable && (
            <>
              <ReactTooltip backgroundColor={theme.colors.mainColor1} textColor={theme.colors.mainWhite} disable={isMobile} id={`filter-${layer.id}`} place="top" type="dark" effect="float">
                <span>{strings.tooltips.layerlist.filter}</span>
              </ReactTooltip>
              <StyledIconWrapper aria-label={strings.accessibility.openFiltering} onClick={() => handleOpenFilteringDialog(layer)} data-tip data-for={`filter-${layer.id}`} style={{marginLeft: 8}}>
                <StyledFloatingSpan style={{float:'right', marginLeft: 6}}>
                  <FontAwesomeIcon icon={faFilter} style={{ color: filters.filter(f => f.layer === layer.id).length > 0 ? theme.colors.secondaryColorPink : theme.colors.primaryColor1 }}/>
                </StyledFloatingSpan>
              </StyledIconWrapper>
            </>
          )}
        </StyledBottomContent>
      </StyledLayerContent>
    </StyledLayerContainer>
  );
};

export default SelectedLayer;
