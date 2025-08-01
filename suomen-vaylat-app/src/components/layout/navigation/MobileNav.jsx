import {
  faInfoCircle,
  faQuestion,
  faTimes,
  faGlobe,
  faArrowRightFromBracket,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../../state/hooks';
import {
  setIsInfoOpen,
  setIsUserGuideOpen,
  setIsSaveViewOpen
} from '../../../state/slices/uiSlice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import strings from '../../../translations';
import LanguageSelector from '../../language-selector/LanguageSelector';
import { ReactComponent as VaylaLogoMobile } from '../images/vayla_v_white.svg';

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

  @media ${(props) => props.theme.device.desktop} {
    width: 140px;
  }
  @media ${(props) => props.theme.device.mobileL} {
    height: 45px;
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

const MobileNav = ({ setIsMenuOpen }) => {
  const { store } = useContext(ReactReduxContext);
  const { isLoggedIn } = useAppSelector((state) => state.rpc);

  // Accessible ID constants
  const menuId = 'mobile-nav-menu-list';
  const bannerId = 'mobile-nav-header-row';
  const profileBtnId = 'mobile-nav-profile-button';
  const userGuideBtnId = 'mobile-nav-user-guide-button';
  const infoBtnId = 'mobile-nav-info-button';
  const langBtnId = 'mobile-nav-language-button';
  const signOutBtnId = 'mobile-nav-sign-out-button';
  const menuLabelId = 'mobile-nav-menu-title';

  // Menu actions
  const handleProfile = () => {
    store.dispatch(setIsSaveViewOpen(true));
    setIsMenuOpen(false);
  };

  const handleUserGuide = () => {
    store.dispatch(setIsUserGuideOpen(true));
    setIsMenuOpen(false);
  };

  const handleInfo = () => {
    store.dispatch(setIsInfoOpen(true));
    setIsMenuOpen(false);
  };

  return (
    <StyledMobileNavContainer
      id="mobile-nav-container"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      aria-label={strings.accessibility.mobileNavigation}
      role="navigation"
      aria-labelledby={menuLabelId}
    >
      <StyledMobileHeaderRow
        id={bannerId}
        role="banner"
        aria-label={strings.accessibility.mobileHeader}
        aria-controls={menuId}
      >
        <StyledHeaderLogoContainer id="mobile-nav-header-logo-container">
          <VaylaLogoMobile aria-hidden="true" focusable="false" />
        </StyledHeaderLogoContainer>

        <StyledMobileMenuTitle id={menuLabelId} aria-hidden="false">
          {strings.title}
        </StyledMobileMenuTitle>

        <StyledHeaderButton
          id="mobile-nav-close-button"
          onClick={() => setIsMenuOpen(false)}
          aria-label={strings.accessibility.closeMenu}
        >
          <FontAwesomeIcon
            icon={faTimes}
            aria-hidden="true"
            focusable="false"
          />
        </StyledHeaderButton>
      </StyledMobileHeaderRow>

      <MobileMenuList id={menuId} role="menu" aria-labelledby={menuLabelId}>
        <StyledMobileMenuButton
          id={profileBtnId}
          onClick={handleProfile}
          aria-label={strings.tooltips.profile}
          aria-haspopup="true"
          role="menuitem"
          aria-controls={menuId}
        >
          <div className="icon-wrapper" id="mobile-nav-profile-icon-wrapper">
            {isLoggedIn ? (
              <AccountCircleIcon />
            ) : (
              <FontAwesomeIcon icon={faSave} />
            )}
          </div>
          <div className="text-wrapper" id="mobile-nav-profile-text-wrapper">
            {strings.tooltips.profile}
          </div>
        </StyledMobileMenuButton>

        <StyledMobileMenuButton
          id={userGuideBtnId}
          onClick={handleUserGuide}
          aria-label={strings.tooltips.userGuide}
          aria-haspopup="true"
          role="menuitem"
          aria-controls={menuId}
        >
          <div className="icon-wrapper" id="mobile-nav-user-guide-icon-wrapper">
            <FontAwesomeIcon
              icon={faQuestion}
              aria-hidden="true"
              focusable="false"
            />
          </div>
          <div className="text-wrapper" id="mobile-nav-user-guide-text-wrapper">
            {strings.tooltips.userGuide}
          </div>
        </StyledMobileMenuButton>

        <StyledMobileMenuButton
          id={infoBtnId}
          onClick={handleInfo}
          aria-label={strings.tooltips.pageInfo}
          aria-haspopup="true"
          role="menuitem"
          aria-controls={menuId}
        >
          <div className="icon-wrapper" id="mobile-nav-info-icon-wrapper">
            <FontAwesomeIcon
              icon={faInfoCircle}
              aria-hidden="true"
              focusable="false"
            />
          </div>
          <div className="text-wrapper" id="mobile-nav-info-text-wrapper">
            {strings.tooltips.pageInfo}
          </div>
        </StyledMobileMenuButton>

        <StyledMobileMenuButton
          id={langBtnId}
          aria-label={strings.accessibility.languageSelect}
          aria-haspopup="listbox"
          role="menuitem"
          aria-controls="mobile-nav-language-selector-wrapper"
        >
          <div className="icon-wrapper" id="mobile-nav-language-icon-wrapper">
            <FontAwesomeIcon
              icon={faGlobe}
              aria-hidden="true"
              focusable="false"
            />
          </div>
          <div
            className="text-wrapper"
            id="mobile-nav-language-selector-wrapper"
          >
            <HiddenLanguageIconWrapper>
              <LanguageSelector />
            </HiddenLanguageIconWrapper>
          </div>
        </StyledMobileMenuButton>

        {isLoggedIn && (
          <StyledMobileMenuButton
            id={signOutBtnId}
            aria-label={strings.signOut}
            role="menuitem"
            tabIndex={0}
          >
            <div className="icon-wrapper" id="mobile-nav-sign-out-icon-wrapper">
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                aria-hidden="true"
                focusable="false"
              />
            </div>
            <div className="text-wrapper" id="mobile-nav-sign-out-text-wrapper">
              {strings.signOut}
            </div>
          </StyledMobileMenuButton>
        )}
      </MobileMenuList>
    </StyledMobileNavContainer>
  );
};

export default MobileNav;
