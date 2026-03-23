import { useState, useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { motion, AnimatePresence } from 'motion/react';
import {
  faSearch,
  faTimes,
  faInfoCircle,
  faMinus
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import strings from '../../translations';
import {
  SEARCH_GEOJSON_ARRAY_ID,
  SEARCH_TIP_LOCALSTORAGE
} from '../../utils/constants';

import { theme } from '../../theme/theme';

import {
  resetFeatureSearchResults,
  setSearchOn,
  setSearchResults,
  setSearchValue,
  setSearchType,
  setIsSearchingActive
} from '../../state/slices/rpcSlice';

import {
  setIsSearchOpen,
  setHasToastBeenShown,
  setActiveSwitch,
  setIsMoreSearchOpen,
  removeFromGeoJsonArray
} from '../../state/slices/uiSlice';

import CircleButton from '../../utils/components/CircleButton';

import { toast } from 'react-toastify';
import TipToast from '../toasts/TipToast';
import SearchDialog from './SearchDialog';
import {
  removeMarkersAndFeatures,
  searchDownloadTips,
  variants
} from './utils/SearchUtil';
import { useDialogStack } from '../../state/DialogStackContext';

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
  const [isSearchMethodSelectorOpen, setIsSearchMethodSelectorOpen] =
    useState(false);

  const {
    isSearchOpen,
    geoJsonArray,
    hasToastBeenShown,
    activeSwitch,
    isMoreSearchOpen
  } = useAppSelector((state) => state.ui);
  const { channel, featureSearchResults, searchResults } = useAppSelector(
    (state) => state.rpc
  );

  const { store } = useContext(ReactReduxContext);

  const [showToast, setShowToast] = useState(
    JSON.parse(localStorage.getItem(SEARCH_TIP_LOCALSTORAGE))
  );

  // Handle search click and direct to the right search handler based on type

  useEffect(() => {
    channel &&
      channel.handleEvent('SearchResultEvent', function (data) {
        store.dispatch(setIsSearchingActive(false));
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
        store.dispatch(setIsSearchingActive(false));
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

  const handleSearchButton = () => {
    if (searchResults || featureSearchResults.length > 0) {
      store.dispatch(setIsSearchOpen(!isSearchOpen));
    } else if (isSearchOpen) {
      store.dispatch(setIsMoreSearchOpen(false));
      store.dispatch(setActiveSwitch('default'));
      store.dispatch(setIsSearchOpen(false));
      store.dispatch(resetFeatureSearchResults());
      // filter out search geojsons
      isSearchOpen &&
        store.dispatch(removeFromGeoJsonArray(SEARCH_GEOJSON_ARRAY_ID));
      store.dispatch(setIsSearchingActive(false));
      store.dispatch(setSearchOn(null));
      isSearchOpen && removeMarkersAndFeatures(channel);
      isSearchOpen && store.dispatch(setSearchResults(null));
      isSearchOpen && store.dispatch(setSearchValue(''));
      isSearchMethodSelectorOpen && setIsSearchMethodSelectorOpen(false);
      store.dispatch(setSearchType('address'));
    } else {
      store.dispatch(setIsSearchOpen(true));
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

  // handle z-index with dialogs
  const { register, unregister, bringToFront, getZIndex, topId } =
    useDialogStack();

  const idRef = useRef('search-container');

  useEffect(() => {
    const id = idRef.current;
    if (!register) return;
    register(id);

    return () => {
      unregister && unregister(id);
    };
  }, [register, unregister]);

  const handleBringToFront = (e) => {
    e.stopPropagation();
    if (!bringToFront) return;
    if (topId === idRef.current) return;
    bringToFront(idRef.current);
  };

  const zIndex = getZIndex ? getZIndex(idRef.current) : 12;

  return (
    <StyledSearchContainer
      id={'search-container'}
      isSearchOpen={isSearchOpen}
      style={{
        zIndex
      }}
      onPointerDown={(e) => {
        handleBringToFront(e);
      }}
    >
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
            variants={variants}
            initial={'initial'}
            animate={'animate'}
            exit={'exit'}
            transition={'transition'}
          >
            <SearchDialog />
          </StyledSearchWrapper>
        )}
      </AnimatePresence>
    </StyledSearchContainer>
  );
};

export default Search;
