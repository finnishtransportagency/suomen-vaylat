// SelectedLayer.jsx
import React, { useContext, useEffect, useState } from 'react';
import {
  faInfoCircle,
  faTimes,
  faCaretDown,
  faCaretUp,
  faGripLines,
  faFilter,
  faEye,
  faEyeSlash,
  faLayerGroup,
  faMap
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { ReactReduxContext } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import strings from '../../../../translations';
import {
  clearLayerMetadata,
  getLayerMetadata,
  setLayerMetadata,
  setZoomTo,
  setFilteringInfo,
  setFilters
} from '../../../../state/slices/rpcSlice';
import { updateLayers } from '../../../../utils/rpcUtil';
import { theme, isMobile } from '../../../../theme/theme';
import { setMinimizeFilterDialog } from '../../../../state/slices/uiSlice';
import { useAppSelector } from '../../../../state/hooks';

const StyledLayerContainer = styled.div`
  z-index: 9999;
  display: flex;
  margin-bottom: 8px;
  background-color: ${(props) => props.theme.colors.mainWhite};
  box-shadow: 0px 1px 3px #0000001f;
  border-radius: 4px;
  user-select: none;
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

const StyledMidContent = styled.div`
  font-size: 12px;
`;

const StyledTitleContent = styled.div`
  width: 100%;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
`;

const StyledLayerName = styled.p`
  display: inline-block;
  max-width: 180px;
  margin: 0;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  color: ${(props) => props.theme.colors.mainColor1};
`;

const StyledBottomContent = styled.div`
  display: flex;
  align-items: center;
  p {
    margin: 0;
    color: ${(props) => props.theme.colors.mainColor1};
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
  background: linear-gradient(
    90deg,
    rgba(0, 100, 175, 0) 0%,
    ${(props) => props.theme.colors.secondaryColorPink} 100%
  );
  margin-left: 8px;
  border-radius: 5px;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
  ::-webkit-slider-thumb {
    width: 16px;
    height: 16px;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
    background: ${(props) => props.theme.colors.mainWhite};
    border: 2px solid ${(props) => props.theme.colors.secondaryColorPink};
    border-radius: 50%;
    box-sizing: border-box;
    transition: all 0.1s ease-out;
    &:hover {
      background: ${(props) => props.theme.colors.secondaryColorPink};
    }
  }
`;

const StyledLayerGripControl = styled.div`
  width: 30px;
  min-width: 40px;
  max-width: 40px;
  flex: 0 0 40px; /* do not grow or shrink */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: grab;
  transition: all 0.1s ease-out;

  svg {
    color: ${(props) => props.theme.colors.secondaryColorPink};
  }
  &:hover {
    transform: scale(1.05);
    svg {
      filter: drop-shadow(0px 1px 2px #00000026);
    }
  }
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
    color: ${(props) => props.theme.colors.mainColor1};
    font-size: 18px;
    transition: all 0.1s ease-out;
  }
  &:hover {
    svg {
      color: ${(props) => props.theme.colors.mainColor2};
    }
  }
`;

const StyledToggleOpacityIconWrapper = styled.div`
  cursor: pointer;
  margin-left: 10px;
  svg {
    color: ${(props) => props.theme.colors.mainColor1};
    transition: all 0.1s ease-out;
  }
  svg:hover {
    color: ${(props) => props.theme.colors.mainColor2};
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
  font: inherit;
`;

const StyledFloatingSpan = styled.div`
  float: right;
  margin-left: 6px;
`;

const StyledOpacityText = styled.p`
  float: right;
  margin-left: 6px;
`;

const SelectedLayer = ({
  layer,
  uuid,
  currentZoomLevel,
  filtersEnabled
}) => {
  const { store } = useContext(ReactReduxContext);
  const [opacity, setOpacity] = useState(parseInt(layer.opacity));
  const [prevOpacity, setPrevOpacity] = useState(parseInt(layer.opacity));
  const { channel, filters, filteringInfo, allSelectedThemeLayers } =
    useAppSelector((state) => state.rpc);
  const { minimizeFilter } = useAppSelector((state) => state.ui);
  const [localfilterenabled, setLocalfilterenabled] = useState(false);

  useEffect(() => setOpacity(parseInt(layer.opacity)), [layer.opacity]);

  useEffect(() => {
    setLocalfilterenabled(filtersEnabled);
  }, [filtersEnabled]);

  const isFilterable =
    typeof layer.config?.gfi?.filterFields !== 'undefined' &&
    layer.config?.gfi?.filterFields.length > 0;

  const handleOpenFilteringDialog = () => {
        if (filteringInfo.filter((f) => f.layer.id === layer.id).length === 0) {
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
    
          const updateFilter = [...filteringInfo];
          updateFilter.push({
            dialogOpen: true,
            layer: {
              id: layer.id,
              title: layer.name,
              filterFieldsInfo: layer.config?.gfi?.filterFieldsInfo || null,
              filterColumnsArray: filterColumnsArray
            }
          });
          store.dispatch(setFilteringInfo(updateFilter));
          minimizeFilter &&
            store.dispatch(
              setMinimizeFilterDialog({ minimized: false, layer: layer.id })
            );
        } else {
          minimizeFilter &&
            store.dispatch(
              setMinimizeFilterDialog({ minimized: false, layer: layer.id })
            );
        }
  };

  const handleLayerRemoveSelectedLayer = (channelArg, layerArg) => {
    store.dispatch(setFilters(filters.filter((f) => f.layer !== layerArg.id)));
    const updatedFilterInfo = filteringInfo.filter(
      (f) => f.layer.id !== layerArg.id
    );
    store.dispatch(setFilteringInfo(updatedFilterInfo));
    updatedFilterInfo.length === 0 &&
      store.dispatch(setMinimizeFilterDialog({ minimized: false }));
    channelArg &&
      channelArg.postRequest('MapModulePlugin.MapLayerUpdateRequest', [
        layerArg.id,
        true,
        { CQL_FILTER: null }
      ]);
    channelArg.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [
      layerArg.id,
      false
    ]);
    updateLayers(store, channelArg);
  };

  const handleLayerOpacity = (channelArg, layerArg, value) => {
    channelArg.postRequest('ChangeMapLayerOpacityRequest', [
      layerArg.id,
      value
    ]);
    setOpacity(value);
  };

  const handleLayerOpacityToggle = (channelArg, layerArg) => {
    let newOpacity = opacity === 0 ? prevOpacity : 0;
    if (opacity === 0 && prevOpacity) {
      newOpacity = prevOpacity;
    }
    if (opacity === 0 && !prevOpacity) {
      newOpacity = 100;
    }
    setOpacity(newOpacity);
    channelArg.postRequest('ChangeMapLayerOpacityRequest', [
      layerArg.id,
      newOpacity
    ]);
    opacity !== 0 ? setPrevOpacity(opacity) : setPrevOpacity(100);
  };

  const handleMetadataSuccess = (data) => {
    if (data) store.dispatch(setLayerMetadata({ data, layer, uuid }));
  };
  const handleMetadataError = () => store.dispatch(clearLayerMetadata());
  const handleLayerMetadata = () =>
    store.dispatch(
      getLayerMetadata({
        layer,
        layerId: layer.id,
        handler: handleMetadataSuccess,
        errorHandler: handleMetadataError
      })
    );

  const isCurrentZoomTooFar =
    layer.minZoomLevel &&
    layer.minZoomLevel !== -1 &&
    currentZoomLevel <= layer.minZoomLevel;
  const isCurrentZoomTooClose =
    layer.maxZoomLevel &&
    layer.maxZoomLevel !== -1 &&
    currentZoomLevel >= layer.maxZoomLevel;
  let layerInfoText = strings.layerlist.selectedLayers.layerVisible;
  if (isCurrentZoomTooFar) {
    layerInfoText = strings.layerlist.selectedLayers.zoomInToShowLayer;
  } else if (isCurrentZoomTooClose) {
    layerInfoText = strings.layerlist.selectedLayers.zoomOutToShowLayer;
  }

  const isLayerSelectedThemeLayer = allSelectedThemeLayers.find(
    (themeLayer) => themeLayer === layer.id
  );

  return (
    <StyledLayerContainer>
      <StyledLayerGripControl
        aria-label={strings.accessibility.reorderLayer}
        title={strings.accessibility.reorderLayer}
      >
        <FontAwesomeIcon
          icon={faCaretUp}
          style={{ fontSize: '14px', marginBottom: '-4px' }}
        />
        <FontAwesomeIcon icon={faGripLines} style={{ fontSize: '16px' }} />
        <FontAwesomeIcon
          icon={faCaretDown}
          style={{ fontSize: '14px', marginTop: '-4px' }}
        />
      </StyledLayerGripControl>
      <StyledLayerContent
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            >
        <StyledTitleContent>
          {/* Layer name */}
          <StyledLayerName>
            <FontAwesomeIcon
              style={{
                marginRight: '4px',
                color: isLayerSelectedThemeLayer
                  ? theme.colors.secondaryColorGreen
                  : theme.colors.mainColor1
              }}
              icon={isLayerSelectedThemeLayer ? faMap : faLayerGroup}
            />
            {layer.name} {localfilterenabled} {filtersEnabled}{' '}
            {localfilterenabled}
          </StyledLayerName>
          {localfilterenabled && (
            <StyledIconWrapper>
              <StyledFloatingSpan>
                <FontAwesomeIcon
                  icon={faFilter}
                  style={{ color: theme.colors.secondaryColorPurple }}
                />
              </StyledFloatingSpan>
            </StyledIconWrapper>
          )}

          <StyledIconsWrapper>
            {uuid && (
              <StyledIconWrapper
                aria-label={strings.accessibility.layerInfo}
                onClick={handleLayerMetadata}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </StyledIconWrapper>
            )}
            <StyledIconWrapper
              aria-label={strings.accessibility.closeLayer}
              onClick={() => handleLayerRemoveSelectedLayer(channel, layer)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </StyledIconWrapper>
          </StyledIconsWrapper>
        </StyledTitleContent>

        {/* mid content */}
        <StyledMidContent>
          {isCurrentZoomTooFar || isCurrentZoomTooClose ? (
            <StyledLayerInfoContainer>
              <StyledShowLayerButton
                onClick={() =>
                  isCurrentZoomTooFar
                    ? store.dispatch(setZoomTo(layer.minZoomLevel + 1))
                    : store.dispatch(setZoomTo(layer.maxZoomLevel - 1))
                }
              >
                {isCurrentZoomTooFar
                  ? strings.tooltips.zoomIn
                  : isCurrentZoomTooClose && strings.tooltips.zoomOut}
              </StyledShowLayerButton>
              <p>{strings.layerlist.selectedLayers.toShowLayer}</p>
            </StyledLayerInfoContainer>
          ) : (
            layerInfoText
          )}
        </StyledMidContent>

        {/* bottom content */}
        <StyledBottomContent>
          <StyledOpacityText>
            {strings.layerlist.selectedLayers.opacity}
          </StyledOpacityText>

          <StyledlayerOpacityControl
            aria-label={strings.accessibility.opacitySlider}
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(event) =>
              handleLayerOpacity(channel, layer, parseInt(event.target.value))
            }
            style={{ marginLeft: 8 }}
          />

          <StyledToggleOpacityIconWrapper
            onClick={() => handleLayerOpacityToggle(channel, layer)}
            aria-label={opacity > 0 ? strings.accessibility.hideLayer : strings.accessibility.showLayer}
          >
            <FontAwesomeIcon icon={opacity > 0 ? faEye : faEyeSlash} />
          </StyledToggleOpacityIconWrapper>

          {isFilterable && (
            <>
              <Tooltip
                style={{backgroundColor: theme.colors.mainColor1}}
                disable={isMobile}
                anchorSelect={`#filter-${layer.id}`}
                id={`filter-${layer.id}_tooltip`}
                place="bottom"
                effect="float"
              >
                <span>{strings.tooltips.layerlist.filter}</span>
              </Tooltip>
              <StyledIconWrapper
                aria-label={strings.accessibility.openFiltering}
                onClick={() => handleOpenFilteringDialog(layer)}
                id={`filter-${layer.id}`}
              >
                <StyledFloatingSpan>
                  <FontAwesomeIcon
                    icon={faFilter}
                    style={{
                      color:
                        filters.filter((f) => f.layer === layer.id).length > 0
                          ? theme.colors.secondaryColorPink
                          : theme.colors.primaryColor1
                    }}
                  />
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
