import { useContext } from "react";
import styled from 'styled-components';
//import { device } from '../../device';
import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import { setLocale } from '../../state/slices/languageSlice';

import strings from './../../translations';

const StyledLanguageSelector = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #fff;
    padding-right: 10px;
`;

const StyledSelect = styled.select`
    cursor: pointer;
    width: 45px;
    height: 30px;
    background-color: transparent;
    border: none;
    color: #fff;
    font-size: 18px;
    option {
        border: none;
        background-color: #0064af;
        width: 45px;
        height: 30px;
        font-size: 18px;
    };
    &:focus {
            outline: 0;
            outline-color: transparent;
            outline-style: none;
    };
`;

export const LanguageSelector = () => {
    const { store } = useContext(ReactReduxContext);
    const lang = useAppSelector((state) => state.language);

    return (
        <StyledLanguageSelector>
            <StyledSelect
                name="langueage_selector"
                value={lang.current}
                onChange={(event: { target: { value: any; }; }) => store.dispatch(setLocale(event.target.value))}
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