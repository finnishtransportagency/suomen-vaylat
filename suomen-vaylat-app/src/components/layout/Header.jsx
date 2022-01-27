import { faInfoCircle, faQuestion, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useContext, useState} from 'react';
import { ReactReduxContext } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { isMobile } from '../../theme/theme';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../../state/hooks';
import { setIsInfoOpen, setIsMainScreen, setIsUserGuideOpen } from '../../state/slices/uiSlice';
import { mapMoveRequest } from '../../state/slices/rpcSlice';
import { resetThemeGroupsForMainScreen } from '../../utils/rpcUtil';
import strings from '../../translations';
import LanguageSelector from '../language-selector/LanguageSelector';
import { WebSiteShareButton } from '../share-web-site/ShareLinkButtons';
import { ReactComponent as VaylaLogoEn } from './images/vayla_sivussa_en_white.svg';
import { ReactComponent as VaylaLogoFi } from './images/vayla_sivussa_fi_white.svg';
import { ReactComponent as VaylaLogoSv } from './images/vayla_sivussa_sv_white.svg';
import { updateLayers } from '../../utils/rpcUtil';

const StyledHeaderContainer = styled.div`
    height: 64px;
    display: grid;
    position: relative;
    grid-template-columns: 1fr 1fr 1fr;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    @media ${props => props.theme.device.tablet} {
        height: 56px;
    };
`;

const StyledHeaderButton = styled.div`
    position: relative;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 22px;
    };
`;

const StyledHeaderTitleContainer = styled.p`
    cursor: pointer;
    height: inherit;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 0;
    color: ${props => props.theme.colors.mainWhite};
    padding-left: 8px;
    font-weight: 600;
    @media ${props => props.theme.device.desktop} {
        font-size: 25px;
    };
    @media ${props => props.theme.device.tablet} {
        font-size: 15px;
    };
`;

const StyledHeaderLogoContainer = styled.div`
    height: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    a {
        height: inherit;
    };
    svg {
        height: inherit;
    };
`;

const StyledRightCornerButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: ${props => props.theme.colors.mainWhite};
    padding-right: 10px;
    @media ${props => props.theme.device.desktop} {
        font-size: 25px;
    };
`;

const DesktopButtons = styled.div`
    display: flex;
    gap: 4px;
    @media ${props => props.theme.device.mobileL} {
        display: none;
    };
`;

const StyledMobileNavContainer = styled(motion.div)`
    z-index: 10;
    position: absolute;
    width: 100%;
    height: 56px;
    display: grid;
    left: 0px;
    top: 100%;
    background-color: ${props => props.theme.colors.mainColor1};
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    display: none;
    @media ${props => props.theme.device.mobileL} {
        display: flex;
        justify-content: flex-end;
    };
`;

const StyledRightCornerButtonsMobile = styled.div`
    display: flex;
    align-items: center;
    color: ${props => props.theme.colors.mainWhite};
`;

const MobileButtons = styled.div`
    display: none;
    @media ${props => props.theme.device.mobileL} {
        display: flex;
    };
    ${StyledHeaderButton}{
        margin-right: 0px;
        width: 24px;
        svg {
            font-size: 20px;
        }
    }
`;

export const Header = () => {
    const lang = useAppSelector((state) => state.language);
    const [ isSubNavOpen, setSubNavOpen ] = useState(false);
    const { store } = useContext(ReactReduxContext);
    const isInfoOpen = useAppSelector((state) => state.ui.isInfoOpen);
    const isUserGuideOpen = useAppSelector((state) => state.ui.isUserGuideOpen);

    const {
        channel,
        selectedLayers,
        lastSelectedTheme,
        selectedThemeIndex,
        startState
    } = useAppSelector((state) => state.rpc);

    const handleSelectGroup = (index, theme) => {
        resetThemeGroupsForMainScreen(store, channel, index, theme, lastSelectedTheme, selectedThemeIndex);
    };

    const setToMainScreen = () => {
        // remove all selected layers
        selectedLayers.forEach((layer) => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, false]);
        });

        // set map center
        store.dispatch(mapMoveRequest({
            x: startState.x,
            y: startState.y,
            zoom: startState.zoom
        }));

        // add start layers
        startState.selectedLayers.forEach((layerId) => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, true]);
        });

        store.dispatch(setIsMainScreen());
        handleSelectGroup(null, lastSelectedTheme);

        updateLayers(store, channel)
    };

    return (
        <>
            <StyledHeaderContainer>
                <ReactTooltip disable={isMobile} id={'show_info'} place='bottom' type='dark' effect='float'>
                    <span>{strings.tooltips.showPageInfo}</span>
                </ReactTooltip>
                <ReactTooltip disable={isMobile} id={'show_user_guide'} place='bottom' type='dark' effect='float'>
                    <span>{strings.tooltips.showUserGuide}</span>
                </ReactTooltip>
                <StyledHeaderTitleContainer onClick={() => setToMainScreen()}>
                        {strings.title}
                </StyledHeaderTitleContainer>
                <StyledHeaderLogoContainer>
                    <a
                        href={
                            lang.current === 'fi' ? "https://vayla.fi/etusivu" :
                            lang.current === 'en' ? "https://vayla.fi/en/frontpage" :
                            lang.current === 'sv' ? "https://vayla.fi/sv/framsida" : "https://vayla.fi/etusivu"
                        }
                        target="_blank"
                        rel="noreferrer">
                        {  
                            lang.current === 'fi' ? <VaylaLogoFi /> :
                            lang.current === 'en' ? <VaylaLogoEn /> :
                            lang.current === 'sv' ? <VaylaLogoSv /> : <VaylaLogoFi />
                        }
                    </a>
                </StyledHeaderLogoContainer>
                <StyledRightCornerButtons>
                    <MobileButtons>
                        <StyledHeaderButton onClick={() => setSubNavOpen(!isSubNavOpen)}>
                            <FontAwesomeIcon
                                icon={faEllipsisV}
                            />
                        </StyledHeaderButton>
                    </MobileButtons>
                    <DesktopButtons>
                        <WebSiteShareButton />
                        <StyledHeaderButton data-tip data-for={'show_user_guide'} onClick={() => store.dispatch(setIsUserGuideOpen(!isUserGuideOpen))}>
                            <FontAwesomeIcon
                                icon={faQuestion}
                            />
                        </StyledHeaderButton>
                        <StyledHeaderButton data-tip data-for={'show_info'} onClick={() => store.dispatch(setIsInfoOpen(!isInfoOpen))}>
                            <FontAwesomeIcon
                                icon={faInfoCircle}
                            />
                        </StyledHeaderButton>
                        <LanguageSelector />
                    </DesktopButtons>
                </StyledRightCornerButtons>
                <AnimatePresence>
                    {
                        isSubNavOpen &&
                        <StyledMobileNavContainer
                            initial={{ y: -100, filter: "blur(10px)", opacity: 0 }}
                            animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                            exit={{ y: -100, filter: "blur(10px)", opacity: 0 }}
                            transition={{
                                duration: 0.4,
                                type: "tween"
                            }}
                        >
                            <StyledRightCornerButtonsMobile>
                                <WebSiteShareButton setSubNavOpen={setSubNavOpen}/>
                                <StyledHeaderButton data-tip data-for={'show_user_guide'}
                                                    onClick={() => {
                                                        setSubNavOpen(false);
                                                        store.dispatch(setIsUserGuideOpen(!isUserGuideOpen))}
                                                    }>
                                    <FontAwesomeIcon
                                        icon={faQuestion}
                                    />
                                </StyledHeaderButton>
                                <StyledHeaderButton data-tip data-for={'show_info'}
                                                    onClick={() => {
                                                        setSubNavOpen(false);
                                                        store.dispatch(setIsInfoOpen(!isInfoOpen))}
                                                        }>
                                    <FontAwesomeIcon
                                        icon={faInfoCircle}
                                    />
                                </StyledHeaderButton>
                                <LanguageSelector/>
                            </StyledRightCornerButtonsMobile>
                        </StyledMobileNavContainer>
                    }
                </AnimatePresence>
            </StyledHeaderContainer>
        </>
    );
 }

 export default Header;
