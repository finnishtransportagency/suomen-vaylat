import styled from 'styled-components';
import strings from '../../translations';
import { useAppSelector } from '../../state/hooks';
import { useContext, useEffect, useState } from 'react';
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  removeMarkersAndFeatures,
  validateFeatureSearch,
  validateSimpleSearch,
  validateTrackSearch
} from './utils/SearchUtil';
import { ReactReduxContext } from 'react-redux';
import DefaultSearchInput from './search-input-types/DefaultSearchInput';
import RoadSearchInput from './search-input-types/RoadSearchInput';
import TrackSearchInput from './search-input-types/TrackSearchInput';
import FeatureSearchInput from './search-input-types/FeatureSearchInput';
import { searchVKMTrack, setFirstSearchResultShown, setIsSearchingActive, setLastSearchValue, setSearchResults, setSearchValue } from '../../state/slices/rpcSlice';
import { setGeoJsonArray, setIsMoreSearchOpen } from '../../state/slices/uiSlice';

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

const SearchInputs = ({
  setDropdownOpen,
  emptySearchResults,
}) => {
  const { store } = useContext(ReactReduxContext);
  const [carriageWaySearch, setCarriageWaySearch] = useState(false);

  const { featureSearchResults, searchResults, searchValue, isSearchingActive, channel, isMoreSearchOpen, lastSearchValue } =
    useAppSelector((state) => state.rpc);
  const { activeSwitch } = useAppSelector((state) => state.ui);

  // simpleError used for non-track / non-road / non-feature basic validations
  const [simpleError, setSimpleError] = useState('');

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
    if (activeSwitch === 'road') {
      // we don't validate feature/road here
      setSimpleError('');
      return;
    }
    // simple live validation for other types
    const msg = validateSimpleSearch(searchValue, false);
    console.log(msg)
    setSimpleError(msg);
  }, [activeSwitch, searchValue, store]);

  // Submit handler that routes validation by activeSwitch
  const submitForActiveSwitch = () => {
    const msg = validateSimpleSearch(searchValue, true);
    if (msg) {
      setSimpleError(msg);
      return;
    }
    setSimpleError('');
    if (activeSwitch == 'layer') {
      handleMetadataSearch(searchValue.trim());
      return;
    } else {
      handleGeneralSearch(searchValue.trim());
      return;
    }
  };

  const handleGeneralSearch = (value) => {
    setDropdownOpen(false);
    let searchValueCopy = value;
    //special case, roadsearch with 3 params is road/part/distance,
    //unless search ajorata and etaisyys flag ( carriageWaySearch ) found

    //TODO if and when we implement track range search, this should be enabled also to track, for now only road search
    if (
      (activeSwitch === 'road' || activeSwitch === null) &&
      !carriageWaySearch &&
      value &&
      value.includes('/') &&
      (value.split('/').length === 3 || value.split('/').length === 5)
    ) {
      let splittedValue = value.split('/');
      searchValueCopy =
        splittedValue[0] + '/' + splittedValue[1] + '//' + splittedValue[2];
      if (splittedValue.length === 5) {
        searchValueCopy += '/' + splittedValue[3] + '//' + splittedValue[4];
      }
    }

    searchValueCopy = searchValueCopy.trim();
    store.dispatch(setGeoJsonArray([]));
    store.dispatch(setFirstSearchResultShown(false));
    removeMarkersAndFeatures(channel);
    store.dispatch(setIsSearchingActive(true));
    if (activeSwitch === 'track') {
      console.log("juu")
      store.dispatch(
        searchVKMTrack({
          value: value,
          handler: (data) => {
            if (data.ratanumero && data.geom) {
              //mimic search structure of old vkm search
              const name = `ratanumero=${data?.ratanumero}, ratakilometri=${data?.ratakilometri}, ratametri=${data?.ratametri}`;

              let locations;
              if (data?.geom?.features[0].geometry?.coordinates?.length > 0) {
                locations = [
                  { type: 'VKM', vkmType: 'track', geom: data.geom, name: name }
                ];
              } else {
                locations = [];
              }

              const mimicdata = { result: { locations: locations } };
              store.dispatch(setSearchResults(mimicdata));
              if (
                (data?.result?.locations?.length > 1 ||
                  data?.geom?.features[0].geometry?.coordinates?.length > 0) &&
                !isMoreSearchOpen
              ) {
                store.dispatch(setIsMoreSearchOpen(true));
              }
              store.dispatch(setIsSearchingActive(false));
            }
          }
        })
      );
    } else {
      // TODO: swap to rpcSlice function
      channel.postRequest('SearchRequest', [searchValueCopy]);
    }
    store.dispatch(setSearchValue(value));
    store.dispatch(setLastSearchValue(value));
    store.dispatch(setSearchResults(null));
  };

  // Handle metadata search
   const handleMetadataSearch = (value) => {
    setDropdownOpen(false);
    removeMarkersAndFeatures(channel);
    store.dispatch(setIsSearchingActive(true));
    channel.postRequest('MetadataSearchRequest', [
      {
        search: value,
        srs: 'EPSG:3067',
        OrganisationName: 'Väylävirasto'
      }
    ]);
    store.dispatch(setLastSearchValue(value));
  };

  return (
    <>
      {activeSwitch === 'default' && (
        <DefaultSearchInput
          handleGeneralSearch={handleGeneralSearch}
          emptySearchResults={emptySearchResults}
        />
      )}

      {activeSwitch === 'road' && (
        <RoadSearchInput
        carriageWaySearch={carriageWaySearch}
        setCarriageWaySearch={setCarriageWaySearch}
          handleGeneralSearch={handleGeneralSearch}
          emptySearchResults={emptySearchResults}
        />
      )}

      {activeSwitch === 'track' && (
        <TrackSearchInput
          handleGeneralSearch={handleGeneralSearch}
          emptySearchResults={emptySearchResults}
        />
      )}

      {activeSwitch === 'feature' && (
        <FeatureSearchInput
          setDropdownOpen={setDropdownOpen}
          emptySearchResults={emptySearchResults}
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
            !isSearchingActive ? (
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
              !isSearchingActive && (
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

export default SearchInputs;
