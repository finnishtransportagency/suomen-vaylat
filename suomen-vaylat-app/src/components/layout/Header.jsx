import { useContext, useState } from 'react';
import { ReactReduxContext } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { theme, isMobile } from '../../theme/theme';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../state/hooks';
import {
  setIsMainScreen,
  setActiveTool,
  removeActiveGeometry
} from '../../state/slices/uiSlice';
import {
  mapMoveRequest,
  removeMarkerRequest,
  resetGFILocations,
  setVKMData
} from '../../state/slices/rpcSlice';
import { resetThemeGroupsForMainScreen } from '../../utils/rpcUtil';
import strings from '../../translations';
import LanguageSelector from '../language-selector/LanguageSelector';
import { ReactComponent as VaylaLogo } from './images/vayla_v_white.svg';
import MenuIcon from '@mui/icons-material/Menu';
import { updateLayers } from '../../utils/rpcUtil';
import DesktopNav from './navigation/DesktopNav';
import { createBrowserHistory } from 'history';
import MobileNav from './navigation/MobileNav';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Badges from '../badges/Badges';

const history = createBrowserHistory();

const StyledHeaderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;

const HeaderLeft = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 64px;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.colors.mainColor1};
  padding: 0 18px;
  border-bottom-right-radius: 30px;
  z-index: 11;
  pointer-events: all;
  padding: 1em 1.5em 1em 0;

  @media ${(props) => props.theme.device.mobileL} {
    height: 60px;
    padding: 0;
    width: auto;
    width: 60px;
    border-bottom-right-radius: 30px;
  }
`;

const StyledHeaderButton = styled.button`
  position: relative;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border-radius: 50%;
  border: none;
  svg {
    color: ${(props) => props.theme.colors.mainWhite};
    font-size: 22px;
  }
  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.secondaryColor};
  }
`;

const HeaderRight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.colors.mainColor1};
  padding: 1em 1em 1em 0.5em;
  border-bottom-left-radius: 30px;
  z-index: 11;
  pointer-events: all;

  @media ${(props) => props.theme.device.mobileL} {
    height: 60px;
    width: 60px;
    padding: 0;
    justify-content: center;
    border-bottom-left-radius: 30px;
  }

  .menu-toggle-button {
    display: none;

    @media ${(props) => props.theme.device.mobileL} {
      display: flex;
      background-color: ${(props) => props.theme.colors.mainColor1};

      svg {
        font-size: 28px;
      }
    }
  }
`;

const StyledHeaderTitleContainer = styled.p`
  cursor: pointer;
  height: inherit;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0;
  color: ${(props) => props.theme.colors.mainWhite};
  font-weight: 600;

  @media ${(props) => props.theme.device.desktop} {
    font-size: 25px;
  }

  @media ${(props) => props.theme.device.tablet} {
    font-size: 10px;
  }
  @media ${(props) => props.theme.device.mobileL} {
    display: none;
  }
`;

const StyledHeaderLogoContainer = styled.div`
  height: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 0px;

  a {
    height: inherit;
  }

  svg {
    height: inherit;
  }
`;

const StyledMobileHeaderRow = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledMobileMenuTitle = styled.p`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.mainWhite};
  margin: 0;
`;

const MobileMenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
  margin-left: 20px;
`;

const StyledMobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 0;
  color: ${(props) => props.theme.colors.mainWhite};
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  margin-left: 20px;
  background: none;
  border: none;

  .icon-wrapper {
    width: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  }

  .text-wrapper {
    display: flex;
    align-items: center;
  }

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.secondaryColor};
  }
`;

const DesktopButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  @media ${(props) => props.theme.device.mobileL} {
    display: none;
  }
`;

const StyledMobileNavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.mainColor1};
  z-index: 1001;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
  gap: 20px;
`;

const HiddenLanguageIconWrapper = styled.div`
  display: flex;
  align-items: center;

  svg {
    display: none;
  }
`;

export const Header = () => {
  const lang = useAppSelector((state) => state.language);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { store } = useContext(ReactReduxContext);

  const {
    channel,
    selectedLayers,
    lastSelectedTheme,
    selectedThemeId,
    startState
  } = useAppSelector((state) => state.rpc);

  const { activeTool, activeGeometries } =
    useAppSelector((state) => state.ui);

  const handleSelectGroup = (index, theme) => {
    resetThemeGroupsForMainScreen(
      store,
      channel,
      index,
      theme,
      lastSelectedTheme,
      selectedThemeId
    );
  };

  const setToMainScreen = () => {
    let routerPrefix = '/';
    if (process.env.REACT_APP_ROUTER_PREFIX) {
      routerPrefix = process.env.REACT_APP_ROUTER_PREFIX;
    }
    // remove all selected layers
    selectedLayers.forEach((layer) => {
      channel &&
        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [
          layer.id,
          false
        ]);
    });

    // set map center
    store.dispatch(
      mapMoveRequest({
        x: startState.x,
        y: startState.y,
        zoom: startState.zoom
      })
    );

    store.dispatch(setIsMainScreen());
    store.dispatch(resetGFILocations([]));
    history.push(routerPrefix);
    handleSelectGroup(null, lastSelectedTheme);

    // add start layers back (do it after than select group)
    startState.selectedLayers.forEach((layer) => {
      channel &&
        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [
          layer.id,
          true
        ]);
      channel &&
        channel.postRequest('ChangeMapLayerOpacityRequest', [
          layer.id,
          layer.opacity
        ]);
    });

    channel &&
      activeTool === 'gfi-selection-tool' &&
      channel.postRequest('DrawTools.StopDrawingRequest', [
        'gfi-selection-tool',
        true
      ]);

    channel &&
      channel.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
    channel && channel.postRequest('DrawTools.StopDrawingRequest', [true]);
    store.dispatch(setActiveTool(null));

    updateLayers(store, channel);

    // Remove all features from map
    channel &&
      channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', []);

    // Remove VKM data
    store.dispatch(setVKMData(null));

    // Remove all markers
    store.dispatch(removeMarkerRequest());

    store.dispatch(removeActiveGeometry());

    activeGeometries.forEach((geometry) => {
      store.dispatch(removeActiveGeometry(geometry.id));
    });
  };

  return (
    <>
      <StyledHeaderContainer id="header-container" role="banner">
        <ReactTooltip
          backgroundColor={theme.colors.mainColor1}
          disable={isMobile}
          id="header-show-info-tooltip"
          place="bottom"
          type="dark"
          effect="float"
        >
          <span>{strings.tooltips.showPageInfo}</span>
        </ReactTooltip>
        <ReactTooltip
          backgroundColor={theme.colors.mainColor1}
          disable={isMobile}
          id="header-show-user-guide-tooltip"
          place="bottom"
          type="dark"
          effect="float"
        >
          <span>{strings.tooltips.showUserGuide}</span>
        </ReactTooltip>
        <HeaderLeft id="header-left">
          <StyledHeaderLogoContainer id="header-logo-container">
            <a
              aria-label={strings.accessibility.vaylaLink}
              href={
                lang.current === 'fi'
                  ? 'https://vayla.fi/etusivu'
                  : lang.current === 'en'
                  ? 'https://vayla.fi/en/frontpage'
                  : lang.current === 'sv'
                  ? 'https://vayla.fi/sv/framsida'
                  : 'https://vayla.fi/etusivu'
              }
              target="_blank"
              rel="noreferrer"
              id="header-vayla-logo-link"
            >
              <VaylaLogo aria-hidden="true" focusable="false"/>
            </a>
          </StyledHeaderLogoContainer>
          <StyledHeaderTitleContainer
            id="header-title"
            onClick={setToMainScreen}
            aria-label={strings.accessibility.headerTitle}
          >
            {strings.title}{' '}
            {process.env.REACT_APP_EXTRANET === 'true' && strings.extranet}
          </StyledHeaderTitleContainer>
        </HeaderLeft>

        <Badges />

        <HeaderRight id="header-right">
          <DesktopButtons
            id="header-desktop-buttons"
            aria-label={strings.accessibility.desktopButtons}
          >
            <LanguageSelector />
            <DesktopNav setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
          </DesktopButtons>

          <StyledHeaderButton
            id="header-menu-toggle-button"
            className="menu-toggle-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={strings.accessibility.menuToggle}
            aria-expanded={isMenuOpen}
            aria-controls="header-mobile-nav-container"
          >
            <FontAwesomeIcon
              icon={faBars}
              aria-hidden="true"
              focusable="false"
            />
          </StyledHeaderButton>
        </HeaderRight>

        <AnimatePresence>
          {isMenuOpen && (
            <MobileNav  setIsMenuOpen={setIsMenuOpen}></MobileNav>
          )}
        </AnimatePresence>
      </StyledHeaderContainer>
    </>
  );
};

export default Header;
