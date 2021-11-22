import {
    setAllLayers,
    setSelectedLayers,
    setSelectedTheme,
    setLastSelectedTheme,
    setSelectedThemeIndex
} from "../state/slices/rpcSlice";

import {
    setSelectedMapLayersMenuThemeIndex
} from "../state/slices/uiSlice";

export const updateLayers = (store, channel) => {
    channel && channel.getAllLayers(function (data) {
        store.dispatch(setAllLayers(data));
    });
    channel && channel.getSelectedLayers(function (data) {
        store.dispatch(setSelectedLayers(data));
    });
};

export const selectGroup = (store, channel, index, theme, lastSelectedTheme, selectedThemeIndex) => {
    store.dispatch(setLastSelectedTheme(theme));
    if(selectedThemeIndex === null){
        store.dispatch(setSelectedTheme(theme));
        store.dispatch(setSelectedThemeIndex(index));
        setTimeout(() => {
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
            store.dispatch(setSelectedThemeIndex(null));
        },700);
    };
};

export const resetThemeGroups = (store, channel, index, theme, lastSelectedTheme, selectedThemeIndex) => {
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