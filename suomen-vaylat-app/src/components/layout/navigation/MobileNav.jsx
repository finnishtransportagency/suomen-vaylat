import {
  faInfoCircle,
  faQuestion,
  faTimes,
  faGlobe,
  faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useState } from 'react';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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

const MobileNav = ({ setSubNavOpen }) => {
  const { store } = useContext(ReactReduxContext);
  const { isLoggedIn } = useAppSelector((state) => state.rpc);

  return (
    <>
      <StyledMobileNavContainer
        id="header-mobile-nav-container"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        aria-label={strings.accessibility.mobileNavigation}
      >
        <StyledMobileHeaderRow
          id="header-mobile-header-row"
          role="banner"
          aria-label={strings.accessibility.mobileHeader}
        >
          <StyledHeaderLogoContainer id="header-mobile-header-logo-container">
            <VaylaLogoMobile aria-hidden="true" focusable="false" />
          </StyledHeaderLogoContainer>

          <StyledMobileMenuTitle
            id="header-mobile-menu-title"
            aria-hidden="true"
          >
            {strings.title}
          </StyledMobileMenuTitle>

          <StyledHeaderButton
            id="header-mobile-close-button"
            onClick={() => setSubNavOpen(false)}
            aria-label={strings.accessibility.closeMenu}
          >
            <FontAwesomeIcon
              icon={faTimes}
              aria-hidden="true"
              focusable="false"
            />
          </StyledHeaderButton>
        </StyledMobileHeaderRow>

        <MobileMenuList
          id="header-mobile-menu-list"
          aria-label={strings.accessibility.mobileMenu}
        >
          <StyledMobileMenuButton
            id="header-mobile-profile-button"
            onClick={() => store.dispatch(setIsSaveViewOpen(true))}
            aria-label={strings.tooltips.profile}
            aria-haspopup="true"
          >
            <div className="icon-wrapper" id="header-user-guide-icon-wrapper">
              <AccountCircleIcon />
            </div>
            <div className="text-wrapper">{strings.tooltips.profile}</div>
          </StyledMobileMenuButton>

          <StyledMobileMenuButton
            id="header-mobile-user-guide-button"
            onClick={() => store.dispatch(setIsUserGuideOpen(true))}
            aria-label={strings.tooltips.userGuide}
            aria-haspopup="true"
          >
            <div className="icon-wrapper" id="header-user-guide-icon-wrapper">
              <FontAwesomeIcon
                icon={faQuestion}
                aria-hidden="true"
                focusable="false"
              />
            </div>
            <div className="text-wrapper">{strings.tooltips.userGuide}</div>
          </StyledMobileMenuButton>

          <StyledMobileMenuButton
            id="header-mobile-info-button"
            onClick={() => store.dispatch(setIsInfoOpen(true))}
            aria-label={strings.tooltips.pageInfo}
            aria-haspopup="true"
          >
            <div className="icon-wrapper" id="header-info-icon-wrapper">
              <FontAwesomeIcon
                icon={faInfoCircle}
                aria-hidden="true"
                focusable="false"
              />
            </div>
            <div className="text-wrapper">{strings.tooltips.pageInfo}</div>
          </StyledMobileMenuButton>

          <StyledMobileMenuButton
            id="header-mobile-language-button"
            aria-label={strings.accessibility.languageSelect}
          >
            <div className="icon-wrapper" id="header-language-icon-wrapper">
              <FontAwesomeIcon
                icon={faGlobe}
                aria-hidden="true"
                focusable="false"
              />
            </div>
            <div className="text-wrapper" id="header-language-selector-wrapper">
              <HiddenLanguageIconWrapper>
                <LanguageSelector />
              </HiddenLanguageIconWrapper>
            </div>
          </StyledMobileMenuButton>

          {isLoggedIn && (
            <StyledMobileMenuButton
              id="header-mobile-sign-out-button"
              aria-label={strings.signOut}
            >
              <div className="icon-wrapper" id="header-sign-out-icon-wrapper">
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  aria-hidden="true"
                  focusable="false"
                />
              </div>
              <div
                className="text-wrapper"
                id="header-sign-out-selector-wrapper"
              >
                {strings.signOut}
              </div>
            </StyledMobileMenuButton>
          )}
        </MobileMenuList>
      </StyledMobileNavContainer>
    </>
  );
};

export default MobileNav;
