import { useState, useContext } from 'react';
import strings from '../../../translations';
import {
  faLayerGroup,
  faMap,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, motion } from 'motion/react';

import BuildIcon from '@mui/icons-material/Build';
import { WebSiteShareButton } from '../../share-website/ShareLinkButtons';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import {
  setIsDrawingToolsOpen,
  setIsSideMenuOpen,
  setActiveTool,
  setGeoJsonArray,
  setSelectedMarker,
  setIsThemeMenuOpen,
  removeFromDrawToolMarkers,
} from '../../../state/slices/uiSlice';
import {
  removeMarkerRequest,
} from '../../../state/slices/rpcSlice';

import CircleButton from '../../../utils/components/CircleButton';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { isMobile } from '../../../theme/theme';
import ToolsPanel from './ToolsPanel';

const StyledMenuBar = styled.div`
  z-index: 11;
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

  @media ${(props) => props.theme.device.lowResDesktop} {
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
  pointer-events: auto;

  @media ${(props) => props.theme.device.mobileL} {
    border-radius: 18px 12px 12px 12px;
    padding-bottom: 12px;
  }
`;

const StyledCornerCloseButton = styled(CircleButton)`
  z-index: 10;
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

const StyledMenuButtonsContainer = styled(motion.div)`
  z-index: 1;
  grid-row-start: 1;
  grid-row-end: 3;
  height: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  transition: all 0.5s ease-in-out;
  gap: 8px;
  margin-left: 2px;

  @media ${({ theme }) => theme.device.mobileL} {
    gap: 6px;
  }

  @media ${({ theme }) => theme.device.lowResDesktop} {
    gap: 6px;
  }
`;

const StyledOpenMobileMenuButton = styled.button`
  background: ${({ theme, isMobileMenuOpen }) =>
    isMobileMenuOpen ? theme.colors.buttonSelected : theme.colors.button};
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  z-index: 1;
  font-size: 30px;

  @media ${(props) => props.theme.device.mobileL} {
    width: 40px;
    height: 40px;
  }

  @media ${(props) => props.theme.device.lowResDesktop} {
    width: 44px;
    height: 44px;
  }

  @media ${(props) => props.theme.device.mobileS} {
    width: 38px;
    height: 38px;
  }
`;

const StyledArrowDropDownCircleIconWrapper = styled(motion.div)`
  z-index: 6;
  pointer-events: auto;
`;

const MenuBar = () => {
  const { store } = useContext(ReactReduxContext);
  const { selectedLayers, channel } =
    useAppSelector((state) => state.rpc);
  const {
    isSideMenuOpen,
    isThemeMenuOpen,
    isDrawingToolsOpen,
    isSearchOpen,
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

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    closeDrawingTools();
  };

  const MENU_ANIMATION = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'tween', duration: 0.1 }
    }
  };

  return (
    <>
      <StyledMenuBar
        isSearchOpen={isSearchOpen}
        id="menubar-container"
        role="navigation"
      >
        {isMobile && (
          <StyledArrowDropDownCircleIconWrapper
            id="menubar-mobile-toggle-icon"
            animate={{
              rotate: isMobileMenuOpen ? -180 : 0
            }}
            transition={{
              duration: 0.3,
              type: 'tween'
            }}
          >
            <StyledOpenMobileMenuButton
              id="menubar-mobile-toggle-btn"
              onClick={handleCloseMobileMenu}
              isMobileMenuOpen={isMobileMenuOpen}
            >
              <ArrowDropDownCircleIcon fontSize="inherit" />
            </StyledOpenMobileMenuButton>
          </StyledArrowDropDownCircleIconWrapper>
        )}
        <AnimatePresence>
          <StyledMenuButtonsContainer
            id="menubar-buttons-container"
            key="menubar-buttons-container"
            initial={!isMobile || isMobileMenuOpen ? 'visible' : 'hidden'}
            animate={!isMobile || isMobileMenuOpen ? 'visible' : 'hidden'}
            exit="exit"
            variants={MENU_ANIMATION}
            style={{ flex: '1 1 auto', minHeight: 0 }}
            role="region"
          >
            {(!isMobile || isMobileMenuOpen) && (
              <>
                <CircleButton
                  id="menubar-map-theme-btn"
                  icon={faMap}
                  text={strings.layerlist.layerlistLabels.themeLayers}
                  toggleState={isThemeMenuOpen}
                  tooltipDirection={'right'}
                  clickAction={() => {
                      store.dispatch(setIsSideMenuOpen(false))
                      store.dispatch(setIsThemeMenuOpen(!isThemeMenuOpen))
                    }
                  }
                  aria-label={strings.layerlist?.layerlistLabels?.themeLayers}
                />
                <CircleButton
                  id="menubar-map-layers-btn"
                  icon={faLayerGroup}
                  text={strings.layerlist.title}
                  toggleState={isSideMenuOpen}
                  tooltipDirection={'right'}
                  clickAction={() => {
                      store.dispatch(setIsThemeMenuOpen(false))
                      store.dispatch(setIsSideMenuOpen(!isSideMenuOpen))
                    }
                  }
                  aria-label={strings.layerlist?.layerlistLabels?.mapLayers}
                >
                  <StyledLayerCount id="menubar-map-layers-count">
                    {selectedLayers.length}
                  </StyledLayerCount>
                </CircleButton>

                <WebSiteShareButton/>

                {isDrawingToolsOpen ? (
                  <StyledDrawingToolsWrapper id="menubar-drawingtools-wrapper">
                    <StyledCornerCloseButton
                      id="menubar-drawingtools-close-btn"
                      icon={faTimes}
                      text=""
                      toggleState={true}
                      tooltipDirection={'right'}
                      clickAction={closeDrawingTools}
                      aria-label={strings.tooltips?.closeDrawingTools}
                      title={strings.tooltips?.closeDrawingTools}
                    />
                    <ToolsPanel isOpen={isDrawingToolsOpen} />
                  </StyledDrawingToolsWrapper>
                ) : (
                  <CircleButton
                    id="menubar-tools-btn"
                    icon={<BuildIcon />}
                    text={strings.tooltips.toolsButton}
                    toggleState={false}
                    tooltipDirection="right"
                    clickAction={() =>
                      store.dispatch(setIsDrawingToolsOpen(true))
                    }
                    aria-label={strings.tooltips?.toolsButton}
                  />
                )}
              </>
            )}
          </StyledMenuButtonsContainer>
        </AnimatePresence>
      </StyledMenuBar>
    </>
  );
};

export default MenuBar;
