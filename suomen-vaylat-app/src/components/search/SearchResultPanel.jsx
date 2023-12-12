import AddRessSearchResultPanel from './AddRessSearchResultPanel';
import MetaSearchResultPanel from './MetaSearchResultPane';
import styled, { css } from 'styled-components';

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
    dropdownVariants,
    firstSearchResultShown,
    handleSearchSelect,
    setFirstSearchResultShown,
    isMobile,
    setShowSearchResults,
    setSearchClickedRow,
    searchClickedRow,
    allLayers,
    showOnlyType='all',
    hidden=false
}) => {
    return (
        <SearchPanelMain hidden={hidden}>
        { 
            isSearchOpen &&
            searchResults !== null &&
            showSearchResults &&
            searchType === 'address' ? 
            <AddRessSearchResultPanel  
                searchResults={searchResults}  
                dropdownVariants={dropdownVariants} 
                firstSearchResultShown={firstSearchResultShown}
                handleSearchSelect={handleSearchSelect}
                setFirstSearchResultShown={setFirstSearchResultShown}
                isMobile={isMobile}
                setShowSearchResults={setShowSearchResults}
                setSearchClickedRow={setSearchClickedRow}
                searchClickedRow={searchClickedRow}
                showOnlyType={showOnlyType}
            />  : (
                isSearchOpen &&
                searchResults !== null &&
                searchType === 'metadata' && (
                <MetaSearchResultPanel 
                    searchResults={searchResults}
                    dropdownVariants={dropdownVariants}
                    setShowSearchResults={setShowSearchResults}
                    allLayers={allLayers}
                />
                )
        )}
        </SearchPanelMain>
    );
};

export default SearchResultPanel;