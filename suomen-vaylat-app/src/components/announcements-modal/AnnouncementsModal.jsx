import { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import strings from '../../translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button } from "react-bootstrap";

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '0',
      borderRadius: '4px',
      boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
      border: 'none'
    },
    overlay: {zIndex: 20}
  };

const ANNOUNCEMENTS_LOCALSTORAGE = "oskari-announcements";

const addToLocalStorageArray = (name, value) => {
    // Get the existing data
    var existing = localStorage.getItem(name);

    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    existing = existing ? existing.split(',') : [];

    // Add new data to localStorage Array
    existing.push(value);

    // Save back to localStorage
    localStorage.setItem(name, existing.toString());
}

const StyledCheckbox = styled.input`
    margin-right: 7px;
`;

const StyledContent = styled.div`
    max-width: 800px;
    padding: 32px;
    border-radius: 4px;
`;

const StyledHeader = styled.div`
    padding: 16px;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.mainColor1};
    height: 56px;
    display: flex;
    align-items: center;
    box-shadow: 2px 2px 4px 0px rgba(0,0,0,0.20);
`;

const StyledFooter = styled.div`
    justify-content: space-between;
`;

const StyledModalCloseIcon = styled.div`
    min-width: 28px;
    min-height: 28px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 20px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.mainColor2};
        }
    };
`;

const StyledButton = styled(Button)`
    border-radius: 30px;
    background-color: #0064af;
`;

export const AnnouncementsModal = ({ id, title, content }) => {
    const [modalIsOpen, setIsOpen] = useState(true);
    const [selected, setIsSelected] = useState(false);

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
        if (selected) {
            addToLocalStorageArray(ANNOUNCEMENTS_LOCALSTORAGE, id);
        }
    }

    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={() => closeModal()}
                style={customStyles}
            >
                <StyledHeader className='modal-header'>
                    <h5>{title}</h5>
                    <StyledModalCloseIcon
                        onClick={() => {
                            closeModal();
                            }} title={strings.general.close}>
                            <FontAwesomeIcon
                                icon={faTimes}
                            />
                        </StyledModalCloseIcon>
                </StyledHeader>
                <StyledContent>
                    {content}
                </StyledContent>
                <StyledFooter className='modal-footer'>
                    <label>
                        <StyledCheckbox
                            name='announcementSelected'
                            type='checkbox'
                            onClick={() => setIsSelected(!selected)}
                        />
                        {strings.general.dontShowAgain}
                    </label>
                    <StyledButton onClick={() => closeModal()}>{strings.general.ok}</StyledButton>
                </StyledFooter>
            </Modal>
        </div>
    );
}
export default AnnouncementsModal;