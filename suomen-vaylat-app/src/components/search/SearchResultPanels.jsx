import AddressSearchResultPanel from './result-panels/AddressSearchResultPanel';
import MetadataSearchResultPanel from './result-panels/MetadataSearchResultPanel';
import FeatureSearchResultPanel from './result-panels/FeatureSearchResultPanel';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { isMobile } from '../../theme/theme';
import strings from '../../translations';

const SearchPanelMain = styled.div`
  width: 100%;
  margin-bottom: 1em;
  overflow: auto;
  @media ${(props) => props.theme.device.mobileL} {
    overflow: visible;
  }
`;

const StyledSearchResultsTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.black};
  margin: 1em 0;
`;

const SearchResultPanels = ({ setSearchClickedRow, searchClickedRow }) => {
  const { featureSearchResults, searchResults, searchType } = useAppSelector(
    (state) => state.rpc
  );
  const { isSearchOpen } = useAppSelector((state) => state.ui);

  return (
    <SearchPanelMain id={"searc-result-panels-main"}>
      {(searchResults !== null || featureSearchResults.length > 0) && (
        <>
          <StyledSearchResultsTitle id={"searc-result-panels-title"}>{strings.search?.results}</StyledSearchResultsTitle>
        </>
      )}
      {isSearchOpen && searchResults !== null && searchType === 'address' && (
        <AddressSearchResultPanel
          isMobile={isMobile}
          setSearchClickedRow={setSearchClickedRow}
          searchClickedRow={searchClickedRow}
        />
      )}
      {isSearchOpen && searchResults !== null && searchType === 'metadata' && (
        <MetadataSearchResultPanel />
      )}
      {isSearchOpen && searchType === 'feature' && <FeatureSearchResultPanel />}
    </SearchPanelMain>
  );
};

export default SearchResultPanels;
