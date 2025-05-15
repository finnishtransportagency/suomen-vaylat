import { useState, useContext, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import SearchResultPanel from './SearchResultPanel';
import {
    faSearch,
    faTimes,
    faTrash,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddressSearch from './AddressSearch';
import MetadataSearch from './MetadataSearch';
import FeatureSearch from './FeatureSearch';
import SvLoder from '../../utils/components/SvLoader';
import strings from '../../translations';
import { SEARCH_TIP_LOCALSTORAGE } from '../../utils/constants';

import { isMobile, theme } from '../../theme/theme';

import { addMarkerRequest, mapMoveRequest, pushToFeatureSearchResults, resetFeatureSearchResults, setSearchOn, searchVKMTrack, setFeatureSearchResults } from '../../state/slices/rpcSlice';

import { setIsSearchOpen, setGeoJsonArray, setHasToastBeenShown, setActiveSwitch, setIsMoreSearchOpen } from '../../state/slices/uiSlice';

import CircleButton from '../circle-button/CircleButton';

import { VKMGeoJsonHoverStyles, VKMGeoJsonStyles } from './VKMSearchStyles';
import { Slide, toast } from "react-toastify";
import SearchToast from '../toasts/SearchToast';
import ReactTooltip from 'react-tooltip';
import TipToast from '../toasts/TipToast';
import SearchModal from './SearchModal';

export const StyledSearchIcon = styled.div`
    min-width: 48px;
    padding-right: 16px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    color: ${(props) => props.active ? props.theme.colors.secondaryColorPink : 'rgba(0, 0, 0, 0.5)'};
    svg {
        font-size: 18px;
    };
    `;

const StyledSearchContainer = styled.div`
    z-index: 6;
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    height: 48px;
    @media only screen and (max-width: 480px) {
        height: 40px;
        width: 77%;
    };

    @media ${props => props.theme.device.mobileL} {
        width: 77%;
        height: 36px;
    };

    @media ${props => props.theme.device.mobileS} {
        width: 77%;
        height: 34px;
    };

    @media ${props => props.theme.device.lowResDesktop} {
        height: 40px;
    };
`;

const StyledSearchWrapper = styled(motion.div)`
    position: absolute;
    z-index: -1;
    transition: all 0.3s ease-out;
    display: block;
    align-items: center;
    width: 100%;
    overflow: hidden;
    padding-right: 48px;
    height: 100%;
    background-color: ${(props) => props.theme.colors.mainWhite};
    border-radius: 24px;
    box-shadow: ${(props) =>
        props.searchType === 'vkmtrack' && props.showSearchResults
            ? 'none'
            : 'rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px'};
    pointer-events: auto;
    @media ${(props) => props.theme.device.mobileL} {
        border-radius: 20px;
        padding-right: 40px;
    } ;
    overflow: initial;
    //border: solid 1px black;
`;

const StyledLeftContentWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
`;

const StyledSearchActionButton = styled(FontAwesomeIcon)`
    margin-right: 8px;
    color: rgba(0, 0, 0, 0.5);
    font-size: 16px;
    cursor: pointer;
    top: 0;
`;

const StyledSelectedSearchMethod = styled.div`
    width: 100%;
    p {
        padding: 6px 8px;
        font-size: 14px;
        margin: 0;
        color: #6c757d;
    }
`;

export const StyledDropDown = styled(motion.div)`
    z-index: -2;
    //position: absolute;
    top: 0px;
    right: 0px;
    max-width: 400px;
    width: 100%;
    height: auto;
    border-radius: 24px;
    //box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    background-color: ${(props) => props.theme.colors.mainWhite};
    padding: 1em 16px 0px 16px;
    pointer-events: auto;
    overflow: auto;
    @media ${(props) => props.theme.device.mobileL} {
        max-width: 100%;
    } ;
   
`;

export const StyledDropdownContentItem = styled.div`
    display: ${(props) => props.type === 'searchResult' && 'flex'};
    align-items: center;
    user-select: none;
    cursor: pointer;
    padding-left: 8px;
    padding-bottom: 16px;
    border-radius: 5px;

    background-color: ${(props) =>
        props.itemSelected ? props.theme.colors.mainColor3 : ''};
    p {
        margin: 0;
        padding: 0;
    }
`;

export const StyledDropdownContentItemTitle = styled.p`
    display: ${(props) => props.type === 'searchResult' && 'flex'};
    text-align: ${(props) => props.type === 'noResults' && 'center'};
    font-size: 14px;
    color: ${(props) => props.active ? props.theme.colors.secondaryColorPink : '#504d4d'};
`;

const StyledDropdownContentItemSubtitle = styled.p`
    font-size: 12px;
    color: #807a7a;
`;

export const StyledHideSearchResultsButton = styled.div`
    position: sticky;
    bottom: 0px;
    background-color: white;
    text-align: center;
    padding-bottom: 4px;
    margin-top: 1em;
    cursor: pointer;
    svg {
        font-size: 23px;
        color: ${(props) => props.theme.colors.mainColor1};
    }
`;

const StyledLoaderWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 999;
    height: 100%;
    max-width: 200px;
    max-height: 200px;
    transform: translate(-50%, -50%);
    svg {
        width: 100%;
        height: 100%;
        fill: none;
    }
`;

const StyledToastIcon = styled(FontAwesomeIcon)`
    color: ${theme.colors.mainColor1};
`;


const Search = () => {
    const [searchValue, setSearchValue] = useState('');
    const [lastSearchValue, setLastSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [showSearchResults, setShowSearchResults] = useState(true);
    const [isSearchMethodSelectorOpen, setIsSearchMethodSelectorOpen] =
        useState(false);
    const [searchType, setSearchType] = useState('address');

    const { isSearchOpen, geoJsonArray, hasToastBeenShown, activeSwitch, isMoreSearchOpen } = useAppSelector((state) => state.ui);
    const { channel, allLayers, selectedLayersByType, featureSearchResults } = useAppSelector((state) => state.rpc);

    const { store } = useContext(ReactReduxContext);

    const markerId = 'SEARCH_MARKER';
    const vectorLayerId = 'SEARCH_VECTORLAYER';
    const [searchClickedRow, setSearchClickedRow] = useState(null);
    const [firstSearchResultShown, setFirstSearchResultShown] = useState(false);
    const [showToast, setShowToast] = useState(JSON.parse(localStorage.getItem(SEARCH_TIP_LOCALSTORAGE)));
    const [carriageWaySearch, setCarriageWaySearch] = useState(false);
    const [trackErrors, setTrackErrors] = useState([false, false, false]);
    const [featureErrors, setFeatureErrors] = useState([]);

    const handleSeach = (searchValue) => {
        setShowSearchResults(true);
        switch (searchType) {
            case 'address':
                if (activeSwitch === 'track') {
                    if (validateTrackSearch(searchValue, setTrackErrors))
                        handleAddressSearch(searchValue);
                } else {
                    handleAddressSearch(searchValue);
                }
 
                break;
            case 'metadata':
                handleMetadataSearch(searchValue);
                break;
            case 'feature':
                handleFeatureSearch(searchValue);
                break;
            default:
                break;
        }
    }

    const checkIfNonEmptyTrackResult = (data) => {
        return data?.geom?.features[0].geometry?.coordinates?.length > 0
    }
    const handleAddressSearch = (value) => {
        let searchValueCopy = value
        //special case, roadsearch with 3 params is road/part/distance, 
        //unless search ajorata and etaisyys flag ( carriageWaySearch ) found
        
        //TODO if and when we implement track range search, this should be enabled also to track, for now only road search 
        if ((activeSwitch === 'road' || activeSwitch === null) && !carriageWaySearch && value && value.includes("/") && (value.split("/").length === 3 || value.split("/").length === 5)) {
            let splittedValue = value.split("/");
            searchValueCopy = splittedValue[0] + "/" + splittedValue[1] + "//" + splittedValue[2];
            if (splittedValue.length === 5) {
                searchValueCopy += "/" + splittedValue[3] + "//" + splittedValue[4]
            }
        }

        searchValueCopy = searchValueCopy.trim(); 
        store.dispatch(setGeoJsonArray([]));
        setFirstSearchResultShown(false);
        removeMarkersAndFeatures();
        setIsSearching(true);
        if (activeSwitch === 'track') {
            store.dispatch(
                searchVKMTrack({
                    value: value,
                    handler: (data) => {
                        if (data.ratanumero && data.geom) {
                            //mimic search structure of old vkm search
                            const name = `ratanumero=${data?.ratanumero}, ratakilometri=${data?.ratakilometri}, ratametri=${data?.ratametri}`;
                            
                            let locations
                            if (checkIfNonEmptyTrackResult(data)){  
                                locations = [{ type: "VKM", vkmType: "track", geom: data.geom, "name": name }]
                            }else {
                                locations = []
                            }

                            const mimicdata = { result: { locations: locations } };
                            setSearchResults(mimicdata);
                            if ((data?.result?.locations?.length > 1 || checkIfNonEmptyTrackResult(data)) && !isMoreSearchOpen) {
                                store.dispatch(setIsMoreSearchOpen(true));
                            }
                            setIsSearching(false);
                        }
                    },

                })
            );
        } else {
            channel.postRequest('SearchRequest', [searchValueCopy]);
        }
        setSearchValue(value);
        setLastSearchValue(value);
        setSearchResults(null);
    };

    const handleMetadataSearch = (value) => {
        removeMarkersAndFeatures();
        setIsSearching(true);
        channel.postRequest('MetadataSearchRequest', [
            {
                search: value,
                srs: 'EPSG:3067',
                OrganisationName: 'Väylävirasto',
            },
        ]);
        setLastSearchValue(value);
    };

    const mergeMatchedKeys = (oldMatchedKeys, newMatchedKeys) => {
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

    const handleFeatureSearch = (searchValue, startIndex = 0, layerId = -1) => {
        if (validateFeatureSearch(searchValue, setFeatureErrors)) {
            const handleSearchResponse = (data) => {
                if (Object.keys(data).length > 0 && Object.keys(data.gfi).length > 0) {
                    setIsSearching(false);
                    store.dispatch(setSearchOn(false));

                    if (startIndex !== 0) {
                        // Update features for "more results"
                        let oldFeatureSearchResults = JSON.parse(JSON.stringify(featureSearchResults));
                            let newFeatureSearchResults = { ...data.gfi }
                            const contentIndex = oldFeatureSearchResults.map(gfi => gfi.content.layerId).indexOf(data.gfi.content.layerId);
                            const updatedFeatures = oldFeatureSearchResults[contentIndex].content.geojson.features.concat(data.gfi.content.geojson.features);
                            newFeatureSearchResults.content.geojson.features = updatedFeatures;

                            const updatedMatchedKeys = mergeMatchedKeys(oldFeatureSearchResults[contentIndex].content.geojson.matchedFeatures, data.gfi.content.geojson.matchedFeatures);
                            newFeatureSearchResults.content.geojson.matchedFeatures = updatedMatchedKeys;

                            oldFeatureSearchResults[contentIndex] = newFeatureSearchResults;

                            store.dispatch(setFeatureSearchResults(oldFeatureSearchResults));
                    } else {
                        store.dispatch(pushToFeatureSearchResults(data.gfi));
                    }
                } else {
                    setIsSearching(false);
                    store.dispatch(setSearchOn(false));
                }
                setLastSearchValue(searchValue);
            };
        
            const handleSearchError = (layerIdentifier, error) => {
                setIsSearching(false);
                store.dispatch(setSearchOn(false));
                setLastSearchValue(searchValue);
        
                toast.error(`${strings.search.feature.errorLayerStart}${layerIdentifier}${strings.search.feature.errorLayerEnd}`, {
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
            };
        
            setIsSearching(true);
            store.dispatch(setSearchOn(true));
            startIndex === 0 && store.dispatch(resetFeatureSearchResults());

            const searchLayer = layerId !== -1 ? layerId : selectedLayersByType.mapLayers[0]?.id;
            const layerIdentifier = layerId !== -1 ? layerId : selectedLayersByType.mapLayers[0]?.name;

            if (searchLayer) {
                channel.searchFeatures([[searchLayer], searchValue, startIndex], 
                    (data) => handleSearchResponse(data, searchLayer), 
                    (error) => handleSearchError(layerIdentifier, error)
                );
            }
        }
    };

    const markerIds = [markerId];

    const vectorLayerIds = [
        vectorLayerId + '_vkm_tie',
        vectorLayerId + '_vkm_vali',
        vectorLayerId + '_vkm_osa',
        vectorLayerId + '_vkm_etaisyys',
        vectorLayerId + '_vkm_track',
        vectorLayerId + '_vkm',
    ];

    const removeMarkersAndFeatures = () => {
        if (!channel) {
            return;
        }
        markerIds.forEach((markerId) => {
            channel.postRequest('MapModulePlugin.RemoveMarkersRequest', [
                markerId,
            ]);
        });
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

    const searchTypes = {
        address: {
            label: strings.search.address.title,
            subtitle: strings.search.address.subtitle,
            content: (
                <AddressSearch
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    setIsSearching={setIsSearching}
                    handleSeach={handleSeach}
                />
            ),
            visible: true,
        },
        metadata: {
            label: strings.search.layer.title,
            subtitle: strings.search.metadata.subtitle,
            content: (
                <MetadataSearch
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    setIsSearching={setIsSearching}
                    handleMetadataSearch={handleMetadataSearch}
                />
            ),
            visible: true,
        },
        feature: {
            label: strings.search.address.title,
            subtitle: strings.search.address.subtitle,
            content: (
                <FeatureSearch
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    setIsSearching={setIsSearching}
                    handleFeatureSearch={handleFeatureSearch}
                />
            ),
            visible: false,
        },
    };

    useEffect(() => {
        channel &&
            channel.handleEvent('SearchResultEvent', function (data) {
                setIsSearching(false);
                if (data.success) {
                    if (data.result) {
                        setSearchResults(data);
                    }
                    if ((data?.result?.locations?.length > 1 || data?.result?.geom?.length > 1) && !isMoreSearchOpen) {
                        store.dispatch(setIsMoreSearchOpen(true));
                    }
                }
            });

        channel &&
            channel.handleEvent('MetadataSearchResultEvent', function (data) {
                setIsSearching(false);
                if (data.success) {
                    if (data.results) {
                        setSearchResults(data.results);
                    }
                }
            });
    }, [channel, activeSwitch]);

    const handleSearchSelect = (name, lon, lat, geom, osa, ajorata, etaisyys, osaLoppu, etaisyysLoppu, type) => {
        removeMarkersAndFeatures();
        if (!geom) {
            store.dispatch(
                addMarkerRequest({
                    x: lon,
                    y: lat,
                    msg: name || '',
                    markerId: markerId,
                    color: 'e50083'
                })
            );

            store.dispatch(
                mapMoveRequest({
                    x: lon,
                    y: lat,
                })
            );
        } else if (type === 'road') {
            let style = 'tie';
            if (osaLoppu && etaisyysLoppu) {
                style = 'vali';
            } else if ((osa || ajorata) && !etaisyys) {
                style = 'osa';
            } else if (etaisyys) {
                style = 'etaisyys';
            }
            let featureStyle = VKMGeoJsonStyles.road[style];
            let hover = VKMGeoJsonHoverStyles.road[style];

            if (style === 'tie') {
                removeMarkersAndFeatures();
            }

            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
                geom,
                {
                    clearPrevious: true,
                    centerTo: true,
                    hover: hover,
                    featureStyle: featureStyle,
                    layerId: vectorLayerId + '_vkm_' + style,
                    maxZoomLevel: 10,
                },
            ]);

            store.dispatch(setGeoJsonArray([{
                data: {
                    geom: geom
                }, style: style, hover: hover, featureStyle: featureStyle
            }]));
        } else if (type === 'track') {
            let featureStyle = VKMGeoJsonStyles['track'];
            let hover = VKMGeoJsonHoverStyles['track'];

            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
                geom,
                {
                    centerTo: true,
                    hover: hover,
                    featureStyle: featureStyle,
                    layerId: vectorLayerId + '_vkm_track',
                    maxZoomLevel: 10
                }
            ]);
            store.dispatch(setGeoJsonArray([{
                data: {
                    geom: geom
                }, style: 'track', hover: hover, featureStyle: featureStyle
            }]));
        };
    };

    const variants = {
        initial: {
            maxWidth: 0,
            opacity: 0,
            filter: 'blur(10px)',
        },
        animate: {
            maxWidth: '400px',
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

    const dropdownVariants = {
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

    const texts = [
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

    const searchDownloadTips = {
        tip: strings.search.tips.toastTip,
        guide: strings.search.tips.toastTipContent
    }

    useEffect(() => {
        ReactTooltip.rebuild();
    }, [isSearchOpen]);

    const handleCloseToast = () => {
        setShowToast(false);
        toast.dismiss('searchTipToast');
        store.dispatch(setHasToastBeenShown({ toastId: 'searchTipToast', shown: true }));
    };

    if (searchType === 'address' && isSearchOpen && !hasToastBeenShown.includes('searchToast')
        && 1 === 2 /*disable search help toast for now */) {
        toast(<SearchToast header={strings.search.tips.title} texts={texts} />,
            {
                toastId: 'searchToast',
                onClose: () => store.dispatch(setHasToastBeenShown({ toastId: 'searchToast', shown: true })),
                position: 'top-right',
                draggable: false
            })
    } else if (!isSearchOpen || searchType !== 'address') {
        toast.dismiss('searchToast');
    }
        
    useEffect(() => {
        const vkmKeys = ['vali', 'tie', 'osa', 'etaisyys', 'track'];

        if (geoJsonArray.length > 0 && isSearchOpen && !hasToastBeenShown.includes('searchTipToast') && showToast !== false) {
            geoJsonArray.forEach(geoj => {
                if (vkmKeys.some(vkmStyle => vkmStyle === geoj.style)) {
                    toast.info(<TipToast handleButtonClick={() => handleCloseToast()} localStorageName={SEARCH_TIP_LOCALSTORAGE} text={<div> <h6>{searchDownloadTips.tip}</h6> <p>{searchDownloadTips.guide}</p></div>} />, 
                        {
                            icon: <StyledToastIcon icon={faInfoCircle} />,
                            toastId: 'searchTipToast',
                            onClose: () => handleCloseToast(),
                            position: 'bottom-left',
                            draggable: false
                        })
                    store.dispatch(setHasToastBeenShown({ toastId: 'searchTipToast', shown: true }));
                    return;
                }
            })
        }
        else toast.dismiss('searchTipToast');
    }, [geoJsonArray]);

    const validateTrackSearch = useCallback((searchValue, setTrackErrors) => {
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
        setTrackErrors(newErrors);
        return newErrors.every((error) => error === false)
    }, [])
    
    const validateFeatureSearch = useCallback((searchValue, setFeatureErrors) => {
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
    }, [])

    useEffect(() => {
        //when carriagewaysearch ( ajordalla haku ) changes, reset searchValue
        setSearchValue('');
    }, [carriageWaySearch, setSearchValue]);

    const emptySearchResults = () => {
        store.dispatch(setGeoJsonArray([]));
        store.dispatch(setFeatureSearchResults([]));
        setSearchResults(null);
        setSearchValue('');
        setLastSearchValue('');
        removeMarkersAndFeatures();
    }
    return (
        <StyledSearchContainer isSearchOpen={isSearchOpen}>
            <ReactTooltip backgroundColor={theme.colors.mainColor1} disable={isMobile} place='bottom' type='dark' effect='float' />
       
            <CircleButton
                icon={isSearchOpen ? faTimes : faSearch}
                text={strings.tooltips.search}
                toggleState={isSearchOpen}
                tooltipDirection={'left'}
                clickAction={() => {
                    if (isSearchOpen) {
                        store.dispatch(setIsMoreSearchOpen(false));
                    }
                    store.dispatch(setActiveSwitch(null));
                    store.dispatch(resetFeatureSearchResults());
                    isSearchOpen && store.dispatch(setGeoJsonArray([]));
                    setIsSearching(false);
                    store.dispatch(setSearchOn(null));
                    isSearchOpen && removeMarkersAndFeatures();
                    isSearchOpen && setSearchResults(null);
                    isSearchOpen && setSearchValue('');
                    store.dispatch(setIsSearchOpen(!isSearchOpen));
                    isSearchMethodSelectorOpen &&
                        setIsSearchMethodSelectorOpen(false);
                    setSearchType('address');
                }}
            />
          
            <AnimatePresence>
                {isSearchOpen && (
                    <StyledSearchWrapper
                        hasGeometry={geoJsonArray.length > 0}
                        variants={variants}
                        initial={'initial'}
                        animate={'animate'}
                        exit={'exit'}
                        transition={'transition'}
                        searchType={searchType}
                        showSearchResults={showSearchResults}
                    >
                        <StyledLeftContentWrapper id="left_search_content_wrapper">
                            {!isSearching ? (
                                <StyledSelectedSearchMethod
                                    onClick={() => {
                                        setShowSearchResults(true);
                                        isSearchMethodSelectorOpen &&
                                            setIsSearchMethodSelectorOpen(
                                                false
                                            );
                                    }}
                                >
                                    {
                                        searchTypes[searchType].content
                                    }
                                </StyledSelectedSearchMethod>
                            ) : (
                                <StyledLoaderWrapper>
                                    <SvLoder />
                                </StyledLoaderWrapper>
                            )}
                            {(searchResults !== null || featureSearchResults.length > 0) &&
                                searchValue === lastSearchValue && !isSearching ? (
                                <StyledSearchActionButton
                                    onClick={emptySearchResults}
                                    icon={faTrash}
                                />
                            ) : !isSearching && (
                                <StyledSearchActionButton
                                    onClick={() => {
                                        handleSeach(searchValue)
                                    }}
                                    icon={faSearch}
                                    size="lg"
                                />
                            )}
                        </StyledLeftContentWrapper>
                        <SearchResultPanel
                            isSearchOpen={isSearchOpen}
                            searchResults={searchResults}
                            showSearchResults={showSearchResults}
                            searchType={searchType}
                            dropdownVariants={dropdownVariants}
                            firstSearchResultShown={firstSearchResultShown}
                            handleSearchSelect={handleSearchSelect}
                            setFirstSearchResultShown={setFirstSearchResultShown}
                            isMobile={isMobile}
                            setShowSearchResults={setShowSearchResults}
                            setSearchClickedRow={setSearchClickedRow}
                            handleFeatureSearch={handleFeatureSearch}
                            lastSearchValue={lastSearchValue}
                            searchClickedRow={searchClickedRow}
                            allLayers={allLayers}
                            hidden={true}
                        />
                        {isMoreSearchOpen && (
                            <SearchModal
                                searchValue={searchValue}
                                setSearchValue={setSearchValue}
                                searchResults={searchResults}
                                setSearchResults={setSearchResults}
                                dropdownVariants={dropdownVariants}
                                firstSearchResultShown={firstSearchResultShown}
                                handleSearchSelect={handleSearchSelect}
                                setFirstSearchResultShown={setFirstSearchResultShown}
                                isMobile={isMobile}
                                setShowSearchResults={setShowSearchResults}
                                setSearchClickedRow={setSearchClickedRow}
                                searchClickedRow={searchClickedRow}
                                allLayers={allLayers}
                                isSearchOpen={isSearchOpen}
                                showSearchResults={showSearchResults}
                                searchType={searchType}
                                setSearchType={setSearchType}
                                handleSeach={handleSeach}
                                isOpen={isMoreSearchOpen}
                                carriageWaySearch={carriageWaySearch}
                                setCarriageWaySearch={setCarriageWaySearch}
                                removeMarkersAndFeatures={removeMarkersAndFeatures}
                                activeSwitch={activeSwitch}
                                trackErrors={trackErrors}
                                setTrackErrors={setTrackErrors}
                                validateTrackSearch={validateTrackSearch}
                                featureErrors={featureErrors}
                                setFeatureErrors={setFeatureErrors}
                                validateFeatureSearch={validateFeatureSearch}
                                handleFeatureSearch={handleFeatureSearch}
                                lastSearchValue={lastSearchValue}
                            />
                        )}
                
                    </StyledSearchWrapper>
             
        
                ) 
                }
            </AnimatePresence>
            <AnimatePresence>
                {isSearchMethodSelectorOpen && (
                    <StyledDropDown
                        key={'dropdown-content-searchmethods'}
                        variants={dropdownVariants}
                        initial={'initial'}
                        animate={'animate'}
                        exit={'exit'}
                        transition={'transition'}
                    >
                        {Object.keys(searchTypes).map((searchType) => {
                            const type = searchTypes[searchType];
                            if (type.visible) {
                                return (
                                    <StyledDropdownContentItem
                                        onClick={() => {
                                            setSearchResults(null);
                                            setSearchType(searchType);
                                            setIsSearchMethodSelectorOpen(
                                                false
                                            );
                                            //setSearchModalOpen(false);
                                            setSearchValue('');
                                            isSearchOpen &&
                                                removeMarkersAndFeatures();
                                        }}
                                        key={'search-type-' + searchType}
                                    >
                                        <StyledDropdownContentItemTitle>
                                            {type.label}
                                        </StyledDropdownContentItemTitle>
                                        <StyledDropdownContentItemSubtitle>
                                            {type.subtitle}
                                        </StyledDropdownContentItemSubtitle>
                                    </StyledDropdownContentItem>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </StyledDropDown>
                )}
            </AnimatePresence>
        </StyledSearchContainer>
    );
};

export default Search;
