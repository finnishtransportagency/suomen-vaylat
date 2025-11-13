import React, { useState } from 'react';
import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import LayersIcon from '@mui/icons-material/Layers';
import { faCopy, faEnvelope, faLayerGroup, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import strings from '../../translations';


const StyledPopupWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);

  @media ${props => props.theme.device.mobileL} {
    position: fixed;
    padding: 22px;
    bottom: 0;
    left: 0;
    width: 100vw;
    margin: 0;
    z-index: 1;
  }

  @media ${props => props.theme.device.mobileM} {
    padding: 7px;
  }

  @media ${props => props.theme.device.mobileS} {
    padding: 2px;
    font-size: 13px;
  }
`;

const StyledDescription = styled.p`
  font-size: 0.95rem;
  color: #333;
  margin: 0 0 16px;
`;


const StyledCopiedToClipboardText = styled(motion.span)`
  color: ${(props) => props.theme.colors.mainColor1};
`;

const StyledLinkBox = styled.div`
  border: 2px dashed ${(props) => props.theme.colors.mainColor1};
  border-radius: 8px;
  background: ${(props) => props.theme.colors.mainColor1}1A;
  padding: 16px;
  min-height: 100px;
  margin-bottom: 16px;
  word-break: break-word;
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.mainColor1};
`;

const StyledLayerSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: #ffffff;
  padding: 12px 16px;
  font-weight: 500;

  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 12px;
  margin-bottom: 16px;  /* always a gap before next element */

  @media ${(props) => props.theme.device.mobileL} {
    padding: 12px;
  }
`;


const StyledLayerList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 12px 16px;

  background-color: #ffffff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 12px;
  margin-bottom: 16px;

  /* If the list comes right after the summary, visually merge them */
  ${StyledLayerSummary} + & {
    border-top: none;
    border-radius: 0 0 12px 12px;
    margin-top: -16px;   /* overlap to remove the gap */
  }

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;

    .mui-icon {
      font-size: 18px;
      color: ${(p) => p.theme.colors.mainColor1};
    }
  }
`;


const StyledLayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .icon {
    color: ${(props) => props.theme.colors.mainColor1};
  }

  .texts {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .title {
    font-size: 14px;
    font-weight: 600;
  }

  .sub {
    font-size: 13px;
    color: #666;
    margin-top: 2px;
  }
`;

const StyledButtonColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 180px; 
`;

const StyledRightAction = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.mainColor1};
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;

  &:hover {
    text-decoration: underline;
  }

  .caret {
    transition: transform 0.15s ease;
    transform: rotate(${(p) => (p.$open ? '180deg' : '0deg')});
  }
`;



const StyledActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 12px;
  flex-wrap: wrap;

  @media ${props => props.theme.device.mobileL} {
    flex-direction: column;
    gap: 8px;
  }

  @media ${props => props.theme.device.mobileM} {
    flex-direction: column;
    gap: 8px;
  }

  @media ${props => props.theme.device.mobileS} {
    flex-direction: column;
    gap: 8px;
    padding: 8px;
  }
`;


const StyledCTAButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;

  background-color: ${(props) => props.theme.colors.mainColor1};
  color: ${(props) => props.theme.colors.mainWhite};

  border: none;
  padding: 10px 20px;
  border-radius: 999px; // makes pill shape
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  svg {
    color: ${(props) => props.theme.colors.mainWhite};
    font-size: 16px;
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.mainColor2}; // hover color if defined
  }
`;

/**
 * Shows ShareWebsiteContent if shareUrl is defined in Redux state.
 */
export const ShareWebsiteContent = () => {
  const { center, currentZoomLevel, selectedLayers, legends } =
    useAppSelector((state) => state.rpc);

  const { shareUrl } = useAppSelector((state) => state.ui);

  const [isCopied, setIsCopied] = useState(false);
  const [showLayers, setShowLayers] = useState(false);

  const getMapLayerStyle = (layer) => {
    const legend = legends.find((l) => l.layerId === layer.id);
    return legend?.legendStyle || 'default';
  };

  let mapLayers = '';
  selectedLayers.forEach((l) => {
    mapLayers += l.id + '+' + l.opacity + '+' + getMapLayerStyle(l) + '++';
  });
  mapLayers = mapLayers.slice(0, -2); // remove last '++'

  let url = shareUrl
    .replace('{zoom}', currentZoomLevel)
    .replace('{x}', parseInt(center.x))
    .replace('{y}', parseInt(center.y))
    .replace('{maplayers}', mapLayers)
    .replace('{lang}', strings.getLanguage());

  const title = strings.share.shareTexts.title;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(url)}`;
  };

  return (
      <StyledPopupWrapper>
        <StyledDescription>
          {strings.share.shareTexts.shareDescription}
      </StyledDescription>
        {selectedLayers?.length > 0 && (
  <>
  <StyledLayerSummary>
    <StyledLayerInfo>
      <FontAwesomeIcon icon={faLayerGroup} className="icon" />
      <div className="texts">
        <div className="title">
          {strings.share.shareTexts.showOpenLayersTitle}
        </div>
        <div className="sub">
          {strings.formatString(strings.share.shareTexts.showOpenLayersCount, {
            count: selectedLayers.length,
          })}
        </div>
      </div>
    </StyledLayerInfo>

    <StyledRightAction
      onClick={() => setShowLayers((prev) => !prev)}
      $open={showLayers}
    >
      {showLayers
        ? strings.share.shareTexts.hideOpenLayers
        : strings.share.shareTexts.showOpenLayers}
      <FontAwesomeIcon icon={faChevronDown} className="caret" />
    </StyledRightAction>
  </StyledLayerSummary>


    {showLayers && (
  <StyledLayerList>
    {selectedLayers.map((layer) => (
      <li key={layer.id}>
      <LayersIcon className="mui-icon" />
        {layer.name}
      </li>
    ))}
  </StyledLayerList>
)}

  </>
)}


        <StyledLinkBox>{url}</StyledLinkBox>

        <StyledActionButtons>
          <StyledButtonColumn>
            <StyledCTAButton onClick={handleCopy}>
              <FontAwesomeIcon icon={faCopy} />
              {strings.share.shareTexts.copyToClipboard}
            </StyledCTAButton>

            <AnimatePresence>
              {isCopied && (
                <StyledCopiedToClipboardText
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, type: 'tween' }}
                >
                  {strings.share.shareTexts.copiedToClipboard}
                </StyledCopiedToClipboardText>
              )}
            </AnimatePresence>
          </StyledButtonColumn>
            
          <StyledButtonColumn>
            <StyledCTAButton onClick={handleEmail}>
              <FontAwesomeIcon icon={faEnvelope} />
              {strings.share.shareTexts.sendEmail}
            </StyledCTAButton>
          </StyledButtonColumn>
        </StyledActionButtons>

      </StyledPopupWrapper>
  );
};
