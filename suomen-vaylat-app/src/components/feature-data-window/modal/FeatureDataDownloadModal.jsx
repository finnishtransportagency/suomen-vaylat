import Modal from '../../modal/Modal';
import strings from '../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import GFIDownload from '../GFIDownload';

import { setIsGfiDownloadOpen } from '../../../state/slices/uiSlice';

import { faDownload } from '@fortawesome/free-solid-svg-icons';

const GFI_GEOMETRY_LAYER_ID = 'drawtools-geometry-layer';

const FeatureDataDownloadModal = ({ constraintsRef }) => {
  const { store } = useContext(ReactReduxContext);
  const { channel } = useAppSelector((state) => state.rpc);

  const { isGfiOpen, isGfiDownloadOpen } = useAppSelector((state) => state.ui);

  const handleCloseGfiDownloadModal = () => {
    store.dispatch(setIsGfiDownloadOpen(false));

    !isGfiOpen &&
      channel &&
      channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
        null,
        null,
        GFI_GEOMETRY_LAYER_ID
      ]);
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
      titleIcon={faDownload} /* Use icon on title or null */
      title={strings.downloads.downloads} /* Modal header title */
      type={'normal'} /* Modal type */
      closeAction={
        handleCloseGfiDownloadModal
      } /* Action when pressing modal close button or backdrop */
      isOpen={isGfiDownloadOpen} /* Modal state */
      id="gfi_download_modal"
      minWidth={'600px'}
    >
      <GFIDownload />
    </Modal>
  );
};

export default FeatureDataDownloadModal;
