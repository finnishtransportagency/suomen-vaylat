import { useContext } from 'react';
import { faSearch, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import {
    addMarkerRequest,
    mapMoveRequest,
    removeFeaturesFromMap,
    removeMarkerRequest,
    searchRequest,
    searchVKMRoad,
    setSelectError
} from '../../state/slices/rpcSlice';
import { emptyFormData, emptySearchResult, setSearching, setSearchResult, setSearchResultOnMapId, setSearchSelected } from '../../state/slices/searchSlice';
import { setIsSearchOpen } from '../../state/slices/uiSlice';
import strings from '../../translations';
import CenterSpinner from '../center-spinner/CenterSpinner';
import AddressSearch from './AddressSearch';
import VKMSearch from './VKMSearch';
import { StyledSelectInput } from './CommonComponents';
import { motion } from "framer-motion";


const variants = {
    open: {
        pointerEvents: "auto",
        x: 0,
        opacity: 1,
    },
    closed: {
        pointerEvents: "none",
        x: "20px",
        opacity: 0,
    },
};

const StyledSearchContainer = styled(motion.div)`
    z-index: 2;
    position: relative;
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: flex-end;
    justify-self: end;
`;

const StyledSearchMethod = styled.div`
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 24px;
    width: 100%;
    max-width: 120px;
    pointer-events: auto;
`;

const StyledSearchAddressInput = styled.div`
    position: relative;
    width: 100%;
    max-width: 300px;
    height: 48px;
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 24px;
    pointer-events: auto;
`;

const StyledCloseButton = styled.div`
    position: absolute;
    right: 0px;
    min-width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.colors.mainColor1};
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
    }
    cursor: pointer;
    pointer-events: auto;
`;

const StyledEmptyButton = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-12px);
    right: 54px;
    pointer-events: auto;
    cursor: pointer;
    border: none;
    transition: all 0.1s ease-in;
    svg {
        width: 24px;
        height: 24px;
        color: ${props => props.theme.colors.mainColor1};
        &:hover {
            transform: scale(1.05);
            color: ${props => props.theme.colors.mainColor2};
        }
    };
    @media only screen and (max-width: 400px) {
        top: 52px;
    }
`;

export const Search = ({isOpen}) => {

    const search = useAppSelector((state) => state.search);

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
    }


    return (
        <StyledSearchContainer
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={variants}
            transition={{
                duration: 0.3,
                type: "tween"
            }}
        >
            <StyledSearchMethod>
                <StyledSelectInput
                    options={searchTypes}
                    value={search.selected}
                    onChange={(event) => {
                        searchTypeOnChange(event.target.value);
                    }}
                    className="search search-type"
                />
            </StyledSearchMethod>
            <StyledSearchAddressInput>
                {
                    search.selected === 'vkm' &&
                    <VKMSearch
                        visible={search.selected === 'vkm'}
                        search={search}
                        store={store}
                        vectorLayerId={vectorLayerId}
                        onEnterHandler={onClickHandler}
                    />
                }
                {
                    search.selected === 'address' &&
                    <AddressSearch
                        visible={search.selected === 'address'}
                        search={search}
                        store={store}
                        markerId={markerId} onEnterHandler={onClickHandler}
                    />
                }
                {
                    search.searching !== true &&
                    <StyledEmptyButton
                        onClick={() => {
                            searchTypeOnChange(search.selected);
                        }}
                        selectedSearch={search.selected}
                    >
                            <FontAwesomeIcon
                                icon={faTrash}
                            />
                    </StyledEmptyButton>
                }
                {
                    search.searching && <CenterSpinner/>
                }
            </StyledSearchAddressInput>
                {
                    (search.selected === 'address' && search.formData.address === null) || (search.selected === 'vkm' && search.formData.vkm.tie === null)
                    ?
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
                :
                    <StyledCloseButton
                        onClick={onClickHandler}
                    >
                            <FontAwesomeIcon
                                icon={faSearch}
                            />
                    </StyledCloseButton>
                }
            </StyledSearchContainer>
        );

 }

 export default Search;
