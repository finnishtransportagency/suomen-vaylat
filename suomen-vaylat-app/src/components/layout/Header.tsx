import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';

import LanguageSelector from '../language-selector/LanguageSelector';
import strings from './../../translations';

import {ReactComponent as VaylaLogoFi} from './images/vayla_sivussa_fi_white.svg';
import {ReactComponent as VaylaLogoEn} from './images/vayla_sivussa_en_white.svg';
import {ReactComponent as VaylaLogoSv} from './images/vayla_sivussa_sv_white.svg';
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {setIsFullScreen, setIsInfoOpen, setIsMainScreen} from "../../state/slices/uiSlice";
import {mapMoveRequest, setZoomTo} from "../../state/slices/rpcSlice";
import {useContext} from "react";
import {ReactReduxContext} from "react-redux";

const StyledHeaderContainer = styled.div`
    z-index: 20;
    height: 80px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    @media ${(props: { theme: { device: { desktop: any; }; }; }) => props.theme.device.desktop} {
        height: 60px;
        //display: none;
    };
    @media ${(props: { theme: { device: { tablet: any; }; }; }) => props.theme.device.tablet} {
        grid-template-columns: 1fr 1fr;
        //display: none;
    };
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
`;

const StyledHeaderMenuBarButton = styled.div`
    position: relative;
    cursor: pointer;
    width: 40px;
    height: 40px;
    margin-right:5px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props: { theme: { colors: { maincolor1: any; }; }; }) => props.theme.colors.maincolor1};
    border-radius: 50%;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    svg {
        font-size: 18px;
        color: ${(props: { theme: { colors: { mainWhite: any; }; }; }) => props.theme.colors.mainWhite};
    };
    @media ${(props: { theme: { device: { mobileL: any; }; }; }) => props.theme.device.mobileL} {
        width: 40px;
        height: 40px;
    };
`;

const StyledHeaderTitleContainer = styled.p`
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: inherit;
    margin: 0;
    padding-left: 10px;
    font-weight: 600;
    color: ${(props: { theme: { colors: { mainWhite: any; }; }; }) => props.theme.colors.mainWhite};
    @media ${(props: { theme: { device: { tablet: any; }; }; }) => props.theme.device.tablet} {
        display: none;
    };
    @media ${(props: { theme: { device: { desktop: any; }; }; }) => props.theme.device.desktop} {
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

const StyledLanguageSelector = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: ${(props: { theme: { colors: { mainWhite: any; }; }; }) => props.theme.colors.mainWhite};
    padding-right: 10px;
`;

export const Header = () => {
    const lang = useAppSelector((state) => state.language);
    const { store } = useContext(ReactReduxContext);
    const isInfoOpen = useAppSelector((state) => state.ui.isInfoOpen);
    // // FIXME Use localization (also check images)
    // let vaylaLogo = <VaylaLogoFi />;
    // //const lang = strings.getLanguage();
    // if (lang.current === 'en') {
    //     vaylaLogo = <VaylaLogoEn />;
    // } else if (lang.current === 'sv') {
    //     vaylaLogo = <VaylaLogoSv />;
    // }

    const setToMainScreen = () => {
        store.dispatch(mapMoveRequest({
            x: 505210.92181416467,
            y: 7109206.188955102
        }));
        store.dispatch(setIsMainScreen())
        store.dispatch(setZoomTo(0))
    };

    return (
        <StyledHeaderContainer>
            <StyledHeaderTitleContainer onClick={() => setToMainScreen()}>
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
            <StyledLanguageSelector>
                <StyledHeaderMenuBarButton onClick={() => store.dispatch(setIsInfoOpen(!isInfoOpen))}>
                    <FontAwesomeIcon
                        icon={faInfoCircle}
                    />
                </StyledHeaderMenuBarButton>
                <LanguageSelector />
            </StyledLanguageSelector>
        </StyledHeaderContainer>
    );
 }

 export default Header;