import React from 'react';
import ReactDOM from 'react-dom';
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
  },
};

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

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

export const AnnouncementsModal = ({ id, title, content }) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
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
      <button onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={() => setIsOpen(!modalIsOpen)}
        onAfterOpen={afterOpenModal}
        onRequestClose={() => closeModal()}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_title) => (title = _title)}>{title}</h2>
        <button onClick={() => closeModal()}>close</button>
        <StyledCheckbox
            name="announcementSelected"
            type="checkbox"
            onClick={() => setIsSelected(!selected)}
        />
        <p>
            {content}
        </p>
      </Modal>
    </div>
  );
}
export default AnnouncementsModal;