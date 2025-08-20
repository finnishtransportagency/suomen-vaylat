import styled from 'styled-components';
import strings from '../../translations';
import { useAppSelector } from '../../state/hooks';
import { useContext, useEffect, useState } from 'react';
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  validateFeatureSearch,
  validateSimpleSearch,
  validateTrackSearch
} from './utils/SearchUtil';
import { ReactReduxContext } from 'react-redux';
import DefaultSearchInput from './search-input-types/DefaultSearchInput';
import RoadSearchInput from './search-input-types/RoadSearchInput';
import TrackSearchInput from './search-input-types/TrackSearchInput';
import FeatureSearchInput from './search-input-types/FeatureSearchInput';
import { setSearchValue } from '../../state/slices/rpcSlice';

const StyledRowWithButton = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  flex-wrap: nowrap;

  @media (max-width: 680px) {
    /* stack on very small screens to avoid overflow */
    flex-direction: column;
    gap: 8px;
  }
`;

const StyledInputsContainer = styled.div`
  flex: 1 1 0;
  min-width: 0; /* ensure proper shrinking inside flex */
  display: flex;
  align-items: center; /* vertically center the input row so the button aligns middle */
`;

const StyledStandardSearchButton = styled.button`
  background: none;
  font-size: 1.2em;
  border: none;
  color: ${(p) => p.theme.colors.mainColor1};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 0 0 0.5em;

  &:hover {
    svg {
      opacity: 0.95;
    }
    opacity: 0.95;
  }
  visibility: ${(p) => (p.roadEndEnabled ? 'hidden' : 'visible')};
`;

const StyledRelativeInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PillInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  min-width: 64px;
  max-width: 130px;
  height: 42px;
  border: 1.5px solid #ccc;
  border-radius: 20px;
  padding: 1em;
  text-align: center;
  outline: none;
  transition: border-color 0.17s;
  background: #fff;
  margin-bottom: 0;
  flex: 1 1 0px;
  @media (max-width: 750px) {
    font-size: 17px;
    height: 36px;
    min-width: 54px;
    max-width: 100%;
  }
  &.error {
    border-color: ${(props) =>
      props.theme.colors.secondaryColorDarkOrange || '#c55'};
  }
  &:focus {
    border-color: #888;
  }
  &:disabled {
    color: #aaa;
    background: #f7f8f8;
  }
`;

const StyledWideInputGroup = styled.div`
  width: 100%;
`;

const StyledWidePillInput = styled(PillInput)`
  width: 100%;
  min-width: 150px;
  max-width: 600px;
  text-align: left;
  padding-right: 44px; /* room for clear button */
`;

const StyledSearchSection = styled.div`
  width: 100%;
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StyledValidationMessage = styled.div`
  color: ${(props) => props.theme.colors.secondaryColorDarkOrange || '#c55'};
  margin-top: 8px;
  font-size: 0.95em;
`;

const parseTrackSearchQuery = (searchQuery) => {
  return searchQuery.endsWith('/') ? searchQuery.slice(0, -1) : searchQuery;
};

const SearchInput = ({
  searchType,
  handleSeach,
  carriageWaySearch,
  setCarriageWaySearch,
  emptySearchResults,
  lastSearchValue,
  isSearching,
}) => {
  const { store } = useContext(ReactReduxContext);

  const {
    featureSearchResults,
    trackErrors,
    searchResults,
    searchValue
  } = useAppSelector((state) => state.rpc);
  const { activeSwitch } = useAppSelector((state) => state.ui);


  // simpleError used for non-track / non-road / non-feature basic validations
  const [simpleError, setSimpleError] = useState('');

  const onClickSearchDefault = (value) => {
    handleSeach(value);
  };
  const onClickSearchRoad = () => {
    handleSeach(searchValue);
  };
  const onClickSearchTrack = () => {
    // require full presence + format for submit
    if (validateTrackSearch(searchValue, store, true)) {
      handleSeach(parseTrackSearchQuery(searchValue));
    }
  };
  const onClickSearchFeature = () => {
    if (validateFeatureSearch(searchValue, store, true)) {
      handleSeach(searchValue.trim());
    }
  };

  useEffect(() => {
    if (activeSwitch === 'track') {
      validateTrackSearch(searchValue, store, false);
      setSimpleError(''); // clear simple error when on track
      return;
    }
    if (activeSwitch === 'feature') {
      validateFeatureSearch(searchValue, store, false);
      setSimpleError(''); // clear simple error when on track
      return;
    }
    // For other types: run simple character-only validation live (no requirement)
    if (['road'].includes(activeSwitch)) {
      // we don't validate feature/road here
      setSimpleError('');
      return;
    }
    // simple live validation for other types
    const msg = validateSimpleSearch(searchValue, false);
    setSimpleError(msg);
  }, [activeSwitch, searchValue, store]);

  const trackErrorsId = 'search-input-track-errors';

  // helpers to read  trackErrors
  const getTrackField = (index) => {
    if (!trackErrors) return { invalid: false, message: '' };
    if (
      trackErrors[index] &&
      trackErrors[index].invalid &&
      trackErrors[index].message.length > 0
    ) {
      return trackErrors[index];
    }
    return { invalid: false, message: '' };
  };

  const getCombinedFieldMessage = (index) => {
    const field = getTrackField(index);
    if (!field || !field.invalid) return '';
    return field.message;
  };

  // Build an array of messages for all fields (displayed together under the inputs)
  const combinedFieldMessages = [0, 1, 2]
    .map((i) => getCombinedFieldMessage(i))
    .filter(Boolean);

  // Submit handler that routes validation by activeSwitch
  const submitForActiveSwitch = () => {
    // Track: handled separately
    if (activeSwitch === 'track') {
      onClickSearchTrack();
      return;
    }
    // Feature and road excluded from these simple validations:
    if (activeSwitch === 'feature') {
      onClickSearchFeature();
      return;
    }
    if (activeSwitch === 'road') {
      onClickSearchRoad();
      return;
    }

    // For other types: require non-empty and allowed characters
    const msg = validateSimpleSearch(searchValue, true);
    if (msg) {
      setSimpleError(msg);
      return;
    }
    setSimpleError('');
    // For 'default' and most others we can just pass trimmed value
    onClickSearchDefault(searchValue.trim());
  };

  return (
    <>
      {activeSwitch === 'default' && (
        <DefaultSearchInput
        handleSeach={handleSeach}
        emptySearchResults={emptySearchResults}
        lastSearchValue={lastSearchValue}
        isSearching={isSearching}
        />
      )}

      {activeSwitch === 'road' && (
        <RoadSearchInput
        searchType={searchType}
        handleSeach={handleSeach}
        carriageWaySearch={carriageWaySearch}
        setCarriageWaySearch={setCarriageWaySearch}
        emptySearchResults={emptySearchResults}
        lastSearchValue={lastSearchValue}
        isSearching={isSearching}
        />
      )}

      {activeSwitch === 'track' && (
        <TrackSearchInput
          handleSeach={handleSeach}
          emptySearchResults={emptySearchResults}
          lastSearchValue={lastSearchValue}
          isSearching={isSearching}
        />
      )}

      {activeSwitch === 'feature' && (
        <FeatureSearchInput
        handleSeach={handleSeach}
        emptySearchResults={emptySearchResults}
        lastSearchValue={lastSearchValue}
        isSearching={isSearching}
        />
      )}

      {['address', 'nomenclature', 'premise', 'layer'].includes(
        activeSwitch
      ) && (
        <StyledSearchSection>
          <StyledRowWithButton>
            <StyledInputsContainer>
              <StyledWideInputGroup>
                <StyledRelativeInputWrapper>
                  <StyledWidePillInput
                    id={`search-input-${activeSwitch}`}
                    aria-label={
                      strings.search[activeSwitch]?.title ||
                      `${activeSwitch} search`
                    }
                    type="text"
                    value={searchValue}
                    onChange={(e) => {
                      store.dispatch(setSearchValue(e.target.value));
                      // live validation handled in useEffect
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') submitForActiveSwitch();
                    }}
                  />
                </StyledRelativeInputWrapper>
              </StyledWideInputGroup>
            </StyledInputsContainer>

            {(searchResults !== null || featureSearchResults.length > 0) &&
            searchValue === lastSearchValue &&
            !isSearching ? (
              <StyledStandardSearchButton
                type="button"
                aria-label="Search"
                onClick={() => {
                  emptySearchResults();
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </StyledStandardSearchButton>
            ) : (
              !isSearching && (
                <StyledStandardSearchButton
                  type="button"
                  aria-label="Search"
                  onClick={submitForActiveSwitch}
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </StyledStandardSearchButton>
              )
            )}
          </StyledRowWithButton>

          {simpleError && (
            <StyledValidationMessage role="alert" aria-live="polite">
              {simpleError}
            </StyledValidationMessage>
          )}
        </StyledSearchSection>
      )}
    </>
  );
};

export default SearchInput;
