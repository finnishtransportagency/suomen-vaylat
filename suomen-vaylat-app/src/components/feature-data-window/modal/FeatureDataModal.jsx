import Modal from '../../modals/Modal';
import strings from '../../../translations';
import { useContext, useState } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import GFIPopup from '../GFIPopup';
import styled from 'styled-components';

import {
  resetGFILocations,
  setDownloadActive,
  setDownloadFinished,
  removeMarkerRequest,
  setVKMData
} from '../../../state/slices/rpcSlice';

import {
  setIsSaveViewOpen,
  setIsGfiOpen,
  setIsGfiDownloadOpen,
  setMinimizeGfi,
  setWarning,
  setMaximizeGfi,
  setActiveSelectionTool
} from '../../../state/slices/uiSlice';

import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';

import { Slide, toast } from 'react-toastify';

const StyledLayerNamesList = styled.ul`
  padding-inline-start: 20px;
`;

const StyledLayerNamesListItem = styled.li``;

const GFI_GEOMETRY_LAYER_ID = 'drawtools-geometry-layer';

const FeatureDataModal = ({ constraintsRef }) => {
  const { store } = useContext(ReactReduxContext);
  const { channel } = useAppSelector((state) => state.rpc);
  const [isGfiDownloadToolsOpen, setIsGfiDownloadToolsOpen] = useState(false);

  const { isGfiOpen, minimizeGfi, maximizeGfi } = useAppSelector(
    (state) => state.ui
  );

  // TODO: do we need to make this into slice var bc handleGfiDownload is used elsewhere
  const [websocketFirstTimeTryConnecting, setWebsocketFirstTimeTryConnecting] =
    useState(false);

  const [downloadUuids, setDownloadUuids] = useState([]);

  const supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;

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

  const handleCloseSaveViewModal = () => {
    store.dispatch(setIsSaveViewOpen(false));
  };

  // TODO: move to utils if this is used more than once
  const connectWebsocket = (count) => {
    const MAX_RECONNECTIONS_TRY = 20;

    setWebsocketFirstTimeTryConnecting(true);

    // Open WebSocket
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    const handleDownloadFailure = () => {
      handleCloseGfiDownloadModal();
      handleCloseSaveViewModal();
      ws.close();

      toast.error(strings.downloads.downloadFailure, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Slide
      });
    };

    ws.onopen = function () {
      // when opened connection send resend download status message
      if (downloadUuids.length > 0) {
        var json = {
          type: 'resendDownloadStatuses',
          data: { uuids: downloadUuids }
        };
        ws.send(JSON.stringify(json));
      }

      // ping 10 min interval
      const sendPing = () => {
        var json = { type: 'ping', data: {} };
        ws.send(JSON.stringify(json));
      };

      setInterval(() => {
        sendPing();
      }, 1000 * 60 * 10);
    };
    ws.onmessage = function (evt) {
      let data = JSON.parse(evt.data);
      if (data.type === 'BODY_SIZE_EXCEEDED') {
        store.dispatch(
          setWarning({
            title: strings.bodySizeWarning,
            subtitle: null,
            cancel: {
              text: strings.general.cancel,
              action: () => {
                store.dispatch(setWarning(null));
              }
            },
            confirm: {
              text: strings.general.continue,
              action: () => {
                // TODO: simplify not used
                //simplifyGeometry();
                store.dispatch(setWarning(null));
              }
            }
          })
        );
      }

      if (data.type === 'DOWNLOAD_READY') {
        if (
          data.data &&
          data.data.uuid &&
          downloadUuids.includes(data.data.uuid)
        ) {
          var index = downloadUuids.indexOf(data.data.uuid);
          let newArray = downloadUuids;
          if (index > -1) {
            newArray.splice(index, 1);
          }
          setDownloadUuids(newArray);

          store.dispatch(
            setDownloadFinished({
              id: data.data.uuid,
              url: data.data.url,
              fileSize: data.data.fileSize !== null && data.data.fileSize,
              errorLayers: data.data.errorLayers
            })
          );
        }
      }
    };
    ws.onerror = () => {
      handleDownloadFailure();
    };
    ws.onclose = () => {
      if (count < MAX_RECONNECTIONS_TRY) {
        setTimeout(() => {
          connectWebsocket(count + 1);
        }, 1000 * 30);
      } else {
        handleDownloadFailure();
      }
    };
  };

  const handleGfiDownload = (format, layers, croppingArea) => {
    // Open websocket if is not already opened
    if (supportsWebSockets) {
      !websocketFirstTimeTryConnecting && connectWebsocket(0);
    } else {
      toast.error(strings.downloads.noWebSocketSupport, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Slide
      });
    }

    let sessionId = '';

    let layerIds = layers.map((layer) => {
      return layer.id;
    });

    //bit hackish way to force datatype when using with single geometry download
    if (!Array.isArray(croppingArea)) croppingArea = [croppingArea];
    channel.downloadFeaturesByGeoJSON &&
      channel.downloadFeaturesByGeoJSON(
        [layerIds, croppingArea, format.format, sessionId],
        (data) => {
          if (data && data.uuid && downloadUuids) {
            let newArray = downloadUuids;
            newArray.push(data.uuid);
            setDownloadUuids(newArray);

            var newDownload = {
              id: data.uuid,
              format: format.title,
              layers: layers,
              title: (
                <StyledLayerNamesList>
                  {layers.map((layer) => {
                    return (
                      <StyledLayerNamesListItem>
                        {layer.name}
                      </StyledLayerNamesListItem>
                    );
                  })}
                </StyledLayerNamesList>
              ),
              loading: true,
              date: Date.now(),
              url: null,
              errorLayers: []
            };

            store.dispatch(setIsGfiDownloadOpen(true));
            store.dispatch(setDownloadActive(newDownload));
          }
          return;
        }
      );

    if (!isGfiOpen) {
      store.dispatch(resetGFILocations([]));
      store.dispatch(removeMarkerRequest({ markerId: 'VKM_MARKER' }));
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
    isGfiDownloadToolsOpen && setIsGfiDownloadToolsOpen(false);
  };

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
      <GFIPopup handleGfiDownload={handleGfiDownload} />
    </Modal>
  );
};

export default FeatureDataModal;
