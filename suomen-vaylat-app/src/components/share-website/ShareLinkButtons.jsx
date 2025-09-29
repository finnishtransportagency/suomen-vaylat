import { useContext } from 'react';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { setShareUrl } from '../../state/slices/uiSlice';
import CircleButton from '../../utils/components/CircleButton';
import strings from '../../translations';

const StyledShareButton = styled.button`
  height: 100%;
  display: flex;
  padding: 0;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  margin-right: 0px;
  border: none;
  svg {
    font-size: 18px;
    color: ${(props) =>
      props.color ? props.color : props.theme.colors.mainWhite};
    transition: all 0.5s ease-out;
  }
  @media ${(props) => props.theme.device.mobileL} {
    font-size: 16px;
  }
`;

/**
 * Theme group share button
 * @param {String} theme theme name
 * @returns theme share button component
 */
export const ThemeGroupShareButton = ({ themeId, color }) => {
  const { store } = useContext(ReactReduxContext);
  const url =
    process.env.REACT_APP_SITE_URL +
    '/theme/{zoom}/{x}/{y}/' +
    themeId +
    '/?lang={lang}';

  return (
    <StyledShareButton
      data-tip
      data-for={'share_' + themeId}
      onClick={(e) => {
        e && e.stopPropagation();
        store.dispatch(setShareUrl(url));
      }}
      color={color}
      aria-label={strings.tooltips.shareTheme}
    >
      <FontAwesomeIcon icon={faShareAlt} />
    </StyledShareButton>
  );
};

/**
 * Website share button
 * @returns  website share button component
 */
export const WebSiteShareButton = ({ setSubNavOpen }) => {
  const { store } = useContext(ReactReduxContext);
  const url =
    process.env.REACT_APP_SITE_URL +
    '/link/{zoom}/{x}/{y}/{maplayers}/?lang={lang}';
  return (
    <>
      <CircleButton
        icon={faShareAlt}
        text={strings.tooltips.share}
        toggleState={false}
        tooltipDirection="right"
        clickAction={(e) => {
          e?.stopPropagation();
          setSubNavOpen?.(false);
          store.dispatch(setShareUrl(url));
        }}
      />
    </>
  );
};
