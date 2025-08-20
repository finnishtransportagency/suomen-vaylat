import { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import {
  faSearch,
  faTimes,
  faInfoCircle,
  faMinus
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import strings from '../../translations';
import { SEARCH_TIP_LOCALSTORAGE } from '../../utils/constants';

import { theme } from '../../theme/theme';

import {
  pushToFeatureSearchResults,
  resetFeatureSearchResults,
  setSearchOn,
  searchVKMTrack,
  setFeatureSearchResults,
  setSearchResults,
  setSearchValue
} from '../../state/slices/rpcSlice';

import {
  setIsSearchOpen,
  setGeoJsonArray,
  setHasToastBeenShown,
  setActiveSwitch,
  setIsMoreSearchOpen
} from '../../state/slices/uiSlice';

import CircleButton from '../../utils/components/CircleButton';

import { Slide, toast } from 'react-toastify';
import SearchToast from '../toasts/SearchToast';
import TipToast from '../toasts/TipToast';
import SearchDialog from './SearchDialog';
import {
  mergeMatchedKeys,
  removeMarkersAndFeatures,
  searchDownloadTips,
  texts,
  validateFeatureSearch,
  variants
} from './utils/SearchUtil';

export const StyledSearchIcon = styled.div`
  min-width: 48px;
  padding-right: 16px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  color: ${(props) =>
    props.active
      ? props.theme.colors.secondaryColorPink
      : 'rgba(0, 0, 0, 0.5)'};
  svg {
    font-size: 18px;
  }
`;

const StyledSearchContainer = styled.div`
  z-index: 6;
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  height: 48px;
  @media only screen and (max-width: 480px) {
    height: 40px;
    width: 77%;
  }

  @media ${(props) => props.theme.device.mobileL} {
    width: 77%;
    height: 36px;
  }

  @media ${(props) => props.theme.device.mobileS} {
    width: 77%;
    height: 34px;
  }

  @media ${(props) => props.theme.device.lowResDesktop} {
    height: 40px;
  }
`;

const StyledSearchWrapper = styled(motion.div)`
  position: absolute;
  z-index: -1;
  transition: all 0.3s ease-out;
  display: block;
  align-items: center;
  width: 100%;
  overflow: hidden;
  padding-right: 48px;
  height: 100%;
  pointer-events: auto;
  @media ${(props) => props.theme.device.mobileL} {
    border-radius: 20px;
    padding-right: 40px;
  }
  overflow: initial;
`;

export const StyledDropDown = styled(motion.div)`
  z-index: -2;
  //position: absolute;
  top: 0px;
  right: 0px;
  max-width: 400px;
  width: 100%;
  height: auto;
  border-radius: 24px;
  //box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
  background-color: ${(props) => props.theme.colors.mainWhite};
  pointer-events: auto;
  overflow: auto;
  @media ${(props) => props.theme.device.mobileL} {
    max-width: 100%;
  }
`;

export const StyledDropdownContentItem = styled.div`
  display: ${(props) => props.type === 'searchResult' && 'flex'};
  align-items: center;
  user-select: none;
  cursor: pointer;
  padding-bottom: 8px;
  border-radius: 5px;

  background-color: ${(props) =>
    props.itemSelected ? props.theme.colors.mainColor3 : ''};
  p {
    margin: 0;
    padding: 0;
  }

  &:hover {
    svg {
      opacity: 0.9;
    }
    opacity: 0.9;
  }
`;

export const StyledDropdownContentItemTitle = styled.p`
  display: ${(props) => props.type === 'searchResult' && 'flex'};
  text-align: ${(props) => props.type === 'noResults' && 'center'};
  font-size: 14px;
  color: ${(props) =>
    props.active ? props.theme.colors.secondaryColorPink : '#504d4d'};
`;

export const StyledHideSearchResultsButton = styled.div``;

const StyledToastIcon = styled(FontAwesomeIcon)`
  color: ${theme.colors.mainColor1};
`;

const Search = () => {
  const [lastSearchValue, setLastSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(true);
  const [isSearchMethodSelectorOpen, setIsSearchMethodSelectorOpen] =
    useState(false);
  const [searchType, setSearchType] = useState('address');

  const {
    isSearchOpen,
    geoJsonArray,
    hasToastBeenShown,
    activeSwitch,
    isMoreSearchOpen
  } = useAppSelector((state) => state.ui);
  const {
    channel,
    allLayers,
    selectedLayersByType,
    featureSearchResults,
    searchResults
  } = useAppSelector((state) => state.rpc);

  const { store } = useContext(ReactReduxContext);

  const [searchClickedRow, setSearchClickedRow] = useState(null);
  const [firstSearchResultShown, setFirstSearchResultShown] = useState(false);
  const [showToast, setShowToast] = useState(
    JSON.parse(localStorage.getItem(SEARCH_TIP_LOCALSTORAGE))
  );
  const [carriageWaySearch, setCarriageWaySearch] = useState(false);

  // Handle search click and direct to the right search handler based on type
  const handleSeach = (searchValue) => {
    switch (searchType) {
      case 'address':
        handleAddressSearch(searchValue);
        break;
      case 'metadata':
        handleMetadataSearch(searchValue);
        break;
      case 'feature':
        handleFeatureSearch(searchValue);
        break;
      default:
        break;
    }
  };

  // Handle every search except feature and metadata
  const handleAddressSearch = (value) => {
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
    setFirstSearchResultShown(false);
    removeMarkersAndFeatures(channel);
    setIsSearching(true);
    if (activeSwitch === 'track') {
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
              setIsSearching(false);
            }
          }
        })
      );
    } else {
      // TODO: swap to rpcSlice function
      channel.postRequest('SearchRequest', [searchValueCopy]);
    }
    store.dispatch(setSearchValue(value));
    setLastSearchValue(value);
    store.dispatch(setSearchResults(null));
  };

  // Handle metadata search
  const handleMetadataSearch = (value) => {
    removeMarkersAndFeatures(channel);
    setIsSearching(true);
    channel.postRequest('MetadataSearchRequest', [
      {
        search: value,
        srs: 'EPSG:3067',
        OrganisationName: 'Väylävirasto'
      }
    ]);
    setLastSearchValue(value);
  };

  // Handle feature search
  const handleFeatureSearch = (searchValue, startIndex = 0, layerId = -1) => {
    const handleSearchResponse = (data) => {
      if (Object.keys(data).length > 0 && Object.keys(data.gfi).length > 0) {
        setIsSearching(false);
        store.dispatch(setSearchOn(false));

        if (startIndex !== 0) {
          // Update features for "more results"
          let oldFeatureSearchResults = JSON.parse(
            JSON.stringify(featureSearchResults)
          );
          let newFeatureSearchResults = { ...data.gfi };
          const contentIndex = oldFeatureSearchResults
            .map((gfi) => gfi.content.layerId)
            .indexOf(data.gfi.content.layerId);
          const updatedFeatures = oldFeatureSearchResults[
            contentIndex
          ].content.geojson.features.concat(data.gfi.content.geojson.features);
          newFeatureSearchResults.content.geojson.features = updatedFeatures;

          const updatedMatchedKeys = mergeMatchedKeys(
            oldFeatureSearchResults[contentIndex].content.geojson
              .matchedFeatures,
            data.gfi.content.geojson.matchedFeatures
          );
          newFeatureSearchResults.content.geojson.matchedFeatures =
            updatedMatchedKeys;

          oldFeatureSearchResults[contentIndex] = newFeatureSearchResults;

          store.dispatch(setFeatureSearchResults(oldFeatureSearchResults));
        } else {
          store.dispatch(pushToFeatureSearchResults(data.gfi));
        }
      } else {
        setIsSearching(false);
        store.dispatch(setSearchOn(false));
      }
      setLastSearchValue(searchValue);
    };

    const handleSearchError = (layerIdentifier, error) => {
      setIsSearching(false);
      store.dispatch(setSearchOn(false));
      setLastSearchValue(searchValue);

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
    };

    setIsSearching(true);
    store.dispatch(setSearchOn(true));
    startIndex === 0 && store.dispatch(resetFeatureSearchResults());

    const searchLayer =
      layerId !== -1 ? layerId : selectedLayersByType.mapLayers[0]?.id;
    const layerIdentifier =
      layerId !== -1 ? layerId : selectedLayersByType.mapLayers[0]?.name;

    if (searchLayer) {
      channel.searchFeatures(
        [[searchLayer], searchValue, startIndex],
        (data) => handleSearchResponse(data, searchLayer),
        (error) => handleSearchError(layerIdentifier, error)
      );
    }
  };

  useEffect(() => {
    channel &&
      channel.handleEvent('SearchResultEvent', function (data) {
        setIsSearching(false);
        if (data.success) {
          if (data.result) {
            store.dispatch(setSearchResults(data));
          }
          if (
            (data?.result?.locations?.length > 1 ||
              data?.result?.geom?.length > 1) &&
            !isMoreSearchOpen
          ) {
            store.dispatch(setIsMoreSearchOpen(true));
          }
        } else {
        }
      });

    channel &&
      channel.handleEvent('MetadataSearchResultEvent', function (data) {
        setIsSearching(false);
        if (data.success) {
          if (data.results) {
            store.dispatch(setSearchResults(data.results));
          }
        }
      });
  }, [channel, activeSwitch]);

  const handleCloseToast = () => {
    setShowToast(false);
    toast.dismiss('searchTipToast');
    store.dispatch(
      setHasToastBeenShown({ toastId: 'searchTipToast', shown: true })
    );
  };

  // TODO: Not in use
  /*
  if (
    searchType === 'address' &&
    isSearchOpen &&
    !hasToastBeenShown.includes('searchToast') &&
    1 === 2 
  ) {
    toast(<SearchToast header={strings.search.tips.title} texts={texts} />, {
      toastId: 'searchToast',
      onClose: () =>
        store.dispatch(
          setHasToastBeenShown({ toastId: 'searchToast', shown: true })
        ),
      position: 'top-right',
      draggable: false
    });
  } else if (!isSearchOpen || searchType !== 'address') {
    toast.dismiss('searchToast');
  }
    */

  useEffect(() => {
    const vkmKeys = ['vali', 'tie', 'osa', 'etaisyys', 'track'];

    if (
      geoJsonArray.length > 0 &&
      isSearchOpen &&
      !hasToastBeenShown.includes('searchTipToast') &&
      showToast !== false
    ) {
      geoJsonArray.forEach((geoj) => {
        if (vkmKeys.some((vkmStyle) => vkmStyle === geoj.style)) {
          toast.info(
            <TipToast
              handleButtonClick={() => handleCloseToast()}
              localStorageName={SEARCH_TIP_LOCALSTORAGE}
              text={
                <div>
                  {' '}
                  <h6>{searchDownloadTips.tip}</h6>{' '}
                  <p>{searchDownloadTips.guide}</p>
                </div>
              }
            />,
            {
              icon: <StyledToastIcon icon={faInfoCircle} />,
              toastId: 'searchTipToast',
              onClose: () => handleCloseToast(),
              position: 'bottom-left',
              draggable: false
            }
          );
          store.dispatch(
            setHasToastBeenShown({ toastId: 'searchTipToast', shown: true })
          );
          return;
        }
      });
    } else toast.dismiss('searchTipToast');
  }, [geoJsonArray]);

  const emptySearchResults = () => {
    store.dispatch(setGeoJsonArray([]));
    store.dispatch(setFeatureSearchResults([]));
    store.dispatch(setSearchResults(null));
    store.dispatch(setSearchValue(''));
    setLastSearchValue('');
    removeMarkersAndFeatures(channel);
  };

  const handleSearchButton = () => {
    if (searchResults || featureSearchResults.length > 0) {
      store.dispatch(setIsSearchOpen(!isSearchOpen));
    } else {
      if (isSearchOpen) {
        store.dispatch(setIsMoreSearchOpen(false));
        store.dispatch(setActiveSwitch('default'));
      }
      store.dispatch(setIsSearchOpen(!isSearchOpen));
      store.dispatch(resetFeatureSearchResults());
      isSearchOpen && store.dispatch(setGeoJsonArray([]));
      setIsSearching(false);
      store.dispatch(setSearchOn(null));
      isSearchOpen && removeMarkersAndFeatures(channel);
      isSearchOpen && store.dispatch(setSearchResults(null));
      isSearchOpen && store.dispatch(setSearchValue(''));
      isSearchMethodSelectorOpen && setIsSearchMethodSelectorOpen(false);
      setSearchType('address');
    }
  };

  // define circlebutton props
  let iconToShow = faSearch;
  let circleButtonText = strings.tooltips.search;
  let circleButtonTooltipBackgroundColor = theme.colors.mainWhite;
  let circleButtonTooltipColor = theme.colors.mainColor1;
  let circleButtonBackgroundColor = theme.colors.mainColor1;
  if (isSearchOpen) {
    if (
      searchResults ||
      (featureSearchResults && featureSearchResults.length > 0)
    ) {
      iconToShow = faMinus;
    } else {
      iconToShow = faTimes;
    }
  } else {
    if (
      searchResults ||
      (featureSearchResults && featureSearchResults.length > 0)
    ) {
      circleButtonText = strings.tooltips.searchActive;
      circleButtonTooltipBackgroundColor = theme.colors.mainColor1Selected;
      circleButtonTooltipColor = theme.colors.mainWhite;
      circleButtonBackgroundColor = theme.colors.mainColor1Selected;
    }
  }

  return (
    <StyledSearchContainer isSearchOpen={isSearchOpen}>
      <CircleButton
        icon={iconToShow}
        text={circleButtonText}
        toggleState={isSearchOpen}
        tooltipDirection={'left'}
        clickAction={handleSearchButton}
        tooltipBackgroundColor={circleButtonTooltipBackgroundColor}
        tooltipColor={circleButtonTooltipColor}
        color={circleButtonBackgroundColor}
      />

      <AnimatePresence>
        {isSearchOpen && (
          <StyledSearchWrapper
            hasGeometry={geoJsonArray.length > 0}
            variants={variants}
            initial={'initial'}
            animate={'animate'}
            exit={'exit'}
            transition={'transition'}
            searchType={searchType}
          >
            <SearchDialog
              firstSearchResultShown={firstSearchResultShown}
              setFirstSearchResultShown={setFirstSearchResultShown}
              setSearchClickedRow={setSearchClickedRow}
              searchClickedRow={searchClickedRow}
              allLayers={allLayers}
              isSearchOpen={isSearchOpen}
              isSearching={isSearching}
              searchType={searchType}
              setSearchType={setSearchType}
              handleSeach={handleSeach}
              carriageWaySearch={carriageWaySearch}
              setCarriageWaySearch={setCarriageWaySearch}
              removeMarkersAndFeatures={removeMarkersAndFeatures}
              handleFeatureSearch={handleFeatureSearch}
              lastSearchValue={lastSearchValue}
              emptySearchResults={emptySearchResults}
            />
          </StyledSearchWrapper>
        )}
      </AnimatePresence>
    </StyledSearchContainer>
  );
};

export default Search;
