import React, { useState, useRef } from 'react';
import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ReactTooltip from 'react-tooltip';

import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import { isMobile } from '../../theme/theme';

import strings from '../../translations';

const StyledClipboardIcon = styled.div`
    svg {
        color: ${props => props.theme.colors.mainColor1};
        font-size: 18px;
        transition: all 0.1s ease-out;
    };
`;

const StyledContainer = styled.div`
    text-align: center;
    margin: 18px;
`;

const StyledInput = styled.textarea`
    width: 100%;
    height: 80px;
    resize: none;
    border: none;
    font-size: 14px;
`;

const StyledShareDescriptionWrapper = styled.div`
    width: 100%;
    // height: 80px;
    margin-bottom: 25px;
    resize: none;
    border: none;
    font-size: 14px;
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
    background-color: ${props => props.theme.colors.mainColor1};
    box-shadow: 2px 2px 4px #0000004d;
    border: none;
    margin: 4px;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 18px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        color: ${props => props.theme.colors.mainColor2};
        svg {
            color: ${props => props.theme.colors.mainWhite};
        };
    };
`;

const SharePageWord = styled.p`
    margin: 0;
`;

const StyledCopiedToClipboardText = styled(motion.span)`
    color: ${props => props.theme.colors.mainColor1};
`;

export const StyledShareDescription = ({currentZoomLevel, selectedLayers, center, lang}) => {
    const stringArray = []
    let string = "";
    if(selectedLayers) stringArray.push(strings.share.shareDescriptions.chosenContent); stringArray.push(strings.share.shareDescriptions.contentTransparency);
    if(currentZoomLevel !== null || currentZoomLevel !== undefined) stringArray.push(strings.share.shareDescriptions.currentZoomLevel)
    if(center) stringArray.push(strings.share.shareDescriptions.center);
    if(lang) stringArray.push(strings.share.shareDescriptions.lang);

    const makeString = (string, stringArray) => {
        for(let i=0; i < stringArray.length; i++) {
            if(i === stringArray.length -1) {
                string += stringArray[i] + "."
            } else if(i + 1 == stringArray.length-1){
                string += stringArray[i] + " " + strings.share.shareDescriptions.and + " "
            } else {
                string += stringArray[i] + ", "
            }
        }
        return string !== '' ? strings.share.shareDescriptions.share + ' ' + string : ''
    }

    return (
        <StyledShareDescriptionWrapper>
            <SharePageWord>{makeString(string, stringArray)}</SharePageWord>
        </StyledShareDescriptionWrapper>
    )
}

/**
 * Shows ShareWebSitePopup if shareUrl is defined in Redux state.
 */
export const ShareWebSitePopup = () => {
    const {
        center,
        currentZoomLevel,
        selectedLayers,
        legends
    } = useAppSelector(state => state.rpc);

    const {
        shareUrl
    } = useAppSelector(state => state.ui);

    const [isCopied, setIsCopied] = useState(false);

    const getMapLayerStyle = (layer) => {
        const legend = legends.filter((l) => { return l.layerId === layer.id;});
        if (legend.length > 0) {
            return legend[0].legendStyle ? legend[0].legendStyle : 'default';
        }
        return 'default';
    };

    let mapLayers = '';
    selectedLayers.forEach((l) => {
        mapLayers += l.id + '+' + l.opacity + '+' + getMapLayerStyle(l) + '++';
    });
    mapLayers = mapLayers.substring(0, mapLayers.length-2);

    // Replace link palceholders to correct values
    let url = shareUrl.replace('{zoom}', currentZoomLevel);
    url = url.replace('{x}', parseInt(center.x));
    url = url.replace('{y}', parseInt(center.y));
    url = url.replace('{maplayers}', mapLayers);
    url = url.replace('{lang}', strings.getLanguage());

    const title = strings.share.shareTexts.title;
    const emailBody = strings.share.shareTexts.emailBody;
    const shareIconSize = 48;
    const inputRef = useRef(null);

    return (
            <StyledContainer>
                <StyledShareDescription 
                    currentZoomLevel={currentZoomLevel}
                    selectedLayers={selectedLayers}
                    center={center}
                    lang={strings.getLanguage()}
                />
                <StyledInput value={url} ref={inputRef} readOnly />
                <AnimatePresence>
                    {isCopied &&
                        <StyledCopiedToClipboardText
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        type: "tween"
                                    }}
                                >
                                    {strings.share.shareTexts.copiedToClipboard}
                        </StyledCopiedToClipboardText>
                    }
                </AnimatePresence>
                <StyledShareButtonsContainer>
                <ReactTooltip disable={isMobile} id='clipboard' place='top' type='dark' effect='float'>
                    <span>{strings.share.tooltips.clipboard}</span>
                </ReactTooltip>
                <ReactTooltip disable={isMobile} id='email' place='top' type='dark' effect='float'>
                    <span>{strings.share.tooltips.email}</span>
                </ReactTooltip>

                <ReactTooltip disable={isMobile} id='facebook' place='top' type='dark' effect='float'>
                    <span>{strings.share.tooltips.facebook}</span>
                </ReactTooltip>

                <ReactTooltip disable={isMobile} id='twitter' place='top' type='dark' effect='float'>
                <span>{strings.share.tooltips.twitter}</span>
                </ReactTooltip>

                <ReactTooltip disable={isMobile} id='linkedin' place='top' type='dark' effect='float'>
                <span>{strings.share.tooltips.linkedin}</span>
                </ReactTooltip>

                <ReactTooltip disable={isMobile} id='whatsapp' place='top' type='dark' effect='float'>
                    <span>{strings.share.tooltips.whatsapp}</span>
                </ReactTooltip>

                <ReactTooltip disable={isMobile} id='telegram' place='top' type='dark' effect='float'>
                    <span>{strings.share.tooltips.telegram}</span>
                </ReactTooltip>
                    <CopyToClipboard text={url} onCopy={() => { setIsCopied(true); }}>
                        <StyledCopyClipboardButton
                            onClick={() => {
                                inputRef.current.select();
                            }}
                            data-tip data-for='clipboard'
                        >
                            <StyledClipboardIcon>
                                <FontAwesomeIcon icon={faCopy} />
                            </StyledClipboardIcon>
                        </StyledCopyClipboardButton>
                    </CopyToClipboard>
                    <EmailShareButton url={url} subject={title} body={emailBody} data-tip data-for='email'>
                        <EmailIcon round={true} size={shareIconSize} style={{margin: "8px", filter: "drop-shadow( 2px 2px 4px #0000004d)"}} />
                    </EmailShareButton>
                    <FacebookShareButton url={url} quote={title} data-tip data-for='facebook'>
                        <FacebookIcon round={true} size={shareIconSize} style={{margin: "8px", filter: "drop-shadow( 2px 2px 4px #0000004d)"}}/>
                    </FacebookShareButton>
                    <TwitterShareButton url={url} title={title} data-tip data-for='twitter'>
                        <TwitterIcon round={true} size={shareIconSize} style={{margin: "8px", filter: "drop-shadow( 2px 2px 4px #0000004d)"}}/>
                    </TwitterShareButton>
                    <LinkedinShareButton url={url} data-tip data-for='linkedin'>
                        <LinkedinIcon round={true} size={shareIconSize} style={{margin: "8px", filter: "drop-shadow( 2px 2px 4px #0000004d)"}}/>
                    </LinkedinShareButton>
                    <WhatsappShareButton url={url} title={title} separator=': ' data-tip data-for='whatsapp'>
                        <WhatsappIcon round={true} size={shareIconSize} style={{margin: "8px", filter: "drop-shadow( 2px 2px 4px #0000004d)"}}/>
                    </WhatsappShareButton>
                    <TelegramShareButton url={url} title={title} data-tip data-for='telegram'>
                        <TelegramIcon round={true} size={shareIconSize} style={{margin: "8px", filter: "drop-shadow( 2px 2px 4px #0000004d)"}}/>
                    </TelegramShareButton>
                </StyledShareButtonsContainer>
            </StyledContainer>
    );
};