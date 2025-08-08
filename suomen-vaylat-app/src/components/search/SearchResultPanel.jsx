import AddRessSearchResultPanel from './address-search/AddRessSearchResultPanel';
import MetaSearchResultPanel from './metadata-search/MetadataSearchResultPanel';
import FeatureSearchResultPanel from './feature-search/FeatureSearchResultPanel';
import styled, { css } from 'styled-components';
import {
    faAngleDown,
    faAngleUp
} from '@fortawesome/free-solid-svg-icons';
import { StyledHideSearchResultsButton } from './Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../state/hooks';
import { isMobile } from '../../theme/theme';

const SearchPanelMain = styled.div`
  ${props =>
    props.hidden &&
    css`
      display: none;
    `}
`;

const SearchResultPanel = ({
    isSearchOpen,
    searchResults,
    showSearchResults,
    searchType,
    firstSearchResultShown,
    setFirstSearchResultShown,
    setShowSearchResults,
    setSearchClickedRow,
    searchClickedRow,
    allLayers,
    hidden=false,
    handleFeatureSearch,
    lastSearchValue
}) => {
    const { featureSearchResults } = useAppSelector((state) => state.rpc);
    console.log(searchType)
    return (
        <SearchPanelMain hidden={hidden}>
        { 
            isSearchOpen &&
            searchResults !== null &&
            showSearchResults &&
            searchType === 'address' &&
            <AddRessSearchResultPanel  
                searchResults={searchResults}  
                firstSearchResultShown={firstSearchResultShown}
                setFirstSearchResultShown={setFirstSearchResultShown}
                isMobile={isMobile}
                setShowSearchResults={setShowSearchResults}
                setSearchClickedRow={setSearchClickedRow}
                searchClickedRow={searchClickedRow}
            /> 
        }
        {
                isSearchOpen &&
                searchResults !== null &&
                showSearchResults &&
                searchType === 'metadata' && (
                <MetaSearchResultPanel 
                    searchResults={searchResults}
                    setShowSearchResults={setShowSearchResults}
                    allLayers={allLayers}
                />
                )
        }
        {
                isSearchOpen &&
                showSearchResults &&
                searchType === 'feature' && (
                <FeatureSearchResultPanel 
                    setShowSearchResults={setShowSearchResults}
                    handleFeatureSearch={handleFeatureSearch}
                    lastSearchValue={lastSearchValue}
                />
                )
        }
        { (searchResults !== null || featureSearchResults.length > 0) && 
            <StyledHideSearchResultsButton
                onClick={() => setShowSearchResults(!showSearchResults)}
            >
                <FontAwesomeIcon icon={showSearchResults ? faAngleUp : faAngleDown} />
            </StyledHideSearchResultsButton>
        }
        </SearchPanelMain>
    );
};

export default SearchResultPanel;