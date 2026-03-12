import Dialog from '../../dialog/Dialog';
import strings from '../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import AppInfoDialogContent from '../AppInfoDialogContent';

import { setIsInfoOpen } from '../../../state/slices/uiSlice';

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const AppInfoDialog = () => {
  const { store } = useContext(ReactReduxContext);

  const { isInfoOpen } = useAppSelector((state) => state.ui);
  const handleCloseAppInfoDialog = () => {
    store.dispatch(setIsInfoOpen(false));
  };

  return isInfoOpen ? (
    <Dialog
      drag={true} /* Enable (true) or disable (false) drag */
      resize={true}
      fullScreenOnMobile={
        true
      } /* Scale dialog full width / height when using mobile device */
      titleIcon={faInfoCircle} /* Use icon on title or null */
      title={strings.appInfo.title} /* Dialog header title */
      type={'normal'} /* Dialog type */
      closeAction={
        handleCloseAppInfoDialog
      } /* Action when pressing dialog close button or backdrop */
      id="app_info_dialog"
      minWidth='35rem'
      minHeight='35rem'
    >
      <AppInfoDialogContent />
    </Dialog>
  ) : null;
};

export default AppInfoDialog;
