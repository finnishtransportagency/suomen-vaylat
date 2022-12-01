import strings from "../../translations";
import styled from "styled-components";
import { DRAWING_TIP_LOCALSTORAGE } from "../../utils/constants";

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

export const DrawingToast = ({text, handleButtonClick}) => {

    const handleClick = () => {
        localStorage.setItem(DRAWING_TIP_LOCALSTORAGE, JSON.stringify(false));
        handleButtonClick();
    };

    return(
        <div>
            <p>{text}</p>
            <StyledToastButton onClick={() => handleClick()}>{ `${strings.general.OkLowerCaseK}, ${strings.general.dontShowAgain.toLowerCase()}.`}</StyledToastButton>
        </div>
    )
};

export default DrawingToast;