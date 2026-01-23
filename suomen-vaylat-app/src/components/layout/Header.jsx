import { useContext, useState, useCallback } from 'react';
import { ReactReduxContext } from 'react-redux';
import { isMobile } from '../../theme/theme';
import styled from 'styled-components';
import { AnimatePresence } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../state/hooks';
import strings from '../../translations';
import LanguageSelector from '../language-selector/LanguageSelector';
import VaylaLogoExtranetMobile from './images/vayla_v_rgb.png';
import VaylaLogoExtranet from './images/vayla_alla_fi_sv_rgb.png';
import { ReactComponent as VaylaLogoSV } from './images/vayla_alla_fi_sv_white.svg';
import { ReactComponent as VaylaLogoSVMobile } from './images/vayla_v_white.svg';
import DesktopNav from './navigation/DesktopNav';
import MobileNav from './navigation/MobileNav';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Badges from '../badges/Badges';

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
import {
  resetThemeGroupsForMainScreen,
  updateLayers
} from '../../utils/rpcUtil';
import { IS_EXTRANET } from '../../utils/appInfoUtil';
import { useNavigate } from 'react-router-dom';

const StyledHeaderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 68px;
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
    gap: ${IS_EXTRANET ? '1em' : '8px'}};
  background-color: ${(props) =>
    IS_EXTRANET
      ? props.theme.colors.extranetHeaderColor
      : props.theme.colors.mainColor1};
  border: ${IS_EXTRANET ? '1px solid' : 'none'};
  border-color: ${(props) =>
    IS_EXTRANET ? props.theme.colors.mainColor1 : 'none'};
  color: ${(props) =>
    IS_EXTRANET ? props.theme.colors.mainColor1 : props.theme.colors.mainWhite};
  padding: 0 18px;
  border-bottom-right-radius: 30px;
  z-index: 11;
  pointer-events: all;
  padding: 1em 1.5em 1em 0;
  box-shadow: ${IS_EXTRANET ? '0px 4px 8px 0px #00000040' : 'none'};

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
  background-color: ${(props) =>
    IS_EXTRANET
      ? props.theme.colors.extranetHeaderColor
      : props.theme.colors.mainColor1};
  border: ${IS_EXTRANET ? '1px solid' : 'none'};
  border-color: ${(props) =>
    IS_EXTRANET ? props.theme.colors.mainColor1 : 'none'};
  color: ${(props) =>
    IS_EXTRANET ? props.theme.colors.mainColor1 : props.theme.colors.mainWhite};
  padding: 1em 1em 1em 0.5em;
  border-bottom-left-radius: 30px;
  z-index: 11;
  pointer-events: all;
  box-shadow: ${IS_EXTRANET ? '0px 4px 8px 0px #00000040' : 'none'};

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
      background-color: ${(props) =>
        IS_EXTRANET
          ? props.theme.colors.extranetHeaderColor
          : props.theme.colors.mainColor1};

      color: ${(props) =>
        IS_EXTRANET
          ? props.theme.colors.mainColor1
          : props.theme.colors.mainWhite};

      svg {
        font-size: 28px;
      }
    }
  }
`;

const StyledHeaderTitleContainer = styled.div`
  cursor: pointer;
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  line-height: ${IS_EXTRANET ? 1.2 : 'normal'};

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

const StyledHeaderTitle = styled.div`
  font-weight: ${IS_EXTRANET ? '700' : '600'};
  font-size: ${IS_EXTRANET ? '20px' : '24px'};
  letter-spacing: ${IS_EXTRANET ? '0.1px' : 'normal'};
`;

const StyledHeaderTitleExtranet = styled.div`
  font-weight: 400 !important;
  letter-spacing: 0.11em !important;
  font-size: 20px;
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

const DesktopButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const Header = () => {
  const lang = useAppSelector((state) => state.language);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { store } = useContext(ReactReduxContext);
  const navigate = useNavigate();

  // This function now only accesses latest redux state when called
  const setToMainScreen = useCallback(() => {
    const state = store.getState();
    const channel = state.rpc.channel;
    const selectedLayers = state.rpc.selectedLayers;
    const selectedTheme = state.rpc.selectedTheme;
    const startState = state.rpc.startState;
    const activeTool = state.ui.activeTool;
    const activeGeometries = state.ui.activeGeometries;

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
    navigate(routerPrefix);
    // TODO: Which of these are actually necessary, are we doing extra work?
    resetThemeGroupsForMainScreen(
      store,
      channel,
      selectedTheme
    );

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
  }, [store]);

  return (
    <>
      <StyledHeaderContainer id="header-container" role="banner">
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
              {IS_EXTRANET ? (
                // Extranet: use PNGs (img tag)
                isMobile ? (
                  <img
                    src={VaylaLogoExtranetMobile}
                    alt="Väylä"
                    style={{ height: '100%', display: 'block' }}
                  />
                ) : (
                  <img
                    src={VaylaLogoExtranet}
                    alt="Väylä"
                    style={{ height: '100%', display: 'block' }}
                  />
                )
              ) : // Public site: use inline SVG components so they can be styled
              isMobile ? (
                <VaylaLogoSVMobile aria-hidden="true" focusable="false" />
              ) : (
                <VaylaLogoSV aria-hidden="true" focusable="false" />
              )}
            </a>
          </StyledHeaderLogoContainer>
          <StyledHeaderTitleContainer
            id="header-title"
            onClick={setToMainScreen}
            aria-label={strings.accessibility.headerTitle}
          >
            {IS_EXTRANET ? (
              <>
                <StyledHeaderTitle>{strings.titleExtranet} </StyledHeaderTitle>
                <StyledHeaderTitleExtranet>
                  {strings.extranet}
                </StyledHeaderTitleExtranet>
              </>
            ) : (
              <>
                <StyledHeaderTitle>{strings.title} </StyledHeaderTitle>
              </>
            )}
          </StyledHeaderTitleContainer>
        </HeaderLeft>

        <Badges />

        <HeaderRight id="header-right">
          {!isMobile && (
            <DesktopButtons
              id="header-desktop-buttons"
              aria-label={strings.accessibility.desktopButtons}
            >
              { !IS_EXTRANET &&
                <LanguageSelector />
              }
              <DesktopNav
                setIsMenuOpen={setIsMenuOpen}
                isMenuOpen={isMenuOpen}
              />
            </DesktopButtons>
          )}

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

        {isMobile && (
          <AnimatePresence>
            {isMenuOpen && <MobileNav setIsMenuOpen={setIsMenuOpen} />}
          </AnimatePresence>
        )}
      </StyledHeaderContainer>
    </>
  );
};

export default Header;
