import styled from 'styled-components';
import strings from '../../../translations';
import { useAppSelector } from '../../../state/hooks';
import { useContext, useEffect, useState } from 'react';
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { emptySearchResults, validateSimpleSearch } from '../utils/SearchUtil';
import { ReactReduxContext } from 'react-redux';
import { setSearchValue } from '../../../state/slices/rpcSlice';
import PillButton from '../../../utils/components/PillButton';

const StyledRowWithButton = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const StyledInputsContainer = styled.div`
  flex: 1 1 0;
  min-width: 0; /* ensure proper shrinking inside flex */
  display: flex;
  align-items: center; /* vertically center the input row so the button aligns middle */

  @media ${(props) => props.theme.device.tablet} {
    width: 100%;
  }
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
  @media ${(props) => props.theme.device.tablet} {
    font-size: 14px;
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

const StyledSearchButtons = styled.div`
  padding-top: 1em;
  display: flex;
  width: 100%;
  gap: 1em;

  @media ${(props) => props.theme.device.tablet} {
    gap: 8px;
    flex-direction: column;
  }
`;

const DefaultSearchInput = ({ handleGeneralSearch, handleMetadataSearch, emptySearchInputs }) => {
  const { store } = useContext(ReactReduxContext);

  const {
    featureSearchResults,
    searchResults,
    searchValue,
    isSearchingActive,
    lastSearchValue
  } = useAppSelector((state) => state.rpc);
  
  const { activeSwitch } = useAppSelector((state) => state.ui);

  const [simpleError, setSimpleError] = useState('');

  const submitSearch = () => {
    const msg = validateSimpleSearch(searchValue, true);
    if (msg) {
      setSimpleError(msg);
      return;
    }
    setSimpleError('');
    if (activeSwitch === 'layer') {
      handleMetadataSearch(searchValue.trim());
      return;
    } else {
      handleGeneralSearch(searchValue.trim());
      return;
    }
  };

  useEffect(() => {
    const msg = validateSimpleSearch(searchValue, false);
    setSimpleError(msg);
  }, [searchValue]);

  return (
    <StyledSearchSection id="default-search-section">
      <StyledRowWithButton>
        <StyledInputsContainer>
          <StyledWideInputGroup>
            <StyledRelativeInputWrapper>
              <StyledWidePillInput
                id="default-search-input"
                aria-label={strings.search.address?.title || 'Search'}
                type="text"
                value={searchValue}
                onChange={(e) => {
                  store.dispatch(setSearchValue(e.target.value));
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') submitSearch();
                }}
              />
            </StyledRelativeInputWrapper>
          </StyledWideInputGroup>
        </StyledInputsContainer>

        {(searchResults !== null || featureSearchResults.length > 0) &&
        searchValue === lastSearchValue &&
        !isSearchingActive ? (
          <StyledStandardSearchButton
            id="default-search-clear-fields-button"
            type="button"
            aria-label={strings.search?.clearFields}
            onClick={() => {
              // clear results
              emptySearchInputs();
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </StyledStandardSearchButton>
        ) : (
          !isSearchingActive && <></>
        )}
      </StyledRowWithButton>

      {/* simple error shown under inputs for default */}
      {simpleError && (
        <StyledValidationMessage
          id="default-search-error"
          role="alert"
          aria-live="polite"
        >
          {simpleError}
        </StyledValidationMessage>
      )}

      <StyledSearchButtons>
        <PillButton
          id={'default-search-submit-button"'}
          key={'default-search-submit-button"'}
          text={strings.search?.search}
          onClick={submitSearch}
          aria-label={strings.search?.clearResults}
          style={{ width: '100%', justifyContent: 'center' }}
          icon={faMagnifyingGlass}
        />

        <PillButton
          id={'default-search-inputs-clear-results-btn'}
          key={'default-search-inputs-clear-results-btn'}
          text={strings.search?.clearResults}
          onClick={emptySearchResults}
          aria-label={strings.search?.clearResults}
          style={{ width: '100%', justifyContent: 'center' }}
          disabled={
            !(searchResults !== null || featureSearchResults.length > 0)
          }
        />
      </StyledSearchButtons>
    </StyledSearchSection>
  );
};

export default DefaultSearchInput;
