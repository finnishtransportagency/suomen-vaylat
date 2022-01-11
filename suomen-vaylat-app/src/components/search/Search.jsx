import { useState, useContext } from 'react';
import styled from 'styled-components';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import {
    faSearch,
    faTimes,
    faTrash,
    faEllipsisV
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddressSearch from './AddressSearch';
import VKMSearch from './VKMSearch';
import SvLoder from '../loader/SvLoader';
import strings from '../../translations';

import { isMobile } from '../../theme/theme';

import {
    addMarkerRequest,
    mapMoveRequest,
    removeFeaturesFromMap,
    removeMarkerRequest,
    searchRequest,
    searchVKMRoad,
    setSelectError
} from '../../state/slices/rpcSlice';

import {
    emptyFormData,
    emptySearchResult,
    setSearching,
    setSearchResult,
    setSelectedIndex,
    setMarker,
    setSearchResultOnMapId,
    setSearchSelected
} from '../../state/slices/searchSlice';

import { setIsSearchOpen } from '../../state/slices/uiSlice';


const StyledSearchContainer = styled.div`
    z-index: 2;
    pointer-events: auto;
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
    position: relative;
    transition: all 0.3s ease-out;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    //max-width: ${props => props.isSearchOpen ? "400px" : "0%"};
    overflow: hidden;
    //max-width: 400px;
    padding-right: 48px;
    height: 100%;
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 24px;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    @media ${props => props.theme.device.mobileL} {
        //height: 40px;
        border-radius: 20px;
        padding-right: 40px;
        //max-width: ${props => props.isSearchOpen ? "100%" : "0%"};
        //max-width: 100%;
    };
`;

const StyledSearchContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0px 8px 0px 8px;
    width: 100%;
`;

const StyledLeftContent = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
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

const StyledMenuBarButton = styled.div`
    position: absolute;
    right: 0px;

    z-index: 1;
    pointer-events: auto;
    cursor: pointer;
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.isActive ? props.theme.colors.buttonActive : props.theme.colors.button};
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 22px;
    };
    @media ${props => props.theme.device.mobileL} {
        width: 40px;
        height: 40px;
        svg {
            font-size: 18px;
        };
    };
`;

const StyledDropDown = styled(motion.div)`
    z-index: -1;
    position: absolute;
    top: 0px;
    right: 0px;
    max-width: 400px;
    width: 100%;
    height: auto;
    //height: 200px;
    border-radius: 24px;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    background-color: ${props => props.theme.colors.mainWhite};
    padding: 48px 16px 16px 16px;
    overflow: auto;
    @media ${props => props.theme.device.mobileL} {
        max-width: 100%;
    };
`;

const StyledDropdownWrapper = styled(motion.div)`
    border-radius: 24px;
    z-index: -1;
    //position: absolute;
    width: 100%;
    height: auto;
    margin-top: 8px;
    //max-height: calc(var(--app-height) - 120px);
    overflow: auto;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    background-color: ${props => props.theme.colors.mainWhite};
`;

const StyledDropdownContent = styled(motion.div)`
    margin: 16px;
    /* margin-top: 48px;
    @media ${props => props.theme.device.mobileL} {
        margin-top: 40px;
    }; */
`;

const StyledDropdownContentItem = styled.div`
    user-select: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 5px;
    background-color: ${props => props.itemSelected ? props.theme.colors.mainColor3 : ""};
    &:hover{
        background-color: ${props => props.theme.colors.mainColor3};
    };
    p {
        margin: 0;
        padding: 0;
        font-size: 15px;
    }
`;

const Search = () => {
    const [isSearchMethodSelectorOpen, setIsSearchMethodSelectorOpen] = useState(false);
    const [searchResultSelectedIndex, setSearchResultSelectedIndex] = useState(-1);
    const [showSearchResults, setShowSearchResults] = useState(true);
    const search = useAppSelector((state) => state.search);
    const {
        isSearchOpen,
    } = useAppSelector((state) => state.ui);

    const vectorLayerId = 'SEARCH_VECTORLAYER';
    const markerId = 'SEARCH_MARKER';
    const { store } = useContext(ReactReduxContext);

    // handlers
    const searchTypeOnChange = (name) => {
        store.dispatch(setSearchSelected(name));
        store.dispatch(emptySearchResult());
        store.dispatch(emptyFormData());
        store.dispatch(removeFeaturesFromMap(vectorLayerId + '_' + search.selected));
        store.dispatch(removeMarkerRequest(markerId));
    };

    const searchTypes = [
        { value: 'address', label: strings.search.types.address },
        { value: 'vkm', label: strings.search.types.vkm }
    ];

    const showAddressSearchResults = !isSearchMethodSelectorOpen && search.searching === false &&
        search.searchResult.address.length > 0 && search.selected === 'address';

    const showVkmSearch = !isSearchMethodSelectorOpen &&
        search.selected === 'vkm';

    const showDropDownContent = (
            // if search method selection is open
            (isSearchMethodSelectorOpen) ||
            // or search method selection is not open and has address search results
            (
                !isSearchMethodSelectorOpen && !search.searching &&
                search.searching === false && search.searchResult.address.length > 0 &&
                search.selected === 'address'
            ) ||
            // or search method selection is not open and vkm search is selected
            (
                !isSearchMethodSelectorOpen &&
                search.selected === 'vkm'
            )
    );

    const onClickHandler = () => {
        store.dispatch(setSearching(true));

        const vkmSearchErrorHandler = (errors) => {

            store.dispatch(setSearching(false));
            store.dispatch(setSelectError({ show: true, message: strings.search.vkm.error.text, errors: errors, type: 'searchWarning', filteredLayers: [], indeterminate: false }));
        };

        if (search.selected === 'vkm') {
            store.dispatch(searchVKMRoad({
                search: [search.formData.vkm.tie, search.formData.vkm.tieosa, search.formData.vkm.ajorata, search.formData.vkm.etaisyys],
                handler: (data) => {
                    store.dispatch(setSearchResult(data));
                },
                errorHandler: vkmSearchErrorHandler
            }));
        } else if (search.selected === 'address') {
            store.dispatch(searchRequest(search.formData.address));
        }
    };

    if (search.searching === false && search.marker.x !== null && search.marker.y !== null
        && search.searchResultOnMapId !== search.marker.x + '_' + search.marker.y + '_' + (search.marker.msg || '') + '_' + markerId) {
        store.dispatch(addMarkerRequest({
            x: search.marker.x,
            y: search.marker.y,
            msg: search.marker.msg || '',
            markerId: markerId
        }));

        store.dispatch(mapMoveRequest({
            x: search.marker.x,
            y: search.marker.y
        }));

        store.dispatch(setSearchResultOnMapId(search.marker.x + '_' + search.marker.y + '_' + (search.marker.msg || '') + '_' + markerId));
    };

    const setItemSelected = (index) => {
        setSearchResultSelectedIndex(index)
    }

    const onAddressSelect = (name, lon, lat, id) => {
        store.dispatch(setSelectedIndex(id));
        store.dispatch(setMarker({
            x: lon,
            y: lat,
            msg: name
        }));
    };

    return (
        <StyledSearchContainer
            isSearchOpen={isSearchOpen}
        >
            <StyledMenuBarButton
                onClick={() => {
                        searchTypeOnChange('address');
                        store.dispatch(setIsSearchOpen(!isSearchOpen));
                        setIsSearchMethodSelectorOpen(false);
                    }}
                    isActive={isSearchOpen}
                >
                    <FontAwesomeIcon
                        icon={isSearchOpen ? faTimes : faSearch}
                    />
            </StyledMenuBarButton>
            <AnimatePresence>
                {
                    isSearchOpen && <StyledSearchWrapper
                        initial={{
                            maxWidth: 0,
                            opacity: 0
                        }}
                        animate={{
                            //height: "auto",
                            maxWidth: "400px",
                            opacity: 1
                        }}
                        exit={{
                            maxWidth: 0,
                            opacity: 0
                        }}
                        transition={{
                            duration: 0.4,
                            type: "tween"
                        }}
                    >
                             <StyledLeftContentWrapper>
                                 <StyledSearchMethodSelector
                                     onClick={() => {
                                         setIsSearchMethodSelectorOpen(!isSearchMethodSelectorOpen);
                                         setShowSearchResults(true);
                                     }}
                                     isSearchMethodSelectorOpen={isSearchMethodSelectorOpen}
                                 >
                                     <FontAwesomeIcon
                                         icon={faEllipsisV}
                                         style={{ transform: isSearchMethodSelectorOpen && 'rotate(180deg)' }}
                                     />
                                 </StyledSearchMethodSelector>
                                 {
                                     !search.searching ?
                                         <StyledSelectedSearchMethod onClick={() => {
                                            setShowSearchResults(true);
                                            isSearchMethodSelectorOpen && setIsSearchMethodSelectorOpen(false);
                                         } 
                                         }>
                                             {
                                                 search.selected === 'vkm' && <p>{strings.search.types.vkm}</p>
                                             }
                                             {
                                                 search.selected === 'address' &&
                                                 <AddressSearch
                                                     visible={search.selected === 'address'}
                                                     search={search}
                                                     store={store}
                                                     markerId={markerId}
                                                     onEnterHandler={onClickHandler}
                                                 />
                                             }
                                         </StyledSelectedSearchMethod> : <SvLoder />
                                 }
                             </StyledLeftContentWrapper>
                             {
                                 search.selected !== 'vkm' &&
                                 <StyledSearchActionButton
                                     onClick={() => {
                                         if (search.searchResult.address.length > 0) {
                                             searchTypeOnChange(search.selected);
                                         } else if (search.formData.address.length > 0) {
                                             onClickHandler();
                                         }
                                     }}
                                     icon={search.searchResult.address.length > 0 ? faTrash : faSearch}
                                 />
                             }          
                 </StyledSearchWrapper>
                }
            </AnimatePresence>
            <AnimatePresence>
                {
                    showSearchResults && showDropDownContent && <StyledDropDown
                        initial={{
                            height: 0,
                            opacity: 0
                        }}
                        animate={{
                            height: "auto",
                            maxHeight: "calc(var(--app-height) - 100px)",
                            opacity: 1
                        }}
                        exit={{
                            height: 0,
                            opacity: 0
                        }}
                        transition={{
                            duration: 0.4,
                            type: "tween"
                        }}
                    >
                        {
                            isSearchMethodSelectorOpen && searchTypes.map(searchType => {
                                return (
                                    <StyledDropdownContentItem
                                        onClick={() => {
                                            searchTypeOnChange(searchType.value);
                                            setIsSearchMethodSelectorOpen(false);
                                        }}
                                        key={'search-type-' + searchType.value}
                                    >
                                        <p>{searchType.label}</p>
                                    </StyledDropdownContentItem>
                                );
                            })
                        }
                        {
                            showAddressSearchResults && showSearchResults &&
                            search.searchResult.address.map(({ name, region, type, lon, lat, id }, index) => {
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
                                const text = {
                                    __html: visibleText
                                };
                                return <StyledDropdownContentItem
                                    itemSelected={searchResultSelectedIndex === index}
                                    key={name + '_' + index}
                                    onClick={() => {
                                        setItemSelected(index);
                                        onAddressSelect(name, lon, lat, id);
                                        isMobile && setShowSearchResults(false);
                                    }}
                                >
                                    <p dangerouslySetInnerHTML={text} />
                                </StyledDropdownContentItem>
                            })
                        }
                        {
                            showVkmSearch &&
                            <VKMSearch
                                visible={search.selected === 'vkm'}
                                search={search}
                                store={store}
                                vectorLayerId={vectorLayerId}
                                onEnterHandler={onClickHandler}
                            />
                        }
                    </StyledDropDown>
                }
            </AnimatePresence>         
        </StyledSearchContainer>
    );

};

export default Search;