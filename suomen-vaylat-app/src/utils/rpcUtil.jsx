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

export const selectGroup = (store, channel, index, theme, lastSelectedTheme, selectedThemeIndex) => {
    store.dispatch(setLastSelectedTheme(theme));
    if(selectedThemeIndex === null){
        store.dispatch(setSelectedTheme(theme));
        store.dispatch(setSelectedThemeIndex(index));
        setTimeout(() => {
            !isMobile && store.dispatch(setIsLegendOpen(true));
            theme.layers.forEach(layerId => {
                theme.defaultLayers.includes(layerId) && channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, true]);
            });
            updateLayers(store, channel);
        },700);
    } else if(selectedThemeIndex !== index ){
        store.dispatch(setSelectedTheme(theme));
        lastSelectedTheme !== null && lastSelectedTheme.layers.forEach(layerId => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, false]);
        });
        updateLayers(store, channel);
        setTimeout(() => {
            store.dispatch(setSelectedThemeIndex(index));
            setTimeout(() => {
                    theme.layers.forEach(layerId => {
                        theme.defaultLayers.includes(layerId) && channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, true]);
                    });
                updateLayers(store, channel);
            },700);
        },1000);

    } else {
        store.dispatch(setSelectedTheme(null));
        theme.layers.forEach(layerId => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, false]);
        });
        updateLayers(store, channel);
        setTimeout(() => {
            !isMobile && store.dispatch(setIsLegendOpen(false));
            store.dispatch(setSelectedThemeIndex(null));
        },700);
    };
};

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

export const reArrangeSelectedLayersOrder = (selectedLayers) => {
    const mapLayers = selectedLayers.filter(layer => {
        return !(layer.groups && layer.groups.includes(1));
    });

    const backgroundMaps = selectedLayers.filter(layer => {
        return layer.groups && layer.groups.includes(1);
    });

    return mapLayers.concat(backgroundMaps)
}

export const resetThemeGroups = (store, channel, index, theme, lastSelectedTheme, selectedThemeIndex) => {
    store.dispatch(setSelectedTheme(null));
    store.dispatch(setLastSelectedTheme(null));
    store.dispatch(setSelectedThemeIndex(null));
};

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
