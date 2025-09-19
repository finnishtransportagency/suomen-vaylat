import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import strings from '../../translations';
import { IS_EXTRANET } from '../../utils/appInfoUtil';

const StyledLanguageSelector = styled.div`
  width: auto;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: transparent;
  position: relative;
  margin-left: 1em;
  @media ${(props) => props.theme.device.mobileL} {
    margin-left: 0px;
  }
`;

const LanguageText = styled.span`
  font-family: inherit;
  font-weight: 500;
  font-size: 1.5em;
  @media ${(props) => props.theme.device.mobileL} {
    font-size: 20px;
  }
  color: ${(props) =>
    IS_EXTRANET ? props.theme.colors.mainColor1 : props.theme.colors.mainWhite};
  text-transform: uppercase;
`;

const LanguageSelect = styled.select`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;

  option {
    background-color: ${(props) => props.theme.colors.mainColor1};
    color: ${(props) => props.theme.colors.mainWhite};
    font-size: 18px;
    font-weight: 600;
    text-transform: uppercase;
  }
`;

export const LanguageSelector = () => {
  const lang = useAppSelector((state) => state.language);

  const redirect = (key, value) => {
    let urlParams = new URLSearchParams(window.location.search);
    urlParams.delete(key);
    urlParams.set(key, value);
    window.location.search = urlParams.toString();
  };

  return (
    <StyledLanguageSelector>
      <LanguageText>{lang.current.toUpperCase()}</LanguageText>
      <LanguageSelect
        value={lang.current}
        onChange={(e) => redirect('lang', e.target.value)}
        aria-label={strings.accessibility.langSelect}
      >
        {strings.getAvailableLanguages().map((value) => (
          <option key={value} value={value}>
            {strings.getString('language.languageSelection.' + value)}
          </option>
        ))}
      </LanguageSelect>
    </StyledLanguageSelector>
  );
};

export default LanguageSelector;
