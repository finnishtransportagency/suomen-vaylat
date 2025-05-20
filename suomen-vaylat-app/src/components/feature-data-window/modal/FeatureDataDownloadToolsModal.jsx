import Modal from '../../modal/Modal';
import strings from '../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import FeatureDataDownloadTools from '../download/FeatureDataDownloadTools';
import { setIsGfiDownloadToolsOpen } from '../../../state/slices/uiSlice';
import {
  resetGFILocations,
  setVKMData,
  removeMarkerRequest
} from '../../../state/slices/rpcSlice';

const GFI_GEOMETRY_LAYER_ID = 'drawtools-geometry-layer';

const FeatureDataDownloadMenuModal = ({
  constraintsRef
}) => {
  const { isGfiDownloadToolsOpen, isGfiOpen } = useAppSelector(
    (state) => state.ui
  );
  const { store } = useContext(ReactReduxContext);
  const { channel } = useAppSelector((state) => state.rpc);

  const handleCloseGfiDownloadTools = () => {
    store.dispatch(setIsGfiDownloadToolsOpen(false));
    if (!isGfiOpen) {
      store.dispatch(resetGFILocations([]));
      setTimeout(() => {
        store.dispatch(setVKMData(null));
      }, 500);
      store.dispatch(removeMarkerRequest({ markerId: 'VKM_MARKER' }));

      channel &&
        channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
          null,
          null,
          GFI_GEOMETRY_LAYER_ID
        ]);
      channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
        null,
        null,
        'download-tool-layer'
      ]);
      channel.postRequest('DrawTools.StopDrawingRequest', [
        'gfi-selection-tool',
        true
      ]);
    }
  };

  return (
    <Modal
      constraintsRef={constraintsRef}
      drag={true}
      resize={true}
      backdrop={false}
      fullScreenOnMobile={true}
      title={strings.gfi.downloadMaterials}
      type={'normal'}
      closeAction={handleCloseGfiDownloadTools}
      isOpen={isGfiDownloadToolsOpen}
      id="gfi_download_menu_modal"
    >
      <FeatureDataDownloadTools/>
    </Modal>
  );
};

export default FeatureDataDownloadMenuModal;
