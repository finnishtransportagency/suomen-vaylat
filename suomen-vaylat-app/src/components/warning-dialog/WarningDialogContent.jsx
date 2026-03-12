import styled from 'styled-components';
import { useState } from 'react';
import strings from '../../translations';

const StyledWarningDialogContainer = styled.div`
  padding: 1rem;
  color: ${(props) => props.theme.colors.mainColor1};
  box-sizing: border-box;
  width: 100%;
  /* Allow content to wrap within the dialog's width */
  overflow: visible;
`;

const StyledWarningTitle = styled.p`
  font-size: 20px;

  margin: 0 0 8px 0;
  white-space: normal; /* allow wrapping */
  overflow-wrap: anywhere; /* break long words/URLs where needed */
  word-break: break-word; /* legacy support for some browsers */

  @media ${(props) => props.theme.device.mobileL} {
    font-size: 18px;
  }
`;

const StyledWarningSubtitle = styled.p`
  font-size: 18px;
  margin: 0 0 12px 0;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;

  @media ${(props) => props.theme.device.mobileL} {
    font-size: 16px;
  }
`;

const StyledWarningButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: baseline;
  padding-top: 1rem;
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
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  border: none;
  color: white;

  @media ${(props) => props.theme.device.mobileL} {
    width: 80%;
  }
`;

const CheckboxContainer = styled.div`
  margin-bottom: 10px;
  input[type='checkbox'] {
    margin-right: 10px;
  }
  @media ${(props) => props.theme.device.mobileL} {
    margin-bottom: 12px;
  }
`;

const StyledTextContent = styled.div`
  text-wrap: wrap;
`;

const WarningDialogContent = ({ warning }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleConfirm = (event) => {
    event.preventDefault();
    dontShowAgain &&
      localStorage.setItem(
        warning.dontShowAgain.id,
        JSON.stringify(dontShowAgain)
      );
    warning.confirm.action();
  };

  return (
    <StyledWarningDialogContainer>
      <StyledTextContent>
        <StyledWarningTitle>
          {warning.title && warning.title}
        </StyledWarningTitle>
        <StyledWarningSubtitle>
          {warning.subtitle && warning.subtitle}
        </StyledWarningSubtitle>
      </StyledTextContent>
      <StyledWarningButtonsContainer>
        {warning.dontShowAgain && (
          <CheckboxContainer>
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShowAgain}
              onChange={() => setDontShowAgain(!dontShowAgain)}
            />
            <label htmlFor="dontShowAgain">
              {strings.general.dontShowAgain}
            </label>
          </CheckboxContainer>
        )}
        {warning.cancel && (
          <StyledActionButton onClick={() => warning.cancel.action()}>
            {warning.cancel.text}
          </StyledActionButton>
        )}
        {warning.confirm && (
          <StyledActionButton onClick={handleConfirm}>
            {warning.confirm.text}
          </StyledActionButton>
        )}
      </StyledWarningButtonsContainer>
    </StyledWarningDialogContainer>
  );
};

export default WarningDialogContent;
