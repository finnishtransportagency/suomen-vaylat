import React, { useRef } from 'react';
import { faCopy, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useState } from 'react';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { setShareUrl } from '../../state/slices/uiSlice';
import strings from '../../translations';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import ReactTooltip from 'react-tooltip';

const StyledShareWebSiteContainer = styled.div`
    position:absolute;
    top: 50%;
    left: 50%;
    z-index:30;
    margin-top: -150px;
    margin-left: -150px;
    width: 300px;
    height: 200px;
    background:white;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    @media ${props => props.theme.device.mobileL} {
        font-size: 13px;
    };
`;

const StyledHeader = styled.div`
    padding: .5rem;
    background-color: ${props => props.theme.colors.maincolor1};
    color: ${props => props.theme.colors.mainWhite};
    border-radius: 0
`;

const StyledCloseIcon = styled.div`
    cursor: pointer;
    position:absolute;
    right: 0;
    top: 8px;
    justify-content: center;
    align-items: center;
    min-width: 28px;
    min-height: 28px;
    svg {
        transition: all 0.1s ease-out;
        font-size: 18px;
        color: ${props => props.theme.colors.mainWhite};
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.maincolor2};
        }
    }
`;

const StyledClipboardIcon = styled.div`
    svg {
        transition: all 0.1s ease-out;
        font-size: 18px;
        color: ${props => props.theme.colors.maincolor1};
    };

`;

const StyledContainer = styled.div`
    padding: 6px;
    height: calc(100% - 40px);
    overflow-y: auto;
`;

const StyledInput = styled.textarea`
    width: 100%;
    height: 80px;
    resize: none;
`;

const StyledShareButtonsContainer = styled.div`
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    aling-items: center;
    width: calc(100% - 12px);
    button {
        margin: 4px;
        margin-bottom: 8px;
    };
`;

const StyledCopyClipboardButton = styled.button`
    justify-content: center;
    align-items: center;
    border: none;
    background-color: ${props => props.theme.colors.maincolor1};
    margin-right: 10px;
    width: 32px;
    height: 32px;
    svg {
        transition: all 0.1s ease-out;
        font-size: 18px;
        color: ${props => props.theme.colors.mainWhite};
    };
    &:hover {
        color: ${props => props.theme.colors.maincolor2};
        svg {
            color: ${props => props.theme.colors.mainWhite};
        }
    }
`;

const StyledCopiedToClipboardText = styled.span`
    color: ${props => props.theme.colors.maincolor1};
`;

export const ShareWebSite = () => {
    const { store } = useContext(ReactReduxContext);
    const shareUrl = useAppSelector((state) => state.ui.shareUrl);
    const [isCopied, setIsCopied] = useState(false);

    const title = strings.share.shareTexts.title;
    const emailBody = strings.share.shareTexts.emailBody;
    const shareIconSize = 32;
    const inputRef = useRef(null);
    return (
        <StyledShareWebSiteContainer>
            <ReactTooltip id='clipboard' place='right' type='dark' effect='float'>
                <span>{strings.share.tooltips.clipboard}</span>
            </ReactTooltip>
            <ReactTooltip id='email' place='right' type='dark' effect='float'>
                <span>{strings.share.tooltips.email}</span>
            </ReactTooltip>

            <ReactTooltip id='facebook' place='right' type='dark' effect='float'>
                <span>{strings.share.tooltips.facebook}</span>
            </ReactTooltip>

            <ReactTooltip id='twitter' place='right' type='dark' effect='float'>
                <span>{strings.share.tooltips.twitter}</span>
            </ReactTooltip>

            <ReactTooltip id='linkedin' place='right' type='dark' effect='float'>
                <span>{strings.share.tooltips.linkedin}</span>
            </ReactTooltip>

            <ReactTooltip id='whatsapp' place='right' type='dark' effect='float'>
                <span>{strings.share.tooltips.whatsapp}</span>
            </ReactTooltip>

            <ReactTooltip id='telegram' place='right' type='dark' effect='float'>
                <span>{strings.share.tooltips.telegram}</span>
            </ReactTooltip>

            <StyledHeader>
                {strings.share.title}
                <StyledCloseIcon onClick={() => {
                    store.dispatch(setShareUrl(''));
                }}>
                    <FontAwesomeIcon icon={faTimes} />
                </StyledCloseIcon>
            </StyledHeader>
            <StyledContainer>
                <StyledInput value={shareUrl} ref={inputRef} readOnly>
                </StyledInput>
                {isCopied ? <StyledCopiedToClipboardText>{strings.share.shareTexts.copiedToClipboard}</StyledCopiedToClipboardText> : null}
                <StyledShareButtonsContainer>
                    <CopyToClipboard text={shareUrl} onCopy={() => {setIsCopied(true);}}>
                        <StyledCopyClipboardButton
                            onClick={() => {
                                inputRef.current.select();
                            }}
                            data-tip data-for='clipboard'
                        >
                            <StyledClipboardIcon>
                                <FontAwesomeIcon icon={faCopy}></FontAwesomeIcon>
                            </StyledClipboardIcon>
                        </StyledCopyClipboardButton>
                    </CopyToClipboard>
                    <EmailShareButton url={shareUrl} subject={title} body={emailBody} data-tip data-for='email'>
                        <EmailIcon size={shareIconSize} />
                    </EmailShareButton>
                    <FacebookShareButton url={shareUrl} quote={title} data-tip data-for='facebook'>
                        <FacebookIcon size={shareIconSize} />
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl} title={title} data-tip data-for='twitter'>
                        <TwitterIcon size={shareIconSize} />
                    </TwitterShareButton>
                    <LinkedinShareButton url={shareUrl} data-tip data-for='linkedin'>
                        <LinkedinIcon size={shareIconSize} />
                    </LinkedinShareButton>
                    <WhatsappShareButton url={shareUrl} title={title} separator=': ' data-tip data-for='whatsapp'>
                        <WhatsappIcon size={shareIconSize} />
                    </WhatsappShareButton>
                    <TelegramShareButton url={shareUrl} title={title} data-tip data-for='telegram'>
                        <TelegramIcon size={shareIconSize} />
                    </TelegramShareButton>
                </StyledShareButtonsContainer>
            </StyledContainer>
        </StyledShareWebSiteContainer>
    );
};