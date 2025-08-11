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
  color: ${(props) => props.theme.colors.black};
  margin: 1em 0;
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

const HorizontalLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: #d7d9db;
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

        { (searchResults !== null || featureSearchResults.length > 0) && 
        <>
              <HorizontalLine/>
        <StyledSearchResultsTitle>
                {"Hakutulokset"}
        </StyledSearchResultsTitle>
        </>
        }
        { 
            isSearchOpen &&
            searchResults !== null &&
            searchType === 'address' &&
            <AddRessSearchResultPanel  
                searchResults={searchResults}  
                firstSearchResultShown={firstSearchResultShown}
                setFirstSearchResultShown={setFirstSearchResultShown}
                isMobile={isMobile}
                setSearchClickedRow={setSearchClickedRow}
                searchClickedRow={searchClickedRow}
            /> 
        }
        {
                isSearchOpen &&
                searchResults !== null &&
                searchType === 'metadata' && (
                <MetaSearchResultPanel 
                    searchResults={searchResults}
                    allLayers={allLayers}
                />
                )
        }
        {
                isSearchOpen &&
                searchType === 'feature' && (
                <FeatureSearchResultPanel 
                    handleFeatureSearch={handleFeatureSearch}
                    lastSearchValue={lastSearchValue}
                />
                )
        }
        </SearchPanelMain>
    );
};

export default SearchResultPanel;