import React, { useContext } from 'react';
import {
  faMapMarkedAlt,
  faExpand,
  faObjectGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import strings from '../../../translations';
import Badge from '../../badges/Badge';
import {
  removeMarkerRequest
} from '../../../state/slices/rpcSlice';
import {
  setActiveSelectionTool,
  setMinimizeFeatureSelection,
  setIsGfiToolsOpen,
  setActiveTool
} from '../../../state/slices/uiSlice';
import { FEATURE_SELECTION_DRAWING_TOOL, FEATURE_SELECTION_LAYER, GFI_GEOMETRY_LAYER_ID } from '../../../utils/constants';
import { theme } from '../../../theme/theme';
import { toast } from 'react-toastify';

const FeatureSelectionBadge = () => {
  const { store } = useContext(ReactReduxContext);
  const { channel } = useAppSelector(
    (state) => state.rpc
  );
  const { activeTool } = useAppSelector((state) => state.ui);

  const handleCloseFeatureSelectionTools = () => {
    store.dispatch(setIsGfiToolsOpen(false));
    store.dispatch(setActiveSelectionTool(null));
    store.dispatch(setMinimizeFeatureSelection(false));
    store.dispatch(setActiveTool(null));

    // remove drawings on map
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

    // dismiss measurement toast as drawing is not active anymore
    toast.dismiss('measurementToast');
  };

  const title = strings.gfi.featureSelection.title;

  return (
    <Badge
      idPrefix={"feature-data"}
      icon={<FontAwesomeIcon icon={faObjectGroup} />}
      title={title}
      bg={theme.colors.mainColor2}
      actionButtons={[
        <div
          key="expand"
          onClick={() => store.dispatch(setMinimizeFeatureSelection(false))}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faExpand} />
        </div>
      ]}
      closeAction={handleCloseFeatureSelectionTools}
    />
  );
}

export default FeatureSelectionBadge;