import { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import {
    faSearch,
    faTimes,
    faTrash,
    faEllipsisV,
    faAngleUp
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddressSearch from './AddressSearch';
import RoadSearch from './RoadSearch';
import VKMRoadSearch from './VKMRoadSearch';
import MetadataSearch from './MetadataSearch';
import Layer from '../menus/hierarchical-layerlist/Layer';
import SvLoder from '../loader/SvLoader';
import strings from '../../translations';

import { isMobile } from '../../theme/theme';

import {
    addMarkerRequest,
    mapMoveRequest,
} from '../../state/slices/rpcSlice';

import { setIsSearchOpen } from '../../state/slices/uiSlice';

import CircleButton from '../circle-button/CircleButton';
import VKMTrackSearch from './VKMTrackSearch';

import { VKMGeoJsonHoverStyles, VKMGeoJsonStyles } from './VKMSearchStyles';

const StyledSearchContainer = styled.div`
    z-index: 2;
    position: relative;
    grid-column-start: 3;
    grid-column-end: 4;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    height: 48px;
    @media ${props => props.theme.device.mobileL} {
        grid-column-start: ${props => props.isSearchOpen ? 1 : 2};
        grid-column-end: 4;
        height: 40px;
    };
`;

const StyledSearchWrapper = styled(motion.div)`
    position: absolute;
    z-index: -1;
    transition: all 0.3s ease-out;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    overflow: hidden;
    padding-right: 48px;
    height: 100%;
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 24px;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    pointer-events: auto;
    @media ${props => props.theme.device.mobileL} {
        border-radius: 20px;
        padding-right: 40px;
    };
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
`;

const StyledSearchMethodSelector = styled.div`
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 8px;
    cursor: pointer;
    color: ${props => props.isSearchMethodSelectorOpen ? props.theme.colors.mainColor1 : 'rgba(0,0,0,0.5)'};
    p {
        margin: 0;
    };
    svg {
        font-size: 16px;
    }
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

const StyledDropDown = styled(motion.div)`
    z-index: -2;
    position: absolute;
    top: 0px;
    right: 0px;
    max-width: 400px;
    width: 100%;
    height: auto;
    border-radius: 24px;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    background-color: ${props => props.theme.colors.mainWhite};
    padding: 64px 16px 0px 16px;
    pointer-events: auto;
    overflow: auto;
    @media ${props => props.theme.device.mobileL} {
        max-width: 100%;
    };
`;

const StyledDropdownContentItem = styled.div`
    user-select: none;
    cursor: pointer;
    padding-left: 8px;
    padding-bottom: 16px;
    border-radius: 5px;

    background-color: ${props => props.itemSelected ? props.theme.colors.mainColor3 : ''};
    p {
        margin: 0;
        padding: 0;
    }
`;

const StyledDropdownContentItemTitle = styled.p`
    text-align: ${props => props.type === 'noResults' && 'center'};
    font-size: 14px;
    color: #504d4d;
`;

const StyledDropdownContentItemSubtitle = styled.p`
    font-size: 12px;
    color: #807A7A;
`;

const StyledHideSearchResultsButton = styled.div`
    position: sticky;
    bottom: 0px;
    background-color: white;
    text-align: center;
    padding-bottom: 4px;
    cursor: pointer;
    svg {
    font-size: 23px;
      color:  ${props => props.theme.colors.mainColor1}
    };

`;

const Search = () => {
    const [searchValue, setSearchValue ] = useState('');
    const [lastSearchValue, setLastSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [showSearchResults, setShowSearchResults] = useState(true);
    const [isSearchMethodSelectorOpen, setIsSearchMethodSelectorOpen] = useState(false);
    const [searchType, setSearchType] = useState('address');

    const { isSearchOpen } = useAppSelector((state) => state.ui);
    const { channel, allLayers } = useAppSelector((state) => state.rpc);

    const { store } = useContext(ReactReduxContext);

    const markerId = 'SEARCH_MARKER';
    const vectorLayerId = 'SEARCH_VECTORLAYER';

    const [vkmError, setVkmError] = useState(null);

    const handleAddressSearch = (value) => {
        removeMarkersAndFeatures();
        setIsSearching(true);
        channel.postRequest('SearchRequest', [value]);
        setLastSearchValue(value);
    };

    const handleVKMResponse = (data) => {
        setIsSearching(false);

        let style = 'tie';
        if ((data.hasOwnProperty('osa') || data.hasOwnProperty('ajorata')) && !data.hasOwnProperty('etaisyys')) {
            style = 'osa';
        } else if (data.hasOwnProperty('etaisyys')) {
            style = 'etaisyys';
        }
        let featureStyle = VKMGeoJsonStyles.road[style];
        let hover = VKMGeoJsonHoverStyles.road[style];

        if (style === 'tie') {
            removeMarkersAndFeatures();
        };

        const value = {
            tienumero: data.hasOwnProperty('tie') ? parseInt(data.tie) : searchValue.tienumero || null,
            tieosa: data.hasOwnProperty('osa') ? parseInt(data.osa) : searchValue.tieosa || 'default',
            ajorata: data.hasOwnProperty('ajorata') ? parseInt(data.ajorata) : 'default',
            etaisyys: data.hasOwnProperty('etaisyys') ? parseInt(data.etaisyys) : '',
            tieosat: data.hasOwnProperty('tieosat') ? data.tieosat: searchValue.tieosat || [],
            ajoradat: data.hasOwnProperty('ajoradat') ? data.ajoradat: searchValue.ajoradat || []
        };

        setSearchValue(value);
        setLastSearchValue(value);

        setSearchResults(data);

        data.hasOwnProperty('geom') && channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest',
        [data.geom, {
            clearPrevious: true,
            centerTo: true,
            hover: hover,
            featureStyle: featureStyle,
            layerId: vectorLayerId + '_vkm_' + style,
            maxZoomLevel: 10
        }]);
    };

    const handleVKMSearch = (params) => {

        setIsSearching(true);
        setVkmError(null);

        let requestData = [
            params.hasOwnProperty('vkmTienumero') && parseInt(params.vkmTienumero),
            params.hasOwnProperty('vkmTieosa') && parseInt(params.vkmTieosa),
            params.hasOwnProperty('vkmAjorata') && parseInt(params.vkmAjorata),
            params.hasOwnProperty('vkmEtaisyys') && parseInt(params.vkmEtaisyys)
        ];

        channel.searchVKMRoad && channel.searchVKMRoad(requestData, handleVKMResponse, (err) => {
            setIsSearching(false);
            if(err){
                setVkmError(err);
            }
        });
    };

    const handleMetadataSearch = (value) => {
        removeMarkersAndFeatures();
        setIsSearching(true);
        channel.postRequest('MetadataSearchRequest', [{
            search: value,
            srs: 'EPSG:3067',
            OrganisationName: 'Väylävirasto'
        }]);
        setLastSearchValue(value);
    };

    const markerIds = [markerId];
    const vectorLayerIds = [vectorLayerId + '_vkm_tie', vectorLayerId + '_vkm_osa', vectorLayerId + '_vkm_etaisyys', vectorLayerId + '_vkm_track'];

    const removeMarkersAndFeatures = () => {
        if (!channel) {
            return;
        }
        markerIds.forEach(markerId => {
            channel.postRequest('MapModulePlugin.RemoveMarkersRequest', [markerId]);
        });
        vectorLayerIds.forEach(vectorLayerId => {
            channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, vectorLayerId])
        });
    };


    const searchTypes = {
        address: {
            label: strings.search.address.title,
            subtitle: strings.search.address.subtitle,
            content: <AddressSearch
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                setIsSearching={setIsSearching}
                handleAddressSearch={handleAddressSearch}
            />,
            visible: true
        },
        vkm: {
            label: strings.search.vkm.title,
            subtitle: strings.search.vkm.subtitle,
            content: <RoadSearch
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                setIsSearching={setIsSearching}
                handleVKMSearch={handleVKMSearch}
            />,
            visible: channel && channel.searchVKMRoad
        },
        vkmtrack: {
            label: strings.search.vkm.trackTitle,
            subtitle: strings.search.vkm.trackSubtitle,
            content: <p>{strings.search.vkm.trackTitle}...</p>,
            visible: channel && channel.searchVKMTrack
        },
        metadata: {
            label: strings.search.metadata.title,
            subtitle: strings.search.metadata.subtitle,
            content: <MetadataSearch
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                setIsSearching={setIsSearching}
                handleMetadataSearch={handleMetadataSearch}
            />,
            visible: true
        }
    };

    useEffect(() => {
        channel && channel.handleEvent('SearchResultEvent', function(data) {
            setIsSearching(false);
            if (data.success){
                if(data.result){
                    setSearchResults(data);
                }
            };
        });

        channel && channel.handleEvent('MetadataSearchResultEvent', function(data) {
            setIsSearching(false);
            if (data.success){
                if(data.results){
                    setSearchResults(data.results);
                }
            };
         });
    },[channel]);

    const handleAddressSelect = (name, lon, lat, id) => {
        store.dispatch(addMarkerRequest({
            x: lon,
            y: lat,
            msg: name || '',
            markerId: markerId
        }));

        store.dispatch(mapMoveRequest({
            x: lon,
            y: lat
        }));
    };

    const variants = {
        initial: {
            maxWidth: 0,
            opacity: 0,
            filter: 'blur(10px)'
        },
        animate: {
            maxWidth: '400px',
            opacity: 1,
            filter: 'blur(0px)'
        },
        exit: {
            maxWidth: 0,
            opacity: 0,
            filter: 'blur(10px)'
        },
        transition: {
            duration: 0.3,
            type: 'tween'
        }
    };

    const dropdownVariants = {
        initial: {
            height: 0,
            opacity: 0
        },
        animate: {
            height: 'auto',
            maxHeight: 'calc(var(--app-height) - 100px)',
            opacity: 1
        },
        exit: {
            height: 0,
            opacity: 0
        },
        transition: {
            duration: 0.5,
            type: 'tween'
        }
    };

    return (
        <StyledSearchContainer
            isSearchOpen={isSearchOpen}
        >
            <CircleButton
                icon={isSearchOpen ? faTimes : faSearch}
                text={strings.tooltips.search}
                toggleState={isSearchOpen}
                tooltipDirection={'left'}
                clickAction={() => {
                    isSearchOpen && removeMarkersAndFeatures();
                    isSearchOpen && setSearchResults(null);
                    isSearchOpen && setSearchValue('');
                    store.dispatch(setIsSearchOpen(!isSearchOpen));
                    isSearchMethodSelectorOpen && setIsSearchMethodSelectorOpen(false);
                    setSearchType('address');
                }}
            />
            <AnimatePresence>
                {
                isSearchOpen && <StyledSearchWrapper
                    variants={variants}
                    initial={'initial'}
                    animate={'animate'}
                    exit={'exit'}
                    transition={'transition'}
                >
                    <StyledLeftContentWrapper>
                        <StyledSearchMethodSelector
                            onClick={() => {
                                setIsSearchMethodSelectorOpen(!isSearchMethodSelectorOpen);
                            }}
                            isSearchMethodSelectorOpen={isSearchMethodSelectorOpen}
                        >
                            <FontAwesomeIcon
                                icon={faEllipsisV}
                            />
                        </StyledSearchMethodSelector>
                        {
                            !isSearching ?
                                <StyledSelectedSearchMethod
                                    onClick={() => {
                                        setShowSearchResults(true);
                                        isSearchMethodSelectorOpen && setIsSearchMethodSelectorOpen(false);
                                    }}
                                >
                                    {
                                        searchTypes[searchType].content
                                    }
                                </StyledSelectedSearchMethod> : <SvLoder />
                        }
                    </StyledLeftContentWrapper>
                    {
                      (searchResults !== null && (searchValue === lastSearchValue)) ?
                      <StyledSearchActionButton
                            onClick={() => {
                                setSearchResults(null);
                                setSearchValue('');
                                removeMarkersAndFeatures();
                            }}
                            icon={faTrash}
                        /> :
                        <StyledSearchActionButton
                            onClick={() => {
                                console.log(searchType);
                                searchType === 'address' && handleAddressSearch(searchValue);
                                searchType === 'vkm' && handleVKMSearch({vkmTienumero: searchValue});
                                searchType === 'metadata' && handleMetadataSearch(searchValue);
                            }}
                            icon={faSearch}
                        />
                    }
                 </StyledSearchWrapper>
                }
            </AnimatePresence>
            <AnimatePresence>
                {
                    isSearchMethodSelectorOpen ?
                    <StyledDropDown
                        key={'dropdown-content-searchmethods'}
                        variants={dropdownVariants}
                        initial={'initial'}
                        animate={'animate'}
                        exit={'exit'}
                        transition={'transition'}
                    >
                        {
                            Object.keys(searchTypes).map((searchType) => {
                                const type = searchTypes[searchType];
                                if (type.visible) {
                                    return (
                                        <StyledDropdownContentItem
                                            onClick={() => {
                                                setSearchResults(null);
                                                setSearchType(searchType);
                                                setIsSearchMethodSelectorOpen(false);
                                                setSearchValue('');
                                                isSearchOpen && removeMarkersAndFeatures();
                                            }}
                                            key={'search-type-' + searchType}
                                        >
                                            <StyledDropdownContentItemTitle>{type.label}</StyledDropdownContentItemTitle>
                                            <StyledDropdownContentItemSubtitle>{type.subtitle}</StyledDropdownContentItemSubtitle>
                                        </StyledDropdownContentItem>
                                    );
                                } else {
                                    return null;
                                }
                            })
                        }
                   </StyledDropDown> :
                    isSearchOpen &&
                    searchResults !== null &&
                    showSearchResults &&
                    searchType === 'address' ?
                    <StyledDropDown
                        key={'dropdown-content-address'}
                        variants={dropdownVariants}
                        initial={'initial'}
                        animate={'animate'}
                        exit={'exit'}
                        transition={'transition'}
                    >
                        {
                            searchResults.result && searchResults.result.locations && searchResults.result.locations.length > 0 ? searchResults.result.locations.map(({ name, region, type, lon, lat, id }, index) => {
                                let visibleText;
                                if (name === region) {
                                    visibleText = name;
                                    if (type) {
                                        visibleText += ' (' + type.toLowerCase() +')';
                                    }
                                } else if (region && type) {
                                    visibleText = name + ', ' + region + ' (' + type.toLowerCase() +')';
                                } else if (type) {
                                    visibleText = name + ' (' + type.toLowerCase() +')';
                                } else {
                                    visibleText = name;
                                }
                                return <StyledDropdownContentItem
                                    key={name + '_' + index}
                                    onClick={() => {
                                        setSearchValue(visibleText);
                                        setLastSearchValue(visibleText);
                                        handleAddressSelect(name, lon, lat, id);
                                        isMobile && setShowSearchResults(false);
                                    }}
                                >
                                   <StyledDropdownContentItemTitle>{ visibleText }</StyledDropdownContentItemTitle>
                                </StyledDropdownContentItem>
                            }) :
                            <StyledDropdownContentItem
                                key={'no-results'}
                            >
                                <StyledDropdownContentItemTitle type='noResults'>{strings.search.address.error.text}</StyledDropdownContentItemTitle>
                            </StyledDropdownContentItem>
                        }
                    <StyledHideSearchResultsButton
                        onClick={() => setShowSearchResults(false)}
                    >
                        <FontAwesomeIcon
                            icon={faAngleUp}
                        />
                    </StyledHideSearchResultsButton>
                    </StyledDropDown> :
                    (isSearchOpen &&
                    showSearchResults &&
                    searchType === 'vkm' &&
                    searchValue.tieosat && 
                    searchValue.tieosat.length > 0) ||
                    vkmError ?
                    <StyledDropDown
                        key={'dropdown-content-vkm'}
                        variants={dropdownVariants}
                        initial={'initial'}
                        animate={'animate'}
                        exit={'exit'}
                        transition={'transition'}
                    >
                        <VKMRoadSearch
                            setIsSearching={setIsSearching}
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                            setLastSearchValue={setLastSearchValue}
                            setSearchResults={setSearchResults}
                            vectorLayerId={vectorLayerId}
                            removeMarkersAndFeatures={removeMarkersAndFeatures}
                            handleVKMSearch={handleVKMSearch}
                            handleVKMResponse={handleVKMResponse}
                            vkmError={vkmError}
                            setVkmError={setVkmError}

                        />
                        <StyledHideSearchResultsButton
                            onClick={() => setShowSearchResults(false)}
                        >
                            <FontAwesomeIcon
                                icon={faAngleUp}
                            />
                        </StyledHideSearchResultsButton>
                    </StyledDropDown> :
                    isSearchOpen &&
                    showSearchResults &&
                    searchType === 'vkmtrack' ?
                    <StyledDropDown
                        key={'dropdown-content-vkmtrack'}
                        variants={dropdownVariants}
                        initial={'initial'}
                        animate={'animate'}
                        exit={'exit'}
                        transition={'transition'}
                    >
                        <VKMTrackSearch
                            setIsSearching={setIsSearching}
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                            setLastSearchValue={setLastSearchValue}
                            setSearchResults={setSearchResults}
                            vectorLayerId={vectorLayerId}
                            removeMarkersAndFeatures={removeMarkersAndFeatures}
                        />
                        <StyledHideSearchResultsButton
                            onClick={() => setShowSearchResults(false)}
                        >
                            <FontAwesomeIcon
                                icon={faAngleUp}
                            />
                        </StyledHideSearchResultsButton>
                    </StyledDropDown> :

                    isSearchOpen &&
                    searchResults !== null &&
                    showSearchResults &&
                    searchType === 'metadata' &&
                    <StyledDropDown
                        key={'dropdown-content-metadata'}
                        variants={dropdownVariants}
                        initial={'initial'}
                        animate={'animate'}
                        exit={'exit'}
                        transition={'transition'}
                    >
                        {
                            searchResults.length > 0 ? searchResults.map(result => {
                                const layers = allLayers.filter(layer => layer.metadataIdentifier === result.id);
                                return layers.map(layer => {
                                    return <Layer key={`metadata_${layer.id}`}layer={layer}/>
                                })
                            }) :
                            <StyledDropdownContentItem
                                key={'no-results'}
                            >
                                <StyledDropdownContentItemTitle type='noResults'>{strings.search.metadata.error.text}</StyledDropdownContentItemTitle>
                            </StyledDropdownContentItem>

                        }
                    <StyledHideSearchResultsButton
                        onClick={() => setShowSearchResults(false)}
                    >
                        <FontAwesomeIcon
                            icon={faAngleUp}
                        />
                    </StyledHideSearchResultsButton>
                    </StyledDropDown>
                }
            </AnimatePresence>
        </StyledSearchContainer>
    );
};

export default Search;