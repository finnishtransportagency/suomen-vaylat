import React, { useState, useRef } from 'react';
import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ReactTooltip from 'react-tooltip';

import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from 'react-share';
import { isMobile, theme } from '../../theme/theme';

import strings from '../../translations';

const StyledClipboardIcon = styled.div`
  svg {
    color: ${(props) => props.theme.colors.mainColor1};
    font-size: 18px;
    transition: all 0.1s ease-out;
  }
`;

const StyledContainer = styled.div`
  text-align: start;
  margin: 18px;
`;

const StyledInput = styled.textarea`
  width: 100%;
  height: 80px;
  resize: none;
  border: none;
`;

const StyledShareButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 8px;
`;

const StyledCopyClipboardButton = styled.button`
  border-radius: 50%;
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.mainColor1};
  box-shadow: 2px 2px 4px #0000004d;
  border: none;
  margin: 4px;
  svg {
    color: ${(props) => props.theme.colors.mainWhite};
    font-size: 18px;
    transition: all 0.1s ease-out;
  }
  &:hover {
    color: ${(props) => props.theme.colors.mainColor2};
    svg {
      color: ${(props) => props.theme.colors.mainWhite};
    }
  }
`;

const StyledCopiedToClipboardText = styled(motion.span)`
  color: ${(props) => props.theme.colors.mainColor1};
`;

const StyledTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 1em;
`;

const StyledTable = styled.table`
  margin-bottom: 1em;
  font-family: arial, sans-serif;
  border: none;
  width: 100%;
  td,
  th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
    vertical-align: baseline;
    font-weight: 500;
  }
`;

export const StyledShareDescription = ({
  currentZoomLevel,
  selectedLayers,
  center,
  lang,
  hasThemeShare,
  selectedTheme
}) => {
  if (!hasThemeShare) {
    return (
      <StyledTable>
        <tbody>
          {lang && (
            <tr>
              <td>{strings.share.shareDescriptions.lang}</td>
              <td>{strings.share.shareDescriptions.languages[lang]}</td>
            </tr>
          )}
          {(currentZoomLevel !== null || currentZoomLevel !== undefined) && (
            <tr>
              <td>{strings.share.shareDescriptions.currentZoomLevel}</td>
              <td>{currentZoomLevel}</td>
            </tr>
          )}
          {center && (
            <tr>
              <td>{strings.share.shareDescriptions.center}</td>
              <td>
                <div>x: {center.x}</div>
                <div>y: {center.y}</div>
              </td>
            </tr>
          )}
          {selectedLayers && (
            <tr>
              <td>{strings.share.shareDescriptions.selectedLayers}</td>
              <td>
                {selectedLayers.map((layer) => {
                  return (
                    <div key={`share_layer_${layer.id}`}>{layer.name}</div>
                  );
                })}
              </td>
            </tr>
          )}
        </tbody>
      </StyledTable>
    );
  } else {
    return (
      <StyledTable>
        <tbody>
          {lang && (
            <tr>
              <td>{strings.share.shareDescriptions.lang}</td>
              <td>{strings.share.shareDescriptions.languages[lang]}</td>
            </tr>
          )}
          {(currentZoomLevel !== null || currentZoomLevel !== undefined) && (
            <tr>
              <td>{strings.share.shareDescriptions.currentZoomLevel}</td>
              <td>{currentZoomLevel}</td>
            </tr>
          )}
          {center && (
            <tr>
              <td>{strings.share.shareDescriptions.center}</td>
              <td>
                <div>x: {center.x}</div>
                <div>y: {center.y}</div>
              </td>
            </tr>
          )}
          <tr>
            <td>{strings.share.shareDescriptions.theme}</td>
            <td>{selectedTheme.locale[lang].name}</td>
          </tr>
        </tbody>
      </StyledTable>
    );
  }
};

/**
 * Shows ShareWebSitePopup if shareUrl is defined in Redux state.
 */
const ShareWebSitePopup = () => {
  const { center, currentZoomLevel, selectedLayers, legends, selectedTheme } =
    useAppSelector((state) => state.rpc);

  const { shareUrl } = useAppSelector((state) => state.ui);

  const [isCopied, setIsCopied] = useState(false);

  const getMapLayerStyle = (layer) => {
    const legend = legends.filter((l) => {
      return l.layerId === layer.id;
    });
    if (legend.length > 0) {
      return legend[0].legendStyle ? legend[0].legendStyle : 'default';
    }
    return 'default';
  };

  let mapLayers = '';
  selectedLayers.forEach((l) => {
    mapLayers += l.id + '+' + l.opacity + '+' + getMapLayerStyle(l) + '++';
  });
  mapLayers = mapLayers.substring(0, mapLayers.length - 2);

  // Replace link placeholders to correct values
  let url = shareUrl.replace('{zoom}', currentZoomLevel);
  url = url.replace('{x}', parseInt(center.x));
  url = url.replace('{y}', parseInt(center.y));
  url = url.replace('{maplayers}', mapLayers);
  url = url.replace('{lang}', strings.getLanguage());

  const hasThemeShare =
    typeof shareUrl === 'string' ? shareUrl.includes('/theme/') : false;

  const title = strings.share.shareTexts.title;
  const emailBody = strings.share.shareTexts.emailBody;
  const shareIconSize = 48;
  const inputRef = useRef(null);

  const shareIconStyle = {
    margin: '8px',
    filter: 'drop-shadow( 2px 2px 4px #0000004d)'
  };

  return (
    <StyledContainer>
      <StyledTitle>{strings.share.shareTexts.descTitle}</StyledTitle>
      <StyledShareDescription
        currentZoomLevel={currentZoomLevel}
        selectedLayers={selectedLayers}
        center={center}
        lang={strings.getLanguage()}
        hasThemeShare={hasThemeShare}
        selectedTheme={selectedTheme}
      />
      <StyledTitle>{strings.share.shareTexts.linkTitle}</StyledTitle>
      <StyledInput value={url} ref={inputRef} readOnly />
      <AnimatePresence>
        {isCopied && (
          <StyledCopiedToClipboardText
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              type: 'tween'
            }}
          >
            {strings.share.shareTexts.copiedToClipboard}
          </StyledCopiedToClipboardText>
        )}
      </AnimatePresence>
      <StyledShareButtonsContainer>
        <ReactTooltip
          backgroundColor={theme.colors.mainColor1}
          disable={isMobile}
          id="clipboard"
          place="bottom"
          type="dark"
          effect="float"
        >
          <span>{strings.share.tooltips.clipboard}</span>
        </ReactTooltip>
        <ReactTooltip
          backgroundColor={theme.colors.mainColor1}
          disable={isMobile}
          id="email"
          place="bottom"
          type="dark"
          effect="float"
        >
          <span>{strings.share.tooltips.email}</span>
        </ReactTooltip>

        <ReactTooltip
          backgroundColor={theme.colors.mainColor1}
          disable={isMobile}
          id="facebook"
          place="bottom"
          type="dark"
          effect="float"
        >
          <span>{strings.share.tooltips.facebook}</span>
        </ReactTooltip>

        <ReactTooltip
          backgroundColor={theme.colors.mainColor1}
          disable={isMobile}
          id="twitter"
          place="bottom"
          type="dark"
          effect="float"
        >
          <span>{strings.share.tooltips.twitter}</span>
        </ReactTooltip>

        <ReactTooltip
          backgroundColor={theme.colors.mainColor1}
          disable={isMobile}
          id="linkedin"
          place="bottom"
          type="dark"
          effect="float"
        >
          <span>{strings.share.tooltips.linkedin}</span>
        </ReactTooltip>

        <ReactTooltip
          backgroundColor={theme.colors.mainColor1}
          disable={isMobile}
          id="whatsapp"
          place="bottom"
          type="dark"
          effect="float"
        >
          <span>{strings.share.tooltips.whatsapp}</span>
        </ReactTooltip>

        <ReactTooltip
          backgroundColor={theme.colors.mainColor1}
          disable={isMobile}
          id="telegram"
          place="bottom"
          type="dark"
          effect="float"
        >
          <span>{strings.share.tooltips.telegram}</span>
        </ReactTooltip>
        <CopyToClipboard
          text={url}
          onCopy={() => {
            setIsCopied(true);
          }}
          id="share-website-clipboard"
        >
          <StyledCopyClipboardButton
            onClick={() => {
              inputRef.current.select();
            }}
            data-tip
            data-for="clipboard"
          >
            <StyledClipboardIcon>
              <FontAwesomeIcon icon={faCopy} />
            </StyledClipboardIcon>
          </StyledCopyClipboardButton>
        </CopyToClipboard>
        <EmailShareButton
          url={url}
          subject={title}
          body={emailBody}
          data-tip
          data-for="email"
        >
          <EmailIcon round={true} size={shareIconSize} style={shareIconStyle} />
        </EmailShareButton>
        <FacebookShareButton
          url={url}
          quote={title}
          data-tip
          data-for="facebook"
        >
          <FacebookIcon
            round={true}
            size={shareIconSize}
            style={shareIconStyle}
          />
        </FacebookShareButton>
        <TwitterShareButton url={url} title={title} data-tip data-for="twitter">
          <TwitterIcon
            round={true}
            size={shareIconSize}
            style={shareIconStyle}
          />
        </TwitterShareButton>
        <LinkedinShareButton url={url} data-tip data-for="linkedin">
          <LinkedinIcon
            round={true}
            size={shareIconSize}
            style={shareIconStyle}
          />
        </LinkedinShareButton>
        <WhatsappShareButton
          url={url}
          title={title}
          separator=": "
          data-tip
          data-for="whatsapp"
        >
          <WhatsappIcon
            round={true}
            size={shareIconSize}
            style={shareIconStyle}
          />
        </WhatsappShareButton>
        <TelegramShareButton
          url={url}
          title={title}
          data-tip
          data-for="telegram"
        >
          <TelegramIcon
            round={true}
            size={shareIconSize}
            style={shareIconStyle}
          />
        </TelegramShareButton>
      </StyledShareButtonsContainer>
    </StyledContainer>
  );
};

export default ShareWebSitePopup;