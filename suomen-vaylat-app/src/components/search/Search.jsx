import { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import {
    faSearch,
    faTimes,
    faTrash,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddressSearch from './AddressSearch';
import MetadataSearch from './MetadataSearch';
import SvLoder from '../loader/SvLoader';
import strings from '../../translations';
import { SEARCH_TIP_LOCALSTORAGE } from '../../utils/constants';

import { isMobile, theme } from '../../theme/theme';

import { addMarkerRequest, mapMoveRequest } from '../../state/slices/rpcSlice';

import { setIsSearchOpen, setGeoJsonArray, setHasToastBeenShown } from '../../state/slices/uiSlice';

import CircleButton from '../circle-button/CircleButton';

import { VKMGeoJsonHoverStyles, VKMGeoJsonStyles } from './VKMSearchStyles';
import { toast } from 'react-toastify';
import SearchToast from '../toasts/SearchToast';
import TipToast from '../toasts/TipToast';
import SearchModal from './SearchModal';


export const StyledSearchIcon  = styled.div`
    min-width: 48px;
    padding-right: 16px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    color: ${(props) => props.active ? props.theme.colors.secondaryColor8 : 'rgba(0, 0, 0, 0.5)'};
    svg {
        font-size: 18px;
    };
    `;

const StyledSearchContainer = styled.div`
    z-index: 2;
    position: absolute;
    right: 0px;
    padding-right: 8px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    height: 48px;
    @media only screen and (max-width: 480px) {
        height: 40px;
        width: 77%;
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
    display: flex;
`;

const StyledSearchActionButton = styled(FontAwesomeIcon)`
    margin-right: 8px;
    color: rgba(0, 0, 0, 0.5);
    font-size: 16px;
    cursor: pointer;
    top: 0;
    margin-top: 15px;
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
    padding: 64px 16px 0px 16px;
    pointer-events: auto;
    overflow: auto;
    @media ${(props) => props.theme.device.mobileL} {
        max-width: 100%;
    } ;
   
`;

export const StyledDropdownContentItem = styled.div`
    display: ${(props) => props.type === 'searchResult' && 'flex'};
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
    color: ${(props) => props.active ? props.theme.colors.secondaryColor8 : '#504d4d'};
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
  
    const { isSearchOpen, geoJsonArray, hasToastBeenShown } = useAppSelector((state) => state.ui);
    const { channel, allLayers } = useAppSelector((state) => state.rpc);

    const { store } = useContext(ReactReduxContext);

    const markerId = 'SEARCH_MARKER';
    const vectorLayerId = 'SEARCH_VECTORLAYER';
    const [searchClickedRow, setSearchClickedRow] = useState(null);
    const [firstSearchResultShown, setFirstSearchResultShown] = useState(false);
    const [showToast, setShowToast] = useState(JSON.parse(localStorage.getItem(SEARCH_TIP_LOCALSTORAGE)));

    const handleSeach = (searchValue) => {
        setShowSearchResults(true);
        switch (searchType) {
            case 'address':
                handleAddressSearch(searchValue);
                break;
            case 'metadata':
                handleMetadataSearch(searchValue);
                break;
            default:
                break;
        }
    }

    const handleAddressSearch = (value) => {
        store.dispatch(setGeoJsonArray([]));
        setFirstSearchResultShown(false);
        setSearchClickedRow(null);
        removeMarkersAndFeatures();
        setIsSearching(true);
        channel.postRequest('SearchRequest', [value]);
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
                    handleAddressSearch={handleAddressSearch}
                />
            ),
            visible: true,
        },
        metadata: {
            label: strings.search.metadata.title,
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
    };

    useEffect(() => {
        channel &&
            channel.handleEvent('SearchResultEvent', function (data) {
                setIsSearching(false);
                if (data.success) {
                    if (data.result) {
                        setSearchResults(data);
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
    }, [channel]);

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

            store.dispatch(setGeoJsonArray([{data: {
                geom: geom
            }, style: style, hover: hover, featureStyle: featureStyle }]));
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
            store.dispatch(setGeoJsonArray([{data: {
                geom: geom
            }, style: 'track', hover: hover, featureStyle: featureStyle }]));
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
            maxHeight: 'calc(var(--app-height) - 100px)',
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

    const handleCloseToast = () => {
        setShowToast(false);
        toast.dismiss('searchTipToast');
        store.dispatch(setHasToastBeenShown({toastId: 'searchTipToast', shown: true}));
    };

    if(searchType === 'address' && isSearchOpen && !hasToastBeenShown.includes('searchToast') 
        && 1===2 /*disable search help toast for now */) {
        toast(<SearchToast header={strings.search.tips.title} texts={texts}/>,
        {
            toastId: 'searchToast',
            onClose: () => store.dispatch(setHasToastBeenShown({toastId: 'searchToast', shown: true})),
            position: 'top-right',
            draggable: false
        })
    } else if (!isSearchOpen || searchType !== 'address') {
        toast.dismiss('searchToast');
    }

    const vkmKeys = ['vali', 'tie', 'osa', 'etaisyys', 'track'];

    useEffect(() => {
        if(geoJsonArray.length > 0 && isSearchOpen && !hasToastBeenShown.includes('searchTipToast') && showToast !== false) {
            geoJsonArray.forEach(geoj => {
                if(vkmKeys.some(vkmStyle => vkmStyle === geoj.style)) {
                    toast.info(<TipToast handleButtonClick={() => handleCloseToast()} localStorageName={SEARCH_TIP_LOCALSTORAGE} text={<div> <h6>{searchDownloadTips.tip}</h6> <p>{searchDownloadTips.guide}</p></div>} />, 
                    {icon: <StyledToastIcon icon={faInfoCircle} />,
                    toastId: 'searchTipToast',
                    onClose: () => handleCloseToast(),
                    position: 'bottom-left',
                    draggable: false
                    })
                    store.dispatch(setHasToastBeenShown({toastId: 'searchTipToast', shown: true}));
                    return;
                }
            })
        }
        else toast.dismiss('searchTipToast');
    }, [geoJsonArray]);

    return (
        <StyledSearchContainer isSearchOpen={isSearchOpen}>
            <CircleButton
                icon={isSearchOpen ? faTimes : faSearch}
                text={strings.tooltips.search}
                toggleState={isSearchOpen}
                tooltipDirection={'left'}
                clickAction={() => {
                    isSearchOpen && store.dispatch(setGeoJsonArray([]));
                    setIsSearching(false);
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
                    <StyledLeftContentWrapper>
                        {!isSearching ? (
                        <StyledSelectedSearchMethod
                            onClick={() => {
                                console.info(isSearchMethodSelectorOpen)
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
                        {searchResults !== null &&
                        searchValue === lastSearchValue ? (
                            <StyledSearchActionButton
                                onClick={() => {
                                    store.dispatch(setGeoJsonArray([]));
                                    setSearchResults(null);
                                    setSearchValue('');
                                    removeMarkersAndFeatures();
                                }}
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
                    />              
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

export  default Search;
