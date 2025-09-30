import React from 'react';
import strings from '../../translations';
import styled from 'styled-components';
import header from './images/header.png';
import lang from './images/lang.png';
import menu from './images/menu.png';
import userguide from './images/userguide.png';
import appInfo from './images/appInfo.png';
import extranetHeader from './images/extranet_header.png';
import extranetLang from './images/extranet_lang.png';
import extranetMenu from './images/extranet_menu.png';
import extranetUserInfo from './images/extranet_user_info.png';
import { IS_EXTRANET } from '../../utils/appInfoUtil';

const StyledIcon = styled.img`
  height: 28px;
`;

const StyledSubTitle = styled.em`
  margin-left: 5px;
  color: ${(props) => props.theme.colors.mainColor1};
`;

const upperBarImages = {
  0: header,
  1: lang,
  2: menu,
  3: userguide,
  4: appInfo
};

// For extranet we provide a parallel mapping (keys 0..4). Adjusted to avoid duplicate keys.
const extranetUpperBarImages = {
  0: extranetHeader,
  1: extranetLang,
  2: extranetMenu,
  3: extranetUserInfo,
  4: userguide,
  5: appInfo
};

const UserGuideUpperBarContent = () => {
  // choose content + images based on extranet flag
  const contentObj = IS_EXTRANET
    ? strings?.appGuide?.dialogContent?.upperBar?.extranetContent
    : strings?.appGuide?.dialogContent?.upperBar?.content;

  const images = IS_EXTRANET ? extranetUpperBarImages : upperBarImages;

  if (!contentObj) return null;

  return Object.values(contentObj).map((value, index) => {
    const imgSrc = images[index];
    const title = value?.title ?? '';
    const text = value?.text ?? '';

    return (
      <div key={'ugubc_' + index}>
        {imgSrc ? (
          <StyledIcon src={imgSrc} alt={title || `upperbar-image-${index}`} aria-label={title || `upperbar-image-${index}`} />
        ) : (
          // if no image is provided for this index, render nothing or a placeholder span
          <span aria-hidden="true" style={{ display: 'inline-block', width: 28, height: 28 }} />
        )}
        <StyledSubTitle>{title}</StyledSubTitle>
        <p>{text}</p>
      </div>
    );
  });
};

export default UserGuideUpperBarContent;
