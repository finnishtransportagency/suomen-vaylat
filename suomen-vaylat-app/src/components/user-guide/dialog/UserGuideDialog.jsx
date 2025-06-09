import Dialog from '../../dialog/Dialog';
import strings from '../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import UserGuideDialogContent from '../UserGuideDialogContent';

import { setIsUserGuideOpen } from '../../../state/slices/uiSlice';

import { faQuestion } from '@fortawesome/free-solid-svg-icons';

const UserGuideDialog = ({ constraintsRef }) => {
  const { store } = useContext(ReactReduxContext);

  const { isUserGuideOpen } = useAppSelector((state) => state.ui);

  const handleCloseUserGuide = () => {
    store.dispatch(setIsUserGuideOpen(false));
  };

  return (
    <Dialog
      constraintsRef={
        constraintsRef
      } /* Reference div for dialog drag boundaries */
      drag={false} /* Enable (true) or disable (false) drag */
      resize={false}
      backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
      fullScreenOnMobile={
        true
      } /* Scale dialog full width / height when using mobile device */
      titleIcon={faQuestion} /* Use icon on title or null */
      title={strings.appGuide.title} /* Dialog header title */
      type={'normal'} /* Dialog type */
      closeAction={
        handleCloseUserGuide
      } /* Action when pressing dialog close button or backdrop */
      isOpen={isUserGuideOpen} /* Dialog state */
      id="user_guide_dialog"
      height="860px"
    >
      <UserGuideDialogContent />
    </Dialog>
  );
};

export default UserGuideDialog;
