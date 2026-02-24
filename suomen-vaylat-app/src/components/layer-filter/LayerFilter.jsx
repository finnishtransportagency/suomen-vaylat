import { useState, useContext, useEffect, useCallback } from 'react';
import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/fi';
import 'dayjs/locale/sv';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Tooltip } from 'react-tooltip';
import {
  getPropertyOperatorCQL,
  updateFiltersOnMap
} from '../../utils/gfiUtil';
import { theme, isMobile } from '../../theme/theme';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { setWarning } from '../../state/slices/uiSlice';
import Select from 'react-select';

import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import strings from '../../translations';
import {
  faPlus,
  faTimes,
  faTrash,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setFilters } from '../../state/slices/rpcSlice';
import { Slide, toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

const StyledFilterProp = styled.div``;

const StyledFilterPropContainer = styled.div`
  padding: 0.3em;
  width: 95%;
`;

const StyledHeaderButton = styled.div`
  position: relative;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: none;
  background: none;
  svg {
    color: ${(props) => props.theme.colors.mainColor1};
    font-size: 20px;
    transition: all 0.1s ease-out;
  }
  &:hover {
    svg {
      color: ${(props) => props.theme.colors.mainColor2};
    }
  }
`;

const StyledFilterHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const StyledDialogContainer = styled.div`
  :after {
    content: '';
    display: table;
    clear: both;
  }
  margin-left: 1em;
  margin-right: 1em;
  margin-top: 1em;
  margin-bottom: 1em;
  min-width: 20em;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const StyledDialogSelectionContainer = styled.div`
  :after {
    content: '';
    display: table;
    clear: both;
  }
  position: relative;
  display: flex;
  flex-direction: column;
`;

const StyledDialogResultContainer = styled.div`
  :after {
    content: '';
    display: table;
    clear: both;
  }
  position: relative;
  display: flex;
  flex-direction: column;
`;

const StyledDialogFloatingChapter = styled.div`
  float: left;
  height: '3em'
  width: 100%;
  position: relative;
`;

const StyledDialogInputFloatingChapter = styled.div`
  float: left;
  height: '3em'
  width: 100%;
  position: relative;
  display: flex;
`;

const StyledDialogFloatingActionChapter = styled.div`
  width: 7%;
  margin-top: 1em;
  float: left;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
  align-self: flex-start;
`;

const StyledInput = styled.input`
  width: 100%;
  padding-left: 12px;
  font-size: 16px;
  padding-top: 10px;
  border-radius: 4px;
  border: 2px solid;
  border-color: hsl(0, 0%, 80%);
  padding: 5px 10px;
`;

const StyledFilterContainer = styled.div`
  margin-left: '.5em';
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledFilterResultContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledFilter = styled.div`
  background-color: #f2f2f2;
  border: solid 1px black;
  border-radius: 7px;
  margin-bottom: 5px;
  padding-left: 3px;
  padding-right: 3px;
  :nth-child(odd) {
    background-color: white;
  }
  :nth-child(3) {
    //float: none;
  }
  display: flex;
`;

const StyledTimesIconWrapper = styled.div`
  margin: 0.5em;
  border: none;
  background: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.mainColor1};
  svg {
    font-size: 20px;
    transition: all 0.1s ease-out;
  }
  &:hover {
    svg {
      color: ${(props) => props.theme.colors.mainColor2};
    }
  }
  float: right;
`;

const StyledValidationMessage = styled.div`
  color: ${(props) => props.theme.colors.secondaryColorDarkOrange};
  margin: 0.3em 0 0 0.2em;
`;

const StyledSelect = styled(Select)`
  font-size: 14;
  color: 'blue';
`;

const StyledFeatureCount = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  margin-top: 1em;
`;

const StyledAddFilterButton = styled.button`
  background-color: ${(props) => props.theme?.colors?.mainWhite};
  color: ${(props) => props.theme?.colors?.mainColor1};
  border: 2px solid ${(props) => props.theme?.colors?.mainColor1};
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.1s;

  #add_filter_plus_icon {
    margin-right: 0.5em;
    font-size: 12px;
  }

  #add_filter_spinner {
    margin-right: 0.5em;
    color: ${(props) => props.theme?.colors?.mainColor1};
  }

  /* pointer only when not disabled and only hover when enabled */
  &:not(:disabled) {
    cursor: pointer;
  }
  &:not(:disabled):hover {
    background-color: ${(props) => props.theme?.colors?.hover};
  }

  &:disabled {
    opacity: 0.5;
    background-color: ${(props) => props.theme.colors.darkGrey};
    color: ${(props) => props.theme?.colors?.mainWhite};
    cursor: not-allowed;
    border: 2px solid ${(props) => props.theme?.colors?.darkGrey};

    #add_filter_spinner {
      margin-right: 0.5em;
      color: ${(props) => props.theme?.colors?.mainWhite};
    }
  }

  @media ${(props) => props.theme.device.mobileL} {
    margin: 18px 0px;
    width: 100%;
  }
`;

const StyledRemoveAllFiltersButton = styled.button`
  background-color: ${(props) => props.theme?.colors?.mainWhite};
  color: ${(props) => props.theme?.colors?.mainColor1};
  border: 2px solid ${(props) => props.theme?.colors?.mainColor1};
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.1s;
  width: fit-content;
  margin-top: 1em;

  svg {
    margin-right: 12px;
    font-size: 12px;
  }

  /* pointer only when not disabled and only hover when enabled */
  &:not(:disabled) {
    cursor: pointer;
  }
  &:not(:disabled):hover {
    background-color: ${(props) => props.theme?.colors?.hover};
  }

  &:disabled {
    opacity: 0.5;
    background-color: ${(props) => props.theme.colors.darkGrey};
    color: ${(props) => props.theme?.colors?.mainWhite};
    cursor: not-allowed;
    border: none;
  }

  @media ${(props) => props.theme.device.mobileL} {
    margin: 18px 0px;
    width: 100%;
  }
`;

const Dropdown = ({ options, placeholder, value, setValue, isDisabled }) => {
  const styles3 = {
    option: (provided, state) => ({
      ...provided,
      zIndex: 101,
      position: 'relative'
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 })
  };

  return (
    <StyledSelect
      isSearchable={true}
      options={options}
      onChange={(e) => {
        setValue(e);
      }}
      value={Object.keys(value).length === 0 ? null : value}
      placeholder={placeholder}
      styles={styles3}
      autoFocus={false}
      isDisabled={isDisabled}
      menuPortalTarget={document.body}
    />
  );
};

export const LayerFilter = ({ filterInfo }) => {
  const { filters, channel } = useAppSelector((state) => state.rpc);
  const { store } = useContext(ReactReduxContext);
  const [operatorValue, setOperatorValue] = useState({});
  const [filterValue, setFilterValue] = useState({ value: '', type: null });
  const [propValue, setPropValue] = useState({});
  const [filterOptions, setFilterOptions] = useState([]);
  const [fieldNameLocales, setFieldNameLocales] = useState({});
  const [codeListValues, setCodeListValues] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [validationError, setValidationError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [featureCount, setFeatureCount] = useState(null);

  const handleSetPropValue = (value) => {
    setStartDate(null);
    setEndDate(null);
    setFilterValue({ value: '', type: null });
    setOperatorValue({});
    setPropValue(value);
  };

  const addFilter = () => {
    setIsLoading(true);
    const prop = propValue.value;
    var value;
    if (startDate || endDate) {
      value = {
        start: startDate ? new Date(startDate) : null,
        end: endDate ? new Date(endDate) : null
      };
    } else {
      value = filterValue.value;
    }
    const type = propValue.type;
    const oper = type === 'date' ? 'date' : operatorValue.value;
    const layer = filterInfo?.layer?.id;

    if (!prop || !value) {
      //lisää popup varoitus
      return;
    }
    let updatedFilters = [
      ...filters,
      {
        layer: layer,
        property: prop,
        operator: oper,
        value: value,
        type: type,
        codeValues: codeListValues[prop] || null
      }
    ];

    let filtersString = '';
    updatedFilters &&
      !updatedFilters.codeValue &&
      updatedFilters
        .filter((f) => f.layer === filterInfo?.layer?.id)
        .forEach((filter, index) => {
          var cqlFilter = getPropertyOperatorCQL(filter);
          index === 0
            ? (filtersString += cqlFilter)
            : (filtersString += ' AND ' + cqlFilter);
        });

    channel.getFeatureCount(
      [filterInfo.layer.id, filtersString],
      (data) => {
        if (data.count && typeof data.count === 'number' && data.count > 0) {
          // features found so apply filter
          updateFiltersOnMap(filtersString, filterInfo, channel);
          setFeatureCount(data.count);
          setIsLoading(false);

          store.dispatch(setFilters(updatedFilters));
          setStartDate(null);
          setEndDate(null);
          setPropValue({});
          setFilterValue({ value: '', type: null });
          setOperatorValue({});
        } else {
          // No features would be on map so notify user and do not apply the filter
          toast.warn(strings.gfifiltering?.errors?.noResults, {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            transition: Slide
          });
          setIsLoading(false);
        }
      },
      (data) => {
        toast.error(strings.gfifiltering?.errors?.filterError, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Slide
        });
        console.error(data);
        setIsLoading(false);
      }
    );
  };

  const gfiFilteringNumberOptions = [
    { value: 'equals', label: strings.gfifiltering.operators.equals },
    { value: 'notEquals', label: strings.gfifiltering.operators.notEquals },
    { value: 'smallerThan', label: strings.gfifiltering.operators.smallerThan },
    { value: 'biggerThan', label: strings.gfifiltering.operators.biggerThan }
  ];

  const gfiFilteringStringOptions = [
    { value: 'equals', label: strings.gfifiltering.operators.equals },
    { value: 'notEquals', label: strings.gfifiltering.operators.notEquals },
    { value: 'includes', label: strings.gfifiltering.operators.includes },
    {
      value: 'doesntInclude',
      label: strings.gfifiltering.operators.doesntInclude
    }
  ];

  var comparisonOperatorsHash = {
    number: gfiFilteringNumberOptions,
    string: gfiFilteringStringOptions
  };

  useEffect(() => {
    var layer = filterInfo?.layer;
    channel.getFieldNameLocales(
      [layer?.id],
      (data) => {
        setFieldNameLocales(data);
      },
      (err) => {
        console.log(err);
      }
    );
    channel.getCodeListValues(
      [layer?.id],
      (data) => {
        setCodeListValues(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }, [channel, filterInfo]);

  useEffect(() => {
    var layer = filterInfo?.layer;
    const options = layer?.filterColumnsArray.map((column) => {
      if (Object.keys(fieldNameLocales).length > 0) {
        const props = {
          value: column.key,
          label: fieldNameLocales[column.title],
          type: column.type
        };
        column.default && handleSetPropValue(props);
        return props;
      } else {
        const props = {
          value: column.key,
          label: column.title,
          type: column.type
        };
        column.default && handleSetPropValue(props);
        return props;
      }
    });
    setFilterOptions(options);
    channel.getFeatureCount(
      [filterInfo.layer.id, ''],
      (data) => {
        if (data.count && typeof data.count === 'number') {
          setFeatureCount(data.count);
        }
      },
      (data) => {
        console.error(data);
      }
    );
  }, [fieldNameLocales, filterInfo?.layer]);

  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    if (filterInfo && filterInfo?.layer && filters) {
      const updatedActivefilters = filters.filter(
        (filter) => filter.layer === filterInfo?.layer?.id
      );
      setActiveFilters(updatedActivefilters);
    }
  }, [filters, filterInfo]);

  const handleRemoveFilter = (filter) => {
    if (filters && filters.length > 0 && filters.includes(filter)) {
      let updatedFilters = filters.filter(
        (existingFilter) => existingFilter !== filter
      );
      let filtersString = '';
      updatedFilters &&
        !updatedFilters.codeValue &&
        updatedFilters
          .filter((f) => f.layer === filterInfo?.layer?.id)
          .forEach((filter, index) => {
            var cqlFilter = getPropertyOperatorCQL(filter);
            index === 0
              ? (filtersString += cqlFilter)
              : (filtersString += ' AND ' + cqlFilter);
          });

      updateFiltersOnMap(filtersString, filterInfo, channel);

      channel.getFeatureCount(
        [filterInfo.layer.id, filtersString],
        (data) => {
          if (data.count && typeof data.count === 'number') {
            setFeatureCount(data.count);
          }
        },
        (data) => {
          console.error(data);
        }
      );
      store.dispatch(setFilters(updatedFilters));
    }
  };

  const handleRemoveAllFilters = () => {
    store.dispatch(setFilters([]));
    updateFiltersOnMap(null, filterInfo, channel);
    channel.getFeatureCount(
      [filterInfo.layer.id, ''],
      (data) => {
        if (data.count && typeof data.count === 'number') {
          setFeatureCount(data.count);
        }
      },
      (data) => {
        console.error(data);
      }
    );
  };

  // Warn user about leaving the page
  const handleInfoClick = (event) => {
    event.preventDefault();
    const savedState = localStorage.getItem('dontShowExitLinkWarn');
    if (!savedState) {
      store.dispatch(
        setWarning({
          title: strings.exitConfirmation,
          subtitle: null,
          confirm: {
            text: strings.general.continue,
            action: () => {
              window.open(filterInfo.layer.filterFieldsInfo, '_blank');
              store.dispatch(setWarning(null));
            }
          },
          cancel: {
            text: strings.general.cancel,
            action: () => {
              store.dispatch(setWarning(null));
            }
          },
          dontShowAgain: {
            id: 'dontShowExitLinkWarn'
          }
        })
      );
    } else {
      window.open(filterInfo.layer.filterFieldsInfo, '_blank');
    }
  };

  const validateFilterInput = useCallback((searchValue) => {
    const regex = /^[A-Za-z0-9äöåÄÖÅ \-.,/()]*$/;

    if (regex.test(searchValue)) {
      setValidationError(false);
    } else {
      setValidationError(true);
    }
  }, []);

  const handleFilterInput = (value, type) => {
    validateFilterInput(value);
    setFilterValue({
      value: value,
      type: type
    });
  };

  return (
    <StyledDialogContainer>
      <Tooltip
        style={{backgroundColor: theme.colors.mainColor1}}
        disable={isMobile}
        anchorSelect={'#open_info_link'}
        id='open_info_link_tooltip'
        place="bottom"
        effect="float"
      >
        <span>{strings.tooltips.showInfoLink}</span>
      </Tooltip>
      <StyledDialogSelectionContainer>
        <StyledDialogFloatingChapter>
          <Dropdown
            options={filterOptions}
            placeholder={strings.gfifiltering.placeholders.chooseProp}
            value={propValue}
            defaultProperty={[filterInfo?.layer.defaultFilterProperty]}
            setValue={(value) => handleSetPropValue(value)}
            isDisabled={false}
          />
        </StyledDialogFloatingChapter>
        {propValue.type === 'date' ? (
          <>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={strings.getLanguage()}
            >
              <DatePicker
                sx={{ marginTop: '.5em' }}
                label={strings.gfifiltering.startDate}
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
              />
              <DatePicker
                sx={{ marginTop: '.5em' }}
                label={strings.gfifiltering.endDate}
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
              />
            </LocalizationProvider>
          </>
        ) : (
          <>
            <StyledDialogFloatingChapter style={{ marginTop: '.5em' }}>
              <Dropdown
                options={comparisonOperatorsHash[propValue.type]}
                placeholder={strings.gfifiltering.placeholders.chooseOperator}
                value={operatorValue}
                setValue={setOperatorValue}
                isDisabled={Object.keys(propValue).length === 0}
              />
            </StyledDialogFloatingChapter>

            <StyledDialogInputFloatingChapter style={{ marginTop: '.5em' }}>
              <StyledInput
                type="text"
                value={filterValue.value}
                placeholder={strings.gfifiltering.placeholders.chooseValue}
                onChange={(e) =>
                  handleFilterInput(e.target.value, propValue.type)
                }
                onKeyPress={(e) => {
                  if (
                    e.key === 'Enter' &&
                    !validationError &&
                    Object.keys(propValue).length !== 0 &&
                    Object.keys(operatorValue).length !== 0
                  ) {
                    addFilter();
                  }
                }}
                disabled={Object.keys(operatorValue).length === 0}
              />
              {filterInfo.layer.filterFieldsInfo && (
                <StyledHeaderButton
                  id='open_info_link'
                  onClick={handleInfoClick}
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                </StyledHeaderButton>
              )}
            </StyledDialogInputFloatingChapter>

            {validationError && (
              <StyledValidationMessage>
                {strings.gfifiltering?.errors?.validationError}
              </StyledValidationMessage>
            )}
          </>
        )}
        <StyledDialogFloatingActionChapter>
          <StyledAddFilterButton
            disabled={
              (filterValue.value.length === 0 &&
              (startDate === null && endDate === null)) ||
              validationError
            }
            onClick={() => addFilter()}
          >
            {!isLoading ? (
              <FontAwesomeIcon id="add_filter_plus_icon" icon={faPlus} />
            ) : (
              <CircularProgress
                id="add_filter_spinner"
                size={14}
                thickness={4}
              />
            )}
            {strings.gfifiltering.addFilter}{' '}
          </StyledAddFilterButton>
        </StyledDialogFloatingActionChapter>
      </StyledDialogSelectionContainer>

      <StyledDialogResultContainer>
        <StyledFeatureCount>
          <StyledFilterHeader style={{ marginBottom: '.5em' }}>
            {strings.gfifiltering.featureCount}
          </StyledFilterHeader>
          {featureCount}
        </StyledFeatureCount>
        {activeFilters && activeFilters.length > 0 && (
          <StyledFilterContainer>
            <StyledFilterResultContainer>
              <StyledFilterHeader style={{ marginBottom: '.5em' }}>
                {strings.gfifiltering.activeFilters}
              </StyledFilterHeader>
              {activeFilters.map((filter, index) => (
                <StyledFilter key={'filter_' + filter.value}>
                  <StyledFilterPropContainer>
                    <StyledFilterProp>
                      {strings.gfifiltering.property}:{' '}
                      {Object.keys(fieldNameLocales).length > 0
                        ? fieldNameLocales[filter.property]
                        : filter.property}
                    </StyledFilterProp>
                    <StyledFilterProp>
                      {filter.operator === 'date' ? (
                        <>
                          {strings.gfifiltering.operator}:{' '}
                          {strings.gfifiltering.dateRange}{' '}
                        </>
                      ) : (
                        <>
                          {strings.gfifiltering.operator}:{' '}
                          {strings.gfifiltering.operators[filter.operator]}{' '}
                        </>
                      )}
                    </StyledFilterProp>
                    {filter.type === 'date' ? (
                      <>
                        <StyledFilterProp>
                          {strings.gfifiltering.startDate}:{' '}
                          {filter.value.start
                            ? filter.value.start.toLocaleString(
                                [strings.getLanguage()],
                                {
                                  year: 'numeric',
                                  month: 'numeric',
                                  day: 'numeric'
                                }
                              )
                            : '-'}
                        </StyledFilterProp>
                        <StyledFilterProp>
                          {strings.gfifiltering.endDate}:{' '}
                          {filter.value.end
                            ? filter.value.end.toLocaleString(
                                [strings.getLanguage()],
                                {
                                  year: 'numeric',
                                  month: 'numeric',
                                  day: 'numeric'
                                }
                              )
                            : '-'}
                        </StyledFilterProp>
                      </>
                    ) : (
                      <StyledFilterProp>
                        {strings.gfifiltering.value}: {filter.value}
                      </StyledFilterProp>
                    )}
                  </StyledFilterPropContainer>
                  <StyledTimesIconWrapper
                    onClick={() => {
                      handleRemoveFilter(filter);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{ marginLeft: '.5em' }}
                    />
                  </StyledTimesIconWrapper>
                </StyledFilter>
              ))}
            </StyledFilterResultContainer>
            <StyledRemoveAllFiltersButton
              onClick={() => handleRemoveAllFilters()}
            >
              <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '.5em' }} />
              {strings.gfifiltering?.removeAllFilters}{' '}
            </StyledRemoveAllFiltersButton>
          </StyledFilterContainer>
        )}
      </StyledDialogResultContainer>
    </StyledDialogContainer>
  );
};
