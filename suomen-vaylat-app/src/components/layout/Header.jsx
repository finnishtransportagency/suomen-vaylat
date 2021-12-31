import { faInfoCircle, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { isMobile } from '../../theme/theme';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { setIsInfoOpen, setIsMainScreen, setIsUserGuideOpen } from '../../state/slices/uiSlice';
import { mapMoveRequest, setZoomTo } from '../../state/slices/rpcSlice';
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
    grid-template-columns: 1fr 1fr 1fr;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    /* @media ${props => props.theme.device.desktop} {
        height: 60px;
    }; */
    @media ${props => props.theme.device.tablet} {
        grid-template-columns: 1fr 1fr;
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
    margin-right:5px;
    background-color: transparent;
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 18px;
    };
    @media ${props => props.theme.device.mobileL} {
        width: 40px;
        height: 40px;
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
    padding-left: 10px;
    font-weight: 600;
    @media ${props => props.theme.device.tablet} {
        display: none;
    };
    @media ${props => props.theme.device.desktop} {
        font-size: 25px;
    };
`;

const StyledHeaderLogoContainer = styled.div`
    height: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
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
`;

export const Header = () => {
    const lang = useAppSelector((state) => state.language);
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
                {   lang.current === 'fi' ? <VaylaLogoFi /> :
                    lang.current === 'en' ? <VaylaLogoEn /> :
                    lang.current === 'sv' ? <VaylaLogoSv /> : <VaylaLogoFi />}
            </StyledHeaderLogoContainer>
            <StyledRightCornerButtons>
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
            </StyledRightCornerButtons>
        </StyledHeaderContainer>
    );
 }

 export default Header;
