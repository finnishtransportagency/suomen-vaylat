import {
  setAllLayers,
  setUserLayers,
  setSelectedLayers,
  setSelectedTheme,
  setLastSelectedTheme,
  setSelectedThemeId,
  reArrangeSelectedMapLayers,
  setBackgroundMaps,
  setMapLayers,
  setAllSelectedThemeLayers,
  getLegends,
  setLegends
} from '../state/slices/rpcSlice';
import { Slide, toast } from 'react-toastify';
import {
  setSelectedMapLayersMenuThemeIndex,
  setIsLegendOpen,
  setIsZoomBarOpen
} from '../state/slices/uiSlice';
import { isMobile } from '../theme/theme';
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
export const updateLayers = (store, channel) => {
  updateAllLayers(store,channel);
  updateSelectedLayers(store,channel);
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
        const userLayers = data.filter(l => typeof l.id === 'string' && l.id.startsWith('userlayer_'));
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
export const updateSelectedLayers = (store, channel) => {
  channel &&
    channel.getSelectedLayers(function (data) {
      const reArrangedSelectedLayers = reArrangeSelectedLayersOrder(
        data,
        store
      );
      store.dispatch(setSelectedLayers(reArrangedSelectedLayers));
      reArrangeRPCLayerOrder(store, reArrangedSelectedLayers);
    });
};

export const getSelectedThemeLayers = (theme, selectedMapLayers) => {
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
  recurseThemeLayers(theme, selectedMapLayers);
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

/**
 * Selects and manages layers based on the given theme.
 * @function selectGroup
 * @param {Object} store - Redux store for state management.
 * @param {Object} channel - Communication channel for map layer actions.
 * @param {Object} allLayers - All available layers.
 * @param {Object} theme - The theme to be selected.
 * @param {String} lastSelectedTheme - Previously selected theme.
 * @param {Number} selectedThemeId - ID of currently selected theme.
 */
export const selectGroup = (
  store,
  channel,
  allLayers,
  theme,
  lastSelectedTheme,
  selectedThemeId
) => {
  const closeLayers = (layers) => {
    layers.forEach((layerId) => {
      channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [
        layerId,
        false
      ]);
      channel.postRequest('ChangeMapLayerStyleRequest', [layerId]);
    });
    updateLayerLegends(store);
  };

  const closeThemeLayers = (theme) => {
    if (theme) {
      theme.layers && closeLayers(theme.layers);
      theme.groups && theme.groups.forEach(closeThemeLayers);
    }
  };
  store.dispatch(setLastSelectedTheme(theme));

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
  };

  const toggleLegendAndZoomBar = (isOpen) => {
    if (!isMobile) {
      store.dispatch(setIsLegendOpen(isOpen));
      store.dispatch(setIsZoomBarOpen(isOpen));
    }
  };

  const processLayers = (theme) => {
    let layers = [];
    theme.layers && layers.push(...theme.layers);
    theme.groups?.forEach((g) => g.layers && layers.push(...g.layers));

    openThemeLayers(theme, layers);
    updateLayers(store, channel);

    const selectedMapLayers =
      store.getState().rpc.selectedLayersByType.mapLayers;
    const selectedThemeLayers = getSelectedThemeLayers(
      theme,
      selectedMapLayers
    );
    store.dispatch(setAllSelectedThemeLayers(selectedThemeLayers));

    selectedMapLayers.forEach((layer) => {
      if (!selectedThemeLayers.includes(layer.id)) {
        channel.postRequest('ChangeMapLayerOpacityRequest', [layer.id, 0]);
        updateLayers(store, channel);
      }
    });
  };

  // Main Execution Logic
  const isThemeChanged = selectedThemeId !== theme.id;

  if (selectedThemeId === null || isThemeChanged) {
    store.dispatch(setSelectedTheme(theme));
    closeThemeLayers(lastSelectedTheme);
    updateLayers(store, channel);
    setTimeout(
      () => {
        toggleLegendAndZoomBar(true);
        store.dispatch(setSelectedThemeId(theme.id));
        setTimeout(() => processLayers(theme), 700);
      },
      isThemeChanged ? 1000 : 700
    );
  } else {
    store.dispatch(setSelectedTheme(null));
    store.dispatch(setAllSelectedThemeLayers([]));
    closeThemeLayers(lastSelectedTheme);
    updateLayers(store, channel);
    setTimeout(() => {
      toggleLegendAndZoomBar(false);
      store.dispatch(setSelectedThemeId(null));
      showNonThemeLayers(store, channel);
    }, 700);
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
  store.dispatch(setLastSelectedTheme(null));
  store.dispatch(setSelectedThemeId(null));
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
  store.dispatch(setLastSelectedTheme(null));
  store.dispatch(setSelectedThemeId(null));
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
