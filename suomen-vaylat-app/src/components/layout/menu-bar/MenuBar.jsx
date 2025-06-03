import { useContext, useState } from 'react';
import strings from '../../../translations';
import {
  faCompress,
  faExpand,
  faLayerGroup,
  faMapMarkedAlt,
  faDownload,
  faMap,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import BuildIcon from '@mui/icons-material/Build';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import {
  setIsDrawingToolsOpen,
  setIsSideMenuOpen,
  setIsSaveViewOpen,
  setIsGfiOpen,
  setActiveTool,
  setMinimizeGfi,
  setIsGfiDownloadOpen,
  setGeoJsonArray,
  setSelectedMarker,
  setIsThemeMenuOpen,
  removeFromDrawToolMarkers
} from '../../../state/slices/uiSlice';
import { removeMarkerRequest, setVKMData } from '../../../state/slices/rpcSlice';

import CircleButton from '../../circle-button/CircleButton';
import DrawingTools from '../../measurement-tools/DrawingTools';
import PillButton from '../../PillButton/PillButton';

const StyledMenuBar = styled.div`
  z-index: 1;
  grid-row-start: 1;
  grid-row-end: 3;
  height: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  transition: all 0.5s ease-in-out;
  gap: 8px;

  @media ${(props) => props.theme.device.mobileL} {
    grid-row-start: ${(props) => (props.isSearchOpen ? 2 : 1)};
    grid-row-end: 3;
    gap: 6px;
  }

  @media ${(props) => props.theme.device.lowresDesktop} {
    gap: 6px;
  }
`;

const StyledMapToolsContainer = styled.div`
  background-color: ${(props) =>
    props.visible ? props.theme.colors.mainColor1 + '50' : 'transparent'};
  border-radius: 24px;
  box-shadow: ${(props) => (props.visible ? '1px 2px 6px #0000004d' : 'none')};
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  margin: 0;
`;

const StyledLayerCount = styled.div`
  position: absolute;
  top: -7px;
  right: -8px;
  width: 24px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  color: ${(props) => props.theme.colors.mainWhite};
  background-color: ${(props) => props.theme.colors.secondaryColorDarkOrange};
  font-size: 14px;
  font-weight: 600;

  @media ${(props) => props.theme.device.lowResDesktop} {
    width: 22px;
    height: 16px;
    font-size: 12px;
  }

  @media ${(props) => props.theme.device.mobileL} {
    width: 22px;
    height: 16px;
    font-size: 12px;
  }

  @media ${(props) => props.theme.device.mobileS} {
    width: 20px;
    height: 14px;
    font-size: 10px;
  }
`;

const MenuBar = () => {
  const { store } = useContext(ReactReduxContext);
  const { selectedLayers, downloads, channel, filters, selectedLayersByType } = useAppSelector(
    (state) => state.rpc
  );
  const {
    isFullScreen,
    isSideMenuOpen,
    isThemeMenuOpen,
    isDrawingToolsOpen,
    isSearchOpen,
    isSaveViewOpen,
    isGfiOpen,
    isGfiDownloadOpen,
    activeTool,
    drawToolMarkers
  } = useAppSelector((state) => state.ui);

  const closeDrawingTools = (open) => {
    channel && channel.postRequest('DrawTools.StopDrawingRequest');
    store.dispatch(setGeoJsonArray([]));
    store.dispatch(setActiveTool(null));
    drawToolMarkers.forEach((marker) => {
      store.dispatch(removeMarkerRequest({ markerId: marker }));
    });
    store.dispatch(setIsDrawingToolsOpen(open));
    store.dispatch(setSelectedMarker(2));
    drawToolMarkers.forEach((marker) => {
      store.dispatch(removeMarkerRequest({ markerId: marker.markerId }));
      store.dispatch(removeFromDrawToolMarkers(marker.markerId));
    });
  };

  const nonBgMaps = selectedLayers.filter(
    (layer) =>
      layer.groups?.every((group) => group !== 1) &&
      selectedLayersByType.backgroundMaps.filter((l) => l.id === layer.id).length === 0
  );

  return (
    <StyledMenuBar isSearchOpen={isSearchOpen}>
      <CircleButton
        icon={faMap}
        text={strings.layerlist.layerlistLabels.themeLayers}
        toggleState={isThemeMenuOpen}
        tooltipDirection="right"
        clickAction={() => store.dispatch(setIsThemeMenuOpen(!isThemeMenuOpen))}
      />
      <CircleButton
        icon={faLayerGroup}
        text={strings.layerlist.layerlistLabels.mapLayers}
        toggleState={isSideMenuOpen}
        tooltipDirection="right"
        clickAction={() => store.dispatch(setIsSideMenuOpen(!isSideMenuOpen))}
      >
        <StyledLayerCount>{selectedLayers.length}</StyledLayerCount>
      </CircleButton>
      <CircleButton
        icon={faMapMarkedAlt}
        text={strings.gfi.title}
        toggleState={isGfiOpen}
        tooltipDirection="right"
        clickAction={() => {
          if (isGfiOpen) {
            store.dispatch(setVKMData(null));
            store.dispatch(setMinimizeGfi(false));
          }
          store.dispatch(setIsGfiOpen(!isGfiOpen));
        }}
      >
        {filters?.filters?.length > 0 && <StyledLayerCount>{filters.filters.length}</StyledLayerCount>}
      </CircleButton>
  
      <CircleButton
        icon={<BuildIcon />}
        text={strings.tooltips.drawingTools.drawingToolsButton}
        toggleState={isDrawingToolsOpen}
        tooltipDirection="right"
        clickAction={() => closeDrawingTools(!isDrawingToolsOpen)}
      />
  
      {isDrawingToolsOpen && (
        <StyledMapToolsContainer visible={isDrawingToolsOpen}>
          <DrawingTools isOpen={isDrawingToolsOpen}>
            <PillButton
              icon={faDownload}
              text={strings.downloads.downloads}
              disabled={nonBgMaps.length === 0}
              onClick={() => {
                store.dispatch(setIsGfiDownloadOpen(!isGfiDownloadOpen));
              }}
            />
            <PillButton
              icon={faSave}
              text={strings.savedContent.saveView.saveView}
              onClick={() => store.dispatch(setIsSaveViewOpen(!isSaveViewOpen))}
            />
          </DrawingTools>
        </StyledMapToolsContainer>
      )}
  
      <CircleButton
        icon={isFullScreen ? faCompress : faExpand}
        text={strings.tooltips.fullscreenButton}
        toggleState={isFullScreen}
        tooltipDirection="right"
        clickAction={() => {
          const elem = document.documentElement;
          isFullScreen ? document.exitFullscreen?.() : elem.requestFullscreen?.();
        }}
      />
    </StyledMenuBar>
  );
  
};

export default MenuBar;
