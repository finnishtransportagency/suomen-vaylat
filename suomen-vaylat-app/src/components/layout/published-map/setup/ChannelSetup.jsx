import {
  setAnnouncements,
  setActiveAnnouncements,
  setAllTags,
  setTagsWithLayers,
  setAllThemesWithLayers,
  setZoomRange,
  setCurrentZoomLevel,
  setAllGroups,
  setFeatures,
  setCurrentMapCenter,
  setStartMapCenter,
} from '../../../../state/slices/rpcSlice';
import {
  setGfiCroppingTypes,
  setSelectedBaseLayers
} from '../../../../state/slices/uiSlice';
import { BASE_LAYERS_LOCALSTORAGE } from '../../../../utils/constants';
import { activateView, updateLayerLegends, updateLayers } from '../../../../utils/rpcUtil';
import { getActiveAnnouncements } from '../../../../utils/rpcUtil';
import { IS_EXTRANET } from '../../../../utils/appInfoUtil';
import { Slide, toast } from 'react-toastify';
import strings from '../../../../translations';

const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

const fetchAnnouncementsAsync = async (data, channel, store) => {
  let activeAnnouncements = [];
  await new Promise((resolve) => {
    setTimeout(() => {
      if (data.getSelectedAnnouncements) {
        channel.getSelectedAnnouncements(function (responseData) {
          store.dispatch(setAnnouncements(responseData));
          activeAnnouncements = getActiveAnnouncements(responseData);

          if (activeAnnouncements && activeAnnouncements.length > 0) {
            store.dispatch(setActiveAnnouncements(activeAnnouncements));
          }
          resolve(activeAnnouncements);
        });
      } else {
        resolve(activeAnnouncements);
      }
    }, 1000);
  }).then((announcements) => {
    // due to a bug, check again after 3 seconds if announcements list is empty on Safari
    if (isSafari() && announcements.length === 0) {
      setTimeout(() => {
        if (data.getSelectedAnnouncements) {
          channel.getSelectedAnnouncements(function (responseData) {
            activeAnnouncements = getActiveAnnouncements(responseData);
            if (activeAnnouncements && activeAnnouncements.length > 0) {
              store.dispatch(setActiveAnnouncements(activeAnnouncements));
            }
          });
        }
      }, 8000);
    }
  });
};

const setupSupportedFunctions = (data, channel, store, isSharedLink) => {

  if (data.getViewLayerDefaultStyles) {
    channel.getViewLayerDefaultStyles(
      () => {
      },
      (data) => {
        console.error(strings.getViewStylesError, data);
        toast.error(strings.getViewStylesError, {
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
    );
  }

  if (IS_EXTRANET && data.fetchUserLayers) {
    channel.fetchUserLayers(
      () => {
        updateLayers(store, channel);
      },
      () => {
        toast.error(strings.datasetImport.fetchUserLayersError, {
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
    );
  }
  // Fetch and save announcements to state
  fetchAnnouncementsAsync(data, channel, store);

  if (data.getTags) {
    channel.getTags((tagsData) => store.dispatch(setAllTags(tagsData)));
  }

  if (data.getTagsWithLayers) {
    channel.getTagsWithLayers((tagsLayersData) =>
      store.dispatch(setTagsWithLayers(tagsLayersData))
    );
  }

  if (data.getGfiCroppingTypes) {
    channel.getGfiCroppingTypes((gfiCroppingTypesData) =>
      store.dispatch(setGfiCroppingTypes(gfiCroppingTypesData))
    );
  }

  if (data.getThemesWithLayers) {
    channel.getThemesWithLayers((themesWithLayersData) =>
      store.dispatch(setAllThemesWithLayers(themesWithLayersData))
    );
  }

  if (data.getZoomRange) {
    channel.getZoomRange((zoomRangeData) => {
      store.dispatch(setZoomRange(zoomRangeData));
      zoomRangeData.hasOwnProperty('current') &&
        store.dispatch(setCurrentZoomLevel(zoomRangeData.current));
    });
  }

  if (data.getAllGroups) {
    channel.getAllGroups((allGroupsData) => {
      const arrangeAlphabetically = (x, y) => {
        if (x.name < y.name) {
          return -1;
        }
        if (x.name > y.name) {
          return 1;
        }
        return 0;
      };

      store.dispatch(setAllGroups(allGroupsData.sort(arrangeAlphabetically)));
    });
  }

  // Update layers and then complete the function onComplete
  updateLayers(store, channel, () => {
    //handle default view
    const defaultView = store
      .getState()
      .rpc?.views?.find((view) => view.default);

    if (!isSharedLink && defaultView) {
      activateView(store, channel, defaultView);
    }

    // handle base layers tool
    const stored = localStorage.getItem(BASE_LAYERS_LOCALSTORAGE);
    if (stored) {
      try {
        const parsedBgLayers = JSON.parse(stored);
        if (parsedBgLayers.length > 0) {
          store.dispatch(setSelectedBaseLayers(parsedBgLayers));
        } else {
          const defaultBackgroundMaps = store
            .getState()
            .rpc?.selectedLayersByType?.backgroundMaps.map((l) => l.id);
          localStorage.setItem(
            BASE_LAYERS_LOCALSTORAGE,
            JSON.stringify(defaultBackgroundMaps)
          );
          store.dispatch(setSelectedBaseLayers(defaultBackgroundMaps));
        }
      } catch (e) {
        store.dispatch(setSelectedBaseLayers([]));
      }
    } else {
      const defaultBackgroundMaps = store
        .getState()
        .rpc?.selectedLayersByType?.backgroundMaps.map((l) => l.id);
      localStorage.setItem(
        BASE_LAYERS_LOCALSTORAGE,
        JSON.stringify(defaultBackgroundMaps)
      );
      store.dispatch(setSelectedBaseLayers(defaultBackgroundMaps));
    }

    // Update legends now that they are for sure loaded in Oskari
    updateLayerLegends(store);
  });

  if (data.getFeatures) {
    channel.getFeatures((featuresData) =>
      store.dispatch(setFeatures(featuresData))
    );
  }

  if (data.getMapPosition) {
    channel.getMapPosition((mapPositionData) => {
      store.dispatch(setStartMapCenter(mapPositionData));
      store.dispatch(setCurrentMapCenter(mapPositionData));
    });
  }
};

export default setupSupportedFunctions;
