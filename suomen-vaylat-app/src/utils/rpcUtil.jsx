import moment from 'moment';
import {
    setAllLayers,
    setSelectedLayers,
    setSelectedTheme,
    setLastSelectedTheme,
    setSelectedThemeIndex,
    reArrangeSelectedMapLayers,
    setBackgroundMaps,
    setMapLayers,
    setAllSelectedThemeLayers
} from '../state/slices/rpcSlice';

import {
    setSelectedMapLayersMenuThemeIndex,
    setIsLegendOpen,
    setIsZoomBarOpen
} from '../state/slices/uiSlice';

import { isMobile } from '../theme/theme';
import strings from '../translations';
import { ANNOUNCEMENTS_LOCALSTORAGE } from '../utils/constants';

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
        const reArrangedSelectedLayers = reArrangeSelectedLayersOrder(data, store)
        store.dispatch(setSelectedLayers(reArrangedSelectedLayers));
        reArrangeRPCLayerOrder(store, reArrangedSelectedLayers)
    });
};

export const getSelectedThemeLayers = (theme, selectedMapLayers) => {
    let array = [];

    const recurseThemeLayers = (theme) => {
        if(theme.layers) {
            theme.layers.forEach(layer => {
                array.push(layer);  
            });
        }
        if(theme.subthemes) {
            theme.subthemes.forEach(subtheme => {
                recurseThemeLayers(subtheme);
            })
        }
        else return array;
    }
    recurseThemeLayers(theme, selectedMapLayers);
    return array;
}

export const showNonThemeLayers = (store, channel) => {
    const selectedMapLayers = store.getState().rpc.selectedLayersByType.mapLayers;
    selectedMapLayers.forEach(layer => {
        if(layer.opacity !== 0) return;
        channel.postRequest('ChangeMapLayerOpacityRequest', [layer.id, 100]);
        updateLayers(store, channel);
    });
}

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

    const closeAllThemeLayers = (theme) => {
        // close all theme layers
        theme?.layers?.forEach(layerId => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, false]);
        });
        // close all subtheme layers and check if subthemes have subthemes and close their layers recursively
        if(theme.subthemes) {
            theme.subthemes.forEach(subtheme => {
                closeAllThemeLayers(subtheme);
            });
        }
    };
    store.dispatch(setLastSelectedTheme(theme));

    if (selectedThemeIndex === null){
        // set selectedLayers opacities to 0 on every layer but theme layers
        store.dispatch(setSelectedTheme(theme));
        store.dispatch(setSelectedThemeIndex(index));
        setTimeout(() => {
            if(!isMobile) {
                store.dispatch(setIsLegendOpen(true));
                store.dispatch(setIsZoomBarOpen(true));
            }
            theme.defaultLayers && theme.defaultLayers.forEach(layerId => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, true]);
            });
            updateLayers(store, channel);
    
        const selectedMapLayers =  store.getState().rpc.selectedLayersByType.mapLayers;
        const selectedTheme = store.getState().rpc.selectedTheme;
        const selectedThemeLayers = getSelectedThemeLayers(selectedTheme, selectedMapLayers);
        store.dispatch(setAllSelectedThemeLayers(selectedThemeLayers));
        if(selectedTheme) {
            selectedMapLayers.forEach(layer => {
                if(!selectedThemeLayers.find(themelayer => themelayer === layer.id)) {
                    channel.postRequest('ChangeMapLayerOpacityRequest', [layer.id, 0]);
                    updateLayers(store, channel);
                }
            })
    }
        },700);

    } 
    
    else if (selectedThemeIndex !== index ){
         // set selectedLayers opacities to 0 on every layer but theme layers
        store.dispatch(setSelectedTheme(theme));
        closeAllThemeLayers(lastSelectedTheme);
        updateLayers(store, channel);
        setTimeout(() => {
            store.dispatch(setSelectedThemeIndex(index));
            setTimeout(() => {
                theme.defaultLayers.forEach(layerId => {
                        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, true]);
                    });
                updateLayers(store, channel);
    
    const selectedMapLayers =  store.getState().rpc.selectedLayersByType.mapLayers;
    const selectedTheme = store.getState().rpc.selectedTheme;
    const selectedThemeLayers = getSelectedThemeLayers(selectedTheme, selectedMapLayers);
    store.dispatch(setAllSelectedThemeLayers(selectedThemeLayers));
    if(selectedTheme) {
        selectedMapLayers.forEach(layer => {
            if(!selectedThemeLayers.find(themelayer => themelayer === layer.id)) {
                channel.postRequest('ChangeMapLayerOpacityRequest', [layer.id, 0]);
                updateLayers(store, channel);
            } 
        })
    }
            },700);
        },1000);
    } 
    
    else {
        store.dispatch(setSelectedTheme(null));
        store.dispatch(setAllSelectedThemeLayers([]));
        closeAllThemeLayers(lastSelectedTheme);
        updateLayers(store, channel);
        setTimeout(() => {
            if(!isMobile) {
                store.dispatch(setIsLegendOpen(false));
                store.dispatch(setIsZoomBarOpen(false));
            }
            store.dispatch(setSelectedThemeIndex(null));
            showNonThemeLayers(store, channel);
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
    const mapLayers = store.getState().rpc.selectedLayersByType.mapLayers;
    const backgroundMaps = store.getState().rpc.selectedLayersByType.backgroundMaps;
    let concatted = mapLayers.concat(backgroundMaps);
    store.dispatch(setSelectedLayers(concatted));

    mapLayers.forEach((layer, i) => {
        const position = concatted.length - i;
        store.dispatch(reArrangeSelectedMapLayers({layerId: layer.id, position: position}));
    });

    backgroundMaps.forEach((map, i) => {
        const position = concatted.length - mapLayers.length -i;
        store.dispatch(reArrangeSelectedMapLayers({layerId: map.id, position: position}))
    });
}

/**
 * Rearrange selected layers order.
 * @method reArrangeSelectedLayersOrder
 * @param {Array} selectedLayers
 * @returns ordered layers
 */
export const reArrangeSelectedLayersOrder = (selectedLayers, store) => {

    let bgMaps = store.getState().rpc.selectedLayersByType.backgroundMaps;

    const clearUnselectedMaps = () => {
        bgMaps = bgMaps.filter(map => selectedLayers.find(layer => layer.id === map.id))
    }

    const getBackgroundMaps = (group) => {
        if(group?.groups) {
            group.groups.forEach(group => {
                getBackgroundMaps(group);
            });
        }
        if(group?.layers) {
            group.layers.forEach(layer => {
                selectedLayers.forEach(selectedLayer => {
                    if(selectedLayer.id === layer) {
                        if(bgMaps.length > 0) {
                            let duplicateIndex = bgMaps.findIndex(map => map.id === layer);
                            if(duplicateIndex === -1) bgMaps = [selectedLayer, ...bgMaps];
                            else bgMaps[duplicateIndex] = selectedLayer
                        }
                        else {
                            bgMaps = [selectedLayer, ...bgMaps];
                        }
                    }
                })
            });
        }
        else return;
    };
    clearUnselectedMaps();
    getBackgroundMaps(store.getState().rpc.allGroups[12]);
    let layers = selectedLayers.filter(layer => !bgMaps.find(map => map.id === layer.id));
    store.dispatch(setBackgroundMaps(bgMaps));
    store.dispatch(setMapLayers(layers));

    return layers.concat(bgMaps)
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
    store.dispatch(setAllSelectedThemeLayers([]));
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

/**
 * Gets active announcements
 * @param {Array} annoucements announcements
 * @returns {Array} active annoucements
 */
export const getActiveAnnouncements = (annoucements) => {
    let activeAnnoucements = [];
    if (annoucements && annoucements.length > 0) {
        const localStorageAnnouncements =
            localStorage.getItem(ANNOUNCEMENTS_LOCALSTORAGE)
                ? localStorage.getItem(
                        ANNOUNCEMENTS_LOCALSTORAGE
                    )
                : [];
        const activeAnnouncements = annoucements.filter(
            (announcement) =>
                localStorageAnnouncements &&
                !localStorageAnnouncements.includes(
                    announcement.id
                )
        );


        const currentTime = Date.now();
        const currentLang = strings.getLanguage();
        const defaultLang = strings.getAvailableLanguages()[0];

        activeAnnouncements.forEach(annoucement => {
            const start = new Date(annoucement.beginDate);
            const end = new Date(annoucement.endDate);
            if (moment(currentTime).isBetween(start, end)) {
                const localeObj = annoucement.locale[currentLang] ? annoucement.locale[currentLang] : (
                        annoucement.locale[defaultLang] ? annoucement.locale[defaultLang] : annoucement.locale[Object.keys(annoucement.locale)[0]]
                    )
                activeAnnoucements.push({
                    id: annoucement.id,
                    title: localeObj.title,
                    content: localeObj.content
                });
            }
        });
    }
    return activeAnnoucements;
}
