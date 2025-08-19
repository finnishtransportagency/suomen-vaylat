import AddRessSearchResultPanel from './address-search/AddRessSearchResultPanel';
import MetaSearchResultPanel from './metadata-search/MetadataSearchResultPanel';
import FeatureSearchResultPanel from './feature-search/FeatureSearchResultPanel';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { isMobile } from '../../theme/theme';

const SearchPanelMain = styled.div`
  width: 100%;
  margin-bottom: 1em;
  overflow: auto;
`;

const StyledSearchResultsTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.black};
  margin: 1em 0;
`;


const SearchResultPanel = ({
  isSearchOpen,
  searchResults,
  searchType,
  firstSearchResultShown,
  setFirstSearchResultShown,
  setSearchClickedRow,
  searchClickedRow,
  allLayers,
  handleFeatureSearch,
  lastSearchValue
}) => {
  const { featureSearchResults } = useAppSelector((state) => state.rpc);
  return (
    <SearchPanelMain>
      {(searchResults !== null || featureSearchResults.length > 0) && (
        <>
          <StyledSearchResultsTitle>{'Hakutulokset'}</StyledSearchResultsTitle>
        </>
      )}
      {isSearchOpen && searchResults !== null && searchType === 'address' && (
        <AddRessSearchResultPanel
          searchResults={searchResults}
          firstSearchResultShown={firstSearchResultShown}
          setFirstSearchResultShown={setFirstSearchResultShown}
          isMobile={isMobile}
          setSearchClickedRow={setSearchClickedRow}
          searchClickedRow={searchClickedRow}
        />
      )}
      {isSearchOpen && searchResults !== null && searchType === 'metadata' && (
        <MetaSearchResultPanel
          searchResults={searchResults}
          allLayers={allLayers}
        />
      )}
      {isSearchOpen && searchType === 'feature' && (
        <FeatureSearchResultPanel
          handleFeatureSearch={handleFeatureSearch}
          lastSearchValue={lastSearchValue}
        />
      )}
    </SearchPanelMain>
  );
};

export default SearchResultPanel;
