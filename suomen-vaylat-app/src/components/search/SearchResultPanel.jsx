import styled from 'styled-components';
import strings from '../../translations';
import AddRessSearchResultPanel from './AddRessSearchResultPanel';
import MetaSearchResultPanel from './MetaSearchResultPane';

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
    showOnlyType='all'
}) => {
    return (
        <>
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
        </>
    );
};

export default SearchResultPanel;