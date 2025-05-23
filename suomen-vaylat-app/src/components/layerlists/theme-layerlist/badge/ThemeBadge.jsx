import { useContext, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import { faMap, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import strings from '../../../../translations';
import { selectGroup } from '../../../../utils/rpcUtil';
import { ThemeGroupShareButton } from '../../../share-website/ShareLinkButtons';

const StyledActionButton = styled(motion.div)`
  max-width: 312px;
  height: 3em;
  padding: 0.5em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) =>
    props.type === 'gfi'
      ? props.theme.colors.mainColor1
      : props.theme.colors.secondaryColorGreen};
  box-shadow: 2px 2px 4px #0000004d;
  border-radius: 24px;
  color: ${(props) => props.theme.colors.mainWhite};
  pointer-events: auto;
  svg {
    color: ${(props) => props.theme.colors.mainWhite};
  }
  @media ${(props) => props.theme.device.mobileL} {
    top: initial;
    max-width: 212px;
    height: 40px;
  }
  ${({ isExpanded }) =>
    isExpanded &&
    `
        height: auto !important;
    `}
  z-index:100;
`;

const StyledActionButtonIcon = styled.div`
  min-width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    font-size: 18px;
  }
  @media ${(props) => props.theme.device.mobileL} {
    min-width: 40px;
    height: 40px;
    svg {
      font-size: 16px;
    }
  }
`;

const StyledActionButtonClose = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg {
    font-size: 20px;
  }
  @media ${(props) => props.theme.device.mobileL} {
    svg {
      font-size: 18px;
    }
  }
`;

const StyledContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  ${({ isExpanded }) =>
    isExpanded &&
    `
        height: auto;
    `}
`;

const StyledActionButtonText = styled.div`
  width: 100%;
  margin: 0;
  padding: 0.5em;
  font-size: 14px;
  font-weight: 600;
  user-select: none;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: max-height 0.3s ease;

  ${({ isExpanded }) =>
    isExpanded &&
    `
        white-space: normal;
        overflow: visible;
        max-height: none;
        padding: 0.5em;
        background: ${(props) => props.theme.colors.secondaryColorGreen};
        border-radius: 8px;
    `}

  @media ${(props) => props.theme.device.mobileL} {
    font-size: 12px;
  }
`;

const ThemeBadge = ({}) => {
  const { store } = useContext(ReactReduxContext);
  const [isTextExpanded, setIsTextExpanded] = useState(false); // state to control text expansion
  const lang = strings.getLanguage();

  const {
    channel,
    selectedTheme,
    lastSelectedTheme,
    selectedThemeId,
    filteringInfo
  } = useAppSelector((state) => state.rpc);

  const handleSelectGroup = (index, theme) => {
    selectGroup(
      store,
      channel,
      null,
      theme,
      lastSelectedTheme,
      selectedThemeId
    );
  };

  // Get titles of filtered layers
  var filterInfoTitle = '';
  filteringInfo.forEach((fil, index) => {
    const title =
      fil.layer.title.length > 10
        ? fil.layer.title.substring(0, 10) + '... '
        : fil.layer.title;
    index === 0
      ? (filterInfoTitle += title)
      : (filterInfoTitle += ', ' + title);
  });

  console.log(selectedTheme)

  return (
    <StyledActionButton
      key="theme_action_button"
      isExpanded={isTextExpanded}
      positionTransition
      initial={{ y: 50, filter: 'blur(10px)', opacity: 0 }}
      animate={{ y: 0, filter: 'blur(0px)', opacity: 1 }}
      exit={{ y: 50, filter: 'blur(10px)', opacity: 0 }}
      transition={{
        duration: 0.4,
        type: 'tween'
      }}
    >
      <StyledContentWrapper>
        <StyledActionButtonIcon>
          <FontAwesomeIcon icon={faMap} />
        </StyledActionButtonIcon>
        <StyledActionButtonText
          isExpanded={isTextExpanded}
          onClick={() => setIsTextExpanded(!isTextExpanded)}
        >
          {selectedTheme?.locale[lang].name}
        </StyledActionButtonText>
        <ThemeGroupShareButton themeId={selectedTheme?.id} />
        <StyledActionButtonClose
          onClick={() => handleSelectGroup(selectedThemeId, selectedTheme)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </StyledActionButtonClose>
      </StyledContentWrapper>
    </StyledActionButton>
  );
};

export default ThemeBadge;
