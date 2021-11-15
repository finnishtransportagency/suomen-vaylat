import { useEffect, useRef } from 'react';
import { faCopy, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Draggable from 'react-draggable';
import { ReactReduxContext } from 'react-redux';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { setShareUrl } from '../../state/slices/uiSlice';
import strings from '../../translations';

const StyledShareWebSiteContainer = styled.div`
    z-index: 30;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 200px;
    background: white;
    margin-top: -150px;
    margin-left: -150px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    @media ${props => props.theme.device.mobileL} {
        font-size: 13px;
    };
`;

const StyledHeader = styled.div`
    cursor: move;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.mainColor1};
    padding: .5rem;
    border-radius: 0;
`;

const StyledCloseIcon = styled.div`
    position: absolute;
    top: 8px;
    right: 0;
    min-width: 28px;
    min-height: 28px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 18px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.mainColor2};
        }
    }
`;

const StyledClipboardIcon = styled.div`
    svg {
        color: ${props => props.theme.colors.mainColor1};
        font-size: 18px;
        transition: all 0.1s ease-out;
    };
`;

const StyledContainer = styled.div`
    height: calc(100% - 40px);
    overflow-y: auto;
    padding: 6px;
`;

const StyledInput = styled.textarea`
    width: 100%;
    height: 80px;
    resize: none;
`;

const StyledShareButtonsContainer = styled.div`
    position: absolute;
    bottom: 0;
    width: calc(100% - 12px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    flex-wrap: nowrap;
    button {
        margin: 4px;
        margin-bottom: 8px;
    };
`;

const StyledCopyClipboardButton = styled.button`
    width: 32px;
    height: 32px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.colors.mainColor1};
    margin-right: 10px;
    border: none;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 18px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        color: ${props => props.theme.colors.mainColor2};
        svg {
            color: ${props => props.theme.colors.mainWhite};
        }
    }
`;

const StyledCopiedToClipboardText = styled.span`
    color: ${props => props.theme.colors.mainColor1};
`;

/**
 * Shows ShareWebSitePopup if shareUrl is defined in Redux state.
 */
export const ShareWebSitePopup = () => {

    const { store } = useContext(ReactReduxContext);

    const {
        center,
        currentZoomLevel,
        selectedLayers,
        legends
    } = useAppSelector(state => state.rpc);

    const {
        shareUrl,
        selectedLayerList
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
    url = url.replace('{layerlistType}', selectedLayerList);
    url = url.replace('{lang}', strings.getLanguage());

    const title = strings.share.shareTexts.title;
    const emailBody = strings.share.shareTexts.emailBody;
    const shareIconSize = 32;
    const inputRef = useRef(null);

    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const updateSize = () =>
        setSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
    useEffect(() => (window.onresize = updateSize), []);

    return (
        <Draggable handle='.draggable-handler' bounds="parent" disabled={size.width / 2 < 300}>
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

                <StyledHeader className='draggable-handler'>
                    {strings.share.title}
                    <StyledCloseIcon onClick={() => {
                        store.dispatch(setShareUrl(''));
                    }}>
                        <FontAwesomeIcon icon={faTimes} />
                    </StyledCloseIcon>
                </StyledHeader>
                <StyledContainer>
                    <StyledInput value={url} ref={inputRef} readOnly>
                    </StyledInput>
                    {isCopied ? <StyledCopiedToClipboardText>{strings.share.shareTexts.copiedToClipboard}</StyledCopiedToClipboardText> : null}
                    <StyledShareButtonsContainer>
                        <CopyToClipboard text={url} onCopy={() => { setIsCopied(true); }}>
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
                        <EmailShareButton url={url} subject={title} body={emailBody} data-tip data-for='email'>
                            <EmailIcon size={shareIconSize} />
                        </EmailShareButton>
                        <FacebookShareButton url={url} quote={title} data-tip data-for='facebook'>
                            <FacebookIcon size={shareIconSize} />
                        </FacebookShareButton>
                        <TwitterShareButton url={url} title={title} data-tip data-for='twitter'>
                            <TwitterIcon size={shareIconSize} />
                        </TwitterShareButton>
                        <LinkedinShareButton url={url} data-tip data-for='linkedin'>
                            <LinkedinIcon size={shareIconSize} />
                        </LinkedinShareButton>
                        <WhatsappShareButton url={url} title={title} separator=': ' data-tip data-for='whatsapp'>
                            <WhatsappIcon size={shareIconSize} />
                        </WhatsappShareButton>
                        <TelegramShareButton url={url} title={title} data-tip data-for='telegram'>
                            <TelegramIcon size={shareIconSize} />
                        </TelegramShareButton>
                    </StyledShareButtonsContainer>
                </StyledContainer>
            </StyledShareWebSiteContainer>
        </Draggable>
    );
};