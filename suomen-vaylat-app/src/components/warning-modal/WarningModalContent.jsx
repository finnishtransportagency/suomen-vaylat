import styled from 'styled-components';
import { useState } from "react";
import strings from "../../translations";

const StyledWarningModalContainer = styled.div`
    padding: 32px;
    color: ${(props) => props.theme.colors.mainColor1};
    @media ${(props) => props.theme.device.mobileL} {
        padding: 16px;
    }
`;

const StyledWarningTitle = styled.p`
    font-size: 20px;
    @media ${(props) => props.theme.device.mobileL} {
        font-size: 18px;
    }
`;

const StyledWarningSubtitle = styled.p`
    font-size: 18px;
    @media ${(props) => props.theme.device.mobileL} {
        font-size: 16px;
    }
`;

const StyledWarningButtonsContainer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 18px;
    border-top: 1px solid #dee2e6;
    @media ${(props) => props.theme.device.mobileL} {
        flex-direction: column;
    }
`;

const StyledActionButton = styled.button`
    min-height: 48px;
    min-width: 90px;
    margin: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.mainColor1};
    border-radius: 30px;
    padding: 8px;
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
    border: none;
    color: white;

    @media ${(props) => props.theme.device.mobileL} {
        width: 80%;
    }
`;

const CheckboxContainer = styled.div`
    margin-bottom: 10px;
    input[type="checkbox"] {
        margin-right: 10px;
    }
    @media ${(props) => props.theme.device.mobileL} {
        margin-bottom: 12px;
    }
`;

const WarningModalContent = ({ warning }) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleConfirm = (event) => {
        event.preventDefault();
        dontShowAgain && localStorage.setItem(warning.dontShowAgain.id, JSON.stringify(dontShowAgain));
        warning.confirm.action();
    };

    return (
        <StyledWarningModalContainer>
            <StyledWarningTitle>{warning.title && warning.title}</StyledWarningTitle>
            <StyledWarningSubtitle>{warning.subtitle && warning.subtitle}</StyledWarningSubtitle>
            <StyledWarningButtonsContainer>
                { warning.dontShowAgain &&
                    <CheckboxContainer>
                        <input type="checkbox" id="dontShowAgain" checked={dontShowAgain} onChange={() => setDontShowAgain(!dontShowAgain)}/>
                        <label htmlFor="dontShowAgain">{strings.general.dontShowAgain}</label>
                    </CheckboxContainer>
                }
                { warning.cancel &&
                    <StyledActionButton onClick={() => warning.cancel.action()}>
                        {warning.cancel.text}
                    </StyledActionButton>
                }
                { warning.confirm &&
                    <StyledActionButton onClick={handleConfirm}>
                        {warning.confirm.text}
                    </StyledActionButton>
                }
            </StyledWarningButtonsContainer>
        </StyledWarningModalContainer>
    );
};

export default WarningModalContent;
