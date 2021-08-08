import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: ".5rem"
  },
};

const ANNOUNCEMENTS_LOCALSTORAGE = "oskari-announcements";

const addToLocalStorageArray = (name, value) => {
    console.log("APUA");
    console.log(name);
    // Get the existing data
    var existing = localStorage.getItem(name);
    console.log(existing);

    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    existing = existing ? existing.split(',') : [];

    // Add new data to localStorage Array
    existing.push(value);
    console.log(existing);
    console.log(name);

    // Save back to localStorage
    localStorage.setItem(name, existing.toString());
}

const StyledCheckbox = styled.input`
    margin-right: 7px;
`;

const StyledContent = styled.div`
    padding: .5rem;
`;
const StyledHeader = styled.div`
    padding: .5rem;
`;
const StyledFooter = styled.div`
    justify-content: space-between;
`;

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

export const AnnouncementsModal = ({ id, title, content }) => {
    console.log(id);
  const [modalIsOpen, setIsOpen] = React.useState(true);
  const [selected, setIsSelected] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }

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
            contentLabel="Example Modal"
        >
        <StyledHeader className="modal-header">
            <h5>{title}</h5>
        </StyledHeader>
        <StyledContent>
            <p>
                {content}
            </p>
        </StyledContent>
        <StyledFooter className="modal-footer">
            <label>
                <StyledCheckbox
                    name="announcementSelected"
                    type="checkbox"
                    onClick={() => setIsSelected(!selected)}
                />
                Älä näytä uudelleen
            </label>
            <button onClick={() => closeModal()}>OK</button>
        </StyledFooter>
      </Modal>
    </div>
  );
}
export default AnnouncementsModal;