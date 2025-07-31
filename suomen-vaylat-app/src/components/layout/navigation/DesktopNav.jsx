import styled from 'styled-components';
import {
  faAngleDown,
  faQuestion,
  faInfoCircle,
  faArrowRightFromBracket,
  faAngleUp,
  faSave,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRef, useState, useContext, useEffect } from 'react';
import { useAppSelector } from '../../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import strings from '../../../translations';
import PillButton from '../../../utils/components/PillButton';
import {
  setIsInfoOpen,
  setIsSaveViewOpen,
  setIsUserGuideOpen
} from '../../../state/slices/uiSlice';

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

const DesktopNavContainer = styled.div`
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
  border-radius: 8px;
  transition: background 0.15s;
  &:hover {
    color: ${(props) => props.theme.colors.hover};
  }
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 110%;
  right: 0;
  min-width: 200px;
  background: ${(props) => props.theme.colors.mainWhite};
  color: ${(props) => props.theme.colors.black};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.13);
  margin: 0;
  padding: 0;
  z-index: 4000;
  list-style: none;
  font-size: 15px;
`;

const DropdownMenuItem = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: none;
  color: ${(props) => props.theme.colors.black};
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  border-radius: 0;

  &:hover,
  &:focus {
    background: ${(props) => props.theme.colors.hover};
    color: ${(props) => props.theme.colors.mainColor1};
    outline: none;
  }

  &.logout {
    justify-content: center;
    padding-top: 18px;
    padding-bottom: 18px;
    background: none;
    &:hover {
      background: none;
      color: ${(props) => props.theme.colors.black};
    }
  }

  svg,
  .MuiSvgIcon-root {
    color: ${(props) => props.theme.colors.mainColor1};
    min-width: 21px;
    min-height: 21px;
    font-size: 20px;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
  }
  span {
    display: inline-block;
    vertical-align: middle;
  }
`;

const MenuDivider = styled.hr`
  border: none;
  height: 1px;
  background: ${(props) => props.theme.colors.lightGrey || '#eee'};
  margin: 0px 5px;
`;

const ProfileNameSpan = styled.span`
  color: ${(props) => props.theme.colors.mainWhite};
  font-weight: 500;
  font-size: 15px;
  margin-right: 2px;
  margin-left: 6px;
`;

const DesktopNav = ({ languageLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn } = useAppSelector((state) => state.rpc);
  const ref = useRef();
  useOnClickOutside(ref, () => setIsOpen(false));
  const { store } = useContext(ReactReduxContext);

  // Menu actions
  const handleProfile = () => {
    store.dispatch(setIsSaveViewOpen(true));
    setIsOpen(false);
  };

  const handleUserGuide = () => {
    store.dispatch(setIsUserGuideOpen(true));
    setIsOpen(false);
  };

  const handleInfo = () => {
    store.dispatch(setIsInfoOpen(true));
    setIsOpen(false);
  };

  // IDs for aria-controls/aria-labelledby
  const menuId = 'desktop-nav-profile-dropdown';
  const profileBtnId = 'desktop-nav-profile-btn';
  const menuProfileId = 'desktop-nav-profile-menuitem';
  const menuUserGuideId = 'desktop-nav-userguide-menuitem';
  const menuInfoId = 'desktop-nav-info-menuitem';
  const menuLogoutId = 'desktop-nav-logout-menuitem';

  return (
    <DesktopNavContainer ref={ref} id="desktop-nav-container">
      <ProfileNameSpan id="desktop-nav-language">
        {languageLabel}
      </ProfileNameSpan>
      <ProfileButton
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        id={profileBtnId}
        tabIndex={0}
        onClick={() => setIsOpen((v) => !v)}
        title={strings.accessibility?.openProfileMenu}
      >
        {isLoggedIn ? (
          <>
            <AccountCircleIcon fontSize="large" />
            <FontAwesomeIcon
              style={{ marginLeft: '6px', fontSize: '19px' }}
              icon={isOpen ? faAngleUp : faAngleDown}
              aria-hidden="true"
            />
          </>
        ) : (
          <>
            <FontAwesomeIcon
              icon={faBars}
              style={{ marginLeft: '6px', fontSize: '1.4em' }}
              aria-hidden="true"
              focusable="false"
            />
          </>
        )}
      </ProfileButton>
      {isOpen && (
        <DropdownMenu id={menuId} role="menu" aria-labelledby={profileBtnId}>
          <DropdownMenuItem
            id={menuProfileId}
            role="menuitem"
            tabIndex={0}
            onClick={handleProfile}
            aria-label={
              isLoggedIn
                ? strings.menu?.profile
                : strings.savedContent?.savedContent
            }
          >
            {isLoggedIn ? (
              <AccountCircleIcon aria-hidden="true" />
            ) : (
              <FontAwesomeIcon icon={faSave} aria-hidden="true" />
            )}
            {strings.savedContent?.savedContent}
          </DropdownMenuItem>
          <DropdownMenuItem
            id={menuUserGuideId}
            role="menuitem"
            tabIndex={0}
            onClick={handleUserGuide}
            aria-label={strings.tooltips.showUserGuide}
          >
            <FontAwesomeIcon icon={faQuestion} aria-hidden="true" />
            {strings.tooltips.userGuide}
          </DropdownMenuItem>
          <DropdownMenuItem
            id={menuInfoId}
            role="menuitem"
            tabIndex={0}
            onClick={handleInfo}
            aria-label={strings.tooltips.showPageInfo}
          >
            <FontAwesomeIcon icon={faInfoCircle} aria-hidden="true" />
            {strings.tooltips.pageInfo}
          </DropdownMenuItem>
          {isLoggedIn && (
            <>
              <MenuDivider />
              <DropdownMenuItem
                className="logout"
                id={menuLogoutId}
                role="menuitem"
                tabIndex={0}
                aria-label={strings.signOut}
              >
                <PillButton
                  id="desktop-nav-profile-dropdown-logout-btn"
                  icon={faArrowRightFromBracket}
                  iconColor={'#FFF'}
                  text={strings.signOut}
                  onClick={() => alert('kirjaudu ulos')}
                  aria-label={strings.signOut}
                />
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenu>
      )}
    </DesktopNavContainer>
  );
};

export default DesktopNav;
