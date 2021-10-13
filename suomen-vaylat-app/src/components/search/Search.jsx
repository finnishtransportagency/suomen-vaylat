import { useContext } from 'react';
import { faSearch, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { addMarkerRequest, mapMoveRequest, removeFeaturesFromMap, removeMarkerRequest, searchRequest, searchVKMRoad } from '../../state/slices/rpcSlice';
import { emptyFormData, emptySearchResult, setSearching, setSearchResult, setSearchSelected, setSearchError } from '../../state/slices/searchSlice';
import { setIsSearchOpen } from '../../state/slices/uiSlice';
import strings from '../../translations';
import CenterSpinner from '../center-spinner/CenterSpinner';
import Notification from '../notification/Notification'
import AddressSearch from './AddressSearch';
import { StyledSelectInput, ToastMessage } from './CommonComponents';
import VKMSearch from './VKMSearch';

const StyledSearchContainer = styled.div`
    z-index: 2;
    position: fixed;
    top: 90px;
    right: 30px;
    min-width: 350px;
    max-width: 400px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    flex-flow: row wrap;
    margin-left: 20px;
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
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
    cursor: pointer;
    margin: 0;
    background-color: transparent;
    padding: 0 !important;
    border: none;
    border-radius: 50%;
    transition: all 0.1s ease-in;
    svg {
        width: 28px;
        height: 28px;
        color: ${props => props.theme.colors.maincolor1};
        &:hover {
            transform: scale(1.05);
            color: ${props => props.theme.colors.maincolor2};
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
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
    cursor: pointer;
    background-color: transparent;
    border: none;
    transition: all 0.1s ease-in;
    svg {
        width: 28px;
        height: 28px;
        color: ${props => props.theme.colors.maincolor1};
        &:hover {
            transform: scale(1.05);
            color: ${props => props.theme.colors.maincolor2};
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
