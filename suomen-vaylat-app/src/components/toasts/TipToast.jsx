import strings from "../../translations";
import styled from "styled-components";

const StyledToastContent = styled.div`
    h6 {
        font-size: 16px;
        font-weight: bold;
    }
`

const StyledToastButton = styled.button`
    border: none;
    background: none;
    color: ${props => props.theme.colors.button};
    padding: 0px;
    font-weight: bold;
    &:hover {
        color: ${props => props.theme.colors.buttonActive }
    }
`;

export const TipToast = ({text, handleButtonClick, localStorageName}) => {

    const handleDontShowAgain = () => {
        localStorage.setItem(localStorageName, JSON.stringify(false));
        handleButtonClick();
    };

    return (
        <StyledToastContent>
            {text}
            {localStorageName && <StyledToastButton onClick={() => handleDontShowAgain()}>{ `${strings.general.OkLowerCaseK}, ${strings.general.dontShowAgain.toLowerCase()}.`}</StyledToastButton>} 
        </StyledToastContent>
    )
};

export default TipToast;