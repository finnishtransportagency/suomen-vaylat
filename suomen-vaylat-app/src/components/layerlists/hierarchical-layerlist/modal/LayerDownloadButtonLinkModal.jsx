import { useContext } from 'react';
import Modal from '../../../modals/Modal';
import strings from '../../../../translations';
import { useAppSelector } from '../../../../state/hooks';
import LayerDownloadLinkButtonModalContent from '../LayerDownloadLinkButtonModalContent';

import { setIsDownloadLinkModalOpen } from '../../../../state/slices/uiSlice';
import { ReactReduxContext } from 'react-redux';

const LayerDownloadLinkButtonModal = ({ constraintsRef }) => {
  const { downloadLink } = useAppSelector((state) => state.ui);
  const { store } = useContext(ReactReduxContext);

  const handleCloseDownloadLinkModal = () => {
    store.dispatch(
      setIsDownloadLinkModalOpen({
        layerDownloadLinkModalOpen: false,
        layerDownloadLink: null,
        layerDownloadLinkName: null
      })
    );
  };

  return (
    <Modal
      constraintsRef={constraintsRef}
      drag={false}
      resize={false}
      backdrop={true}
      fullScreenOnMobile={true}
      title={strings.downloadLink.downloadLinkModalHeader}
      type={'normal'}
      closeAction={handleCloseDownloadLinkModal}
      isOpen={downloadLink.layerDownloadLinkModalOpen}
      id="layer_download_link_modal"
    >
      <LayerDownloadLinkButtonModalContent downloadLink={downloadLink} />
    </Modal>
  );
};

export default LayerDownloadLinkButtonModal;
