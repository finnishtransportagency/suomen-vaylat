import Modal from '../../modals/Modal';
import strings from '../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import UserGuideModalContent from '../UserGuideModalContent';

import { setIsUserGuideOpen } from '../../../state/slices/uiSlice';

import { faQuestion } from '@fortawesome/free-solid-svg-icons';

const UserGuideModal = ({ constraintsRef }) => {
  const { store } = useContext(ReactReduxContext);

  const { isUserGuideOpen } = useAppSelector((state) => state.ui);

  const handleCloseUserGuide = () => {
    store.dispatch(setIsUserGuideOpen(false));
  };

  return (
    <Modal
      constraintsRef={
        constraintsRef
      } /* Reference div for modal drag boundaries */
      drag={false} /* Enable (true) or disable (false) drag */
      resize={false}
      backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
      fullScreenOnMobile={
        true
      } /* Scale modal full width / height when using mobile device */
      titleIcon={faQuestion} /* Use icon on title or null */
      title={strings.appGuide.title} /* Modal header title */
      type={'normal'} /* Modal type */
      closeAction={
        handleCloseUserGuide
      } /* Action when pressing modal close button or backdrop */
      isOpen={isUserGuideOpen} /* Modal state */
      id="user_guide_modal"
      height="860px"
    >
      <UserGuideModalContent />
    </Modal>
  );
};

export default UserGuideModal;
