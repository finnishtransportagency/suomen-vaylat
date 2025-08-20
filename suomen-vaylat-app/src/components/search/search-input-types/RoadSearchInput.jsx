import styled from 'styled-components';
import strings from '../../../translations';
import { useAppSelector } from '../../../state/hooks';
import { useContext, useEffect, useState } from 'react';
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import { setSearchValue } from '../../../state/slices/rpcSlice';

const StyledSectionDivider = styled.div`
  margin: 0.5em 0;
  border-bottom: 1px solid #dee2e6;
  font-weight: 500;
  color: ${(p) => p.theme.colors.black};
  font-size: 15px;
  padding-bottom: 2px;
`;

const StyledFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: auto;
`;

const InputRow = styled.div`
  display: flex;
  gap: 0.5em;
  width: 100%;
  justify-content: flex-start;
  margin-bottom: 8px;
  flex-wrap: nowrap;

  @media ${(props) => props.theme.device.tablet} {
    gap: 8px;
    flex-direction: column;
  }
`;

const StyledRowWithButton = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  flex-wrap: nowrap;

  @media ${(props) => props.theme.device.tablet} {
    gap: 8px;
    flex-direction: column;
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

const FieldItem = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 72px;
  align-items: flex-start;
  box-sizing: border-box;
`;

const LabelAbove = styled.label`
  display: block;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #444;
  margin-bottom: 6px;
  margin-left: 0.5em;
`;

const StyledSearchSection = styled.div`
  width: 100%;
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StyledCheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 1em 8px;
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

const RoadSearchInput = ({
  carriageWaySearch,
  setCarriageWaySearch,
  handleGeneralSearch,
  emptySearchInputs
}) => {
  const { store } = useContext(ReactReduxContext);

  const {
    featureSearchResults,
    searchResults,
    searchValue,
    searchType,
    isSearchingActive,
    lastSearchValue
  } = useAppSelector((state) => state.rpc);

  const [roadEndEnabled, setRoadEndEnabled] = useState(false);

  const onClickSearchRoad = () => {
    handleGeneralSearch(searchValue);
  };

  useEffect(() => {
    //when carriagewaysearch ( ajordalla haku ) changes, reset searchValue
    store.dispatch(setSearchValue(''));
  }, [carriageWaySearch]);

  const updateRoadSearchValue = (
    searchValue,
    searchType,
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
        store.dispatch(setSearchValue(updatedSearchValue));
      }
    } else if (
      (searchArray === undefined || searchArray === '') &&
      value !== undefined &&
      part === 0
    ) {
      store.dispatch(setSearchValue(value));
    } else if (
      (searchArray === undefined || searchArray === '') &&
      searchValue !== undefined &&
      part === 1
    ) {
      store.dispatch(setSearchValue(searchValue + '/' + value));
    } else if (
      searchArray !== undefined &&
      searchArray !== '' &&
      searchArray.length === part - 1
    ) {
      store.dispatch(setSearchValue(searchValue + '/' + value));
    }
  };

  return (
    <StyledSearchSection>
      <StyledCheckboxWrapper>
        <StyledCheckbox
          id="search-input-carriageWaySearchBox"
          name="search-input-carriageWaySearchBox"
          type="checkbox"
          onChange={() => setCarriageWaySearch(!carriageWaySearch)}
          checked={carriageWaySearch}
          aria-checked={!!carriageWaySearch}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.click();
            }
          }}
        />

        <CheckboxLabel htmlFor="search-input-carriageWaySearchBox">
          {strings.search.carriageWaySearch}
        </CheckboxLabel>
      </StyledCheckboxWrapper>
      <StyledCheckboxWrapper>
        <StyledCheckbox
          id="search-input-roadEndCheckbox"
          name="search-input-roadEndCheckbox"
          type="checkbox"
          onChange={() => setRoadEndEnabled(!roadEndEnabled)}
          checked={roadEndEnabled}
          aria-checked={!!roadEndEnabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.click();
            }
          }}
        />

        <CheckboxLabel htmlFor="search-input-roadEndCheckbox">
          {'Anna tien loppu tiedot'}
        </CheckboxLabel>
      </StyledCheckboxWrapper>
      {roadEndEnabled && (
        <StyledSectionDivider id="search-input-road-start-divider">
          Alku
        </StyledSectionDivider>
      )}

      {/* START group */}
      <StyledRowWithButton>
        <StyledInputsContainer>
          <StyledFieldGroup>
            <InputRow>
              <FieldItem>
                <LabelAbove htmlFor="search-input-road-tie">
                  {strings.search.vkm.tie}
                </LabelAbove>
                <PillInput
                  id="search-input-road-tie"
                  aria-labelledby="search-input-road-tie-label"
                  type="text"
                  onChange={(e) =>
                    updateRoadSearchValue(
                      searchValue,
                      searchType,
                      0,
                      e.target.value,
                      carriageWaySearch
                    )
                  }
                  value={getSearchValuePart(searchValue, searchType, 0)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleGeneralSearch(searchValue);
                  }}
                />
              </FieldItem>

              <FieldItem>
                <LabelAbove htmlFor="search-input-road-osa">
                  {strings.search.vkm.osa}
                </LabelAbove>
                <PillInput
                  id="search-input-road-osa"
                  aria-labelledby="search-input-road-osa-label"
                  type="text"
                  onChange={(e) =>
                    updateRoadSearchValue(
                      searchValue,
                      searchType,
                      1,
                      e.target.value,
                      carriageWaySearch
                    )
                  }
                  value={getSearchValuePart(searchValue, searchType, 1)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleGeneralSearch(searchValue);
                  }}
                />
              </FieldItem>

              <FieldItem>
                <LabelAbove htmlFor="search-input-road-majorata">
                  {strings.search.vkm.ajorata}
                </LabelAbove>
                <PillInput
                  id="search-input-road-majorata"
                  aria-labelledby="search-input-road-majorata-label"
                  type="text"
                  onChange={(e) =>
                    updateRoadSearchValue(
                      searchValue,
                      searchType,
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
                    if (e.key === 'Enter') handleGeneralSearch(searchValue);
                  }}
                  disabled={!carriageWaySearch}
                />
              </FieldItem>

              <FieldItem>
                <LabelAbove htmlFor="search-input-road-etaisyys">
                  {strings.search.vkm.etaisyys}
                </LabelAbove>
                <div style={{ display: 'flex' }}>
                  <PillInput
                    id="search-input-road-etaisyys"
                    aria-labelledby="search-input-road-etaisyys-label"
                    type="text"
                    onChange={(e) =>
                      updateRoadSearchValue(
                        searchValue,
                        searchType,
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
                      if (e.key === 'Enter') handleGeneralSearch(searchValue);
                    }}
                  />

                  {(searchResults !== null ||
                    featureSearchResults.length > 0) &&
                  searchValue === lastSearchValue &&
                  !isSearchingActive ? (
                    <StyledStandardSearchButton
                      type="button"
                      aria-label="Search"
                      onClick={emptySearchInputs}
                      roadEndEnabled={roadEndEnabled}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </StyledStandardSearchButton>
                  ) : (
                    !isSearchingActive && (
                      <StyledStandardSearchButton
                        type="button"
                        aria-label="Search"
                        onClick={onClickSearchRoad}
                        roadEndEnabled={roadEndEnabled}
                      >
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                      </StyledStandardSearchButton>
                    )
                  )}
                </div>
              </FieldItem>
            </InputRow>
          </StyledFieldGroup>
        </StyledInputsContainer>
      </StyledRowWithButton>

      {/* END group (if enabled) */}
      {roadEndEnabled && (
        <>
          <StyledSectionDivider id="search-input-road-end-divider">
            Loppu
          </StyledSectionDivider>
          <StyledRowWithButton>
            <StyledInputsContainer>
              <StyledFieldGroup>
                <InputRow>
                  <FieldItem>
                    <LabelAbove htmlFor="search-input-road-tieloppu">
                      {strings.search.vkm.tie}
                    </LabelAbove>
                    <PillInput
                      id="search-input-road-tieloppu"
                      aria-labelledby="search-input-road-tieloppu-label"
                      type="text"
                      onChange={(e) =>
                        updateRoadSearchValue(
                          searchValue,
                          searchType,
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
                        if (e.key === 'Enter') handleGeneralSearch(searchValue);
                      }}
                    />
                  </FieldItem>

                  <FieldItem>
                    <LabelAbove htmlFor="search-input-road-osa-loppu">
                      {strings.search.vkm.osa}
                    </LabelAbove>
                    <PillInput
                      id="search-input-road-osa-loppu"
                      aria-labelledby="search-input-road-osa-loppu-label"
                      type="text"
                      onChange={(e) =>
                        updateRoadSearchValue(
                          searchValue,
                          searchType,
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
                        if (e.key === 'Enter') handleGeneralSearch(searchValue);
                      }}
                    />
                  </FieldItem>

                  <FieldItem>
                    <LabelAbove htmlFor="search-input-road-majorata-loppu">
                      {strings.search.vkm.ajorata}
                    </LabelAbove>
                    <PillInput
                      id="search-input-road-majorata-loppu"
                      aria-labelledby="search-input-road-majorata-loppu-label"
                      type="text"
                      onChange={(e) =>
                        updateRoadSearchValue(
                          searchValue,
                          searchType,
                          6,
                          e.target.value,
                          carriageWaySearch
                        )
                      }
                      value={getSearchValuePart(
                        searchValue,
                        searchType,
                        6,
                        carriageWaySearch
                      )}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleGeneralSearch(searchValue);
                      }}
                      disabled={!carriageWaySearch}
                    />
                  </FieldItem>

                  <FieldItem>
                    <LabelAbove htmlFor="search-input-road-etaisyys-loppu">
                      {strings.search.vkm.etaisyys}
                    </LabelAbove>
                    <div style={{ display: 'flex' }}>
                      <PillInput
                        id="search-input-road-etaisyys-loppu"
                        aria-labelledby="search-input-road-etaisyys-loppu-label"
                        type="text"
                        onChange={(e) =>
                          updateRoadSearchValue(
                            searchValue,
                            searchType,
                            carriageWaySearch ? 7 : 6,
                            e.target.value,
                            carriageWaySearch
                          )
                        }
                        value={getSearchValuePart(
                          searchValue,
                          searchType,
                          7,
                          carriageWaySearch
                        )}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter')
                            handleGeneralSearch(searchValue);
                        }}
                      />

                      {(searchResults !== null ||
                        featureSearchResults.length > 0) &&
                      searchValue === lastSearchValue &&
                      !isSearchingActive ? (
                        <StyledStandardSearchButton
                          type="button"
                          aria-label="Search"
                          onClick={emptySearchInputs}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </StyledStandardSearchButton>
                      ) : (
                        !isSearchingActive && (
                          <StyledStandardSearchButton
                            type="button"
                            aria-label="Search"
                            onClick={onClickSearchRoad}
                          >
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                          </StyledStandardSearchButton>
                        )
                      )}
                    </div>
                  </FieldItem>
                </InputRow>
              </StyledFieldGroup>
            </StyledInputsContainer>
          </StyledRowWithButton>
        </>
      )}
    </StyledSearchSection>
  );
};

export default RoadSearchInput;
