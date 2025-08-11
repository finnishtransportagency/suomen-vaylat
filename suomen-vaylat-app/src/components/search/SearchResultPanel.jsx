import AddRessSearchResultPanel from './address-search/AddRessSearchResultPanel';
import MetaSearchResultPanel from './metadata-search/MetadataSearchResultPanel';
import FeatureSearchResultPanel from './feature-search/FeatureSearchResultPanel';
import styled, { css } from 'styled-components';
import {
    faAngleDown,
    faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { StyledHideSearchResultsButton } from './Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../state/hooks';
import { isMobile } from '../../theme/theme';

const SearchPanelMain = styled.div`

  width: 100%;
  margin-bottom: 1em;
`;

const StyledSearchResultsTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.mainColor1};
`;

const StyledSearchResultsTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: ${(props) => props.theme.colors.mainColor1};
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 12px;
  padding: 8px 0;
  user-select: none;
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
    handleFeatureSearch,
    lastSearchValue
}) => {
    const { featureSearchResults } = useAppSelector((state) => state.rpc);
    return (
        <SearchPanelMain>

        { (searchResults !== null || featureSearchResults.length > 0) && 
        <StyledSearchResultsTitleWrapper
                onClick={() => setShowSearchResults(!showSearchResults)}>
            <span>
                {"Hakutulokset"}
            </span>
          <FontAwesomeIcon
            icon={faChevronDown}
            rotation={showSearchResults ? 180 : undefined}
          />
        </StyledSearchResultsTitleWrapper>
        }
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
        </SearchPanelMain>
    );
};

export default SearchResultPanel;