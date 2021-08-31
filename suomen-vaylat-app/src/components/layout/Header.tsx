import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';

import LanguageSelector from '../language-selector/LanguageSelector';
import strings from './../../translations';

import {ReactComponent as VaylaLogoFi} from './images/vayla_sivussa_fi_white.svg';
import {ReactComponent as VaylaLogoEn} from './images/vayla_sivussa_en_white.svg';
import {ReactComponent as VaylaLogoSv} from './images/vayla_sivussa_sv_white.svg';

const StyledHeaderContainer = styled.div`
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
`;

const StyledHeaderTitleContainer = styled.p`
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

export const Header = () => {
    const lang = useAppSelector((state) => state.language);
    // // FIXME Use localization (also check images)
    // let vaylaLogo = <VaylaLogoFi />;
    // //const lang = strings.getLanguage();
    // if (lang.current === 'en') {
    //     vaylaLogo = <VaylaLogoEn />;
    // } else if (lang.current === 'sv') {
    //     vaylaLogo = <VaylaLogoSv />;
    // }
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
            <LanguageSelector />
        </StyledHeaderContainer>
    );
 }

 export default Header;