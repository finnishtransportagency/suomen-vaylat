import { useContext } from 'react';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { setShareUrl } from '../../state/slices/uiSlice';
import CircleButton from '../../utils/components/CircleButton';
import strings from '../../translations';
import { useAppSelector } from '../../state/hooks';

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
    color: ${(props) => props.theme.colors.mainWhite};
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
export const ThemeGroupShareButton = ({ themeId }) => {
  const { store } = useContext(ReactReduxContext);
  const url =
    process.env.REACT_APP_SITE_URL +
    '/theme/{zoom}/{x}/{y}/' +
    themeId +
    '/?lang={lang}';

  return (
    <StyledShareButton
      onClick={(e) => {
        e && e.stopPropagation();
        store.dispatch(setShareUrl(url));
      }}
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
export const WebSiteShareButton = () => {
  const { store } = useContext(ReactReduxContext);
  const { shareUrl } = useAppSelector((state) => state.ui);
  const url =
    process.env.REACT_APP_SITE_URL +
    '/link/{zoom}/{x}/{y}/{maplayers}/?lang={lang}';
  return (
    <>
      <CircleButton
        id="menubar-share-btn"
        aria-label={strings.accessibility?.shareWebsite ?? 'Share website'}
        icon={faShareAlt}
        text={strings.tooltips.share}
        toggleState={false}
        tooltipDirection="right"
        clickAction={(e) => {
          e?.stopPropagation();
          shareUrl
            ? store.dispatch(setShareUrl(null))
            : store.dispatch(setShareUrl(url));
        }}
      />
    </>
  );
};
