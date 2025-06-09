import Dialog from '../../dialog/Dialog';
import strings from '../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import FeatureDataPopup from '../FeatureDataPopup';

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
import { GFI_GEOMETRY_LAYER_ID } from '../../../utils/constants';

const FeatureDataDialog = ({ constraintsRef }) => {
  const { store } = useContext(ReactReduxContext);
  const { channel, gfiLocations } = useAppSelector((state) => state.rpc);

  const { isGfiOpen, minimizeGfi, maximizeGfi } = useAppSelector(
    (state) => state.ui
  );

  const handleCloseGFIDialog = () => {
    store.dispatch(setActiveSelectionTool(null));
    store.dispatch(resetGFILocations([]));
    store.dispatch(setIsGfiOpen(false));
    store.dispatch(setVKMData(null));
    store.dispatch(setMinimizeGfi(false));
    store.dispatch(setMaximizeGfi(false));
    setTimeout(() => {
      store.dispatch(setVKMData(null));
    }, 500); // VKM info does not disappear during dialog close animation.
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
    <Dialog
      constraintsRef={
        constraintsRef
      } /* Reference div for dialog drag boundaries */
      drag={true} /* Enable (true) or disable (false) drag */
      resize={true}
      backdrop={false} /* Is backdrop enabled (true) or disabled (false) */
      fullScreenOnMobile={
        true
      } /* Scale dialog full width / height when using mobile device */
      titleIcon={faMapMarkedAlt} /* Use icon on title or null */
      title={strings.gfi.title} /* Dialog header title */
      type={'gfi'} /* Dialog type */
      closeAction={
        handleCloseGFIDialog
      } /* Action when pressing dialog close button or backdrop */
      isOpen={isGfiOpen} /* Dialog state */
      id="gfi_dialog"
      minWidth={'600px'}
      minHeight={'530px'}
      height={gfiLocations.length > 0 ? "100vw" : "40vw"}
      width={gfiLocations.length > 0 ? "50vh" : "40vh"}
      minimize={minimizeGfi}
      maximize={maximizeGfi}
      minimizable={true}
      maximizable={true}
      minimizeAction={() => store.dispatch(setMinimizeGfi(!minimizeGfi))}
      maximizeAction={() => store.dispatch(setMaximizeGfi(!maximizeGfi))}
    >
      <FeatureDataPopup />
    </Dialog>
  );
};

export default FeatureDataDialog;
