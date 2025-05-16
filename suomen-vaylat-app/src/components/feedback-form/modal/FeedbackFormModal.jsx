import Modal from '../../modals/Modal';
import strings from '../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import FeedbackForm from '../FeedbackForm';

import { setIsFeedBackFormOpen } from '../../../state/slices/uiSlice';

const FeedbackFormModal = ({ constraintsRef }) => {
  const { store } = useContext(ReactReduxContext);

  const { isFeedbackFormOpen } = useAppSelector((state) => state.ui);
  let { allLayers, allGroups } = useAppSelector((state) => state.rpc);

  const handleCloseFeedbackForm = () => {
    store.dispatch(setIsFeedBackFormOpen(false));
  };

  return (
    <Modal
      constraintsRef={
        constraintsRef
      } /* Reference div for modal drag boundaries */
      drag={true} /* Enable (true) or disable (false) drag */
      resize={false}
      backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
      fullScreenOnMobile={
        true
      } /* Scale modal full width / height when using mobile device */
      titleIcon={null} /* Use icon on title or null */
      title={strings.appInfo.feedbackForm.title} /* Modal header title */
      type={'normal'} /* Modal type */
      closeAction={
        handleCloseFeedbackForm
      } /* Action when pressing modal close button or backdrop */
      isOpen={isFeedbackFormOpen} /* Modal state */
      id="feedback_form_modal"
      maxWidth={'800px'}
      overflow={'auto'}
    >
      <FeedbackForm layers={allLayers} groups={allGroups} />
    </Modal>
  );
};

export default FeedbackFormModal;
