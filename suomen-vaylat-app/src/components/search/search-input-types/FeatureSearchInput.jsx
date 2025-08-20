import styled from 'styled-components';
import strings from '../../../translations';
import { useAppSelector } from '../../../state/hooks';
import { useContext, useEffect } from 'react';
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { validateFeatureSearch } from '../utils/SearchUtil';
import { ReactReduxContext } from 'react-redux';
import { setSearchValue } from '../../../state/slices/rpcSlice';

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

const StyledFeatureSearchSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
  width: 100%;
`;

const StyledValidationMessage = styled.div`
  color: ${(props) => props.theme.colors.secondaryColorDarkOrange || '#c55'};
  margin-top: 8px;
  font-size: 0.95em;
`;

const StyledSelectedLayerWrapper = styled.div`
  display: flex;
  align-items: baseline;
  margin-left: 0.5em;
  margin-bottom: 4px;
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

const FeatureSearchInput = ({
  handleSeach,
  emptySearchResults,
  lastSearchValue,
  isSearching
}) => {
  const { store } = useContext(ReactReduxContext);

  const {
    selectedLayersByType,
    featureSearchResults,
    featureErrors,
    searchResults,
    searchValue
  } = useAppSelector((state) => state.rpc);

  const onClickSearchFeature = () => {
    if (validateFeatureSearch(searchValue, store, true)) {
      handleSeach(searchValue.trim());
    }
  };

  return (
    <StyledFeatureSearchSection>
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

      <StyledRowWithButton>
        <StyledInputsContainer>
          <StyledWideInputGroup>
            <StyledRelativeInputWrapper>
              <StyledWidePillInput
                id="search-input-feature"
                aria-label={strings.search.feature?.title || 'Feature search'}
                type="text"
                value={searchValue}
                onChange={(e) => store.dispatch(setSearchValue(e.target.value))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSeach(searchValue.trim());
                }}
                className={featureErrors.length > 0 ? 'error' : ''}
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
            onClick={emptySearchResults}
          >
            <FontAwesomeIcon icon={faTrash} />
          </StyledStandardSearchButton>
        ) : (
          !isSearching && (
            <StyledStandardSearchButton
              type="button"
              aria-label="Search"
              onClick={onClickSearchFeature}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </StyledStandardSearchButton>
          )
        )}
      </StyledRowWithButton>

      {featureErrors &&
        featureErrors.map((error, i) => (
          <StyledValidationMessage
            key={`feature-error-${i}-${error}`}
            role="alert"
            aria-live="polite"
          >
            {strings?.search?.feature?.errors?.[error] ?? error}
          </StyledValidationMessage>
        ))}
    </StyledFeatureSearchSection>
  );
};

export default FeatureSearchInput;
