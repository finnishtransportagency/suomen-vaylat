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
import {
  FEATURE_SELECTION_DRAWING_TOOL,
  FEATURE_SELECTION_LAYER,
  GFI_GEOMETRY_LAYER_ID
} from '../../../utils/constants';

const FeatureDataDialog = () => {
  const { store } = useContext(ReactReduxContext);
  const { channel } = useAppSelector((state) => state.rpc);

  const { isGfiOpen, minimizeGfi, maximizeGfi, activeTool } = useAppSelector(
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
      FEATURE_SELECTION_LAYER
    ]);
    channel &&
      channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
        null,
        null,
        GFI_GEOMETRY_LAYER_ID
      ]);

    // clears feature selection drawing
    activeTool === FEATURE_SELECTION_DRAWING_TOOL &&
      channel.postRequest('DrawTools.StopDrawingRequest', [
        FEATURE_SELECTION_DRAWING_TOOL,
        true
      ]);
  };

  return isGfiOpen ? (
    <Dialog
      drag={true} /* Enable (true) or disable (false) drag */
      resize={true}
      fullScreenOnMobile={
        true
      } /* Scale dialog full width / height when using mobile device */
      titleIcon={faMapMarkedAlt} /* Use icon on title or null */
      title={strings.gfi.title} /* Dialog header title */
      type={'gfi'} /* Dialog type */
      closeAction={
        handleCloseGFIDialog
      } /* Action when pressing dialog close button or backdrop */
      id="gfi_dialog"
      minWidth={'35rem'}
      minHeight={'40rem'}
      minimize={minimizeGfi}
      maximize={maximizeGfi}
      minimizable={true}
      maximizable={true}
      maxWidth={maximizeGfi ? null : '90vw'}
      maxHeight={maximizeGfi ? null : '90vh'}
      minimizeAction={() => store.dispatch(setMinimizeGfi(!minimizeGfi))}
      maximizeAction={() => store.dispatch(setMaximizeGfi(!maximizeGfi))}
    >
      <FeatureDataPopup />
    </Dialog>
  ) : null;
};

export default FeatureDataDialog;
