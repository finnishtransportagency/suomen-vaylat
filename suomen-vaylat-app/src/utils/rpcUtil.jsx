import {
    setAllLayers,
    setSelectedLayers,
    setSelectedTheme,
    setLastSelectedTheme,
    setSelectedThemeIndex,
    reArrangeSelectedMapLayers
} from '../state/slices/rpcSlice';

import {
    setSelectedMapLayersMenuThemeIndex,
    setIsLegendOpen
} from '../state/slices/uiSlice';

import { isMobile } from '../theme/theme';

/**
 * Update layers. Use only this to update all layers and selected layers.
 * @method updateLayers
 * @param {Object} store
 * @param {Object} channel
 */
export const updateLayers = (store, channel) => {
    channel && channel.getAllLayers(function (data) {
        store.dispatch(setAllLayers(data));
    });
    channel && channel.getSelectedLayers(function (data) {
        const reArrangedSelectedLayers = reArrangeSelectedLayersOrder(data)
        store.dispatch(setSelectedLayers(reArrangedSelectedLayers));
        reArrangeRPCLayerOrder(store, reArrangedSelectedLayers)
    });
};

/**
 * Select group.
 * @method selectGroup
 * @param {Object} store
 * @param {Object} channel
 * @param {Number} index
 * @param {String} theme
 * @param {String} lastSelectedTheme
 * @param {Number} selectedThemeIndex
 */
export const selectGroup = (store, channel, index, theme, lastSelectedTheme, selectedThemeIndex) => {
    store.dispatch(setLastSelectedTheme(theme));
    if (selectedThemeIndex === null){
        store.dispatch(setSelectedTheme(theme));
        store.dispatch(setSelectedThemeIndex(index));
        setTimeout(() => {
            !isMobile && store.dispatch(setIsLegendOpen(true));
            theme.defaultLayers && theme.defaultLayers.forEach(layerId => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, true]);
            });
            updateLayers(store, channel);
        },700);
    } else if (selectedThemeIndex !== index ){
        store.dispatch(setSelectedTheme(theme));
        lastSelectedTheme !== null && lastSelectedTheme.layers.forEach(layerId => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, false]);
        });
        updateLayers(store, channel);
        setTimeout(() => {
            store.dispatch(setSelectedThemeIndex(index));
            setTimeout(() => {
                theme.defaultLayers.forEach(layerId => {
                        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, true]);
                    });
                updateLayers(store, channel);
            },700);
        },1000);

    } else {
        store.dispatch(setSelectedTheme(null));
        theme.layers && theme.layers.forEach(layerId => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, false]);
        });
        if (theme.subthemes){
            for (var i = 0; i < theme.subthemes.length; i++) {
                theme.subthemes[i].layers.forEach(layerId => {
                    channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, false]);
                });
            }
        }
        updateLayers(store, channel);
        setTimeout(() => {
            !isMobile && store.dispatch(setIsLegendOpen(false));
            store.dispatch(setSelectedThemeIndex(null));
        },700);
    };
};

/**
 * Rearrange RPC layer order.
 * @method reArrangeRPCLayerOrder
 * @param {Object} store
 * @param {Array} selectedLayers
 */
export const reArrangeRPCLayerOrder = (store, selectedLayers) => {
    const mapLayers = selectedLayers.filter(layer => {
        return !(layer.groups && layer.groups.includes(1));
    });

    const backgroundMaps = selectedLayers.filter(layer => {
        return layer.groups && layer.groups.includes(1);
    });

    mapLayers.forEach((layer, idx) => {
        // Update layer orders to correct
        const position = selectedLayers.length-idx;
        store.dispatch(reArrangeSelectedMapLayers({layerId: layer.id, position: position}));
    });

    backgroundMaps.forEach((layer, idx) => {
        // Update layer orders to correct
        const position = selectedLayers.length - mapLayers.length -idx;
        store.dispatch(reArrangeSelectedMapLayers({layerId: layer.id, position: position}));
    })
}

/**
 * Rearrange selected layers order.
 * @method reArrangeSelectedLayersOrder
 * @param {Array} selectedLayers
 * @returns ordered layers
 */
export const reArrangeSelectedLayersOrder = (selectedLayers) => {
    const mapLayers = selectedLayers.filter(layer => {
        return !(layer.groups && layer.groups.includes(1));
    });

    const backgroundMaps = selectedLayers.filter(layer => {
        return layer.groups && layer.groups.includes(1);
    });

    return mapLayers.concat(backgroundMaps)
}

/**
 * Reset theme groups.
 * @method resetThemeGroup
 * @param {Object} store
 * @param {Object} channel
 * @param {Number} index
 * @param {String} theme
 * @param {String} lastSelectedTheme
 * @param {Number} selectedThemeIndex
 */
export const resetThemeGroups = (store, channel, index, theme, lastSelectedTheme, selectedThemeIndex) => {
    store.dispatch(setSelectedTheme(null));
    store.dispatch(setLastSelectedTheme(null));
    store.dispatch(setSelectedThemeIndex(null));
};

/**
 * Reset theme groups for main screen.
 * @method resetThemeGroupsForMainScreen
 * @param {Object} store
 * @param {Object} channel
 * @param {Number} index
 * @param {String} theme
 * @param {String} lastSelectedTheme
 * @param {Number} selectedThemeIndex
 */
export const resetThemeGroupsForMainScreen = (store, channel, index, theme, lastSelectedTheme, selectedThemeIndex) => {
    if(theme){
        theme.layers.forEach(layerId => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, false]);
        });
    };
    store.dispatch(setSelectedMapLayersMenuThemeIndex(0));
    store.dispatch(setSelectedTheme(null));
    store.dispatch(setLastSelectedTheme(null));
    store.dispatch(setSelectedThemeIndex(null));
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
    let lookupObject  = {};

    for(let i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(let i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}
