import { setTrackErrors } from "../../../state/slices/rpcSlice";
import strings from "../../../translations";

    export const vectorLayerId = 'SEARCH_VECTORLAYER';
    export const markerId = 'SEARCH_MARKER';

export const validateFeatureSearch = (searchValue, setFeatureErrors) => {
        const newErrors = [];
        const regex = /[^A-Za-z0-9äöåÄÖÅ -,./()]/;
        if (searchValue.length < 3) {
            newErrors.push("length")
        }
        if (regex.test(searchValue)) {
            newErrors.push("regex")
        }
        newErrors.length > 0 && setFeatureErrors(newErrors);
        return newErrors.length === 0;
    }

    export const removeMarkersAndFeatures = (channel) => {
        if (!channel) {
            return;
        }
        channel.postRequest('MapModulePlugin.RemoveMarkersRequest', [
                'SEARCH_MARKER',
            ]);
        vectorLayerIds.forEach((vectorLayerId) => {
            channel.postRequest(
                'MapModulePlugin.RemoveFeaturesFromMapRequest',
                [null, null, vectorLayerId]
            );
        });

        // for feature search
        channel &&
            channel.postRequest("MapModulePlugin.RemoveFeaturesFromMapRequest", [
                null,
                null,
                "feature-search-results",
            ]);
    };


    export const validateTrackSearch = (searchValue, store) => {
        let searchArray = searchValue.split("/");
        const newErrors = Array(3).fill(false);
        // If there are not exactly 3 values, populate the errors array accordingly
        if (searchArray.length !== 3) {
            for (let i = 0; i < 3; i++) {
                if (!searchArray[i]) {
                    newErrors[i] = true;
                }
            }
        } else {
            // Check for any empty values
            searchArray.forEach((value, index) => {
                if (value === '') {
                    newErrors[index] = true;
                }
            });
        }
        store.dispatch(setTrackErrors(newErrors));
        return newErrors.every((error) => error === false)
    }


    export const variants = {
        initial: {
            maxWidth: 0,
            opacity: 0,
            filter: 'blur(10px)',
        },
        animate: {
            maxWidth: '450px',
            opacity: 1,
            filter: 'blur(0px)',
        },
        exit: {
            maxWidth: 0,
            opacity: 0,
            filter: 'blur(10px)',
        },
        transition: {
            duration: 0.3,
            type: 'tween',
        },
    };

    export const dropdownVariants = {
        initial: {
            height: 0,
            opacity: 0,
        },
        animate: {
            height: 'auto',
            opacity: 1,
        },
        exit: {
            height: 0,
            opacity: 0,
        },
        transition: {
            duration: 0.5,
            type: 'tween',
        },
    };

    export const texts = [
        {
            text: strings.search.tips.address,
            examples: strings.search.tips.addressExamples
        },
        {
            text: strings.search.tips.realEstateUnitIdentifier,
            examples: strings.search.tips.realEstateUnitIdentifierExamples
        },
        {
            text: strings.search.tips.vkmRoad,
            examples: strings.search.tips.vkmRoadExamples
        },
        {
            text: strings.search.tips.vkmTrack,
            examples: strings.search.tips.vkmTrackExamples
        }
    ];

    export const searchDownloadTips = {
        tip: strings.search.tips.toastTip,
        guide: strings.search.tips.toastTipContent
    }

    export const vectorLayerIds = [
        vectorLayerId + '_vkm_tie',
        vectorLayerId + '_vkm_vali',
        vectorLayerId + '_vkm_osa',
        vectorLayerId + '_vkm_etaisyys',
        vectorLayerId + '_vkm_track',
        vectorLayerId + '_vkm',
    ];
    
        export const mergeMatchedKeys = (oldMatchedKeys, newMatchedKeys) => {
            // Create a new object that will hold the merged keys
            const mergedMatchedKeys = { ...oldMatchedKeys };
        
            // Iterate through each key in the new matchedFeatures object
            Object.keys(newMatchedKeys).forEach(key => {
                if (mergedMatchedKeys.hasOwnProperty(key)) {
                    // If the key exists in the old object, concatenate the arrays
                    mergedMatchedKeys[key] = mergedMatchedKeys[key].concat(newMatchedKeys[key]);
                } else {
                    // If the key doesn't exist, add it to the merged object
                    mergedMatchedKeys[key] = newMatchedKeys[key];
                }
            });
        
            // Return the merged object
            return mergedMatchedKeys;
        };
    