import React, { useContext, useState } from 'react';
import {
  faMapMarkedAlt,
  faExpand,
  faPencilRuler
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import strings from '../../../translations';
import Badge from '../../badges/Badge';
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
import { GFI_GEOMETRY_LAYER_ID } from '../../../utils/constants';
import { theme } from '../../../theme/theme';

const addFeaturesToMapParams = {
  layerId: GFI_GEOMETRY_LAYER_ID,
  featureStyle: {
    fill: {
      color: 'rgba(10, 140, 247, 0.1)'
    },
    stroke: {
      area: {
        color: 'rgba(100, 255, 95, 0.7)',
        width: 4,
        lineJoin: 'round'
      }
    },
    image: {
      shape: 5,
      size: 3,
      fill: {
        color: 'rgba(100, 255, 95, 0.7)'
      }
    }
  }
};

const FeatureDataBadge = () => {
  const { store } = useContext(ReactReduxContext);
  const [activeGeometries, setActiveGeometries] = useState(true);
  const { channel, gfiLocations, filteringInfo } = useAppSelector(
    (state) => state.rpc
  );
  const { activeTool } = useAppSelector((state) => state.ui);

  const handleCloseGFIDialog = () => {
    store.dispatch(setActiveSelectionTool(null));
    store.dispatch(resetGFILocations([]));
    store.dispatch(setIsGfiOpen(false));
    store.dispatch(setVKMData(null));
    store.dispatch(setMinimizeGfi(false));
    store.dispatch(setMaximizeGfi(false));
    setTimeout(() => {
      store.dispatch(setVKMData(null));
    }, 500);
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
    activeTool === 'gfi-selection-tool' &&
      channel.postRequest('DrawTools.StopDrawingRequest', [
        'gfi-selection-tool',
        true
      ]);
  };

  const handleShowGeometry = () => {
    if (!activeGeometries) {
      gfiLocations.forEach((gfiLocation) => {
        gfiLocation.gfiCroppingArea &&
          channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
            gfiLocation.gfiCroppingArea,
            addFeaturesToMapParams
          ]);
      });
    } else {
      channel &&
        channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
          null,
          null,
          GFI_GEOMETRY_LAYER_ID
        ]);
    }
    setActiveGeometries(!activeGeometries);
  };

  const title = strings.gfi.title;

  return (
    <Badge
      idPrefix={"feature-data"}
      icon={<FontAwesomeIcon icon={faMapMarkedAlt} />}
      title={title}
      bg={theme.colors.mainColor1}
      actionButtons={[
        <div
          key="geometry"
          onClick={handleShowGeometry}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faPencilRuler} />
        </div>,
        <div
          key="expand"
          onClick={() => store.dispatch(setMinimizeGfi(false))}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faExpand} />
        </div>
      ]}
      closeAction={handleCloseGFIDialog}
    />
  );
}

export default FeatureDataBadge;