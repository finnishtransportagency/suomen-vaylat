import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import Modal from '../../modals/Modal';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '../../../state/hooks';
import strings from '../../../translations';
import WarningModalContent from '../WarningModalContent';

import { setWarning } from '../../../state/slices/uiSlice';

const WarningModal = ({ constraintsRef }) => {
  const { warning } = useAppSelector((state) => state.ui);
  const { store } = useContext(ReactReduxContext);

  const handleCloseWarning = () => {
    store.dispatch(setWarning(null));
  };

  return (
    <Modal
      constraintsRef={constraintsRef}
      drag={false}
      resize={false}
      backdrop={true}
      fullScreenOnMobile={false}
      titleIcon={faExclamationCircle}
      title={strings.general.warning}
      type={'warning'}
      closeAction={handleCloseWarning}
      isOpen={warning !== null}
      id={null}
    >
      <WarningModalContent warning={warning} />
    </Modal>
  );
};

export default WarningModal;
