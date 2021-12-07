import { useState, useContext } from 'react';
import styled from 'styled-components';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { motion } from 'framer-motion';
import {
    faSearch,
    faTimes,
    faTrash,
    faEllipsisV
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AddressSearch from './AddressSearch';
import VKMSearch from './VKMSearch';


import SvLoder from '../../components/loader/SvLoader';



import strings from '../../translations';

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
    width: ${props => props.isSearchOpen ? "100%" : "48px"};
    pointer-events: auto;
    z-index: 2;
    position: relative;
    grid-column-start: 3;
    grid-column-end: 4;
    max-width: 400px;
    justify-self: end;
    transition: width 0.8s ease-in-out;
    @media ${props => props.theme.device.mobileL} {
        max-width: 100%;
        grid-column-start: 1;
        grid-column-end: 4;
        width: ${props => props.isSearchOpen ? "100%" : "40px"};
    };
`;

const StyledSearchWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 24px;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    overflow: hidden;
    @media ${props => props.theme.device.mobileL} {
        height: 40px;
    };
`;

const StyledSearchContent = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    svg {
        //padding-left: 16px;
        //margin-right: 16px;
    }
`;

const StyledLeftContent = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
`;

const StyledSearchActionButton = styled(FontAwesomeIcon)`
    color: rgba(0, 0, 0, 0.5);
    font-size: 16px;
    cursor: pointer;
`;

const StyledSearchMethodSelector = styled.div`
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: ${props => props.isSearchMethodSelectorOpen ? props.theme.colors.mainColor1 : "rgba(0,0,0,0.5)"};
    p {
        margin: 0;
    };
    svg {
        font-size: 16px;
    }
`;

const StyledSelectedSearchMethod = styled.div`

    p {
        padding: 6px 8px;
        font-size: 14px;
        margin: 0;
        color: #6c757d;
    }
`;

const StyledMenuBarButton = styled.div`  
    pointer-events: auto;
    cursor: pointer;
    min-width: 48px;
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
        min-width: 40px;
        height: 40px;
        svg {
            font-size: 18px;
        };
    };
`;

const StyledDropdownWrapper = styled(motion.div)`
    border-radius: 24px;
    z-index: -1;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: auto;
    //max-height: calc(100vh - 70px);
    max-height: calc(var(--app-height) - 72px);
    overflow: auto;
    background-color: ${props => props.theme.colors.mainWhite};
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
`;

const StyledDropdownContent = styled.div`
    margin: 16px;
    margin-top: 48px;
    @media ${props => props.theme.device.mobileL} {
        margin-top: 40px;
    };
`;

const StyledDropdownContentItem = styled.div`
    user-select: none;
    cursor: pointer;
    padding-top: 8px;
    p {
        margin: 0;
        padding: 0;
        font-size: 12px;
    }
`;

const Search2 = () => {


    const [isSearchMethodSelectorOpen, setIsSearchMethodSelectorOpen] = useState(false);
    const search = useAppSelector((state) => state.search);
    const {
        isSearchOpen,
    } =  useAppSelector((state) => state.ui);

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

    const onClickHandler = () => {
        store.dispatch(setSearching(true));

        const vkmSearchErrorHandler = (errors) => {
            store.dispatch(setSearching(false));
            store.dispatch(setSelectError({show: true, message: strings.search.address.error.text, type: 'searchWarning', filteredLayers: [], indeterminate: false}));
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
        <StyledSearchWrapper>
            <StyledSearchContent>
                <StyledLeftContent>
                    <StyledSearchMethodSelector
                        onClick={() => {
                            setIsSearchMethodSelectorOpen(!isSearchMethodSelectorOpen);
                        }}
                        isSearchMethodSelectorOpen={isSearchMethodSelectorOpen}
                    >
                        <FontAwesomeIcon
                            icon={faEllipsisV}
                            style={{transform: isSearchMethodSelectorOpen && "rotate(180deg)"}}
                        />
                    </StyledSearchMethodSelector>
                    {
                        !search.searching ?
                        <StyledSelectedSearchMethod onClick={() => isSearchMethodSelectorOpen && setIsSearchMethodSelectorOpen(false)}>
                            {
                                search.selected === 'vkm' && <p>Tiehaku</p>
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
                </StyledLeftContent>
                {
                    search.selected !== 'vkm' && 
                    <StyledSearchActionButton
                        onClick={() => {
                            if(search.searchResult.address.length > 0){
                                searchTypeOnChange(search.selected);
                            } else if(search.formData.address.length > 0 ){
                                onClickHandler();
                            }
                        }}
                        icon={search.searchResult.address.length > 0 ? faTrash : faSearch}
                    />
                }
            </StyledSearchContent>
            <StyledMenuBarButton
                onClick={() => {
                    searchTypeOnChange('address');
                    store.dispatch(setIsSearchOpen(!isSearchOpen));
                    setIsSearchMethodSelectorOpen(false);
                }}
            >
                <FontAwesomeIcon
                    icon={isSearchOpen ? faTimes : faSearch}
                />
            </StyledMenuBarButton>
        </StyledSearchWrapper>
        <StyledDropdownWrapper
            //layout
        >
            <StyledDropdownContent>
            {
                isSearchMethodSelectorOpen && searchTypes.map(searchType => {
                    return (
                        <StyledDropdownContentItem
                            onClick={() => {
                                searchTypeOnChange(searchType.value);
                                setIsSearchMethodSelectorOpen(false);
                            }}
                        >
                           <p>{searchType.label}</p>
                        </StyledDropdownContentItem>
                    );
                })
            }
            {
                    !isSearchMethodSelectorOpen &&
                    !search.searching &&
                     search.searching === false && search.searchResult.address.length > 0 &&
                     search.selected === 'address' &&
                     search.searchResult.address.map(({ name, lon, lat, id }, index) => {
                         return <StyledDropdownContentItem
                         key={name + '_' + index}
                         onClick={() => {
                             searchTypeOnChange('address');
                             onAddressSelect(name, lon, lat, id);
                         }}
                     >
                         <p>{name}</p>
                     </StyledDropdownContentItem>
                 })
            }
            {
                    !isSearchMethodSelectorOpen &&
                    search.selected === 'vkm' &&
                    <VKMSearch
                        visible={search.selected === 'vkm'}
                        search={search}
                        store={store}
                        vectorLayerId={vectorLayerId}
                        onEnterHandler={onClickHandler}
                    />
            }
            </StyledDropdownContent>
        </StyledDropdownWrapper>  
</StyledSearchContainer>
);

};

export default Search2;