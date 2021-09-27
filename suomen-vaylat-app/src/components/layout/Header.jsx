import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';

import LanguageSelector from '../language-selector/LanguageSelector';
import strings from '../../translations';

import {ReactComponent as VaylaLogoFi} from './images/vayla_sivussa_fi_white.svg';
import {ReactComponent as VaylaLogoEn} from './images/vayla_sivussa_en_white.svg';
import {ReactComponent as VaylaLogoSv} from './images/vayla_sivussa_sv_white.svg';
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {setIsInfoOpen} from "../../state/slices/uiSlice";
import {useContext} from "react";
import {ReactReduxContext} from "react-redux";
import { WebSiteShareButton } from '../share-web-site/ShareLinkButtons';

const StyledHeaderContainer = styled.div`
    z-index: 20;
    height: 80px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    @media ${props => props.theme.device.desktop} {
        height: 60px;
        //display: none;
    };
    @media ${props => props.theme.device.tablet} {
        grid-template-columns: 1fr 1fr;
        //display: none;
    };
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
`;

const StyledHeaderButton = styled.div`
    position: relative;
    cursor: pointer;
    width: 40px;
    height: 40px;
    margin-right:5px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border-radius: 50%;
    svg {
        font-size: 18px;
        color: ${props => props.theme.colors.mainWhite};
    };
    @media ${props => props.theme.device.mobileL} {
        width: 40px;
        height: 40px;
    };
`;

const StyledHeaderTitleContainer = styled.p`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: inherit;
    margin: 0;
    padding-left: 10px;
    font-weight: 600;
    color: ${props => props.theme.colors.mainWhite};
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
                <StyledHeaderButton onClick={() => store.dispatch(setIsInfoOpen(!isInfoOpen))}>
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