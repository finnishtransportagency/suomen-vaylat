import { useState, useEffect } from 'react';
import Dialog from '../../dialog/Dialog';
import { useAppSelector } from '../../../state/hooks';
import AnnouncementsDialogContent from '../AnnouncementsDialogContent';
import { ANNOUNCEMENTS_LOCALSTORAGE } from '../../../utils/constants';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';

const AnnouncementsDialog = () => {
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
    if (announcements.length > currentAnnouncement + 1) {
      setCurrentAnnouncement(currentAnnouncement + 1);
    } else {
      setCurrentAnnouncement(null);
    }
  };

  return (
    <>
      {currentAnnouncement !== null && announcements[currentAnnouncement] && (
        <Dialog
          key={'announcement-dialog-' + announcements[currentAnnouncement].id}
          drag={false} /* Enable (true) or disable (false) drag */
          resize={false}
          fullScreenOnMobile={
            true
          } /* Scale dialog full width / height when using mobile device */
          titleIcon={faBullhorn} /* Use icon on title or null */
          title={
            announcements[currentAnnouncement].title
          } /* Dialog header title */
          closeAction={
            closeAnnouncement
          } /* Action when pressing dialog close button or backdrop */
          id={announcements[currentAnnouncement].id}
          minWidth="30rem"
          minHeight="18rem"
        >
          <AnnouncementsDialogContent
            id={announcements[currentAnnouncement].id}
            content={announcements[currentAnnouncement].content}
            handleAnnouncementDialog={closeAnnouncement}
            key={'announcement_dialog_' + announcements[currentAnnouncement].id}
          />
        </Dialog>
      )}
    </>
  );
};

export default AnnouncementsDialog;
