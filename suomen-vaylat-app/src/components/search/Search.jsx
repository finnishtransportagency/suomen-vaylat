import React, { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { searchVKMRoad, removeFeaturesFromMap, searchRequest, addMarkerRequest, mapMoveRequest } from '../../state/slices/rpcSlice';
import { setSearchSelected, emptySearchResult, emptyFormData, setSearching } from '../../state/slices/searchSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import strings from '../../translations';
import CenterSpinner from '../center-spinner/CenterSpinner';
import { StyledSelectInput, ToastMessage } from './CommonComponents';
import { setSearchResult } from '../../state/slices/searchSlice';
import { ShowError } from '../messages/Messages';
import './Search.scss';
import VKMSearch from './VKMSearch';
import AddressSearch from './AddressSearch';

const StyledSearchContainer = styled.div`
    z-index: 2;
    position: fixed;
    max-width: 400px;
    padding: 8px;
    margin-left: 20px;
    right: 20px;
    top: 80px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    background-color: #0064af;
    border-radius: 15px;
    flex-flow: row wrap;
`;

const StyledSearchControl = styled.button`
    border: none;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    pointer-events: auto;
    transition: all 0.1s ease-in;
    width: 46px;
    height: 46px;
    background-color: #0064af;
    margin: 0px 3px 3px 3px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    svg {
        color: white;
        width: 28px;
        height: 28px;
    };
    &:hover {
        background-color: #009ae1;
        transform: scale(1.05);
    }
    &:disabled {
        background-color: #777;
        transform: scale(1.0);
        cursor: not-allowed;
        opacity: 0.7;
    }
`;

export const Search = () => {
    const search = useAppSelector((state) => state.search);

    const vectorLayerId = 'SEARCH_VECTORLAYER';
    const markerId = 'SEARCH_MARKER';
    const { store } = useContext(ReactReduxContext)

    // handlers
    const searchTypeOnChange = (name) => {
        store.dispatch(setSearchSelected(name));
        store.dispatch(emptySearchResult());
        store.dispatch(emptyFormData());
        store.dispatch(removeFeaturesFromMap(vectorLayerId + '_' + search.selected));
    };
    const searchTypes = [
        { value: 'address', label: strings.search.types.address },
        { value: 'vkm', label: strings.search.types.vkm }
    ];

    let searchDisabled = true;

    const onClickHandler = () => {
        store.dispatch(setSearching(true));

        const vkmSearchErrorHandler = (errors) => {
            store.dispatch(setSearching(false));

            ShowError(<ToastMessage title={strings.search.vkm.error.title}
                message={strings.search.vkm.error.text}
                errors={errors}/>);
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

    } else if (search.searching === false ) {
        //store.dispatch(removeMarkerRequest(markerId));
    }

    return (
        <StyledSearchContainer className="search">
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
                    vectorLayerId={vectorLayerId}></VKMSearch>
                <AddressSearch visible={search.selected === 'address'}
                    search={search}
                    store={store}
                    markerId={markerId} onEnterHandler={onClickHandler}></AddressSearch>
                <StyledSearchControl
                    disabled={searchDisabled}
                    onClick={onClickHandler}
                    className="search search-button"
                    >
                    <FontAwesomeIcon
                        icon={faSearch}
                    />
                </StyledSearchControl>
            </StyledSearchContainer>
        );

 }

 export default Search;