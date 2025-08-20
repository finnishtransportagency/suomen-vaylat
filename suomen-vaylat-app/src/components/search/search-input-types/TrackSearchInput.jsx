import styled from 'styled-components';
import strings from '../../../translations';
import { useAppSelector } from '../../../state/hooks';
import { useContext, useEffect } from 'react';
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { validateTrackSearch } from '../utils/SearchUtil';
import { ReactReduxContext } from 'react-redux';
import { setSearchValue } from '../../../state/slices/rpcSlice';

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
    gap: 6px;
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

const StyledValidationMessage = styled.div`
  color: ${(props) => props.theme.colors.secondaryColorDarkOrange || '#c55'};
  margin-top: 8px;
  font-size: 0.95em;
`;

const StyledErrorsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const getTrackSearchValuePart = (position, searchValue) => {
  if (!searchValue) return '';
  const searchArray = searchValue.split('/');
  return searchArray[position] || '';
};

const parseTrackSearchQuery = (searchQuery) => {
  return searchQuery.endsWith('/') ? searchQuery.slice(0, -1) : searchQuery;
};

const TrackSearchInput = ({ handleGeneralSearch, emptySearchInputs }) => {
  const { store } = useContext(ReactReduxContext);

  const {
    featureSearchResults,
    trackErrors,
    searchResults,
    searchValue,
    isSearchingActive,
    lastSearchValue
  } = useAppSelector((state) => state.rpc);

  const onClickSearchTrack = () => {
    // require full presence + format for submit
    if (validateTrackSearch(searchValue, store, true)) {
      handleGeneralSearch(parseTrackSearchQuery(searchValue));
    }
  };

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

  const updateTrackSearchValue = (newValue, position, searchValue) => {
    let searchArray = searchValue ? searchValue.split('/') : ['', '', ''];
    searchArray[position] = newValue;
    const newSearchValue = searchArray.join('/');
    store.dispatch(
      setSearchValue(
        newSearchValue.endsWith('/')
          ? newSearchValue.slice(0, -1)
          : newSearchValue
      )
    );
  };

  return (
    <StyledSearchSection>
      <StyledRowWithButton>
        <StyledInputsContainer>
          <StyledFieldGroup>
            <InputRow>
              <FieldItem>
                <LabelAbove htmlFor="search-input-track-number">
                  {strings.search.track.tracknumber}
                </LabelAbove>
                <PillInput
                  id="search-input-track-number"
                  aria-labelledby="search-input-track-number-label"
                  aria-invalid={!!getTrackField(0).invalid}
                  aria-describedby={
                    combinedFieldMessages.length ? trackErrorsId : undefined
                  }
                  type="text"
                  value={getTrackSearchValuePart(0, searchValue)}
                  onChange={(e) =>
                    updateTrackSearchValue(e.target.value, 0, searchValue)
                  }
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onClickSearchTrack();
                    }
                  }}
                  className={getTrackField(0).invalid ? 'error' : ''}
                />
              </FieldItem>

              <FieldItem>
                <LabelAbove htmlFor="search-input-track-km">
                  {strings.search.track.trackkm}
                </LabelAbove>
                <PillInput
                  id="search-input-track-km"
                  aria-labelledby="search-input-track-km-label"
                  aria-invalid={!!getTrackField(1).invalid}
                  aria-describedby={
                    combinedFieldMessages.length ? trackErrorsId : undefined
                  }
                  type="text"
                  value={getTrackSearchValuePart(1, searchValue)}
                  onChange={(e) =>
                    updateTrackSearchValue(e.target.value, 1, searchValue)
                  }
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onClickSearchTrack();
                    }
                  }}
                  className={getTrackField(1).invalid ? 'error' : ''}
                />
              </FieldItem>

              <FieldItem>
                <LabelAbove htmlFor="search-input-track-m">
                  {strings.search.track.trackm}
                </LabelAbove>
                <div style={{ display: 'flex' }}>
                  <PillInput
                    id="search-input-track-m"
                    aria-labelledby="search-input-track-m-label"
                    aria-invalid={!!getTrackField(2).invalid}
                    aria-describedby={
                      combinedFieldMessages.length ? trackErrorsId : undefined
                    }
                    type="text"
                    value={getTrackSearchValuePart(2, searchValue)}
                    onChange={(e) =>
                      updateTrackSearchValue(e.target.value, 2, searchValue)
                    }
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        onClickSearchTrack();
                      }
                    }}
                    className={getTrackField(2).invalid ? 'error' : ''}
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
                        onClick={onClickSearchTrack}
                      >
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                      </StyledStandardSearchButton>
                    )
                  )}
                </div>
              </FieldItem>
            </InputRow>

            {combinedFieldMessages.length > 0 && (
              <StyledValidationMessage
                id={trackErrorsId}
                role="alert"
                aria-live="polite"
              >
                <StyledErrorsList>
                  {combinedFieldMessages.map((msg, i) => (
                    <div key={`track-msg-${i}`}>{msg}</div>
                  ))}
                </StyledErrorsList>
              </StyledValidationMessage>
            )}
          </StyledFieldGroup>
        </StyledInputsContainer>
      </StyledRowWithButton>
    </StyledSearchSection>
  );
};

export default TrackSearchInput;
