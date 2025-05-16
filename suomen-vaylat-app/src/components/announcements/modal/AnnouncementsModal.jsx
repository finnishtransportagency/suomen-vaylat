import { useState, useEffect } from "react";
import Modal from '../../modal/Modal';
import { useAppSelector } from '../../../state/hooks';
import AnnouncementsModalContent from '../AnnouncementsModalContent';
import { ANNOUNCEMENTS_LOCALSTORAGE } from '../../../utils/constants';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';

const AnnouncementsModal = ({ constraintsRef }) => {
  const announcements = useAppSelector(
    (state) => state.rpc.activeAnnouncements
  );
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);

  useEffect(() => {
    announcements && setCurrentAnnouncement(0);
  }, [announcements]);
  const addToLocalStorageArray = (name, value) => {
    // Get the existing data
    let existing = localStorage.getItem(name);

    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    existing = existing ? existing.split(',') : [];

    // Add new data to localStorage Array
    existing.push(value);

    // Save back to localStorage
    localStorage.setItem(name, existing.toString());
  };
  const closeAnnouncement = (selected, id) => {
    if (selected) {
      addToLocalStorageArray(ANNOUNCEMENTS_LOCALSTORAGE, id);
    }
    announcements.length > currentAnnouncement + 1 &&
      setCurrentAnnouncement(currentAnnouncement + 1);
  };

  return (
    <>
      {currentAnnouncement !== null && announcements[currentAnnouncement] && (
        <Modal
          key={'announcement-modal-' + announcements[currentAnnouncement].id}
          constraintsRef={
            constraintsRef
          } /* Reference div for modal drag boundaries */
          drag={false} /* Enable (true) or disable (false) drag */
          resize={false}
          backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            true
          } /* Scale modal full width / height when using mobile device */
          titleIcon={faBullhorn} /* Use icon on title or null */
          title={
            announcements[currentAnnouncement].title
          } /* Modal header title */
          type={'announcement'} /* Modal type */
          overflow={'auto'}
          closeAction={
            closeAnnouncement
          } /* Action when pressing modal close button or backdrop */
          isOpen={null} /* Modal state */
          id={announcements[currentAnnouncement].id}
        >
          <AnnouncementsModalContent
            id={announcements[currentAnnouncement].id}
            title={announcements[currentAnnouncement].title}
            content={announcements[currentAnnouncement].content}
            key={'announcement_modal_' + announcements[currentAnnouncement].id}
          />
        </Modal>
      )}
    </>
  );
};

export default AnnouncementsModal;
