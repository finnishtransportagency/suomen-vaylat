import styled from 'styled-components';
import { faUser, faAngleDown, faQuestion, faInfoCircle, faArrowRightFromBracket, faIdBadge, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRef, useState, useContext, useEffect } from 'react';
import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import strings from '../../translations';
import PillButton from '../../utils/components/PillButton';

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
};

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
  border-radius: 8px;
  transition: background 0.15s;
  &:hover {
    color: ${(props) => props.theme.colors.hover};
  }
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 110%; /* just under profile button */
  right: 0;
  min-width: 200px;
  background: ${(props) => props.theme.colors.mainWhite};
  color: ${(props) => props.theme.colors.black};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.13);
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

  &:hover, &:focus {
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

  svg, .MuiSvgIcon-root {
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
  background: ${(props) => props.theme.colors.lightGrey || "#eee"};
  margin: 0px 5px;
`;

const ProfileNameSpan = styled.span`
  color: ${(props) => props.theme.colors.mainWhite};
  font-weight: 500;
  font-size: 15px;
  margin-right: 2px;
  margin-left: 6px;
`;

// Component - clean menu
const ProfileDropdown = ({ languageLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, () => setIsOpen(false));
  const { store } = useContext(ReactReduxContext);

  const { isInfoOpen, isUserGuideOpen } = useAppSelector((state) => state.ui);

  // Menu actions
  const handleUserGuide = () => {
    store.dispatch({ type: 'ui/setIsUserGuideOpen', payload: !isUserGuideOpen });
    setIsOpen(false);
  };

  const handleInfo = () => {
    store.dispatch({ type: 'ui/setIsInfoOpen', payload: !isInfoOpen });
    setIsOpen(false);
  };

  return (
    <ProfileDropdownContainer ref={ref}>
      <ProfileNameSpan>{languageLabel}</ProfileNameSpan>
      <ProfileButton
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="header-profile-dropdown"
        id="header-profile-btn"
        tabIndex={0}
        onClick={() => setIsOpen((v) => !v)}
        title={strings.accessibility?.openProfileMenu || "Open profile menu"}
      >
        <AccountCircleIcon fontSize="large" />
        <FontAwesomeIcon style={{ marginLeft: "6px", fontSize: "19px" }}  icon={isOpen ? faAngleUp : faAngleDown}
/>
      </ProfileButton>
      {isOpen && (
        <DropdownMenu
          id="header-profile-dropdown"
          role="menu"
          aria-labelledby="header-profile-btn"
        >
          <DropdownMenuItem role="menuitem" tabIndex={0}>
            <AccountCircleIcon/>
            {strings.menu?.profile || "Omat tiedot"}
          </DropdownMenuItem>
          <DropdownMenuItem
            role="menuitem"
            tabIndex={0}
            onClick={handleUserGuide}
            aria-label={strings.tooltips.showUserGuide}
          >
            <FontAwesomeIcon icon={faQuestion} />
            {strings.tooltips.userGuide || "Käyttöohjeet"}
          </DropdownMenuItem>
          <DropdownMenuItem
            role="menuitem"
            tabIndex={0}
            onClick={handleInfo}
            aria-label={strings.tooltips.showPageInfo}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            {strings.tooltips.pageInfo || "Sovelluksen tiedot"}
          </DropdownMenuItem>
          <MenuDivider />
<DropdownMenuItem className="logout" role="menuitem" tabIndex={0}>
  <PillButton
    id="profile-dropdown-logout-btn"
    icon={faArrowRightFromBracket}
    iconColor={"#FFF"} // <-- add this prop and handle in PillButton
    text={"Kirjaudu ulos"}
    onClick={() => alert("kirjaudu ulos")}
    aria-label={"Kirjaudu ulos"}
  />
</DropdownMenuItem>

        </DropdownMenu>
      )}
    </ProfileDropdownContainer>
  );
};

export default ProfileDropdown;
