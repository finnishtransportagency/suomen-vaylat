import styled from 'styled-components';
import {useEffect, useState} from "react";
import strings from "../../translations";

const StyledWarningModalContainer = styled.div`
    padding: 32px 32px 16px 32px;
    color: ${props => props.theme.colors.mainColor1};
`;

const StyledWarningTitle = styled.p`

`;

const StyledWarningSubtitle = styled.p`

`;

const StyledWarningButtonsContainer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: baseline;
    padding: 18px;
    border-top: 1px solid #dee2e6;
`;

const StyledActionButton = styled.button`
    min-height: 48px;
    min-width: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: ${props => props.theme.colors.mainColor1};
    border-radius: 30px;
    padding: 8px 0px 8px 0px;
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
    border: none;
    color: white;
    padding: 8px 16px 8px 16px;
`;

const CheckboxContainer = styled.div`
    margin-bottom: 10px;
    input[type="checkbox"] {
      margin-right: 10px;
  }
  `;

const WarningModalContent = ({
    warning
}) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleConfirm = (event) => {
        event.preventDefault();
        dontShowAgain && localStorage.setItem(warning.dontShowAgain.id, JSON.stringify(dontShowAgain));
        warning.confirm.action();
    };

    return <StyledWarningModalContainer>
        <StyledWarningTitle>{warning.title && warning.title}</StyledWarningTitle>
        <StyledWarningSubtitle>{warning.subtitle && warning.subtitle}</StyledWarningSubtitle>
        <StyledWarningButtonsContainer>
            {  warning.dontShowAgain &&
                <CheckboxContainer>
                    <input type="checkbox" id="dontShowAgain" checked={dontShowAgain} onChange={() => setDontShowAgain(!dontShowAgain)}/>
                    <label for="dontShowAgain">{strings.general.dontShowAgain}</label>

                </CheckboxContainer>
            }
            {
                warning.cancel &&
                <StyledActionButton
                    onClick={() => warning.cancel.action()}
                >
                    {warning.cancel.text}
                </StyledActionButton>
            }
            {
                warning.confirm &&
                <StyledActionButton
                    onClick={handleConfirm}
                >
                     {warning.confirm.text}
                </StyledActionButton>
            }
        </StyledWarningButtonsContainer>

    </StyledWarningModalContainer>
};

export default WarningModalContent;