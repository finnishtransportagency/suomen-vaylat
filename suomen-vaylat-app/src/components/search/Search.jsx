import React, { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { searchVKMRoad, removeFeaturesFromMap } from '../../state/slices/rpcSlice';
import { setSearchSelected, emptySearchResult, emptyFormData, setSearching } from '../../state/slices/searchSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import strings from '../../translations';
import CenterSpinner from '../center-spinner/CenterSpinner';
import { StyledSelectInput } from './CommonComponents';
import { setSearchResult } from '../../state/slices/searchSlice';
import './Search.scss';
import VKMSearch from './VKMSearch';

const StyledSearchContainer = styled.div`
    z-index: 2;
    position: fixed;
    max-width: 400px;
    padding: 8px;
    right: 30px;
    top: 90px;
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

        if (search.selected === 'vkm') {
            store.dispatch(searchVKMRoad({
                search: [search.formData.vkm.tie, search.formData.vkm.tieosa, search.formData.vkm.ajorata, search.formData.vkm.etaisyys],
                handler: (data) => {
                    store.dispatch(setSearchResult(data));
                }
            }));
        }
    };

    if( search.searching === false && search.selected === 'vkm'
        && search.formData.vkm.tie !== null
        && search.formData.vkm.tieosa !== null
        && search.formData.vkm.ajorata !== null
        && search.formData.vkm.etaisyys !== null
    ) {
        searchDisabled = false;
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