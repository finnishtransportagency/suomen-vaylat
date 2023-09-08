import { useState, useContext, useEffect } from 'react';
import strings from '../translations';
import { ReactReduxContext } from 'react-redux';
import {
    setGFILocations,
    resetGFILocations,
    setGFICroppingArea,
    setVKMData
} from '../state/slices/rpcSlice';

import { setMinimizeGfi, setSelectedGfiTool, setGeoJsonArray, setHasToastBeenShown, setActiveSelectionTool, setWarning } from '../state/slices/uiSlice';




const BODY_SIZE_EXCEED = "BODY_SIZE_EXCEED";
const GENERAL_FAIL = "GENERAL_FAIL";

export const fetchContentFromChannel = (fetchableLayers, featureArray, filters, store, channel) => {

        
    console.info("featurearray", featureArray)
    //featureArray?.forEach(async feature => {
        store.dispatch(setGFICroppingArea(featureArray));
        
        let index = 0;
        try {
            for(const layer of fetchableLayers) {  
                console.log(filters)
                console.log(layer)

                const activeFilters = filters && filters?.length > 0 ?  filters?.filter(filter => (filter.layer ===  layer.name)) : [];
                console.log(activeFilters)
                //console.info("feature" ,feature)
                fetchFeaturesSynchronous(featureArray, layer, featureArray, activeFilters, store, channel)
                .then(
                    index++
                ).catch((error) => {
                        if (error===BODY_SIZE_EXCEED){
                            store.dispatch(setWarning({
                                title: strings.bodySizeWarningTemporary,
                                subtitle: null,
                                cancel: {
                                    text: strings.general.cancel,
                                    action: () => {
                                        store.dispatch(setWarning(null))
                                    }
                                },
                                /*TODO return when simplify geometry feature ready 
                                    confirm: {
                                    text: strings.general.continue,
                                    action: () => {
                                        simplifyGeometry();
                                        store.dispatch(setWarning(null));
                                    }
                                },*/
                            }))
                        
                            //throw error to break synchronous loop
                            throw new Error(BODY_SIZE_EXCEED);
                        }else if (error === GENERAL_FAIL){
                            console.info("general fail thrown") 
                        }
                    }
                );

            } 
        } catch (error) {
            //catch exception, when simplify geometry feature ready, catch BODY_SIZE_EXCEED
            //and make simplify and rerun query
        }
        
    //}); 
}

export const fetchFeaturesSynchronous = (features, layer, data, activeFilters, store, channel) => {
    return new Promise(function(resolve, reject) {
    // executor (the producing code, "singer")
    channel.getFeaturesByGeoJSON(
        [features, 0, [layer.id], activeFilters],
        (gfiData) => {
            console.info("datski", gfiData)
            store.dispatch(setVKMData(null));
            channel.postRequest('MapModulePlugin.RemoveMarkersRequest', ["VKM_MARKER"]);
                gfiData?.gfi?.forEach((gfi) => {
                    if (gfi.content.length > 0) {
                        store.dispatch(setGFILocations({
                            content: gfi.content,
                            layerId: gfi.layerId,
                            gfiCroppingArea:
                            data.geojson,
                            type: 'geojson',
                            moreFeatures: gfi.content.some(content => content.moreFeatures),
                        })) 
                    }
                });
                resolve("ok");                  
            },
            function (error) {
                console.info("erska", error)
                if (error.BODY_SIZE_EXCEEDED_ERROR) {
                    // simplify modal removed for now, uncomment when simplifyGeometry feature ready, make new call after
                    /*store.dispatch(setWarning({
                        title: strings.bodySizeWarning,
                        subtitle: null,
                        cancel: {
                            text: strings.general.cancel,
                            action: () => {
                                setIsGfiLoading(false);
                                store.dispatch(setWarning(null))
                            }
                        },
                        confirm: {
                            text: strings.general.continue,
                            action: () => {
                                simplifyGeometry();
                                store.dispatch(setWarning(null));
                            }
                        },
                    }))
                    */
                    reject(BODY_SIZE_EXCEED)
                }      
                reject(GENERAL_FAIL)
            }
        )
    });
}

const getPropertyOperator = (operator) => {
    switch (operator) {
        case "equals":
            return "===";
        case "notEquals":
            return "!==";
        case "smallerThan":
            return "<";
        case "biggerThan":
            return ">";
        case "includes":
            return "includes";
        case "doesntInclude":
            return "doesntInclude";
        default:
            return "===";
    }
}

const getParameterCaseInsensitive = (object, key) => {
    const asLowercase = key.toLowerCase();
    return object[Object.keys(object).filter(function(k) {
      return k.toLowerCase() === asLowercase;
    })[0]];
  }

export const filterFeature = (feature, location, filters) => {
    if (filters.length === 0) {
        return true;
    }

    var comparisonOperatorsHash = {
        '<': function(a, b) { return a < b; },
        '>': function(a, b) { return a > b; },
        '>=': function(a, b) { return a >= b; },
        '<=': function(a, b) { return a <= b; },
        '==': function(a, b) { return a === b; },
        '!==': function(a, b) { return isNaN(a) && isNaN(b) ? a.toLowerCase() !== b.toLowerCase() : a !== b; },
        '===': function(a, b) { return isNaN(a) && isNaN(b) ? a.toLowerCase() === b.toLowerCase() : a === b; },
        'includes': function(a, b) { return isNaN(a) && isNaN(b) && a.toLowerCase().includes(b.toLowerCase()); },
        'doesntInclude': function(a, b) { return isNaN(a) && isNaN(b) && !a.toLowerCase().includes(b); },
    };

    const properties = feature.properties;

    const filterMatch = filters.every(filter => {
        if (location.layerId === filter.layer) {
            const operator = getPropertyOperator(filter.operator);
            var comparisonOperator = comparisonOperatorsHash[operator];
            const value = getParameterCaseInsensitive(properties, filter.property);
            if (value === undefined)
            return false
            const doFilter = comparisonOperator(value, filter.value);
            return doFilter;
        } else {
            return true;
        }
    })

    return filterMatch;
}