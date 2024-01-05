import { useContext, useEffect, useState } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { theme, isMobile } from '../../../theme/theme';
import ReactTooltip from "react-tooltip";
import strings from '../../../translations';
import {
  setIsWaterwayListOpen,
   setMinimizeFilterModal,
   setSelectedMapLayersMenuTab
  } from "../../../state/slices/uiSlice";
import { setFilteringInfo } from '../../../state/slices/rpcSlice';

import styled from 'styled-components';
import {
  changeLayerStyle,
  getLegends,
  setLegends,
  setMapLayerVisibility,
} from "../../../state/slices/rpcSlice";
import { updateLayers } from "../../../utils/rpcUtil";
import LayerDownloadLinkButton from "./LayerDownloadLinkButton";
import {
  setIsDownloadLinkModalOpen,
} from "../../../state/slices/uiSlice";
import LayerMetadataButton from "./LayerMetadataButton";
import { useAppSelector } from "../../../state/hooks";

const StyledLayerContainer = styled.li`
  background-color: ${(props) => props.themeStyle && "#F5F5F5"};
  overflow: hidden;
  min-height: 32px;
  display: flex;
  align-items: center;
  margin-top: ${(props) => props.themeStyle && "8px"};
  border-radius: 4px;
`;

const StyledlayerHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const StyledLayerName = styled.p`
  user-select: none;
  color: ${(props) =>
    props.themeStyle
      ? props.theme.colors.secondaryColor2
      : props.theme.colors.mainColor1};
  margin: 0px;
  font-size: 14px;
  padding-left: 8px;
`;

const StyledSwitchContainer = styled.div`
  position: relative;
  min-width: 32px;
  height: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  background-color: ${(props) => (props.isSelected ? "#8DCB6D" : "#AAAAAA")};
  cursor: pointer;
  margin-right: 16px;
`;

const StyledSwitchButton = styled.div`
  position: absolute;
  left: ${(props) => (props.isSelected ? "15px" : "0px")};
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-left: 2px;
  margin-right: 2px;
  transition: all 0.3s ease-out;
  background-color: ${(props) => props.theme.colors.mainWhite};
`;

const StyledFilterIcon = styled.div`
  padding-right: 8px;  
  cursor: pointer;
  svg {
      color: ${props => props.theme.colors.mainColor1};
      transition: all 0.1s ease-out;
  };
  &:hover {
    svg {
      color: ${props => props.theme.colors.mainColor2};
    }
  };
`;

export const Switch = ({ action, layer, isSelected }) => {
  return (
    <StyledSwitchContainer
      isSelected={isSelected}
      onClick={() => {
        action(layer);
      }}
    >
      <StyledSwitchButton isSelected={isSelected} />
    </StyledSwitchContainer>
  );
};

export const findGroupForLayer = (groups, layerId) => {
  for (let group of groups) {
    if (group.layers && group.layers.includes(layerId)) {
      return group;
    }
    if (group.groups) {
      const nestedGroup = findGroupForLayer(group.groups, layerId);
      if (nestedGroup) return nestedGroup;
    }
  }
  return null;
};

export const Layer = ({ layer, themeName, groupName, showSwitch = true }) => {

    const { store } = useContext(ReactReduxContext);
    const [layerStyle, setLayerStyle] = useState(null);
    const [themeSelected, setThemeSelected] = useState(false);
    const { minimizeFilter } = useAppSelector(state => state.ui);
    const { filters } = useAppSelector(state => state.rpc);


    const isFilterable = typeof layer.config?.gfi?.filterFields !== "undefined" && layer.config?.gfi?.filterFields.length > 0 ;

    const {
        channel,
        selectedTheme,
        filteringInfo
    } = useSelector(state => state.rpc);

    const excludeGroups = ["Digiroad", "Tierekisteri (Poistuva)"];

    const handleLayerVisibility = (channel, layer) => {
      store.dispatch(setMapLayerVisibility(layer));
      updateLayers(store, channel);
  }

  const handleIsDownloadLinkModalOpen = () => {
    store.dispatch(
      setIsDownloadLinkModalOpen({
        layerDownloadLinkModalOpen: true,
        layerDownloadLink: downloadLink,
        layerDownloadLinkName: layer.name,
      })
    );
  };

  const updateLayerLegends = () => {
    // need use global window variable to limit legend updates
    clearTimeout(window.legendUpdateTimer);
    window.legendUpdateTimer = setTimeout(function () {
      store.dispatch(
        getLegends({
          handler: (data) => {
            store.dispatch(setLegends(data));
          },
        })
      );
    }, 1000);
  };

  useEffect(() => {
    // Clear the timeout when the component unmounts
    return () => clearTimeout(window.legendUpdateTimer);
  }, []);

    const themeStyle = themeName || null;

  if (selectedTheme && selectedTheme.name && themeSelected === false) {
    setThemeSelected(true);
  }

  // needs only get new style or legends when toggling theme selection
  if (layer.visible && themeSelected) {
    channel.getLayerThemeStyle(
      [
        layer.id,
        selectedTheme && selectedTheme.name ? selectedTheme.name : null,
      ],
      function (styleName) {
        if (styleName && styleName !== layerStyle) {
          setLayerStyle(styleName);
          store.dispatch(
            changeLayerStyle({ layerId: layer.id, style: styleName })
          );
          // update layers legends
          updateLayerLegends();
        }
      }
    );
  }

  const handleOpenPop = () => {
    store.dispatch(setIsWaterwayListOpen(true))
  }

  const handleFilterClick = (layer) => {
    !layer.visible && handleLayerVisibility(channel, layer);
    store.dispatch(setSelectedMapLayersMenuTab(1));

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
            filterColumnsArray: filterColumnsArray
          }
      }
      )
      store.dispatch(setFilteringInfo(updateFilter));
      minimizeFilter && store.dispatch(setMinimizeFilterModal({minimized: false, layer: layer.id}))
    } else {
        minimizeFilter && store.dispatch(setMinimizeFilterModal({minimized: false, layer: layer.id}))
    }
  }

  let downloadLink = null;
  if (layer.config && layer.config.downloadLink) {
    downloadLink = layer.config.downloadLink;
  }

    return (
            <StyledLayerContainer
                themeStyle={themeStyle}
                className={`list-layer ${layer.visible && "list-layer-active"}`}
                key={'layer' + layer.id + '_' + themeName}
            >
                <StyledlayerHeader>
                    <StyledLayerName
                        themeStyle={themeStyle}
                    >
                        {layer.name} {groupName && groupName !== 'Unknown' && !excludeGroups.includes(groupName) && ` (${groupName})`}
                    </StyledLayerName>
                </StyledlayerHeader>
                {layer.metadataIdentifier && <LayerMetadataButton layer={layer}/>}
                { isFilterable &&
                  <>
                    <ReactTooltip
                    backgroundColor={theme.colors.mainColor1}
                    textColor={theme.colors.mainWhite}
                    disable={isMobile}
                    id="filterableLayer"
                    place="top"
                    type="dark"
                    effect="float"
                  >
                    <span>{strings.tooltips.layerlist.filter}</span>
                  </ReactTooltip>
                  <StyledFilterIcon data-tip data-for={"filterableLayer"} onClick={() => handleFilterClick(layer)}>
                    <FontAwesomeIcon icon={faFilter} style={{ color: filters.filter(f => f.layer === layer.id).length > 0 ? theme.colors.secondaryColor8 : theme.colors.primaryColor1 }} />
                  </StyledFilterIcon>
                  </>
                }
                <StyledFilterIcon
                    onClick={handleOpenPop} >
                  <FontAwesomeIcon icon={faFilter} />
                </StyledFilterIcon>
                
                {downloadLink && <LayerDownloadLinkButton
                    handleIsDownloadLinkModalOpen={handleIsDownloadLinkModalOpen} />
                }
                {showSwitch && <Switch
                action={() => handleLayerVisibility(channel, layer)}
                isSelected={layer.visible}
                layer={layer}
            />}
                </StyledLayerContainer>
    );
  };

export default Layer;
