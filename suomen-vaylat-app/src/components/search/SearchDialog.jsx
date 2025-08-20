import styled from 'styled-components';
import strings from '../../translations';
import { ReactReduxContext } from 'react-redux';
import { setActiveSwitch } from '../../state/slices/uiSlice';
import { useAppSelector } from '../../state/hooks';
import { useEffect, useContext, useState, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SearchSwitch from './utils/SearchSwitch';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import SearchResultPanel from './SearchResultPanel';
import { resetFeatureSearchResults, setSearchResults, setSearchValue } from '../../state/slices/rpcSlice';
import { removeMarkersAndFeatures } from './utils/SearchUtil';
import { isMobile } from '../../theme/theme';
import SearchInput from './SearchInput';
import SvLoader from '../../utils/components/SvLoader';

const StyledSearchDialog = styled.div`
  border: none;
  width: 100%;
  padding: 1.5em 1em 1em 1em;
  &:focus {
    outline: none;
  }
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 24px;
  right: 24px;
  background-color: white;
  border-radius: 5px;
  box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 6px 6px;
  font-size: 15px;
  font-weight: 400;
  max-height: 80vh;
  overflow: auto;
`;

const DropdownWrapper = styled.div`
  width: 100%;
  margin-bottom: 0.5em;
`;

const DropdownHeader = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: ${(props) => props.theme.colors.mainColor1};
  cursor: pointer;
  font-size: 16px;
  padding: 8px 0;
  user-select: none;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;

  &:focus {
    outline: 2px solid ${(p) => p.theme.colors.mainColor1};
    outline-offset: 2px;
  }
`;

const DropdownContent = styled.div`
  padding-left: 2px;
  padding-bottom: 8px;
  transition: all 0.3s;
  display: block;
`;

const InfoText = styled.div`
  background: #eef3fb;
  border-radius: 5px;
  padding: 10px 16px;
  margin: 6px 0 6px 34px;
  font-size: 0.97em;
  color: #234167;
`;

const StyledLoaderWrapper = styled.div`
  z-index: 999;
  height: 100%;
  max-width: 30%;
  svg {
    width: 100%;
    height: 100%;
    fill: none;
  }
`;

const HorizontalLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: #d7d9db;
`;

const switchDefinitions = [
  {
    id: 'default',
    title: strings.search.address.title,
    tooltipText: strings.search.tips.location
  },
  {
    id: 'road',
    title: strings.search.vkm.title,
    tooltipText: strings.search.tips.vkmRoadExamples,
    tooltipAddress: strings.search.tips.vkmRoad
  },
  {
    id: 'track',
    title: strings.search.vkm.trackTitle,
    tooltipText: strings.search.tips.vkmTrackExamples,
    tooltipAddress: strings.search.tips.vkmTrack
  },
  {
    id: 'address',
    title: strings.tooltips.searchButton,
    tooltipText: strings.search.tips.addressExamples,
    tooltipAddress: strings.search.tips.address
  },
  {
    id: 'nomenclature',
    title: strings.search.nomenclature.title,
    tooltipText: strings.search.tips.nomenclatureExamples,
    tooltipAddress: strings.search.tips.nomenclature
  },
  {
    id: 'premise',
    title: strings.search.premise.title,
    tooltipText: strings.search.tips.realEstateUnitIdentifierExamples,
    tooltipAddress: strings.search.tips.realEstateUnitIdentifier
  },
  {
    id: 'layer',
    title: strings.search.layer.title,
    tooltipText: strings.search.tips.layerExamples,
    tooltipAddress: strings.search.tips.layer
  },
  {
    id: 'feature',
    title: strings.search.feature.title,
    tooltipText: strings.search.tips.featureExamples,
    tooltipAddress: strings.search.tips.feature
  }
];

const SearchDialog = ({
  firstSearchResultShown,
  setFirstSearchResultShown,
  setSearchClickedRow,
  searchClickedRow,
  allLayers,
  isSearchOpen,
  isSearching,
  searchType,
  setSearchType,
  handleSeach,
  carriageWaySearch,
  setCarriageWaySearch,
  handleFeatureSearch,
  lastSearchValue,
  emptySearchResults
}) => {
  const { store } = useContext(ReactReduxContext);
  const { featureSearchResults, channel, searchResults } = useAppSelector(
    (state) => state.rpc
  );
  const { activeSwitch } = useAppSelector((state) => state.ui);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearchAndCloseDropdown = (searchValue) => {
    handleSeach(searchValue);
    setDropdownOpen(false);
  }

  // Determine the header title: if an active switch matches, show its title; otherwise fallback to "Hakuasetukset"
  const activeDef = switchDefinitions.find((sw) => sw.id === activeSwitch);
  const headerTitle = activeDef ? activeDef.title : 'Hakuasetukset';

  const updateActiveSwitch = (type) => {
    // if no specific search is selected, default to address
    if (activeSwitch !== type) {
      store.dispatch(setActiveSwitch(type));
      if (type === 'layer') setSearchType('metadata');
      else if (type === 'feature') setSearchType('feature');
      else setSearchType('address');
    } else {
      store.dispatch(setActiveSwitch('default'));
      setSearchType('address');
    }
    store.dispatch(setSearchResults(null));
    store.dispatch(setSearchValue(''));
    store.dispatch(resetFeatureSearchResults());
    removeMarkersAndFeatures(channel);
  };

  return (
    <StyledSearchDialog>
      <DropdownWrapper>
        <DropdownHeader
          onClick={() => setDropdownOpen((o) => !o)}
          aria-expanded={dropdownOpen}
          aria-controls="search-dropdown-content"
          id="search-dropdown-button"
        >
          <span>{headerTitle}</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            rotation={dropdownOpen ? 180 : undefined}
          />
        </DropdownHeader>
        {dropdownOpen &&
            <DropdownContent id="search-dropdown-content" aria-labelledby="search-dropdown-button">
            {switchDefinitions.map((sw, index) => (
                <Fragment key={sw.id}>
                <SearchSwitch
                    isSelected={activeSwitch === sw.id}
                    action={() => updateActiveSwitch(sw.id)}
                    title={sw.title}
                    tooltipText={sw.tooltipText}
                    tooltipAddress={sw.tooltipAddress}
                    id={sw.id}
                    isMobile={isMobile}
                />
                </Fragment>
            ))}
            </DropdownContent>
        }
      </DropdownWrapper>

      <SearchInput
        firstSearchResultShown={firstSearchResultShown}
        setFirstSearchResultShown={setFirstSearchResultShown}
        setSearchClickedRow={setSearchClickedRow}
        searchClickedRow={searchClickedRow}
        allLayers={allLayers}
        isSearchOpen={isSearchOpen}
        searchType={searchType}
        setSearchType={setSearchType}
        handleSeach={handleSearchAndCloseDropdown}
        carriageWaySearch={carriageWaySearch}
        setCarriageWaySearch={setCarriageWaySearch}
        removeMarkersAndFeatures={removeMarkersAndFeatures}
        handleFeatureSearch={handleFeatureSearch}
        lastSearchValue={lastSearchValue}
        emptySearchResults={emptySearchResults}
        isSearching={isSearching}
      />

      {isSearching && (
        <>
          <HorizontalLine />
          <StyledLoaderWrapper>
            <SvLoader />
          </StyledLoaderWrapper>
        </>
      )}

      {(searchResults !== null || featureSearchResults.length > 0) &&
        !isSearching && (
          <>
            <HorizontalLine />
            <SearchResultPanel
              isSearchOpen={isSearchOpen}
              isSearching={isSearching}
              searchType={searchType}
              firstSearchResultShown={firstSearchResultShown}
              setFirstSearchResultShown={setFirstSearchResultShown}
              setSearchClickedRow={setSearchClickedRow}
              handleFeatureSearch={handleFeatureSearch}
              lastSearchValue={lastSearchValue}
              searchClickedRow={searchClickedRow}
              allLayers={allLayers}
            />
          </>
        )}
    </StyledSearchDialog>
  );
};

export default SearchDialog;
