import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useRef, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import {
  faInfoCircle,
  faQuestion,
  faTimes,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';
import { ReactReduxContext } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { theme, isMobile } from '../../theme/theme';
import { motion, AnimatePresence } from 'framer-motion';
import {
  setIsInfoOpen,
  setIsMainScreen,
  setIsUserGuideOpen,
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
import { ReactComponent as VaylaLogoMobile } from './images/vayla_v_white.svg';
import MenuIcon from '@mui/icons-material/Menu';
import { ReactComponent as VaylaLogo } from './images/vayla_sivussa_fi_sv_white.svg';
import { updateLayers } from '../../utils/rpcUtil';

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}


const ProfileDropdownContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${(props) => props.theme.colors.mainWhite};
  padding: 0;
  margin: 0;
  border-radius: 6px;
  transition: background 0.15s;
  &:hover {
    color: ${(props) => props.theme.colors.hover};
  }
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 110%; /* just under profile button */
  right: 0;
  min-width: 160px;
  background: ${(props) => props.theme.colors.mainWhite};
  color: ${(props) => props.theme.colors.black};
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.13);
  margin: 0;
  padding: 6px 0;
  z-index: 4000;
  list-style: none;
`;

const DropdownMenuItem = styled.li`
  padding: 10px 20px;
  cursor: pointer;
  &:hover {
    background: ${(props) => props.theme.colors.lightGrey || "#333"};
    color: ${(props) => props.theme.colors.mainColor1 || "#1964e0"};
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

const ProfileDropdown = ({languageLabel}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, () => setOpen(false));
  const { store } = useContext(ReactReduxContext);

  const { isInfoOpen, isUserGuideOpen, activeTool, activeGeometries } =
    useAppSelector((state) => state.ui);

  return (
    <ProfileDropdownContainer ref={ref}>
      <ProfileButton
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="header-profile-dropdown"
        id="header-profile-btn"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
      >
        <AccountCircleIcon fontSize='large'/>
        <FontAwesomeIcon style={{marginLeft: "8px"}} icon={faAngleDown} />
      </ProfileButton>
      {open && (
        <DropdownMenu
          id="header-profile-dropdown"
          role="menu"
          aria-labelledby="header-profile-btn"
        >
          <DropdownMenuItem role="menuitem" tabIndex={0}>
            
            <StyledHeaderButton 
              id="header-user-guide-button"
              data-tip
              data-for="header-show-user-guide-tooltip"
              onClick={() =>
                store.dispatch(setIsUserGuideOpen(!isUserGuideOpen))
              }
              aria-label={strings.tooltips.showUserGuide}
              aria-haspopup="true"
            >
              <FontAwesomeIcon icon={faQuestion} aria-hidden="true" focusable="false"/>
              {"userguide"}
            </StyledHeaderButton>
          </DropdownMenuItem>
          <DropdownMenuItem role="menuitem" tabIndex={0}>

            <StyledHeaderButton 
              id="header-info-button"
              data-tip
              data-for="header-show-info-tooltip"
              onClick={() => store.dispatch(setIsInfoOpen(!isInfoOpen))}
              aria-label={strings.tooltips.showPageInfo}
              aria-haspopup="true"
            >
              <FontAwesomeIcon icon={faInfoCircle} aria-hidden="true" focusable="false"/>
                {"info"}
            </StyledHeaderButton>          </DropdownMenuItem>
          <DropdownMenuItem role="menuitem" tabIndex={0}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem role="menuitem" tabIndex={0}>
            Log out
          </DropdownMenuItem>
        </DropdownMenu>
      )}
    </ProfileDropdownContainer>
  );
}

export default ProfileDropdown;
