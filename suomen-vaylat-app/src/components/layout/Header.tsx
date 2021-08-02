import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';
import { device } from '../../device';

import LanguageSelector from '../language-selector/LanguageSelector';
import strings from './../../translations';

import {ReactComponent as VaylaLogoFi} from './images/vayla_sivussa_fi_white.svg';
import {ReactComponent as VaylaLogoEn} from './images/vayla_sivussa_en_white.svg';
import {ReactComponent as VaylaLogoSv} from './images/vayla_sivussa_sv_white.svg';

const StyledHeaderContainer = styled.div`
    height: 80px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    @media ${device.desktop} {
        height: 60px;
        //display: none;
    };
    @media ${device.tablet} {
        grid-template-columns: 1fr 1fr;
        //display: none;
    };
`;

const StyledHeaderTitleContainer = styled.p`
    display: flex;
    justify-content: center;
    align-items: center;
    height: inherit;
    margin: 0;
    color: #fff;
    @media ${device.tablet} {
        display: none;
    };
    @media ${device.desktop} {
        font-size: 25px;
    };
`;

const StyledHeaderLogoContainer = styled.div`
        height: inherit;
        display: flex;
        justify-content: flex-start;
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
            <StyledHeaderLogoContainer>
                {   lang.current === 'fi' ? <VaylaLogoFi /> :
                    lang.current === 'en' ? <VaylaLogoEn /> :
                    lang.current === 'sv' ? <VaylaLogoSv /> : <VaylaLogoFi />}
                {/* <a href="https://www.vayla.fi" target="_blank" rel="noreferrer">
                    <img alt="Väylä" src={vaylaLogo}/>
                </a> */}
            </StyledHeaderLogoContainer>
            <StyledHeaderTitleContainer>
                    {strings.title.toUpperCase()}
            </StyledHeaderTitleContainer>
            <LanguageSelector />
        </StyledHeaderContainer>
    );
 }

 export default Header;