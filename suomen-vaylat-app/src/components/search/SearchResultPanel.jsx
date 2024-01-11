import AddRessSearchResultPanel from './AddRessSearchResultPanel';
import MetaSearchResultPanel from './MetaSearchResultPane';
import styled, { css } from 'styled-components';
import {
    faAngleDown,
    faAngleUp
} from '@fortawesome/free-solid-svg-icons';
import { StyledHideSearchResultsButton } from './Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
                showSearchResults &&
                searchType === 'metadata' && (
                <MetaSearchResultPanel 
                    searchResults={searchResults}
                    dropdownVariants={dropdownVariants}
                    setShowSearchResults={setShowSearchResults}
                    allLayers={allLayers}
                />
                )
        )}
        { searchResults !== null && 
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