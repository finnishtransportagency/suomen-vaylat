import AddRessSearchResultPanel from './result-panels/AddRessSearchResultPanel';
import MetadataSearchResultPanel from './result-panels/MetadataSearchResultPanel';
import FeatureSearchResultPanel from './result-panels/FeatureSearchResultPanel';
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
  searchType,
  firstSearchResultShown,
  setFirstSearchResultShown,
  setSearchClickedRow,
  searchClickedRow,
  allLayers,
  handleFeatureSearch,
  lastSearchValue
}) => {
  const { featureSearchResults, searchResults } = useAppSelector((state) => state.rpc);
  return (
    <SearchPanelMain>
      {(searchResults !== null || featureSearchResults.length > 0) && (
        <>
          <StyledSearchResultsTitle>{'Hakutulokset'}</StyledSearchResultsTitle>
        </>
      )}
      {isSearchOpen && searchResults !== null && searchType === 'address' && (
        <AddRessSearchResultPanel
          firstSearchResultShown={firstSearchResultShown}
          setFirstSearchResultShown={setFirstSearchResultShown}
          isMobile={isMobile}
          setSearchClickedRow={setSearchClickedRow}
          searchClickedRow={searchClickedRow}
        />
      )}
      {isSearchOpen && searchResults !== null && searchType === 'metadata' && (
        <MetadataSearchResultPanel
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
