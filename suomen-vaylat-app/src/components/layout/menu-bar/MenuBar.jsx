import { useState, useContext } from 'react';
import strings from '../../../translations';
import {
  faCompress,
  faExpand,
  faLayerGroup,
  faMapMarkedAlt,
  faDownload,
  faMap,
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

import BuildIcon from '@mui/icons-material/Build';
import { WebSiteShareButton } from '../../share-website/ShareLinkButtons';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import {
  removeMarkerRequest,
  setVKMData
} from '../../../state/slices/rpcSlice';

import CircleButton from '../../../utils/components/CircleButton';
import DrawingTools from '../../measurement-tools/DrawingTools';
import PillButton from '../../../utils/components/PillButton';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';

const StyledMenuBar = styled.div`
  z-index: 1;
  pointer-events: none;
  height: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  transition: all 0.5s ease-in-out;
  gap: 8px;

  @media ${(props) => props.theme.device.mobileL} {
    pointer-events: none;
    grid-row-start: ${(props) => (props.isSearchOpen ? 2 : 1)};
    grid-row-end: 3;
    gap: 6px;
  }

  @media ${(props) => props.theme.device.lowresDesktop} {
    gap: 6px;
  }
`;

const StyledDrawingToolsWrapper = styled.div`
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: ${({ theme }) => theme.colors.mainColor1 + '35'};
  border-radius: 22px 16px 16px 16px;
  padding-bottom: 12px;
  pointer-events: auto;
`;

const StyledCornerCloseButton = styled(CircleButton)`
  z-index: 10;
`;

const StyledToolButtons = styled.div`
  overflow: scroll;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 8px;
  pointer-events: auto;

  @media ${(props) => props.theme.device.mobileL} {
    gap: 6px;
  }
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

const DesktopOnly = styled.div`
  z-index: 1;
  grid-row-start: 1;
  grid-row-end: 3;
  height: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  transition: all 0.5s ease-in-out;
  gap: 8px;
  @media ${({ theme }) => theme.device.mobileL} {
    display: none;
  }
`;

const MobileOnly = styled.div`
  display: none;
  @media ${({ theme }) => theme.device.mobileL} {
    display: flex;
    flex-direction: column;
    z-index: 1;
    gap: 10px;
    pointer-events: auto;
  }
`;

const MobileMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: ${({ theme }) => theme.colors.mainColor1 + '20'};
  border-radius: 16px;
  pointer-events: auto;
`;

const StyledCloseMobileMenuButton = styled.button`
  background: ${({ theme }) => theme.colors.button};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  padding: 0;
  z-index: 1;

  svg {
    height: 1.5em !important;
    width: 1.5em !important;
  }
`;

const StyledOpenMobileMenuButton = styled.button`
  background: ${({ theme }) => theme.colors.button};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  padding: 0;
  z-index: 1;

  svg {
    height: 1.2em !important;
    width: 1.2em !important;
  }

  @media ${(props) => props.theme.device.mobileL} {
    width: 36px;
    height: 36px;
  }

  @media ${(props) => props.theme.device.lowResDesktop} {
    width: 40px;
    height: 40px;
  }

  @media ${(props) => props.theme.device.mobileS} {
    width: 34px;
    height: 34px;
  }
`;

const StyledArrowDropDownCircleIconWrapper = styled(motion.div)``;

const MenuBar = () => {
  const { store } = useContext(ReactReduxContext);
  const { selectedLayers, downloads, channel, filters, selectedLayersByType } =
    useAppSelector((state) => state.rpc);
  const {
    isFullScreen,
    isSideMenuOpen,
    isThemeMenuOpen,
    isDrawingToolsOpen,
    isSearchOpen,
    isSaveViewOpen,
    isGfiOpen,
    isGfiDownloadOpen,
    drawToolMarkers
  } = useAppSelector((state) => state.ui);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      selectedLayersByType.backgroundMaps.filter((l) => l.id === layer.id)
        .length === 0
  );

  return (
    <>
      {/* DESKTOP MENU */}
      <StyledMenuBar isSearchOpen={isSearchOpen}>
        <DesktopOnly id="desktop-only">
          <CircleButton
            icon={faMap}
            text={strings.layerlist.layerlistLabels.themeLayers}
            toggleState={isThemeMenuOpen}
            tooltipDirection={'right'}
            clickAction={() =>
              store.dispatch(setIsThemeMenuOpen(!isThemeMenuOpen))
            }
          />
          <CircleButton
            icon={faLayerGroup}
            text={strings.layerlist.layerlistLabels.mapLayers}
            toggleState={isSideMenuOpen}
            tooltipDirection={'right'}
            clickAction={() =>
              store.dispatch(setIsSideMenuOpen(!isSideMenuOpen))
            }
          >
            <StyledLayerCount>{selectedLayers.length}</StyledLayerCount>
          </CircleButton>
          <CircleButton
            icon={faMapMarkedAlt}
            text={strings.gfi.title}
            toggleState={isGfiOpen}
            tooltipDirection={'right'}
            clickAction={() => {
              if (isGfiOpen) {
                store.dispatch(setVKMData(null));
                store.dispatch(setMinimizeGfi(false));
              }
              store.dispatch(setIsGfiOpen(!isGfiOpen));
            }}
          >
            {filters?.filters?.length > 0 && (
              <StyledLayerCount>{filters.filters.length}</StyledLayerCount>
            )}
          </CircleButton>
          <WebSiteShareButton />

          {isDrawingToolsOpen ? (
            <StyledDrawingToolsWrapper>
              <StyledCornerCloseButton
                icon={faTimes}
                text=""
                toggleState={true}
                tooltipDirection={'right'}
                clickAction={() => store.dispatch(setIsDrawingToolsOpen(false))}
              />
              <StyledToolButtons>
                <DrawingTools isOpen={isDrawingToolsOpen} />
                <PillButton
                  id="tools-download"
                  icon={faDownload}
                  text={strings.downloads.downloads}
                  disabled={nonBgMaps.length === 0}
                  onClick={() =>
                    store.dispatch(setIsGfiDownloadOpen(!isGfiDownloadOpen))
                  }
                />
                <PillButton
                  id="tools-save"
                  icon={faSave}
                  text={strings.savedContent.saveView.saveView}
                  onClick={() =>
                    store.dispatch(setIsSaveViewOpen(!isSaveViewOpen))
                  }
                />
                <PillButton
                  id="tools-full-screen"
                  icon={isFullScreen ? faCompress : faExpand}
                  text={strings.tooltips.fullscreenButton}
                  onClick={() => {
                    const elem = document.documentElement;
                    isFullScreen
                      ? document.exitFullscreen?.()
                      : elem.requestFullscreen?.();
                  }}
                />
              </StyledToolButtons>
            </StyledDrawingToolsWrapper>
          ) : (
            <CircleButton
              icon={<BuildIcon />}
              text={strings.tooltips.toolsButton}
              toggleState={false}
              tooltipDirection="right"
              clickAction={() => store.dispatch(setIsDrawingToolsOpen(true))}
            />
          )}
        </DesktopOnly>
      </StyledMenuBar>

      {/* MOBILE MENU */}
      <MobileOnly id="mobile-only">
        <MobileMenuContainer>
          <StyledArrowDropDownCircleIconWrapper
            animate={{
              rotate: isMobileMenuOpen ? -180 : 0
            }}
            transition={{
              duration: 0.1,
              type: 'tween'
            }}
          >
            <StyledOpenMobileMenuButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ArrowDropDownCircleIcon />
            </StyledOpenMobileMenuButton>
          </StyledArrowDropDownCircleIconWrapper>
          {isMobileMenuOpen && (
            <>
              <CircleButton
                icon={faMap}
                text=""
                toggleState={isThemeMenuOpen}
                clickAction={() =>
                  store.dispatch(setIsThemeMenuOpen(!isThemeMenuOpen))
                }
              />

              <CircleButton
                icon={faLayerGroup}
                text=""
                toggleState={isSideMenuOpen}
                clickAction={() =>
                  store.dispatch(setIsSideMenuOpen(!isSideMenuOpen))
                }
              >
                <StyledLayerCount>{selectedLayers.length}</StyledLayerCount>
              </CircleButton>

              <CircleButton
                icon={faMapMarkedAlt}
                text=""
                toggleState={isGfiOpen}
                clickAction={() => {
                  if (isGfiOpen) {
                    store.dispatch(setVKMData(null));
                    store.dispatch(setMinimizeGfi(false));
                  }
                  store.dispatch(setIsGfiOpen(!isGfiOpen));
                }}
              >
                {filters?.filters?.length > 0 && (
                  <StyledLayerCount>{filters.filters.length}</StyledLayerCount>
                )}
              </CircleButton>

              <WebSiteShareButton />

              <CircleButton
                icon={isDrawingToolsOpen ? faTimes : <BuildIcon />}
                text=""
                toggleState={isDrawingToolsOpen}
                clickAction={() => closeDrawingTools(!isDrawingToolsOpen)}
              />

              {isDrawingToolsOpen && (
                <>
                  <DrawingTools isOpen={isDrawingToolsOpen} />

                  <PillButton
                    id="tools-download"
                    icon={faDownload}
                    text={strings.downloads.downloads}
                    disabled={nonBgMaps.length === 0}
                    onClick={() =>
                      store.dispatch(setIsGfiDownloadOpen(!isGfiDownloadOpen))
                    }
                  />
                  <PillButton
                    id="tools-save"
                    icon={faSave}
                    text={strings.savedContent.saveView.saveView}
                    onClick={() =>
                      store.dispatch(setIsSaveViewOpen(!isSaveViewOpen))
                    }
                  />
                  <PillButton
                    id="tools-full-screen"
                    icon={isFullScreen ? faCompress : faExpand}
                    text={strings.tooltips.fullscreenButton}
                    onClick={() => {
                      const elem = document.documentElement;
                      isFullScreen
                        ? document.exitFullscreen?.()
                        : elem.requestFullscreen?.();
                    }}
                  />
                </>
              )}
            </>
          )}
        </MobileMenuContainer>
      </MobileOnly>
    </>
  );
};

export default MenuBar;
