import Modal from '../../modals/Modal';
import strings from '../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import AppInfoModalContent from '../AppInfoModalContent';

import { setIsInfoOpen } from '../../../state/slices/uiSlice';

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const AppInfoModal = ({ constraintsRef }) => {
  const { store } = useContext(ReactReduxContext);

  const { isInfoOpen } = useAppSelector((state) => state.ui);

  const handleCloseAppInfoModal = () => {
    store.dispatch(setIsInfoOpen(false));
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
          titleIcon={faInfoCircle} /* Use icon on title or null */
          title={strings.appInfo.title} /* Modal header title */
          type={"normal"} /* Modal type */
          closeAction={
            handleCloseAppInfoModal
          } /* Action when pressing modal close button or backdrop */
          isOpen={isInfoOpen} /* Modal state */
          id="app_info_modal"
          maxWidth={"800px"}
        >
          <AppInfoModalContent />
        </Modal>
  );
};

export default AppInfoModal;
