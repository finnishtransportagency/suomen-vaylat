import React, { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { searchVKMRoad, removeFeaturesFromMap, searchRequest, addMarkerRequest, mapMoveRequest, removeMarkerRequest } from '../../state/slices/rpcSlice';
import { setSearchSelected, emptySearchResult, emptyFormData, setSearching, setSearchError } from '../../state/slices/searchSlice';
import { setIsSearchOpen } from '../../state/slices/uiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import strings from '../../translations';
import CenterSpinner from '../center-spinner/CenterSpinner';
import { StyledSelectInput, ToastMessage } from './CommonComponents';
import { setSearchResult } from '../../state/slices/searchSlice';
import VKMSearch from './VKMSearch';
import Notification from '../notification/Notification'
import AddressSearch from './AddressSearch';

const StyledSearchContainer = styled.div`
    z-index: 2;
    position: fixed;
    max-width: 400px;
    padding: 8px;
    margin-left: 20px;
    right: 30px;
    top: 90px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    flex-flow: row wrap;
    min-width:350px;
    padding: 6px;
`;

const StyledCloseButton = styled.div`
    position: absolute;
    top: -20px;
    right: -20px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.colors.maincolor1};
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
    }
    cursor: pointer;
`;

const StyledSearchControl = styled.button`
    position: absolute;
    top: ${props => (props.selectedSearch === 'vkm' ? '142px': '10px')};
    right: 12px;
    border: none;
    pointer-events: auto;
    transition: all 0.1s ease-in;
    width: 30px;
    height: 30px;

    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: transparent;
    padding: 0 !important;
    margin: 0;

    svg {
        color: ${props => props.theme.colors.maincolor1};
        width: 28px;
        height: 28px;
        &:hover {
            color: ${props => props.theme.colors.maincolor2};
            transform: scale(1.05);
        }
    };
    &:disabled {
        display: none;
    }

    @media only screen and (max-width: 400px) {
        top: ${props => (props.selectedSearch === 'vkm' ? '186px': '52px')};
    }
`;

const StyledEmptyButton = styled.button`
    position: absolute;
    top: 10px;
    right: ${props => (props.selectedSearch === 'vkm' ? '12px': '35px')};
    border: none;
    pointer-events: auto;
    transition: all 0.1s ease-in;
    width: 30px;
    height: 30px;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    svg {
        color: ${props => props.theme.colors.maincolor1};
        width: 28px;
        height: 28px;
        &:hover {
            color: ${props => props.theme.colors.maincolor2};
            transform: scale(1.05);
        }
    };
    &:disabled {
        display: none;
    }

    @media only screen and (max-width: 400px) {
        top: 52px;
    }
`;

export const Search = () => {
    const search = useAppSelector((state) => state.search);

    const vectorLayerId = 'SEARCH_VECTORLAYER';
    const markerId = 'SEARCH_MARKER';
    const { store } = useContext(ReactReduxContext);

    // handlers
    const searchTypeOnChange = (name) => {
        store.dispatch(setSearchSelected(name));
        store.dispatch(emptySearchResult());
        store.dispatch(setSearchError({errorState: false, data: [''], errorType: ""}));
        store.dispatch(emptyFormData());
        store.dispatch(removeFeaturesFromMap(vectorLayerId + '_' + search.selected));
        store.dispatch(removeMarkerRequest(markerId));
    };
    const searchTypes = [
        { value: 'address', label: strings.search.types.address },
        { value: 'vkm', label: strings.search.types.vkm }
    ];

    let searchDisabled = true;

    const onClickHandler = () => {
        store.dispatch(setSearching(true));

        const vkmSearchErrorHandler = (errors) => {
            console.log("seracherror ", errors);
            store.dispatch(setSearching(false));
            store.dispatch(setSearchError({errorState: true, data: errors, errorType: "primary"}));
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

    if (search.searching === false && search.selected === 'vkm'
        && search.formData.vkm.tie !== null
        && search.formData.vkm.tieosa !== null
        && search.formData.vkm.ajorata !== null
        && search.formData.vkm.etaisyys !== null
    ) {
        searchDisabled = false;
    } else if (search.searching === false && search.selected === 'address'
        && search.formData.address !== null && search.formData.address.length > 0) {
        searchDisabled = false;
    }

    if (search.searching === false && search.marker.x !== null && search.marker.y !== null) {
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
    }

    return (
        <StyledSearchContainer className="search">
            <StyledCloseButton
                onClick={() => {
                    searchTypeOnChange('address');
                    store.dispatch(setIsSearchOpen(false));
                }}
            >
                <FontAwesomeIcon
                            icon={faTimes}
                />
            </StyledCloseButton>
            <StyledEmptyButton
                disabled={(search.formData.address === null || (search.formData.address.length === 0 && search.formData.vkm.tie === null) || search.searching === true)}
                onClick={() => {
                    searchTypeOnChange(search.selected);
                }}
                selectedSearch={search.selected}
                >
                <FontAwesomeIcon
                    icon={faTrash}
                />
            </StyledEmptyButton>
            {search.searching ? (
                <CenterSpinner/>
            ) : null}
                <StyledSelectInput
                    options={searchTypes}
                    value={search.selected}
                    onChange={(event) => {
                        searchTypeOnChange(event.target.value);
                    }}
                    className="search search-type"
                >
                </StyledSelectInput>
                <VKMSearch visible={search.selected === 'vkm'}
                    search={search}
                    store={store}
                    vectorLayerId={vectorLayerId}
                    onEnterHandler={onClickHandler}></VKMSearch>
                <AddressSearch visible={search.selected === 'address'}
                    search={search}
                    store={store}
                    markerId={markerId} onEnterHandler={onClickHandler}></AddressSearch>
                <StyledSearchControl
                    disabled={searchDisabled}
                    onClick={onClickHandler}
                    className="search search-button"
                    selectedSearch={search.selected}
                    >
                    <FontAwesomeIcon
                        icon={faSearch}
                    />
                </StyledSearchControl>
                <Notification
                    title={strings.search.vkm.error.title}
                    message={strings.search.vkm.error.text}
                    errors={search.searchErrorData}
                />
            </StyledSearchContainer>
        );

 }

 export default Search;