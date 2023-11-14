import {useEffect, useState} from "react";
import styled from "styled-components";
import strings from "../../translations";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 500;
`;

const HeaderContainer = styled.div`
  display: flex;  
  align-items: center;
  background-color: #C73F00;
  padding: 9px;
  color: #fff;
`;

const ExclamationIcon = styled.div`
  margin-right: 4px;
`;

const ModalContainer = styled.div`
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
  border-radius: 4px;

  p {
    margin-bottom: 20px;
    padding: 5px;
  }

  button {
    min-height: 48px;
    min-width: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: ${props => props.theme.colors.mainColor1};
    border-radius: 4px;
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
    border: none;
    color: white;

    &:hover {
      background-color: #0056b3;
    }
  }
  `;

  const CheckboxContainer = styled.div`
    margin-bottom: 10px;

    input[type="checkbox"] {
      margin-right: 10px;
  }
  `;

  const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-around;
    padding: 5px;
  `;

const ExitConfirmationModal = ({ isOpen, onRequestClose, onConfirm }) => {
  const [dontShow, setDontShow] = useState(false);
  const [tempDontShow, setTempDontShow] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('dontShowModal');
    if (savedState) {
      setDontShow(JSON.parse(savedState));
      setTempDontShow(JSON.parse(savedState));
    }
  }, []);

  const handleConfirmLeave = (event) => {
    event.preventDefault();
    setDontShow(tempDontShow);
    localStorage.setItem('dontShowModal', JSON.stringify(tempDontShow));
    onConfirm();
  };

  if (!isOpen || dontShow) {
    return null;
  }

  return (
    <ModalOverlay>
      <ModalContainer>
      <HeaderContainer>
      <ExclamationIcon>
      <FontAwesomeIcon icon={faExclamationCircle} size="lg" /> 
      </ExclamationIcon>
        {strings.general.warning}
        </HeaderContainer>
        <p>{strings.exitConfirmation}</p>
        <CheckboxContainer>
          <input type="checkbox" checked={tempDontShow} onChange={() => setTempDontShow(!tempDontShow)} />
          <label>{strings.general.dontShowAgain}</label>
        </CheckboxContainer>
        <ButtonContainer>
          <button onClick={onRequestClose}>{strings.general.cancel}</button>
          <button onClick={handleConfirmLeave}>{strings.general.continue}</button>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};


export default ExitConfirmationModal;
