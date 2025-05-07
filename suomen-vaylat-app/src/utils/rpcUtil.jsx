import {
    setAllLayers,
    setSelectedLayers,
    setSelectedTheme,
    setLastSelectedTheme,
    setSelectedThemeId,
    reArrangeSelectedMapLayers,
    setBackgroundMaps,
    setMapLayers,
    setAllSelectedThemeLayers
} from '../state/slices/rpcSlice';
import { Slide, toast } from "react-toastify";
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
 * @method updateLayers
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
    channel && channel.getAllLayersSV(function (data) {
        store.dispatch(setAllLayers(data));
    }, function err(data) {
        toast.error(strings.layerlist.errorLoadingLayers, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Slide
        });
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
        if(theme.groups) {
            theme.groups.forEach(subtheme => {
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
 * @param Object store
 * @param Object channel
 * @param Object allLayers
 * @param String theme
 * @param String lastSelectedTheme
 * @param Number selectedThemeId
 */
export const selectGroup = (store, channel, allLayers, theme, lastSelectedTheme, selectedThemeId) => {
    const closeAllThemeLayers = (theme) => {
        // close all theme layers
        theme?.layers?.forEach(layerId => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, false]);
        });
        // close all subtheme layers and check if subthemes have subthemes and close their layers recursively
        if(theme.groups) {
            theme.groups.forEach(subtheme => {
                closeAllThemeLayers(subtheme);
            });
        }
    };
    store.dispatch(setLastSelectedTheme(theme));

    if (selectedThemeId === null){
        // set selectedLayers opacities to 0 on every layer but theme layers
        store.dispatch(setSelectedTheme(theme));
        store.dispatch(setSelectedThemeId(theme.id));
        setTimeout(() => {
            if(!isMobile) {
                store.dispatch(setIsLegendOpen(true));
                store.dispatch(setIsZoomBarOpen(true));
            }

            let layers = [];
            theme.layers && layers.push(...theme.layers);
            theme.groups && theme.groups.forEach(g => {
                g.layers && layers.push(...g.layers)
            })
            allLayers && layers.length > 0 && layers.forEach(layerId => {
                const filteredLayer = allLayers.find(l => l.id === layerId);
                const isThemesArray = Array.isArray(filteredLayer.config.themes);
                const foundMatch = filteredLayer.config?.themes?.find(t => t.name["fi"].toLowerCase() === theme.locale["fi"].name.toLowerCase());
                if (isThemesArray && foundMatch && foundMatch.default) {
                    channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, true]);
                }
            });
            updateLayers(store, channel);

            const selectedMapLayers =  store.getState().rpc.selectedLayersByType.mapLayers;
            const selectedThemeLayers = getSelectedThemeLayers(theme, selectedMapLayers);
            store.dispatch(setAllSelectedThemeLayers(selectedThemeLayers));

            if(theme) {
                selectedMapLayers.forEach(layer => {
                    if(!selectedThemeLayers.find(themelayer => themelayer === layer.id)) {
                        channel.postRequest('ChangeMapLayerOpacityRequest', [layer.id, 0]);
                        updateLayers(store, channel);
                    }
                })
            }
        },700);

    }

    else if (selectedThemeId !== theme.id ){
         // set selectedLayers opacities to 0 on every layer but theme layers
        store.dispatch(setSelectedTheme(theme));
        closeAllThemeLayers(lastSelectedTheme);
        updateLayers(store, channel);
        setTimeout(() => {
            store.dispatch(setSelectedThemeId(theme.id));
            setTimeout(() => {
                let layers = [];
                theme.layers && layers.push(...theme.layers);
                theme.groups && theme.groups.forEach(g => {
                    g.layers && layers.push(...g.layers)
                })
                allLayers && layers.length > 0 && layers.forEach(layerId => {
                    const filteredLayer = allLayers.find(l => l.id === layerId);
                    const isThemesArray = Array.isArray(filteredLayer.config.themes);
                    const foundMatch = filteredLayer.config?.themes?.find(t => t.name["fi"].toLowerCase() === theme.locale["fi"].name.toLowerCase());
                    if (isThemesArray && foundMatch && foundMatch.default) {
                        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, true]);
                    }
                });
                updateLayers(store, channel);

                const selectedMapLayers =  store.getState().rpc.selectedLayersByType.mapLayers;
                const selectedThemeLayers = getSelectedThemeLayers(theme, selectedMapLayers);
                store.dispatch(setAllSelectedThemeLayers(selectedThemeLayers));
                if(theme) {
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
            store.dispatch(setSelectedThemeId(null));
            showNonThemeLayers(store, channel);
        },700);
    };
};

/**
* Sort object values alphabetically i.ex. themes group names
* @param string a first comparable value
* @param string b second comparable value
* @method sortObjectAlphabetically
*/
export const sortObjectAlphabetically = ( a, b ) => {
    if ( a < b ){
    return -1;
    }
    if ( a > b ){
    return 1;
    }
    return 0;
}

/**
* Rearrange object array according to other array.
* @param Object objectArray
* @param Array order
* @param String key
* @method reArrangeArray
*/
export const reArrangeArray = (objectArray, order, key) => {
    let arrayForSort = [...objectArray]
    let sortedArray = arrayForSort.sort( function (a, b) {
        var A = a[key], B = b[key];
        
        if (order.indexOf(A) > order.indexOf(B)) {
          return 1;
        } else {
          return -1;
        }
    });
    return sortedArray;
}

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
    getBackgroundMaps(
        store.getState().rpc.allGroups.find((group) => group.id === 1)
    );
    let layers = selectedLayers.filter(layer => !bgMaps.find(map => map.id === layer.id));
    store.dispatch(setBackgroundMaps(bgMaps));
    store.dispatch(setMapLayers(layers));

    return layers.concat(bgMaps)
}

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
    if(theme){
        theme.layers.forEach(layerId => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, false]);
        });
    };
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
            (announcement) => {
                const currDate = new Date();
                const annDate = new Date(announcement.endDate);
                return localStorageAnnouncements &&
                !localStorageAnnouncements.includes(
                    announcement.id
                ) &&
                currDate < annDate;
            }
        );

        const currentLang = strings.getLanguage();
        const defaultLang = strings.getAvailableLanguages()[0];

        activeAnnouncements.forEach(annoucement => {
                const localeObj = annoucement.locale[currentLang] ? annoucement.locale[currentLang] : (
                        annoucement.locale[defaultLang] ? annoucement.locale[defaultLang] : annoucement.locale[Object.keys(annoucement.locale)[0]]
                    )
                activeAnnoucements.push({
                    id: annoucement.id,
                    title: localeObj.title,
                    content: localeObj.content
                });
        });
    }
    return activeAnnoucements;
}
