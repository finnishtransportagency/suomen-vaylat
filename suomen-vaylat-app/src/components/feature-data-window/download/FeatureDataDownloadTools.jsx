import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../../../state/hooks';
import { ReactReduxContext } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faFile,
  faFileArchive
} from '@fortawesome/free-solid-svg-icons';

import DialogListItem from '../../dialog/DialogListItem';
import CheckBox from '../../checkbox/CheckBox';
import SVLoader from '../../../utils/components/SvLoader';
import strings from '../../../translations';

import {
  resetGFILocations,
  setDownloadActive,
  setDownloadFinished,
  removeMarkerRequest
} from '../../../state/slices/rpcSlice';

import {
  setIsGfiDownloadOpen,
  setWarning,
  setIsGfiDownloadToolsOpen,
} from '../../../state/slices/uiSlice';
import { Slide, toast } from 'react-toastify';
import { GFI_GEOMETRY_LAYER_ID, MAX_RECONNECTIONS_FEATURE_DATA_DOWNLOAD } from '../../../utils/constants';

const StyledGfiDownloadsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow: auto;
  @media ${(props) => props.theme.device.mobileL} {
    padding: 16px;
  }
  background-color: white;
`;

const StyledListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;

const StyledLoadingOverlay = styled(motion.div)`
  z-index: 2;
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
`;

const StyledSubtitle = styled.div`
  display: flex;
  justify-content: flex-start;
  color: ${(props) => props.theme.colors.mainColor1};
  padding: 0px 0px 10px 5px;
  font-size: 16px;
  font-weight: bold;
`;

const StyledCloseButton = styled.div`
  z-index: 1;
  position: sticky;
  top: 0px;
  right: 0px;
  display: flex;
  justify-content: flex-end;
  svg {
    font-size: 24px;
    color: ${(props) => props.theme.colors.mainColor1};
    cursor: pointer;
  }
`;

const StyledDownloadFormats = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  padding: 16px;
`;

const StyledDownloadFormat = styled(motion.button)`
  position: relative;
  width: 56px;
  height: 56px;
  display: flex;
  gap: 6px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 4px #0000004d;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  pointer-events: auto;
  svg {
    color: ${(props) => props.theme.colors.mainWhite};
    font-size: 22px;
  }
  p {
    margin: 0;
    font-weight: bold;
    font-size: 10px;
    color: ${(props) => props.theme.colors.mainWhite};
    margin-top: -4px;
  }
`;

const StyledLoaderWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 999;
  height: 100%;
  max-width: 200px;
  max-height: 200px;
  transform: translate(-50%, -50%);
  svg {
    width: 100%;
    height: 100%;
    fill: none;
  }
`;

const StyledLayerNamesList = styled.ul`
  padding-inline-start: 20px;
`;

const StyledLayerNamesListItem = styled.li``;

const FeatureDataDownloadTools = ({ closeButton = true, handleGfiDownloadsMenu}) => {
  const [loading] = useState(false);

  let {
    channel,
    gfiLocations,
    allLayers,
    gfiCroppingArea,
    selectedLayersByType
  } = useAppSelector((state) => state.rpc);

  const { isGfiDownloadToolsOpen, isGfiOpen, activeTool } =
    useAppSelector((state) => state.ui);
  const { store } = useContext(ReactReduxContext);
  const [downloadUuids, setDownloadUuids] = useState([]);

  const [websocketFirstTimeTryConnecting, setWebsocketFirstTimeTryConnecting] =
    useState(false);

  const [selectedLayers, setSelectedLayers] = useState([]);

  const [downloadFormats] = useState([
    {
      id: 'download-format-gpkg',
      title: '.GPKG',
      format: 'gpkg',
      selected: false,
      loading: false
    },
    {
      id: 'download-format-shape',
      title: '.SHP',
      format: 'shape-zip',
      selected: false,
      loading: false
    },
    {
      id: 'download-format-csv',
      title: '.CSV',
      format: 'csv',
      selected: false,
      loading: false
    },
    {
      id: 'download-format-xls',
      title: '.XLS',
      format: 'excel2007',
      selected: false,
      loading: false
    },
    {
      id: 'download-format-json',
      title: '.JSON',
      format: 'application/json',
      selected: false,
      loading: false
    }
  ]);

  const handleSelectLayer = (layer) => {
    if (
      selectedLayers?.find((selectedLayer) => selectedLayer.id === layer.id)
    ) {
      setSelectedLayers(
        selectedLayers?.filter((selectedLayer) => selectedLayer.id !== layer.id)
      );
    } else {
      setSelectedLayers([...selectedLayers, layer]);
    }
  };

  useEffect(() => {
    const layers =
      gfiLocations &&
      gfiLocations.length > 0 &&
      gfiLocations.map((location, index) => {
        const layer = allLayers.find((layer) => layer.id === location.layerId);
        return layer;
      });
    setSelectedLayers(layers);
  }, [allLayers, gfiLocations]);

  const supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;

  const handleCloseGfiDownloadDialog = () => {
    store.dispatch(setIsGfiDownloadOpen(false));

    !isGfiOpen &&
      channel &&
      channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
        null,
        null,
        GFI_GEOMETRY_LAYER_ID
      ]);
  };


  // TODO: move to utils if this is used more than once
  const connectWebsocket = (count) => {
    setWebsocketFirstTimeTryConnecting(true);

    // Open WebSocket
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    const handleDownloadFailure = () => {
      handleCloseGfiDownloadDialog();
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
      if (count < MAX_RECONNECTIONS_FEATURE_DATA_DOWNLOAD) {
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
      activeTool === 'gfi-selection-tool' && channel.postRequest('DrawTools.StopDrawingRequest', [
        'gfi-selection-tool',
        true
      ]);
    }
    isGfiDownloadToolsOpen && store.dispatch(setIsGfiDownloadToolsOpen(false));
  };

  return (
    <StyledGfiDownloadsContainer>
      {closeButton && (
        <StyledCloseButton onClick={() => handleGfiDownloadsMenu()}>
          <FontAwesomeIcon icon={faTimes} />
        </StyledCloseButton>
      )}
      <AnimatePresence>
        {loading && (
          <StyledLoadingOverlay
            transition={{
              duration: 0.2,
              type: 'tween'
            }}
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
          >
            <StyledLoaderWrapper>
              <SVLoader />
            </StyledLoaderWrapper>
          </StyledLoadingOverlay>
        )}
      </AnimatePresence>
      <StyledSubtitle>{strings.downloads.layers}:</StyledSubtitle>
      <StyledListContainer>
        {gfiLocations &&
          gfiLocations.length > 0 &&
          gfiLocations.map((location, index) => {
            const isBackgroundMap =
              selectedLayersByType.backgroundMaps.filter(
                (l) => l.id === location.layerId
              ).length > 0;

            const isUserLayer =
              typeof location.layerId === 'string' && location.layerId.startsWith('userlayer_');

            if (isBackgroundMap || isUserLayer) {
              return null;
            }
            const layer = allLayers.find(
              (layer) => layer.id === location.layerId
            );

            return (
              <DialogListItem
                key={'gfi_download_' + location.layerId}
                index={index}
                id={location.layerId}
                icon={faFile}
                title={layer.name && layer.name}
              >
                <CheckBox
                  checked={
                    selectedLayers.length > 0 &&
                    selectedLayers?.find(
                      (selectedLayer) => selectedLayer.id === location.layerId
                    )
                  }
                  selectAction={() => {
                    handleSelectLayer(layer);
                  }}
                />
              </DialogListItem>
            );
          })}
      </StyledListContainer>
      <StyledSubtitle style={{ display: 'flex', justifyContent: 'center' }}>
        {strings.downloads.format}:
      </StyledSubtitle>
      <StyledDownloadFormats>
        {downloadFormats.map((format) => {
          return (
            <StyledDownloadFormat
              key={format.id}
              transition={{
                duration: 0.2,
                type: 'tween'
              }}
              whileHover={{
                backgroundColor: !format.loading ? '#3c85bd' : '#DDD',
                transition: { duration: 0.2 }
              }}
              disabled={selectedLayers.length === 0 || format.loading}
              animate={{
                backgroundColor:
                  selectedLayers.length === 0 || format.loading
                    ? '#DDD'
                    : '#0064af'
              }}
              onClick={() =>
                handleGfiDownload(format, selectedLayers, gfiCroppingArea)
              }
            >
              <FontAwesomeIcon icon={faFileArchive} />
              <p>{format.title.toUpperCase()}</p>
            </StyledDownloadFormat>
          );
        })}
      </StyledDownloadFormats>
    </StyledGfiDownloadsContainer>
  );
};

export default FeatureDataDownloadTools;
