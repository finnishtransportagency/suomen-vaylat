import styled from 'styled-components';
import strings from '../../translations';
import { useAppSelector } from '../../state/hooks';
import { useState } from 'react';
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// --- Better Responsive "road" field styling ---

const SectionDivider = styled.div`
  margin: 0.5em 0;
  border-bottom: 1px solid #dee2e6;
  font-weight: 500;
  color: ${(p) => p.theme.colors.black};
  font-size: 15px;
  padding-bottom: 2px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: auto;
`;

const LabelRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 3px;
  flex-wrap: wrap;
  @media (max-width: 750px) {
    gap: 6px;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  justify-content: flex-start;
  margin-bottom: 8px;
  flex-wrap: wrap;
  @media (max-width: 750px) {
    gap: 6px;
  }
`;

/* New wrappers to place inputs left and button right */
const RowWithButton = styled.div`
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

/* container for inputs to allow them to wrap inside left area */
const InputsContainer = styled.div`
  flex: 1 1 0;
  min-width: 0; /* ensure proper shrinking inside flex */
`;

/* Button row placed under inputs (two buttons: left trash, right search) */
const ButtonsRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  margin-top: 1em;
  gap: 1em;
  flex-wrap: nowrap;

  @media (max-width: 680px) {
    flex-direction: row;
    gap: 8px;
  }
`;

/* Search button styling (right) */
const StyledStandardSearchButton = styled.button`
  background: none;
  font-size: 1.2em;;
  border: none;
  color: ${(p) => p.theme.colors.mainColor1};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 0 0 0.5em;

  &:hover {
    opacity: 0.95;
  }
`;

/* Search button styling (right) */
const StyledSearchButton = styled.button`
  background-color: ${(p) => p.theme.colors.mainColor1};
  color: ${(p) => p.theme.colors.mainWhite};
  border: 1px solid ${(p) => p.theme.colors.mainColor1};
  border-radius: 20px;
  min-width: 44px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 16px;
  flex: 1 0 auto;
  gap: 1em;

  &:hover {
  background-color: ${(p) => p.theme.colors.mainColor1Selected};
  }

  @media (max-width: 680px) {
    flex: 1 1 0;
    height: 40px;
  }
`;

/* Trash / clear button styling (left) */
const StyledTrashButton = styled.button`
  background-color: ${(p) => p.theme.colors.secondaryColorDarkOrange};
  color: ${(p) => p.theme.colors.mainWhite};
  border: 1px solid ${(p) => p.theme.colors.secondaryColorDarkOrange};
  border-radius: 20px;
  min-width: 44px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 16px;
  flex: 1 0 auto;
  gap: 1em;

  &:hover {
  background-color: ${(p) => p.theme.colors.secondaryColorDarkOrangeSelected};
  }

  @media (max-width: 680px) {
    flex: 1 1 0;
    height: 40px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 72px;
`;

const RoadInputLabel = styled.label`
  flex: 1 1 0px;
  min-width: 70px;
  max-width: 130px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #444;
  box-sizing: border-box;
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

// For main search types single input (e.g. address, track, etc)
const WideInputGroup = styled.div`
  width: 100%;
`;

const WidePillInput = styled(PillInput)`
  width: 100%;
  min-width: 150px;
  max-width: 600px;
  text-align: left;
`;

const StyledFeatureSearchSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
  width: 100%;
`;
const StyledSearchSection = styled.div`
  width: 100%;
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const StyledCheckbox = styled.input`
  margin-left: 0;
  margin-right: 8px;
  width: 16px;
  height: 16px;
`;

const CheckboxLabel = styled.label`
  font-size: 16px;
  margin: 0;
  color: ${(props) => props.theme.colors.darkGrey || '#333'};
`;

const StyledValidationMessage = styled.div`
  color: ${(props) => props.theme.colors.secondaryColorDarkOrange || '#c55'};
  margin-top: 4px;
`;

const StyledSelectedLayerWrapper = styled.div`
  display: flex;
  align-items: baseline;
  margin-left: 0.5em;
  margin-top: 4px;
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

// Utility methods (your original versions, unchanged)
const getSearchValuePart = (
  searchValue,
  searchType,
  part,
  carriageWaySearch
) => {
  const splittedSearchArray = splitSearchValue(searchValue, searchType, part);
  let retVa;
  let actualPart;
  if (carriageWaySearch === true) {
    if (splittedSearchArray && part > splittedSearchArray.length) {
      return '';
    } else {
      actualPart = part;
    }
  } else {
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
  } else if (part === 0) {
    retVa = searchValue;
  } else {
    retVa = '';
  }
  return retVa;
};
const splitSearchValue = (searchValue, searchType) => {
  let roadParts;
  if (
    searchValue !== '' &&
    searchType !== undefined &&
    searchType === 'address' &&
    searchValue.includes('/')
  ) {
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
const updateRoadSearchValue = (
  searchValue,
  searchType,
  setSearchValue,
  part,
  value,
  carriageWaySearch = false
) => {
  let searchArray = splitSearchValue(searchValue, searchType);
  const effectivePart = carriageWaySearch ? part : part - 1;
  if (
    searchArray !== undefined &&
    searchArray !== '' &&
    searchArray.length >= effectivePart
  ) {
    if (value === '') {
      searchArray.length = part;
    }
    const blancSpacePosition = carriageWaySearch ? 4 : 3;
    if (part > blancSpacePosition) {
      searchArray[effectivePart] = value;
    } else {
      searchArray[part] = value;
    }
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
    setSearchValue(value);
  } else if (
    (searchArray === undefined || searchArray === '') &&
    searchValue !== undefined &&
    part === 1
  ) {
    setSearchValue(searchValue + '/' + value);
  } else if (
    searchArray !== undefined &&
    searchArray !== '' &&
    searchArray.length === part - 1
  ) {
    setSearchValue(searchValue + '/' + value);
  }
};
const parseSearchValueFromParts = (partsArray, blancSpacePosition) => {
  let newSearchValue;
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
  const newErrors = [...(trackErrors ?? [])];
  newErrors[position] = newValue === '';
  setTrackErrors(newErrors);
  let searchArray = searchValue ? searchValue.split('/') : ['', '', ''];
  searchArray[position] = newValue;
  const newSearchValue = searchArray.join('/');
  setSearchValue(
    newSearchValue.endsWith('/') ? newSearchValue.slice(0, -1) : newSearchValue
  );
};
const parseTrackSearchQuery = (searchQuery) => {
  return searchQuery.endsWith('/') ? searchQuery.slice(0, -1) : searchQuery;
};

const SearchInput = ({
  searchValue,
  setSearchValue,
  searchType,
  handleSeach,
  carriageWaySearch,
  setCarriageWaySearch,
  trackErrors,
  setTrackErrors,
  validateTrackSearch,
  featureErrors
}) => {
  const { selectedLayersByType } = useAppSelector((state) => state.rpc);
  const { activeSwitch } = useAppSelector((state) => state.ui);
  const [roadEndEnabled, setRoadEndEnabled] = useState(false);

  /* helper click handlers mapping to existing enter behavior */
  const onClickSearchDefault = () => {
    handleSeach(searchValue);
  };
  const onClickSearchRoad = () => {
    handleSeach(searchValue);
  };
  const onClickSearchTrack = () => {
    if (validateTrackSearch(searchValue, setTrackErrors)) {
      handleSeach(parseTrackSearchQuery(searchValue));
    }
  };
  const onClickSearchWide = () => {
    handleSeach(searchValue);
  };
  const onClickSearchFeature = () => {
    handleSeach(searchValue.trim());
  };

  /* clearing helpers */
  const clearAllRoadFields = () => {
    // easiest: clear whole search string for road inputs
    setSearchValue('');
  };
  const clearRoadEndFields = () => {
    // clear whole search value as well (simpler and predictable)
    setSearchValue('');
  };
  const clearTrackFields = () => {
    setSearchValue('');
    // reset validation flags too
    if (Array.isArray(trackErrors) && trackErrors.length > 0) {
      setTrackErrors([false, false, false]);
    }
  };

  return (
    <>
      {activeSwitch === 'default' && (
        <StyledSearchSection>
          <RowWithButton>
            <InputsContainer>
              <WideInputGroup>
                <WidePillInput
                  id="default-search"
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSeach(searchValue);
                  }}
                />
              </WideInputGroup>
            </InputsContainer>

            <StyledStandardSearchButton
              type="button"
              aria-label="Search"
              onClick={onClickSearchDefault}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </StyledStandardSearchButton>
          </RowWithButton>
        </StyledSearchSection>
      )}

      {activeSwitch === 'road' && (
        <StyledSearchSection>
          {roadEndEnabled && <SectionDivider>Alku</SectionDivider>}
          <RowWithButton>
            <InputsContainer>
              <FieldGroup>
                <LabelRow>
                  <RoadInputLabel htmlFor="road-tie">
                    {strings.search.vkm.tie}
                  </RoadInputLabel>
                  <RoadInputLabel htmlFor="road-osa">
                    {strings.search.vkm.osa}
                  </RoadInputLabel>
                  <RoadInputLabel htmlFor="road-majorata">
                    {strings.search.vkm.ajorata}
                  </RoadInputLabel>
                  <RoadInputLabel htmlFor="road-etaisyys">
                    {strings.search.vkm.etaisyys}
                  </RoadInputLabel>
                </LabelRow>
                <InputRow>
                  <PillInput
                    id="road-tie"
                    type="text"
                    placeholder=""
                    onChange={(e) =>
                      updateRoadSearchValue(
                        searchValue,
                        searchType,
                        setSearchValue,
                        0,
                        e.target.value,
                        carriageWaySearch
                      )
                    }
                    value={getSearchValuePart(searchValue, searchType, 0)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSeach(searchValue);
                    }}
                  />
                  <PillInput
                    id="road-osa"
                    type="text"
                    placeholder=""
                    onChange={(e) =>
                      updateRoadSearchValue(
                        searchValue,
                        searchType,
                        setSearchValue,
                        1,
                        e.target.value,
                        carriageWaySearch
                      )
                    }
                    value={getSearchValuePart(searchValue, searchType, 1)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSeach(searchValue);
                    }}
                  />
                  <PillInput
                    id="road-majorata"
                    type="text"
                    placeholder=""
                    onChange={(e) =>
                      updateRoadSearchValue(
                        searchValue,
                        searchType,
                        setSearchValue,
                        2,
                        e.target.value,
                        carriageWaySearch
                      )
                    }
                    value={getSearchValuePart(
                      searchValue,
                      searchType,
                      2,
                      carriageWaySearch
                    )}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSeach(searchValue);
                    }}
                    disabled={!carriageWaySearch}
                  />
                  <PillInput
                    id="road-etaisyys"
                    type="text"
                    placeholder=""
                    onChange={(e) =>
                      updateRoadSearchValue(
                        searchValue,
                        searchType,
                        setSearchValue,
                        carriageWaySearch ? 3 : 2,
                        e.target.value,
                        carriageWaySearch
                      )
                    }
                    value={getSearchValuePart(
                      searchValue,
                      searchType,
                      3,
                      carriageWaySearch
                    )}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSeach(searchValue);
                    }}
                  />
                </InputRow>
              </FieldGroup>
            </InputsContainer>
          </RowWithButton>

          {roadEndEnabled && (
            <>
              <SectionDivider>Loppu</SectionDivider>
              <RowWithButton>
                <InputsContainer>
                  <FieldGroup>
                    <LabelRow>
                      <RoadInputLabel htmlFor="road-tieloppu">
                        {strings.search.vkm.tie}
                      </RoadInputLabel>
                      <RoadInputLabel htmlFor="road-osa-loppu">
                        {strings.search.vkm.osa}
                      </RoadInputLabel>
                      <RoadInputLabel htmlFor="road-majorata-loppu">
                        {strings.search.vkm.ajorata}
                      </RoadInputLabel>
                      <RoadInputLabel htmlFor="road-etaisyys-loppu">
                        {strings.search.vkm.etaisyys}
                      </RoadInputLabel>
                    </LabelRow>
                    <InputRow>
                      <PillInput
                        id="road-tieloppu"
                        aria-label={strings.search.vkm.tieloppu}
                        type="text"
                        placeholder=""
                        onChange={(e) =>
                          updateRoadSearchValue(
                            searchValue,
                            searchType,
                            setSearchValue,
                            4,
                            e.target.value,
                            carriageWaySearch
                          )
                        }
                        value={getSearchValuePart(
                          searchValue,
                          searchType,
                          4,
                          carriageWaySearch
                        )}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSeach(searchValue);
                        }}
                      />
                      <PillInput
                        id="road-osa-loppu"
                        aria-label={strings.search.vkm.osaLoppu}
                        type="text"
                        placeholder=""
                        onChange={(e) =>
                          updateRoadSearchValue(
                            searchValue,
                            searchType,
                            setSearchValue,
                            5,
                            e.target.value,
                            carriageWaySearch
                          )
                        }
                        value={getSearchValuePart(
                          searchValue,
                          searchType,
                          5,
                          carriageWaySearch
                        )}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSeach(searchValue);
                        }}
                      />
                      <PillInput
                        id="road-majorata-loppu"
                        aria-label={strings.search.vkm.ajorata}
                        type="text"
                        placeholder=""
                        value={getSearchValuePart(
                          searchValue,
                          searchType,
                          6,
                          carriageWaySearch
                        )}
                        onChange={(e) =>
                          updateRoadSearchValue(
                            searchValue,
                            searchType,
                            setSearchValue,
                            6,
                            e.target.value,
                            carriageWaySearch
                          )
                        }
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSeach(searchValue);
                        }}
                        disabled={!carriageWaySearch}
                      />
                      <PillInput
                        id="road-etaisyys-loppu"
                        aria-label={strings.search.vkm.etaisyysLoppu}
                        type="text"
                        placeholder=""
                        value={getSearchValuePart(
                          searchValue,
                          searchType,
                          7,
                          carriageWaySearch
                        )}
                        onChange={(e) =>
                          updateRoadSearchValue(
                            searchValue,
                            searchType,
                            setSearchValue,
                            carriageWaySearch ? 7 : 6,
                            e.target.value,
                            carriageWaySearch
                          )
                        }
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSeach(searchValue);
                        }}
                      />
                    </InputRow>
                  </FieldGroup>
                </InputsContainer>
              </RowWithButton>
            </>
          )}

          <CheckboxWrapper>
            <StyledCheckbox
              id="carriageWaySearchBox"
              name="carriageWaySearchBox"
              type="checkbox"
              onChange={() => setCarriageWaySearch(!carriageWaySearch)}
              checked={carriageWaySearch}
            />
            <CheckboxLabel htmlFor="carriageWaySearchBox">
              {strings.search.carriageWaySearch}
            </CheckboxLabel>
          </CheckboxWrapper>
          <CheckboxWrapper>
            <StyledCheckbox
              id="roadEndCheckbox"
              name="roadEndCheckbox"
              type="checkbox"
              onChange={() => setRoadEndEnabled(!roadEndEnabled)}
              checked={roadEndEnabled}
            />
            <CheckboxLabel htmlFor="roadEndCheckbox">
              {'Anna tien loppu tiedot'}
            </CheckboxLabel>
          </CheckboxWrapper>


                {/* Buttons under the start group */}
                <ButtonsRow>
                  <StyledSearchButton
                    type="button"
                    aria-label="Search road"
                    onClick={onClickSearchRoad}
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    {strings.search.search}
                  </StyledSearchButton>
                  <StyledTrashButton
                    type="button"
                    aria-label="Clear road start fields"
                    onClick={clearAllRoadFields}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    {strings.search.erase}
                  </StyledTrashButton>
                </ButtonsRow>
        </StyledSearchSection>
      )}

      {activeSwitch === 'track' && (
        <StyledSearchSection>
          <RowWithButton>
            <InputsContainer>
              <FieldGroup>
                <LabelRow>
                  <RoadInputLabel htmlFor="track-tracknumber">
                    {strings.search.track.tracknumber}
                  </RoadInputLabel>
                  <RoadInputLabel htmlFor="track-trackkm">
                    {strings.search.track.trackkm}
                  </RoadInputLabel>
                  <RoadInputLabel htmlFor="track-trackm">
                    {strings.search.track.trackm}
                  </RoadInputLabel>
                </LabelRow>
                <InputRow>
                  <PillInput
                    id="track-tracknumber"
                    type="text"
                    value={getTrackSearchValuePart(0, searchValue)}
                    onChange={(e) =>
                      updateTrackSearchValue(
                        e.target.value,
                        0,
                        searchValue,
                        setSearchValue,
                        trackErrors,
                        setTrackErrors
                      )
                    }
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        if (validateTrackSearch(searchValue, setTrackErrors)) {
                          handleSeach(parseTrackSearchQuery(searchValue));
                        }
                      }
                    }}
                    className={trackErrors[0] ? 'error' : ''}
                  />
                  <PillInput
                    id="track-trackkm"
                    type="text"
                    value={getTrackSearchValuePart(1, searchValue)}
                    onChange={(e) =>
                      updateTrackSearchValue(
                        e.target.value,
                        1,
                        searchValue,
                        setSearchValue,
                        trackErrors,
                        setTrackErrors
                      )
                    }
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        if (validateTrackSearch(searchValue, setTrackErrors)) {
                          handleSeach(parseTrackSearchQuery(searchValue));
                        }
                      }
                    }}
                    className={trackErrors[1] ? 'error' : ''}
                  />
                  <PillInput
                    id="track-trackm"
                    type="text"
                    value={getTrackSearchValuePart(2, searchValue)}
                    onChange={(e) =>
                      updateTrackSearchValue(
                        e.target.value,
                        2,
                        searchValue,
                        setSearchValue,
                        trackErrors,
                        setTrackErrors
                      )
                    }
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        if (validateTrackSearch(searchValue, setTrackErrors)) {
                          handleSeach(parseTrackSearchQuery(searchValue));
                        }
                      }
                    }}
                    className={trackErrors[2] ? 'error' : ''}
                  />
                </InputRow>


          {trackErrors.some((error) => error === true) && (
            <StyledValidationMessage>
              {strings.search.track.trackMandatoryMessage}
            </StyledValidationMessage>
          )}

                {/* Buttons under track inputs */}
                <ButtonsRow>
                  <StyledSearchButton
                    type="button"
                    aria-label="Search track"
                    onClick={onClickSearchTrack}
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    {strings.search.search}
                  </StyledSearchButton>
                  <StyledTrashButton
                    type="button"
                    aria-label="Clear track fields"
                    onClick={clearTrackFields}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    {strings.search.erase}
                  </StyledTrashButton>
                </ButtonsRow>
              </FieldGroup>
            </InputsContainer>
          </RowWithButton>
        </StyledSearchSection>
      )}

      {activeSwitch === 'address' && (
        <StyledSearchSection>
          <RowWithButton>
            <InputsContainer>
              <WideInputGroup>
                <WidePillInput
                  id="address-search"
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSeach(searchValue);
                  }}
                />
              </WideInputGroup>
            </InputsContainer>
            <StyledStandardSearchButton
              type="button"
              aria-label="Search address"
              onClick={onClickSearchWide}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </StyledStandardSearchButton>
          </RowWithButton>
        </StyledSearchSection>
      )}

      {activeSwitch === 'nomenclature' && (
        <StyledSearchSection>
          <RowWithButton>
            <InputsContainer>
              <WideInputGroup>
                <WidePillInput
                  id="nomenclature-search"
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSeach(searchValue);
                  }}
                />
              </WideInputGroup>
            </InputsContainer>
            <StyledStandardSearchButton
              type="button"
              aria-label="Search nomenclature"
              onClick={onClickSearchWide}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </StyledStandardSearchButton>
          </RowWithButton>
        </StyledSearchSection>
      )}

      {activeSwitch === 'premise' && (
        <StyledSearchSection>
          <RowWithButton>
            <InputsContainer>
              <WideInputGroup>
                <WidePillInput
                  id="premise-search"
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSeach(searchValue);
                  }}
                />
              </WideInputGroup>
            </InputsContainer>
            <StyledStandardSearchButton
              type="button"
              aria-label="Search premise"
              onClick={onClickSearchWide}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </StyledStandardSearchButton>
          </RowWithButton>
        </StyledSearchSection>
      )}

      {activeSwitch === 'layer' && (
        <StyledSearchSection>
          <RowWithButton>
            <InputsContainer>
              <WideInputGroup>
                <WidePillInput
                  id="metadata-search"
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSeach(searchValue);
                  }}
                />
              </WideInputGroup>
            </InputsContainer>
            <StyledStandardSearchButton
              type="button"
              aria-label="Search layer"
              onClick={onClickSearchWide}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </StyledStandardSearchButton>
          </RowWithButton>
        </StyledSearchSection>
      )}

      {activeSwitch === 'feature' && (
        <StyledFeatureSearchSection>
          <RowWithButton>
            <InputsContainer>
              <WideInputGroup>
                <WidePillInput
                  id="feature-search"
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSeach(searchValue.trim());
                  }}
                  className={featureErrors.length > 0 ? 'error' : ''}
                />
              </WideInputGroup>
            </InputsContainer>

            <StyledStandardSearchButton
              type="button"
              aria-label="Search feature"
              onClick={onClickSearchFeature}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </StyledStandardSearchButton>
          </RowWithButton>

          <StyledSelectedLayerWrapper>
            {selectedLayersByType.mapLayers.length > 0 ? (
              <>
                <StyledSelectedLayerTitle>
                  {strings.search.feature.searchFromLayer}
                </StyledSelectedLayerTitle>
                <StyledSelectedLayerText>
                  {selectedLayersByType.mapLayers[0].name}
                </StyledSelectedLayerText>
              </>
            ) : (
              <StyledNoActivaLayers></StyledNoActivaLayers>
            )}
          </StyledSelectedLayerWrapper>
        </StyledFeatureSearchSection>
      )}
    </>
  );
};

export default SearchInput;
