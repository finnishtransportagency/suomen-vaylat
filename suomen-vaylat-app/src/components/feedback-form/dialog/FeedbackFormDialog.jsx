import Dialog from '../../dialog/Dialog';
import strings from '../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import FeedbackForm from '../FeedbackForm';

import { setIsFeedBackFormOpen } from '../../../state/slices/uiSlice';

const FeedbackFormDialog = ({ constraintsRef }) => {
  const { store } = useContext(ReactReduxContext);

  const { isFeedbackFormOpen } = useAppSelector((state) => state.ui);
  let { allLayers, allGroups } = useAppSelector((state) => state.rpc);

  const handleCloseFeedbackForm = () => {
    store.dispatch(setIsFeedBackFormOpen(false));
  };

  return (
    <Dialog
      constraintsRef={
        constraintsRef
      } /* Reference div for dialog drag boundaries */
      drag={true} /* Enable (true) or disable (false) drag */
      resize={false}
      backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
      fullScreenOnMobile={
        true
      } /* Scale dialog full width / height when using mobile device */
      titleIcon={null} /* Use icon on title or null */
      title={strings.appInfo.feedbackForm.title} /* Dialog header title */
      type={'normal'} /* Dialog type */
      closeAction={
        handleCloseFeedbackForm
      } /* Action when pressing dialog close button or backdrop */
      isOpen={isFeedbackFormOpen} /* Dialog state */
      id="feedback_form_dialog"
      maxWidth={'800px'}
      overflow={'auto'}
    >
      <FeedbackForm layers={allLayers} groups={allGroups} />
    </Dialog>
  );
};

export default FeedbackFormDialog;
