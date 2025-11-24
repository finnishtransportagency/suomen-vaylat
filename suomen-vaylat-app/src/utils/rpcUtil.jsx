import {
  setAllLayers,
  setSelectedLayers,
  setSelectedTheme,
  reArrangeSelectedMapLayers,
  setBackgroundMaps,
  setMapLayers,
  setAllSelectedThemeLayers,
  getLegends,
  setLegends,
  addMarkerRequest,
  removeMarkerRequest,
  setUserLayers
} from '../state/slices/rpcSlice';
import { Slide, toast } from 'react-toastify';
import {
  setSelectedMapLayersMenuThemeIndex,
  setIsLegendOpen,
  removeActiveGeometry,
  addToActiveGeometries,
  setIsSaveViewOpen
} from '../state/slices/uiSlice';
import strings from '../translations';
import { ANNOUNCEMENTS_LOCALSTORAGE } from '../utils/constants';

/**
 * Get desc content for themes groups
 * @method getDescTagContent
 * @param String text
 * @param String startTag
 * @param String endTag
 */
export const getDescTagContent = (text, startTag, endTag) => {
  let links = [];
  let index = 0;

  while (index < text.length) {
    let startPos = text.indexOf(startTag, index);
    if (startPos === -1) break;

    let endPos = text.indexOf(endTag, startPos + startTag.length);
    if (endPos === -1) break; // Added this to handle cases where the end tag is not found

    let link = text.substring(startPos + startTag.length, endPos);
    links.push(link);

    index = endPos + endTag.length;
  }
  return links;
};

/**
 * Update layers. Use only this to update all layers and selected layers.
 * @method updateLayers
 * @param {Object} store
 * @param {Object} channel
 */
export const updateLayers = (store, channel, onComplete) => {
  // TODO maybe make functions promises
  updateAllLayers(store, channel);
  updateSelectedLayers(store, channel, onComplete);
};

/**
 * Activate view to map
 * @method activateView
 * @param {Object} store
 * @param {Object} channel
 * @param {Object} view The view data object
 */
export const activateView = (store, channel, view) => {
  channel.getMapPosition(function () {
    var routeSteps = [
      {
        lon: view.data.x,
        lat: view.data.y,
        duration: 3000,
        zoom: view.data.zoom,
        animation: 'zoomPan'
      }
    ];
    var stepDefaults = {
      lon: view.data.x,
      lat: view.data.y,
      zoom: view.data.zoom,
      animation: 'zoomPan',
      duration: 3000,
      srsName: 'EPSG:3067'
    };
    channel.postRequest('MapTourRequest', [routeSteps, stepDefaults]);
  });

  store.getState().rpc.selectedLayers.forEach((layer) => {
    channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [
      layer.id,
      false
    ]);
  });

  view.data.layers.forEach((layer) => {
    channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [
      layer.id,
      true
    ]);
    channel.postRequest('ChangeMapLayerOpacityRequest', [
      layer.id,
      layer.opacity
    ]);
  });

  if (view.data.geometries) {
    const geometry = view.data.geometries;
    geometry.markers.forEach((marker) => {
      store.dispatch(addMarkerRequest(marker));
    });

    const addFeaturesToMapParams = {
      clearPrevious: false,
      layerId: geometry.id,
      featureStyle: {
        fill: {
          color: 'rgba(10, 140, 247, 0.1)'
        },
        stroke: {
          color: 'rgba(10, 140, 247, 0.3)',
          width: 5,
          lineDash: 'solid',
          lineCap: 'round',
          lineJoin: 'round',
          area: {
            color: '#ff5100b3',
            width: 4,
            lineJoin: 'round'
          }
        },
        image: {
          shape: 5,
          size: 3,
          fill: {
            color: '#ff5100b3'
          }
        }
      }
    };
    if (store.getState().ui.activeGeometries.find((g) => g.id === view.id)) {
      store.dispatch(removeActiveGeometry(view.id));
      geometry.markers.forEach((marker) => {
        store.dispatch(removeMarkerRequest({ markerId: marker.markerId }));
      });
      channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
        null,
        null,
        geometry.id
      ]);
      return;
    }
    const savedGeometries = [...geometry.geoJsonArray];

    savedGeometries.forEach((g) => {
      //tiehaku
      g.data &&
        g.data.geom &&
        channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
          geometry.data.geom,
          addFeaturesToMapParams
        ]);

      g.features &&
        g.features.forEach((feature) => {
          channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
            feature.geojson,
            addFeaturesToMapParams
          ]);
        });

      g.geojson &&
        channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
          g.geojson,
          addFeaturesToMapParams
        ]);
    });

    store.dispatch(addToActiveGeometries(geometry));
  }

  updateLayers(store, channel);
  store.dispatch(setIsSaveViewOpen(false));
};

/**
 * Update all layers
 * @method updateAllLayers
 * @param {Object} store
 * @param {Object} channel
 */
export const updateAllLayers = (store, channel) => {
  channel &&
    channel.getAllLayersSV(
      function (data) {
        const userLayers = data.filter(
          (l) => typeof l.id === 'string' && l.id.startsWith('userlayer_')
        );
        store.dispatch(setAllLayers(data));
        store.dispatch(setUserLayers(userLayers));
      },
      function err(data) {
        toast.error(strings.layerlist.errorLoadingLayers, {
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
};

/**
 * Update selected layers
 * @method updateSelectedLayers
 * @param {Object} store
 * @param {Object} channel
 */
export const updateSelectedLayers = (store, channel, onComplete) => {
  channel &&
    channel.getSelectedLayers(function (data) {
      const reArrangedSelectedLayers = reArrangeSelectedLayersOrder(
        data,
        store
      );
      store.dispatch(setSelectedLayers(reArrangedSelectedLayers));
      reArrangeRPCLayerOrder(store, reArrangedSelectedLayers);
      if (typeof onComplete === 'function') onComplete();
    });
};

export const getThemeLayers = (theme) => {
  let array = [];

  const recurseThemeLayers = (theme) => {
    if (theme.layers) {
      theme.layers.forEach((layer) => {
        array.push(layer);
      });
    }
    if (theme.groups) {
      theme.groups.forEach((subtheme) => {
        recurseThemeLayers(subtheme);
      });
    } else return array;
  };
  recurseThemeLayers(theme);
  return array;
};

export const showNonThemeLayers = (store, channel) => {
  const selectedMapLayers = store.getState().rpc.selectedLayersByType.mapLayers;
  selectedMapLayers.forEach((layer) => {
    if (layer.opacity !== 0) return;
    channel.postRequest('ChangeMapLayerOpacityRequest', [layer.id, 100]);
    updateLayers(store, channel);
  });
};

export const updateLayerLegends = (store) => {
  // need use global window variable to limit legend updates
  clearTimeout(window.legendUpdateTimer);
  window.legendUpdateTimer = setTimeout(function () {
    store.dispatch(
      getLegends({
        handler: (data) => {
          store.dispatch(setLegends(data));
        }
      })
    );
  }, 1000);
};

const closeThemeLayers = (channel, store, theme, onComplete) => {
  const themeLayers = getThemeLayers(theme);
  const selectedMapLayers = store.getState().rpc.selectedLayersByType.mapLayers;
  const selectedIdSet = new Set(selectedMapLayers.map(l => Number(l.id)));
  const selectedLayers = themeLayers.filter(id => selectedIdSet.has(Number(id)));

  channel.closeThemeLayers(
    [themeLayers, selectedLayers],
    function () {
      // Theme layers successfully closed and styles returned to default, ready to update legends
      updateLayers(store, channel)
      updateLayerLegends(store);
      onComplete();
    },
    function (err) {
      console.error('closeThemeLayers error: ', err);
      toast.error(strings.themelayerlist.errors.closeThemeLayersError, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'colored',
        transition: Slide
      });
    }
  );
};

/**
 * Closes theme
 * @function closeTheme
 * @param {Object} store - Redux store for state management.
 * @param {Object} channel - Communication channel for map layer actions.
 * @param {Object} theme - The theme to be selected.
 */
export const closeTheme = (store, channel, theme) => {
  // close themelayers
  closeThemeLayers(channel, store, theme, () => {
    store.dispatch(setSelectedTheme(null));
    store.dispatch(setAllSelectedThemeLayers([]));
    setTimeout(() => {
      store.dispatch(setIsLegendOpen(false));
      showNonThemeLayers(store, channel);
    }, 700);
  });
};

/**
 * Selects and manages layers based on the given theme.
 * @function selectTheme
 * @param {Object} store - Redux store for state management.
 * @param {Object} channel - Communication channel for map layer actions.
 * @param {Object} allLayers - All available layers.
 * @param {Object} theme - The theme to be selected.
 * @param {Object} lastSelectedTheme - Previously selected theme.
 */
export const selectTheme = (
  store,
  channel,
  allLayers,
  theme,
  lastSelectedTheme
) => {
  const selectedThemeId = lastSelectedTheme?.id || null;
  const themeLayers = getThemeLayers(theme);

  const openThemeLayers = (theme, layers) => {
    layers.forEach((layerId) => {
      const layer = allLayers?.find((l) => l.id === layerId);
      const hasDefaultTheme = layer?.config?.themes?.some(
        (t) =>
          t.name['fi'].toLowerCase() ===
            theme.locale['fi'].name.toLowerCase() && t.default
      );
      if (hasDefaultTheme) {
        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [
          layerId,
          true
        ]);
      }
    });
    // TODO: is this necessary as we already update the layers after hiding non theme layers?
    updateLayers(store, channel);
  };

  const processLayers = (theme) => {
    if (themeLayers.length === 0) return;
    channel.setLayerThemeStyle(
      [themeLayers, theme.locale['fi'].name],
      function (data) {
        // data has successLayers and errorLayers

        // actually open the default layers
        openThemeLayers(theme, themeLayers);

        const selectedMapLayers =
          store.getState().rpc.selectedLayersByType.mapLayers;
        store.dispatch(setAllSelectedThemeLayers(themeLayers));

        // if layer is not in theme, set it not visible
        selectedMapLayers.forEach((layer) => {
          if (!themeLayers.includes(layer.id)) {
            channel.postRequest('ChangeMapLayerOpacityRequest', [layer.id, 0]);
          }
        });
        updateLayers(store, channel);

        updateLayerLegends(store);
        store.dispatch(setIsLegendOpen(true));
      },
      function (error) {
        toast.error(strings.themelayerlist.errors.themeStyleError + error, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: 'colored',
          transition: Slide
        });
      }
    );
  };

  // Main Execution Logic
  const isThemeChanged = selectedThemeId !== theme.id;

  if (lastSelectedTheme !== null) {
    // close themelayers
    closeThemeLayers(channel, store, lastSelectedTheme, () => {
      store.dispatch(setSelectedTheme(theme));
      setTimeout(
        () => {
          setTimeout(() => {
            processLayers(theme);
          }, 700);
        },
        isThemeChanged ? 1000 : 700
      );
    });
  } else {
    store.dispatch(setSelectedTheme(theme));
    setTimeout(
      () => {
        setTimeout(() => {
          processLayers(theme);
        }, 700);
      },
      isThemeChanged ? 1000 : 700
    );
  }
};

/**
 * Sort object values alphabetically i.ex. themes group names
 * @param {string} a first comparable value
 * @param {string} b second comparable value
 * @method sortObjectAlphabetically
 */
export const sortObjectAlphabetically = (a, b) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

/**
 * Rearrange object array according to other array.
 * @param {Object} objectArray
 * @param {Array} order
 * @param {String} key
 * @method reArrangeArray
 */
export const reArrangeArray = (objectArray, order, key) => {
  let arrayForSort = [...objectArray];
  let sortedArray = arrayForSort.sort(function (a, b) {
    var A = a[key],
      B = b[key];

    if (order.indexOf(A) > order.indexOf(B)) {
      return 1;
    } else {
      return -1;
    }
  });
  return sortedArray;
};

/**
 * Rearrange RPC layer order.
 * @method reArrangeRPCLayerOrder
 * @param {Object} store
 * @param {Array} selectedLayers
 */
export const reArrangeRPCLayerOrder = (store, selectedLayers) => {
  const mapLayers = store.getState().rpc.selectedLayersByType.mapLayers;
  const backgroundMaps =
    store.getState().rpc.selectedLayersByType.backgroundMaps;
  let concatted = mapLayers.concat(backgroundMaps);
  store.dispatch(setSelectedLayers(concatted));

  mapLayers.forEach((layer, i) => {
    const position = concatted.length - i;
    store.dispatch(
      reArrangeSelectedMapLayers({ layerId: layer.id, position: position })
    );
  });

  backgroundMaps.forEach((map, i) => {
    const position = concatted.length - mapLayers.length - i;
    store.dispatch(
      reArrangeSelectedMapLayers({ layerId: map.id, position: position })
    );
  });
};

/**
 * Rearrange selected layers order.
 * @method reArrangeSelectedLayersOrder
 * @param {Array} selectedLayers
 * @returns ordered layers
 */
export const reArrangeSelectedLayersOrder = (selectedLayers, store) => {
  let bgMaps = store.getState().rpc.selectedLayersByType.backgroundMaps;

  const clearUnselectedMaps = () => {
    bgMaps = bgMaps.filter((map) =>
      selectedLayers.find((layer) => layer.id === map.id)
    );
  };

  const getBackgroundMaps = (group) => {
    if (group?.groups) {
      group.groups.forEach((group) => {
        getBackgroundMaps(group);
      });
    }
    if (group?.layers) {
      group.layers.forEach((layer) => {
        selectedLayers.forEach((selectedLayer) => {
          if (selectedLayer.id === layer) {
            if (bgMaps.length > 0) {
              let duplicateIndex = bgMaps.findIndex((map) => map.id === layer);
              if (duplicateIndex === -1) bgMaps = [selectedLayer, ...bgMaps];
              else bgMaps[duplicateIndex] = selectedLayer;
            } else {
              bgMaps = [selectedLayer, ...bgMaps];
            }
          }
        });
      });
    } else return;
  };
  clearUnselectedMaps();
  getBackgroundMaps(
    store.getState().rpc.allGroups.find((group) => group.id === 1)
  );
  let layers = selectedLayers.filter(
    (layer) => !bgMaps.find((map) => map.id === layer.id)
  );
  store.dispatch(setBackgroundMaps(bgMaps));
  store.dispatch(setMapLayers(layers));

  return layers.concat(bgMaps);
};

/**
 * Reset theme groups.
 * @method resetThemeGroup
 * @param {Object} store
 */
export const resetThemeGroups = (store) => {
  store.dispatch(setSelectedTheme(null));
  store.dispatch(setAllSelectedThemeLayers([]));
};

/**
 * Reset theme groups for main screen.
 * @method resetThemeGroupsForMainScreen
 * @param {Object} store
 * @param {Object} channel
 * @param {String} theme
 */
export const resetThemeGroupsForMainScreen = (store, channel, theme) => {
  if (theme) {
    theme.layers.forEach((layerId) => {
      channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [
        layerId,
        false
      ]);
    });
  }
  store.dispatch(setSelectedMapLayersMenuThemeIndex(0));
  store.dispatch(setSelectedTheme(null));
};

/**
 * Remove dublicates.
 * @method removeDublicates
 * @param {Array} originalArray
 * @param {String} prop
 * @returns
 */
export const removeDuplicates = (originalArray, prop) => {
  let newArray = [];
  let lookupObject = {};

  for (let i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for (let i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
};

/**
 * Gets active announcements
 * @param {Array} annoucements announcements
 * @returns {Array} active annoucements
 */
export const getActiveAnnouncements = (annoucements) => {
  let activeAnnoucements = [];
  if (annoucements && annoucements.length > 0) {
    const localStorageAnnouncements = localStorage.getItem(
      ANNOUNCEMENTS_LOCALSTORAGE
    )
      ? localStorage.getItem(ANNOUNCEMENTS_LOCALSTORAGE)
      : [];
    const activeAnnouncements = annoucements.filter((announcement) => {
      const currDate = new Date();
      const annDate = new Date(announcement.endDate);
      return (
        localStorageAnnouncements &&
        !localStorageAnnouncements.includes(announcement.id) &&
        currDate < annDate
      );
    });

    const currentLang = strings.getLanguage();
    const defaultLang = strings.getAvailableLanguages()[0];

    activeAnnouncements.forEach((annoucement) => {
      const localeObj = annoucement.locale[currentLang]
        ? annoucement.locale[currentLang]
        : annoucement.locale[defaultLang]
        ? annoucement.locale[defaultLang]
        : annoucement.locale[Object.keys(annoucement.locale)[0]];
      activeAnnoucements.push({
        id: annoucement.id,
        title: localeObj.title,
        content: localeObj.content
      });
    });
  }
  return activeAnnoucements;
};
