import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import strings from './../../translations';

const StyledLanguageSelector = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: ${(props: { theme: { colors: { mainWhite: any; }; }; }) => props.theme.colors.mainWhite};
    padding-right: 10px;
`;

const StyledSelect = styled.select`
    width: 45px;
    height: 30px;
    cursor: pointer;
    color: ${(props: { theme: { colors: { mainWhite: any; }; }; }) => props.theme.colors.mainWhite};
    background-color: transparent;
    border: none;
    font-size: 18px;
    option {
        width: 45px;
        height: 30px;
        background-color: ${(props: { theme: { colors: { mainColor1: any; }; }; }) => props.theme.colors.mainColor1};
        border: none;
        font-size: 18px;
    };
    &:focus {
            outline: 0;
            outline-color: transparent;
            outline-style: none;
    };
`;

export const LanguageSelector = () => {

    const lang = useAppSelector((state) => state.language);

    const redirect = (key:string, value:string) => {
        let urlParams = new URLSearchParams(window.location.search);
        urlParams.delete(key);
        urlParams.set(key, value);
        window.location.search = urlParams.toString();
    };

    return (
        <StyledLanguageSelector>
            <StyledSelect
                name="language_selector"
                value={lang.current}
                onChange={(event: { target: { value: any; }; }) => {
                    redirect('lang', event.target.value);
                }}
            >
                {strings.getAvailableLanguages().map((value, index) => {
                        return  (
                        <option
                            key={'lang-'+value}
                            value={value}
                        >
                            {strings.getString('language.languageSelection.' + value)}
                        </option>
                    )})}
            </StyledSelect>
        </StyledLanguageSelector>
    );
 }

 export default LanguageSelector;