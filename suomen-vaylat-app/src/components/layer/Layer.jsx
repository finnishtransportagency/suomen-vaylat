import { useContext, useEffect, useState } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Badge from 'react-bootstrap/Badge';
import { toast, Slide } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { theme, isMobile } from '../../theme/theme';
import ReactTooltip from 'react-tooltip';
import strings from '../../translations';
import {
  setMinimizeFilterDialog,
  setSelectedMapLayersMenuTab
} from '../../state/slices/uiSlice';
import { setFilteringInfo } from '../../state/slices/rpcSlice';

import styled from 'styled-components';
import {
  changeLayerStyle,
  setMapLayerVisibility
} from '../../state/slices/rpcSlice';
import { updateLayers, updateLayerLegends } from '../../utils/rpcUtil';
import LayerDownloadLinkButton from '../layerlists/hierarchical-layerlist/LayerDownloadLinkButton';
import { setIsDownloadLinkDialogOpen } from '../../state/slices/uiSlice';
import LayerMetadataButton from '../layerlists/hierarchical-layerlist/LayerMetadataButton';
import { useAppSelector } from '../../state/hooks';
import LayerlistSwitch from '../layerlists/hierarchical-layerlist/LayerlistSwitch';

const StyledLayerContainer = styled.div`
  background-color: ${(props) => props.themeStyle && '#F5F5F5'};
  overflow: hidden;
  min-height: 32px;
  display: flex;
  align-items: center;
  margin-top: ${(props) => props.themeStyle && '8px'};
  border-radius: 4px;
  margin-bottom: 4px;
`;

const StyledlayerHeader = styled.div`
  margin-right: 0.5em;
  display: flex;
  width: 100%;
  align-items: center;
`;

const StyledLayerName = styled.p`
  word-break: break-word;
  user-select: none;
  color: ${(props) =>
    props.themeStyle
      ? props.theme.colors.secondaryColorGreen
      : props.theme.colors.mainColor1};
  margin: 0px;
  font-size: 14px;
  padding-left: 8px;
`;

const StyledFilterIcon = styled.div`
  padding-right: 8px;
  cursor: pointer;
  svg {
    color: ${(props) => props.theme.colors.mainColor1};
    transition: all 0.1s ease-out;
  }
  &:hover {
    svg {
      color: ${(props) => props.theme.colors.mainColor2};
    }
  }
`;

export const Layer = ({ layer, themeName, groupName }) => {
  const { store } = useContext(ReactReduxContext);
  const [layerStyle, setLayerStyle] = useState(null);
  const { minimizeFilter } = useAppSelector((state) => state.ui);
  const { filters } = useAppSelector((state) => state.rpc);

  const isFilterable =
    typeof layer.config?.gfi?.filterFields !== 'undefined' &&
    layer.config?.gfi?.filterFields.length > 0;

  const { channel, selectedTheme, filteringInfo } = useSelector(
    (state) => state.rpc
  );

  const excludeGroups = ['Digiroad', 'Tierekisteri (Poistuva)'];

  const handleLayerVisibility = (channel, layer) => {
    store.dispatch(setMapLayerVisibility(layer));
    updateLayers(store, channel);
  };

  const handleIsDownloadLinkDialogOpen = () => {
    store.dispatch(
      setIsDownloadLinkDialogOpen({
        layerDownloadLinkDialogOpen: true,
        layerDownloadLink: downloadLink,
        layerDownloadLinkName: layer.name
      })
    );
  };

  useEffect(() => {
    // Clear the timeout when the component unmounts
    return () => clearTimeout(window.legendUpdateTimer);
  }, []);

  const themeStyle = themeName || null;

  useEffect(() => {
    // needs only get new style or legends when toggling theme selection
    if (
      layer.visible &&
      selectedTheme &&
      selectedTheme.layers?.includes(layer.id)
    ) {
      const themeName = selectedTheme.locale?.['fi']?.name || null;
      channel.getLayerThemeStyle(
        [layer.id, themeName],
        function (styleName) {
          if (styleName && styleName !== layerStyle) {
            setLayerStyle(styleName);
            store.dispatch(
              changeLayerStyle({ layerId: layer.id, style: styleName })
            );
            // update layers legends
            updateLayerLegends(store);
          }
        },
        function (error) {
          toast.error(strings.themelayerlist.errors.themeStyleError + error, {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: 'colored',
            transition: Slide
          });
        }
      );
    }
  }, [selectedTheme, layer.visible]);

  const handleFilterClick = (layer) => {
    !layer.visible && handleLayerVisibility(channel, layer);
    store.dispatch(setSelectedMapLayersMenuTab(1));

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

  let downloadLink = null;
  if (layer.config && layer.config.downloadLink) {
    downloadLink = layer.config.downloadLink;
  }

  return (
    <StyledLayerContainer
      themeStyle={themeStyle}
      className={`list-layer ${layer.visible && 'list-layer-active'}`}
      key={'layer' + layer.id + '_' + themeName}
    >
      <StyledlayerHeader>
        <StyledLayerName themeStyle={themeStyle}>
          {layer.name}{' '}
          {groupName &&
            groupName !== 'Unknown' &&
            !excludeGroups.includes(groupName) &&
            ` (${groupName})`}
          {layer.newLayer && (
            <Badge
              style={{
                color: theme.colors.mainWhite,
                backgroundColor: theme.colors.mainColor1,
                marginLeft: '.5em'
              }}
              pill
              bg="null"
            >
              {strings.tooltips.layerlist.newLayer}
            </Badge>
          )}
        </StyledLayerName>
      </StyledlayerHeader>
      {layer.metadataIdentifier && <LayerMetadataButton layer={layer} />}
      {isFilterable && (
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
          <StyledFilterIcon
            data-tip
            data-for={'filterableLayer'}
            onClick={() => handleFilterClick(layer)}
          >
            <FontAwesomeIcon
              icon={faFilter}
              style={{
                color:
                  filters.filter((f) => f.layer === layer.id).length > 0
                    ? theme.colors.secondaryColorPink
                    : theme.colors.primaryColor1
              }}
            />
          </StyledFilterIcon>
        </>
      )}
      {downloadLink && (
        <LayerDownloadLinkButton
          handleIsDownloadLinkDialogOpen={handleIsDownloadLinkDialogOpen}
        />
      )}
      <LayerlistSwitch
        action={() => handleLayerVisibility(channel, layer)}
        isSelected={layer.visible}
        layer={layer}
      />
    </StyledLayerContainer>
  );
};

export default Layer;
