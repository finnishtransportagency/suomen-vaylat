import { useContext } from "react";
import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from "react-redux";
import styled from 'styled-components';
import LanguageSelector from '../language-selector/LanguageSelector';
import strings from '../../translations';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import { setIsInfoOpen } from "../../state/slices/uiSlice";

import { WebSiteShareButton } from '../share-web-site/ShareLinkButtons';

import { ReactComponent as VaylaLogoFi } from './images/vayla_sivussa_fi_white.svg';
import { ReactComponent as VaylaLogoEn } from './images/vayla_sivussa_en_white.svg';
import { ReactComponent as VaylaLogoSv } from './images/vayla_sivussa_sv_white.svg';

const StyledHeaderContainer = styled.div`
    z-index: 20;
    height: 80px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    @media ${props => props.theme.device.desktop} {
        height: 60px;
    };
    @media ${props => props.theme.device.tablet} {
        grid-template-columns: 1fr 1fr;
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

    return (
        <StyledHeaderContainer>
            <ReactTooltip id={'show_info'} place='bottom' type='dark' effect='float'>
                <span>{strings.tooltips.showPageInfo}</span>
            </ReactTooltip>
            <StyledHeaderTitleContainer>
                    {strings.title.toUpperCase()}
            </StyledHeaderTitleContainer>
            <StyledHeaderLogoContainer>
                {   lang.current === 'fi' ? <VaylaLogoFi /> :
                    lang.current === 'en' ? <VaylaLogoEn /> :
                    lang.current === 'sv' ? <VaylaLogoSv /> : <VaylaLogoFi />}
                {/* <a href="https://www.vayla.fi" target="_blank" rel="noreferrer">
                    <img alt="Väylä" src={vaylaLogo}/>
                </a> */}
            </StyledHeaderLogoContainer>
            <StyledRightCornerButtons>
                <WebSiteShareButton />
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