import React, { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import Select from 'react-styled-select'
import { removeFeaturesFromMap } from '../../state/slices/rpcSlice';
import { setSearchSelected, emptySearchResult, emptyFormData } from '../../state/slices/searchSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import strings from '../../translations';
import CenterSpinner from '../center-spinner/CenterSpinner';
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
    svg {
        color: white;
        width: 28px;
        height: 28px;
    };
    &:hover {
        background-color: #009ae1;
        transform: scale(1.05);
    }
`;

export const Search = () => {
    const search = useAppSelector((state) => state.search);
    console.log(search);

    const vectorLayerId = 'SEARCH_VECTORLAYER';
    const { store } = useContext(ReactReduxContext)

    // handlers
    const searchTypeOnChange = (name) => {
        store.dispatch(setSearchSelected(name));
        store.dispatch(emptySearchResult());
        store.dispatch(emptyFormData());
        store.dispatch(removeFeaturesFromMap(vectorLayerId + '_' + search.selected));
    };
    const values = [
        { value: 'address', label: 'Osoitehaku' },
        { value: 'vkm', label: 'Tiehaku' },
    ];

    return (
        <StyledSearchContainer className="search">
            {search.searching ? (
                <CenterSpinner/>
            ) : null}
                <Select
                    options={values}
                    onChange={searchTypeOnChange}
                    value={search.selected}
                    className="search search-type"
                />
                <VKMSearch visible={search.selected === 'vkm'}
                    search={search}
                    store={store}
                    vectorLayerId={vectorLayerId}></VKMSearch>

                <StyledSearchControl
                    disabled={false}
                    onClick={() => {
                        //store.dispatch(setZoomIn());
                    }}
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