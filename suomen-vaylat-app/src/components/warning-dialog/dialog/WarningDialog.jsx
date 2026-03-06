import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import Dialog from '../../dialog/Dialog';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '../../../state/hooks';
import strings from '../../../translations';
import WarningDialogContent from '../WarningDialogContent';

import { setWarning } from '../../../state/slices/uiSlice';
import { isMobile } from '../../../theme/theme';

const WarningDialog = () => {
  const { warning } = useAppSelector((state) => state.ui);
  const { store } = useContext(ReactReduxContext);
  
  const handleCloseWarning = () => {
    store.dispatch(setWarning(null));
  };

  return warning !== null ? (
    <Dialog
      drag={false}
      resize={false}
      fullScreenOnMobile={true}
      titleIcon={faExclamationCircle}
      title={strings.general.warning}
      type={'warning'}
      closeAction={handleCloseWarning}
      isOpen={warning !== null}
      id={null}
      maxWidth={isMobile ? null : '30em'}
    >
      <WarningDialogContent warning={warning} />
    </Dialog>
  )
  : null ;
};

export default WarningDialog;
