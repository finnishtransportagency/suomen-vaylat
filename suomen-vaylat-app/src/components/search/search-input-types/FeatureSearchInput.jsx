import styled from 'styled-components';
import strings from '../../../translations';
import { useAppSelector } from '../../../state/hooks';
import { useContext, useEffect, useState } from 'react';
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  emptySearchResults,
  mergeMatchedKeys,
  validateFeatureSearch
} from '../utils/SearchUtil';
import { ReactReduxContext } from 'react-redux';
import {
  pushToFeatureSearchResults,
  resetFeatureSearchResults,
  setFeatureSearchResults,
  setIsSearchingActive,
  setLastSearchValue,
  setLastSearchAttribute,
  setSearchOn,
  setSearchValue
} from '../../../state/slices/rpcSlice';
import { setAttributeSearchEnabled } from '../../../state/slices/uiSlice';
import { Slide, toast } from 'react-toastify';
import Select from 'react-select';
import '../css/ReactSelectStyling.css';
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
  padding-right: 44px;
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

const StyledCheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 1em 0.5em;
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

const StyledAttributeSelectionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  justify-content: space-between;
`;

const StyledInstructionText = styled.p`
  margin-bottom: 0px;
  margin-left: 0.5em;
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

const FeatureSearchInput = ({ setDropdownOpen, emptySearchInputs }) => {
  const { store } = useContext(ReactReduxContext);

  const {
    channel,
    selectedLayersByType,
    featureSearchResults,
    featureErrors,
    searchResults,
    searchValue,
    isSearchingActive,
    lastSearchValue,
    lastSearchAttribute
  } = useAppSelector((state) => state.rpc);

  const { attributeSearchEnabled } = useAppSelector((state) => state.ui);

  // Keep available layer attributes and user chosen attribute
  // Contains object of key-value pairs, eg. {attribute: humanReadableAttribute}
  const [layerAttributes, setLayerAttributes] = useState([]);

  const [activeLayer, setActiveLayer] = useState(null);
  const [searchAttribute, setSearchAttribute] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  // Turn object with key-value pairs into array of value-label pairs for select-react module
  const parseFieldNameLocales = (data) => {
    if (!data) return [];
    return Object.entries(data)
      .map(([key, value]) => ({ value: key, label: value }))
      .sort((a, b) => {
        const la = a.label ?? '';
        const lb = b.label ?? '';
        // Prefer string comparison; fall back to String() for non-strings
        const sa = typeof la === 'string' ? la : String(la);
        const sb = typeof lb === 'string' ? lb : String(lb);
        return sa.localeCompare(sb, undefined, { sensitivity: 'base' });
      });
  };

  useEffect(() => {
    // Update layer attribute list if active layer was changed or if attribute list is empty
    if (
      selectedLayersByType.mapLayers[0]?.id &&
      (selectedLayersByType.mapLayers[0]?.id !== activeLayer ||
        !layerAttributes)
    ) {
      setSelectedOption('');
      channel.getFieldNameLocales(
        [selectedLayersByType.mapLayers[0]?.id],
        (data) => {
          if (data) {
            setLayerAttributes(parseFieldNameLocales(data));
          }
        },
        (error) => console.log(error)
      );
      setActiveLayer(selectedLayersByType.mapLayers[0]?.id);
    }
  }, [selectedLayersByType, activeLayer, channel, layerAttributes]);

  const onClickSearchFeature = () => {
    if (
      validateFeatureSearch(searchValue, store, true, attributeSearchEnabled)
    ) {
      setDropdownOpen(false);
      handleFeatureSearch(searchValue.trim());
    }
  };

  const handleFeatureSearch = (searchValue, startIndex = 0, layerId = -1) => {
    const attributeUsedInSearch = attributeSearchEnabled ? searchAttribute : '';
    const handleSearchResponse = (data, usedAttr) => {
      if (Object.keys(data).length > 0) {
        store.dispatch(setIsSearchingActive(false));
        store.dispatch(setSearchOn(false));

        if (startIndex !== 0) {
          // Update features for "more results"
          let oldFeatureSearchResults = JSON.parse(
            JSON.stringify(featureSearchResults)
          );
          let newFeatureSearchResults = { ...data };
          const contentIndex = oldFeatureSearchResults
            .map((gfi) => gfi.content.layerId)
            .indexOf(data.content.layerId);
          const updatedFeatures = oldFeatureSearchResults[
            contentIndex
          ].content.geojson.features.concat(data.content.geojson.features);
          newFeatureSearchResults.content.geojson.features = updatedFeatures;

          const updatedMatchedKeys = mergeMatchedKeys(
            oldFeatureSearchResults[contentIndex].content.geojson
              .matchedFeatures,
            data.content.geojson.matchedFeatures
          );
          newFeatureSearchResults.content.geojson.matchedFeatures =
            updatedMatchedKeys;

          oldFeatureSearchResults[contentIndex] = newFeatureSearchResults;

          store.dispatch(setFeatureSearchResults(oldFeatureSearchResults));
        } else {
          store.dispatch(pushToFeatureSearchResults(data));
        }
      } else {
        store.dispatch(setIsSearchingActive(false));
        store.dispatch(setSearchOn(false));
      }
      store.dispatch(setLastSearchValue(searchValue));
      store.dispatch(setLastSearchAttribute(usedAttr));
    };

    const handleSearchError = (layerIdentifier, error, usedAttr) => {
      store.dispatch(setIsSearchingActive(false));
      store.dispatch(setSearchOn(false));
      store.dispatch(setLastSearchValue(searchValue));
      store.dispatch(setLastSearchAttribute(usedAttr));

      if (error === "invalid datatype") {
        toast.error(
          `${strings.search?.feature?.errors?.invalidDataType}`,
          {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            transition: Slide
          }
        );
      } else {
        toast.error(
          `${strings.search.feature.errorLayerStart}${layerIdentifier}${strings.search.feature.errorLayerEnd}`,
          {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            transition: Slide
          }
        );
      }
    };

    store.dispatch(setIsSearchingActive(true));
    store.dispatch(setSearchOn(true));
    startIndex === 0 && store.dispatch(resetFeatureSearchResults());

    const searchLayer =
      layerId !== -1 ? layerId : selectedLayersByType.mapLayers[0]?.id;
    const layerIdentifier =
      layerId !== -1 ? layerId : selectedLayersByType.mapLayers[0]?.name;

    if (searchLayer) {
      channel.searchFeatures(
        [searchLayer, searchValue, attributeUsedInSearch, startIndex],
        (data) => {
          handleSearchResponse(data, attributeUsedInSearch);
        },
        (error) => {
          handleSearchError(layerIdentifier, error, attributeUsedInSearch);
        }
      );
    }
  };

  return (
    <StyledFeatureSearchSection id="feature-search-section">
      <StyledSelectedLayerWrapper>
        {selectedLayersByType.mapLayers.length > 0 ? (
          <>
            <StyledSelectedLayerTitle id="feature-search-layer-title">
              {strings.search.feature.searchFromLayer}
            </StyledSelectedLayerTitle>
            <StyledSelectedLayerText id="feature-search-layer-text">
              {selectedLayersByType.mapLayers[0].name}
            </StyledSelectedLayerText>
          </>
        ) : (
          <StyledNoActivaLayers id="feature-search-no-active-layers" />
        )}
      </StyledSelectedLayerWrapper>

      <StyledCheckboxWrapper>
        <StyledCheckbox
          id="feature-search-attribute-checkbox"
          aria-label={strings.search.feature.attributeSearch}
          name="feature-search-attribute-checkbox"
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked === false) setSelectedOption('');
            store.dispatch(setAttributeSearchEnabled(!attributeSearchEnabled));
          }}
          checked={attributeSearchEnabled}
          aria-checked={!!attributeSearchEnabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.click();
            }
          }}
        />
        <CheckboxLabel htmlFor="feature-search-attribute-checkbox">
          {strings.search.feature.attributeSearch}
        </CheckboxLabel>
      </StyledCheckboxWrapper>

      {attributeSearchEnabled && (
        <StyledAttributeSelectionSection id="attribute-selection-section">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <StyledInstructionText id="attribute-selection-title">
              {strings.search.feature.selectSearchAttribute}
            </StyledInstructionText>
          </div>
          <div style={{ width: '100%', marginBottom: '0.5em' }}>
            <Select
              inputId="attribute-select"
              aria-label={strings.search.feature.selectSearchAttribute}
              value={{ value: selectedOption, label: selectedOption }}
              onChange={(opt) => {
                if (opt && opt.value) {
                  setSelectedOption(opt.label);
                  setSearchAttribute(opt.value);
                  // If user hasn't edited, effect will refresh displayed values for the new projection
                }
              }}
              options={layerAttributes}
              isSearchable
              placeholder="Select attribute..."
              // avoids parent clipping / z-index issues
              // TODO: Options in the menu are invisibe or white --> needs to be fixed
              menuPortalTarget={
                typeof document !== 'undefined' ? document.body : null
              }
              menuPosition="fixed"
              classNamePrefix="feature-search"
            />
          </div>
        </StyledAttributeSelectionSection>
      )}

      <StyledRowWithButton>
        <StyledInputsContainer>
          <StyledWideInputGroup>
            <StyledRelativeInputWrapper>
              <StyledWidePillInput
                id="feature-search-input"
                aria-label={strings.search.feature?.title || 'Feature search'}
                aria-describedby={
                  featureErrors.length > 0
                    ? 'feature-search-error-list'
                    : undefined
                }
                type="text"
                value={searchValue}
                onChange={(e) => store.dispatch(setSearchValue(e.target.value))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') onClickSearchFeature();
                }}
                className={featureErrors.length > 0 ? 'error' : ''}
              />
            </StyledRelativeInputWrapper>
          </StyledWideInputGroup>
        </StyledInputsContainer>

        {
        !isSearchingActive && searchValue ? (
          <StyledStandardSearchButton
            id="feature-search-clear-fields-button"
            type="button"
            aria-label={strings.search?.clearFields}
            onClick={emptySearchInputs}
          >
            <FontAwesomeIcon icon={faTrash} />
          </StyledStandardSearchButton>
        ) : (
          !isSearchingActive && <></>
        )}
      </StyledRowWithButton>

      {featureErrors && featureErrors.length > 0 && (
        <div id="feature-search-error-list">
          {featureErrors.map((error, i) => (
            <StyledValidationMessage
              id={`feature-search-error-${i}`}
              key={`feature-search-error-${i}-${error}`}
              role="alert"
              aria-live="polite"
            >
              {strings?.search?.feature?.errors?.[error] ?? error}
            </StyledValidationMessage>
          ))}
        </div>
      )}

      <StyledSearchButtons>
        <PillButton
          id={'feature-search-submit-button'}
          key={'feature-search-submit-button'}
          text={strings.search?.search}
          onClick={onClickSearchFeature}
          aria-label={strings.search.search}
          style={{ width: '100%', justifyContent: 'center' }}
          icon={faMagnifyingGlass}
        />

        <PillButton
          id={'feature-search-inputs-clear-results-btn'}
          key={'feature-search-inputs-clear-results-btn'}
          text={strings.search?.clearResults}
          onClick={emptySearchResults}
          aria-label={strings.search?.clearResults}
          style={{ width: '100%', justifyContent: 'center' }}
          disabled={
            !(searchResults !== null || featureSearchResults.length > 0)
          }
        />
      </StyledSearchButtons>
    </StyledFeatureSearchSection>
  );
};

export default FeatureSearchInput;
