import Modal from '../../modal/Modal';
import strings from '../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import GFIPopup from '../GFIPopup';

import {
  resetGFILocations,
  removeMarkerRequest,
  setVKMData
} from '../../../state/slices/rpcSlice';

import {
  setIsGfiOpen,
  setMinimizeGfi,
  setMaximizeGfi,
  setActiveSelectionTool
} from '../../../state/slices/uiSlice';

import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';

const GFI_GEOMETRY_LAYER_ID = 'drawtools-geometry-layer';

const FeatureDataModal = ({ constraintsRef }) => {
  const { store } = useContext(ReactReduxContext);
  const { channel } = useAppSelector((state) => state.rpc);

  const { isGfiOpen, minimizeGfi, maximizeGfi } = useAppSelector(
    (state) => state.ui
  );

  const handleCloseGFIModal = () => {
    store.dispatch(setActiveSelectionTool(null));
    store.dispatch(resetGFILocations([]));
    store.dispatch(setIsGfiOpen(false));
    store.dispatch(setVKMData(null));
    store.dispatch(setMinimizeGfi(false));
    store.dispatch(setMaximizeGfi(false));
    setTimeout(() => {
      store.dispatch(setVKMData(null));
    }, 500); // VKM info does not disappear during modal close animation.
    store.dispatch(removeMarkerRequest({ markerId: 'VKM_MARKER' }));
    channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
      null,
      null,
      'download-tool-layer'
    ]);
    channel &&
      channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
        null,
        null,
        GFI_GEOMETRY_LAYER_ID
      ]);
    channel.postRequest('DrawTools.StopDrawingRequest', [
      'gfi-selection-tool',
      true
    ]);
  };

  return (
    <Modal
      constraintsRef={
        constraintsRef
      } /* Reference div for modal drag boundaries */
      drag={true} /* Enable (true) or disable (false) drag */
      resize={true}
      backdrop={false} /* Is backdrop enabled (true) or disabled (false) */
      fullScreenOnMobile={
        true
      } /* Scale modal full width / height when using mobile device */
      titleIcon={faMapMarkedAlt} /* Use icon on title or null */
      title={strings.gfi.title} /* Modal header title */
      type={'gfi'} /* Modal type */
      closeAction={
        handleCloseGFIModal
      } /* Action when pressing modal close button or backdrop */
      isOpen={isGfiOpen} /* Modal state */
      id="gfi_modal"
      minWidth={'600px'}
      minHeight={'530px'}
      height="100vw"
      width="50vw"
      minimize={minimizeGfi}
      maximize={maximizeGfi}
      minimizable={true}
      maximizable={true}
      minimizeAction={() => store.dispatch(setMinimizeGfi(!minimizeGfi))}
      maximizeAction={() => store.dispatch(setMaximizeGfi(!maximizeGfi))}
    >
      <GFIPopup />
    </Modal>
  );
};

export default FeatureDataModal;
