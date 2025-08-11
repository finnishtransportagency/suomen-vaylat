import styled from 'styled-components';
import strings from '../../translations';
import { ReactReduxContext } from 'react-redux';
import { setActiveSwitch } from '../../state/slices/uiSlice';
import { useAppSelector } from '../../state/hooks';
import { useEffect, useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SearchSwitch from './utils/SearchSwitch';
import { faLongArrowDown } from '@fortawesome/free-solid-svg-icons';
import SearchResultPanel from './SearchResultPanel';
import { resetFeatureSearchResults } from '../../state/slices/rpcSlice';
import { removeMarkersAndFeatures } from './utils/SearchUtil';
import { isMobile } from '../../theme/theme';
import SearchInput from './SearchInput';

const StyledSearchDialog = styled.div`
  border: none;
  width: 100%;
  padding-left: 28px;
  &:focus {
    outline: none;
  }
  position: absolute;
  top: 24px;
  right: 24px;
  background-color: white;
  border-radius: 5px;
  box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 6px 6px;
  padding-top: 10px;
  font-size: 15px;
  font-weight: 400;
  padding-top: 30px;
  max-height: ${(props) =>
    props.isMobile
      ? window.innerHeight - 50 + 'px'
      : window.innerHeight - 200 + 'px'};
  padding-bottom: 16px;
  overflow: auto;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 5px;
  border-radius: 15px;
  border-color: #a0a0a0;
  margin: 8px 0;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
  &.error {
    border-color: ${(props) => props.theme.colors.secondaryColorDarkOrange};
  }
`;
const StyledInputHalf = styled.input`
  width: 49%;
  font-size: 16px;
  border-radius: 15px;
  border-color: #a0a0a0;
  margin-top: 3px;
  margin-bottom: 3px;
  padding: 5px;
  :last-of-type {
    margin-left: 2%;
  }
  &:focus {
    border-color: #007bff;
    outline: none;
  }
  &.error {
    border-color: ${(props) => props.theme.colors.secondaryColorDarkOrange};
  }
`;

const StyledFeatureSearchSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-bottom: 1em;
`;

const StyledSearchSection = styled.div`
  width: 90%;
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
`;

const StyledRoadStart = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const StyledRoadEnd = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledTrackWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTrackInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const StyledCheckbox = styled.input`
  float: right;
  width: 16px;
  height: 16px;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CheckboxLabel = styled.label`
  font-size: 16px;
  margin-left: 8px;
  color: ${(props) => props.theme.colors.darkGrey};
`;
const StyledValidationMessage = styled.div`
  color: ${(props) => props.theme.colors.secondaryColorDarkOrange};
`;

const StyledSelectedLayerWrapper = styled.div`
    display: flex;
    align-items: baseline;
    margin-left: 0.5em;
    margin-bottom: 4px
    overflow: hidden;
    white-space: nowrap;
`;
const StyledSelectedLayerTitle = styled.div`
  color: ${(props) => props.theme.colors.mainColor1};
  font-size: 16px;
  font-weight: 500;
`;
const StyledSelectedLayerText = styled.div`
  font-size: 15px;
  font-weight: 400;
  margin-left: 0.5em;
  margin-right: 0.5em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    white-space: normal;
  }
`;
const StyledNoActivaLayers = styled.div`
  color: ${(props) => props.theme.colors.secondaryColorDarkOrange};
  font-size: 16px;
  font-weight: 500;
`;

const getSearchValuePart = (
  searchValue,
  searchType,
  part,
  carriageWaySearch
) => {
  const splittedSearchArray = splitSearchValue(searchValue, searchType, part);
  let retVa;
  let actualPart;
  //actual value tells from which cell value is fetched
  //differenct cell of value array choosed if ajorata search not enabled
  if (carriageWaySearch === true) {
    if (splittedSearchArray && part > splittedSearchArray.length) {
      return '';
    } else {
      actualPart = part;
    }
  } else {
    //no ajorata part on etäisyys search
    if (part === 2 || part === 6) {
      return '';
    } else if (part > 6) {
      actualPart = part - 2;
    } else if (part >= 3) {
      actualPart = part - 1;
    } else {
      actualPart = part;
    }
  }
  if (
    splittedSearchArray !== undefined &&
    splittedSearchArray.length - 1 >= actualPart &&
    typeof splittedSearchArray[actualPart] !== 'undefined'
  ) {
    retVa = splittedSearchArray[actualPart];
  }
  //first value set whole searchvalue
  else if (part === 0) {
    retVa = searchValue;
  } else {
    retVa = '';
  }
  return retVa;
};

/**
 * Split search value string to single values
 * @param {*} searchValue search query string
 * @param {*} searchType type
 * @returns array containing search values
 */
const splitSearchValue = (searchValue, searchType) => {
  let roadParts;
  if (
    searchValue !== '' &&
    searchType !== undefined &&
    searchType === 'address' &&
    searchValue.includes('/')
  ) {
    //if roadsearch contains space, ingnore and handle on search field, range search case
    if (searchValue.includes(' ')) {
      const partsArray = searchValue.split(' ');
      const part1 = partsArray[0].split('/').filter((val) => val !== '');
      const part2 = partsArray[1].split('/').filter((val) => val !== '');
      roadParts = part1.concat(part2);
    } else {
      roadParts = searchValue.split('/');
    }
  }
  return roadParts;
};

/**
 * update searchValue attribute
 * @param {*} searchValue whole search query
 * @param {*} searchType
 * @param {*} part part of roadsearch to update 0=tie, 1=osa, 2= ajorata, 3= etäisyys
 * @param {*} value value to add
 */
const updateRoadSearchValue = (
  searchValue,
  searchType,
  setSearchValue,
  part,
  value,
  carriageWaySearch = false
) => {
  //const oldPart = getSearchValuePart(searchValue, searchType, part);
  let searchArray = splitSearchValue(searchValue, searchType);
  const effectivePart = carriageWaySearch ? part : part - 1;
  if (
    searchArray !== undefined &&
    searchArray !== '' &&
    searchArray.length >= effectivePart
  ) {
    //replace existing value
    //empty value in the middle remove values on right side
    if (value === '') {
      searchArray.length = part;
    }
    const blancSpacePosition = carriageWaySearch ? 4 : 3;
    if (part > blancSpacePosition) {
      searchArray[effectivePart] = value;
    } else {
      searchArray[part] = value;
    }
    //range search add empty space between parts
    const updatedSearchValue = parseSearchValueFromParts(
      searchArray,
      blancSpacePosition
    );
    if (updatedSearchValue !== undefined) {
      setSearchValue(updatedSearchValue);
    }
  } else if (
    (searchArray === undefined || searchArray === '') &&
    value !== undefined &&
    part === 0
  ) {
    //first part
    setSearchValue(value);
  } else if (
    (searchArray === undefined || searchArray === '') &&
    searchValue !== undefined &&
    part === 1
  ) {
    //add second part to search
    setSearchValue(searchValue + '/' + value);
  } else if (
    searchArray !== undefined &&
    searchArray !== '' &&
    searchArray.length === part - 1
  ) {
    //any bigger new part than 0 or 1
    setSearchValue(searchValue + '/' + value);
  }
};

/**
 * Parse value from value array
 * @param {*} partsArray array containing searchvalues
 * @param {*} blancSpacePosition position of space 3|4
 * @returns string searchvalue string on oskari vkm api undertandable format
 */
const parseSearchValueFromParts = (partsArray, blancSpacePosition) => {
  let newSearchValue;
  //if range search (more than blancSpacePosition params) add space between
  if (partsArray !== undefined && partsArray.length > blancSpacePosition - 1) {
    let firstPart = partsArray.slice(0, blancSpacePosition).join('/');
    let secondi = partsArray.slice(blancSpacePosition).join('/');
    newSearchValue = [firstPart, ' ', secondi].join('');
  } else {
    newSearchValue = partsArray.join('/');
  }
  return newSearchValue.endsWith('/')
    ? newSearchValue.slice(0, -1)
    : newSearchValue;
};

const getTrackSearchValuePart = (position, searchValue) => {
  if (!searchValue) return '';
  const searchArray = searchValue.split('/');
  return searchArray[position] || '';
};

const updateTrackSearchValue = (
  newValue,
  position,
  searchValue,
  setSearchValue,
  trackErrors,
  setTrackErrors
) => {
  // Update errors
  const newErrors = [...(trackErrors ?? [])];
  newErrors[position] = newValue === '';
  setTrackErrors(newErrors);
  // Modify the search value
  let searchArray = searchValue ? searchValue.split('/') : ['', '', ''];
  searchArray[position] = newValue;
  // Join the parts back into a single string
  const newSearchValue = searchArray.join('/');
  setSearchValue(
    newSearchValue.endsWith('/') ? newSearchValue.slice(0, -1) : newSearchValue
  );
};

const parseTrackSearchQuery = (searchQuery) => {
  return searchQuery.endsWith('/') ? searchQuery.slice(0, -1) : searchQuery;
};

const SearchDialog = ({
  searchValue,
  setSearchValue,
  searchResults,
  setSearchResults,
  firstSearchResultShown,
  setFirstSearchResultShown,
  setShowSearchResults,
  setSearchClickedRow,
  searchClickedRow,
  allLayers,
  isSearchOpen,
  showSearchResults,
  searchType,
  setSearchType,
  handleSeach,
  carriageWaySearch,
  setCarriageWaySearch,
  trackErrors,
  setTrackErrors,
  validateTrackSearch,
  featureErrors,
  handleFeatureSearch,
  lastSearchValue
}) => {
  const { store } = useContext(ReactReduxContext);
  const { selectedLayersByType, channel } = useAppSelector(
    (state) => state.rpc
  );
  const { activeSwitch } = useAppSelector((state) => state.ui);
  const [roadEndEnabled, setRoadEndEnabled] = useState(false);

  const updateActiveSwitch = (type) => {
    // if no specific search is selected, default to address
    if (activeSwitch !== type) {
      store.dispatch(setActiveSwitch(type));
      if (type === 'layer') setSearchType('metadata');
      else if (type === 'feature') setSearchType('feature');
      else setSearchType('address');
    } else {
      store.dispatch(setActiveSwitch(null));
      setSearchType('address');
    }
    setSearchResults(null);
    setShowSearchResults(false);
    setSearchValue('');
    store.dispatch(resetFeatureSearchResults());
    removeMarkersAndFeatures(channel);
  };

  useEffect(() => {
    //track validation every time searchValue changes
    if (activeSwitch === 'track') {
      validateTrackSearch(searchValue, setTrackErrors);
    }
    setSearchValue(searchValue);
  }, [
    activeSwitch,
    searchValue,
    setSearchValue,
    setTrackErrors,
    validateTrackSearch
  ]);

  return (
    <StyledSearchDialog>
      <SearchInput
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        firstSearchResultShown={firstSearchResultShown}
        setFirstSearchResultShown={setFirstSearchResultShown}
        setShowSearchResults={setShowSearchResults}
        setSearchClickedRow={setSearchClickedRow}
        searchClickedRow={searchClickedRow}
        allLayers={allLayers}
        isSearchOpen={isSearchOpen}
        showSearchResults={showSearchResults}
        searchType={searchType}
        setSearchType={setSearchType}
        handleSeach={handleSeach}
        carriageWaySearch={carriageWaySearch}
        setCarriageWaySearch={setCarriageWaySearch}
        removeMarkersAndFeatures={removeMarkersAndFeatures}
        trackErrors={trackErrors}
        setTrackErrors={setTrackErrors}
        validateTrackSearch={validateTrackSearch}
        featureErrors={featureErrors}
        handleFeatureSearch={handleFeatureSearch}
        lastSearchValue={lastSearchValue}
      />
      <>
        {
          <SearchSwitch
            action={() => {
              updateActiveSwitch('road');
            }}
            isSelected={activeSwitch === 'road'}
            title={strings.search.vkm.title}
            tooltipText={strings.search.tips.vkmRoadExamples}
            tooltipAddress={strings.search.tips.vkmRoad}
            id={'vkm'}
            tooltipEnabled={activeSwitch === 'road'}
            isMobile={isMobile}
          />
        }
        
        <div style={{ clear: 'both' }} />
        {
          <SearchSwitch
            isSelected={activeSwitch === 'track'}
            action={() => {
              updateActiveSwitch('track');
            }}
            title={strings.search.vkm.trackTitle}
            tooltipText={strings.search.tips.vkmTrackExamples}
            tooltipAddress={strings.search.tips.vkmTrack}
            id="track"
            tooltipEnabled={activeSwitch === 'track'}
            isMobile={isMobile}
          />
        }
        
        <div style={{ clear: 'both' }} />
        {
          <SearchSwitch
            isSelected={activeSwitch === 'address'}
            action={() => {
              updateActiveSwitch('address');
            }}
            title={strings.tooltips.searchButton}
            tooltipText={strings.search.tips.addressExamples}
            tooltipAddress={strings.search.tips.address}
            id="address"
            tooltipEnabled={activeSwitch === 'address'}
            isMobile={isMobile}
          />
        }
        <div style={{ clear: 'both' }} />
        {
          <SearchSwitch
            isSelected={activeSwitch === 'nomenclature'}
            action={() => {
              updateActiveSwitch('nomenclature');
            }}
            title={strings.search.nomenclature.title}
            tooltipText={strings.search.tips.nomenclatureExamples}
            tooltipAddress={strings.search.tips.nomenclature}
            id="nomenclature"
            tooltipEnabled={activeSwitch === 'nomenclature'}
            isMobile={isMobile}
          />
        }
        <div style={{ clear: 'both' }} />
        {
          <SearchSwitch
            isSelected={activeSwitch === 'premise'}
            action={() => {
              updateActiveSwitch('premise');
            }}
            title={strings.search.premise.title}
            tooltipText={strings.search.tips.realEstateUnitIdentifierExamples}
            tooltipAddress={strings.search.tips.realEstateUnitIdentifier}
            id="premise"
            tooltipEnabled={activeSwitch === 'premise'}
            isMobile={isMobile}
          />
        }
        
        <div style={{ clear: 'both' }} />
        {
          <SearchSwitch
            isSelected={activeSwitch === 'layer'}
            action={() => {
              updateActiveSwitch('layer');
            }}
            title={strings.search.layer.title}
            tooltipText={strings.search.tips.layerExamples}
            tooltipAddress={strings.search.tips.layer}
            id="layer"
            tooltipEnabled={activeSwitch === 'layer'}
            isMobile={isMobile}
          />
        }
        
        <div style={{ clear: 'both' }} />
        {
          <SearchSwitch
            isSelected={activeSwitch === 'feature'}
            action={() => {
              updateActiveSwitch('feature');
            }}
            title={strings.search.feature.title}
            tooltipText={strings.search.tips.featureExamples}
            tooltipAddress={strings.search.tips.feature}
            id="layer"
            tooltipEnabled={activeSwitch === 'feature'}
            isMobile={isMobile}
          />
        }
        
      </>
      <SearchResultPanel
        isSearchOpen={isSearchOpen}
        searchResults={searchResults}
        showSearchResults={showSearchResults}
        searchType={searchType}
        firstSearchResultShown={firstSearchResultShown}
        setFirstSearchResultShown={setFirstSearchResultShown}
        setShowSearchResults={setShowSearchResults}
        setSearchClickedRow={setSearchClickedRow}
        handleFeatureSearch={handleFeatureSearch}
        lastSearchValue={lastSearchValue}
        searchClickedRow={searchClickedRow}
        allLayers={allLayers}
      />
    </StyledSearchDialog>
  );
};

export default SearchDialog;
