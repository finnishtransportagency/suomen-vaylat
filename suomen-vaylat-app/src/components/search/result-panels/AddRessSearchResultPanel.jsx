import strings from '../../../translations';
import {
  StyledDropDown,
  StyledDropdownContentItem,
  StyledSearchIcon,
  StyledDropdownContentItemTitle
} from '../Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { faCity, faRoad, faTrain } from '@fortawesome/free-solid-svg-icons';
import {
  markerId,
  removeMarkersAndFeatures,
  vectorLayerId,
  dropdownVariants
} from '../utils/SearchUtil';
import { theme } from '../../../theme/theme';
import { useAppSelector } from '../../../state/hooks';
import { useContext, useEffect, useMemo } from 'react';
import { ReactReduxContext } from 'react-redux';
import { setGeoJsonArray } from '../../../state/slices/uiSlice';
import {
  VKMGeoJsonHoverStyles,
  VKMGeoJsonStyles
} from '../utils/VKMSearchStyles';
import {
  addMarkerRequest,
  mapMoveRequest,
  setFirstSearchResultShown
} from '../../../state/slices/rpcSlice';

const AddressSearchResultPanel = ({
  setSearchClickedRow,
  searchClickedRow
}) => {
  const { activeSwitch } = useAppSelector((state) => state.ui);
  const { channel, searchResults, firstSearchResultShown } = useAppSelector(
    (state) => state.rpc
  );
  const { store } = useContext(ReactReduxContext);

  const typeResolvTable = [
    ['address', 'Osoite'],
    ['premise', 'Kiinteistötunnus'],
    ['track', 'VKM']
  ];
  const typeMap = new Map(typeResolvTable);
  const nonNomenclatureTypes = Array.from(typeMap.values());

  // Guard: ensure we always work with an array
  const locations =
    searchResults &&
    searchResults.result &&
    Array.isArray(searchResults.result.locations)
      ? searchResults.result.locations
      : [];

  // compute filteredResult via useMemo for stability
  const filteredResult = useMemo(() => {
    if (!locations.length) return [];
    return locations.filter((res) => {
      if (activeSwitch === null || activeSwitch === undefined) {
        return true;
      }
      let showResult = false;
      switch (activeSwitch) {
        case 'track':
          showResult = res.type === 'VKM' && res.vkmType === 'track';
          break;
        case 'address':
          showResult = res.type === typeMap.get(activeSwitch);
          break;
        case 'premise':
          showResult = res.type === typeMap.get(activeSwitch);
          break;
        case 'road':
          showResult = res.type === 'VKM' && res.vkmType === 'road';
          break;
        case 'nomenclature':
          showResult =
            res.channelId === 'NLSFI_GEOCODING' &&
            !nonNomenclatureTypes.includes(res.type);
          break;
        default:
          return true;
      }
      return showResult;
    });
  }, [locations, activeSwitch, typeMap, nonNomenclatureTypes]);

  const handleSearchSelect = (
    name,
    lon,
    lat,
    geom,
    osa,
    ajorata,
    etaisyys,
    osaLoppu,
    etaisyysLoppu,
    type
  ) => {
    removeMarkersAndFeatures(channel);
    if (!geom) {
      store.dispatch(
        addMarkerRequest({
          x: lon,
          y: lat,
          msg: name || '',
          markerId: markerId,
          color: theme.colors.secondaryColorPink
        })
      );

      store.dispatch(
        mapMoveRequest({
          x: lon,
          y: lat
        })
      );
    } else if (type === 'road') {
      let style = 'tie';
      if (osaLoppu && etaisyysLoppu) {
        style = 'vali';
      } else if ((osa || ajorata) && !etaisyys) {
        style = 'osa';
      } else if (etaisyys) {
        style = 'etaisyys';
      }
      let featureStyle = VKMGeoJsonStyles.road[style];
      let hover = VKMGeoJsonHoverStyles.road[style];

      if (style === 'tie') {
        removeMarkersAndFeatures(channel);
      }

      channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
        geom,
        {
          clearPrevious: true,
          centerTo: true,
          hover: hover,
          featureStyle: featureStyle,
          layerId: vectorLayerId + '_vkm_' + style,
          maxZoomLevel: 10
        }
      ]);

      store.dispatch(
        setGeoJsonArray([
          {
            data: {
              geom: geom
            },
            style: style,
            hover: hover,
            featureStyle: featureStyle
          }
        ])
      );
    } else if (type === 'track') {
      let featureStyle = VKMGeoJsonStyles['track'];
      let hover = VKMGeoJsonHoverStyles['track'];

      channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
        geom,
        {
          centerTo: true,
          hover: hover,
          featureStyle: featureStyle,
          layerId: vectorLayerId + '_vkm_track',
          maxZoomLevel: 10
        }
      ]);
      store.dispatch(
        setGeoJsonArray([
          {
            data: {
              geom: geom
            },
            style: 'track',
            hover: hover,
            featureStyle: featureStyle
          }
        ])
      );
    }
  };

  // SIDE EFFECT: when there's exactly one filtered result and we haven't shown it yet,
  // do the map selection and mark it shown. This runs AFTER render (no setState during render).
  useEffect(() => {
    if (!filteredResult || filteredResult.length !== 1) return;
    if (firstSearchResultShown) return;

    const res = filteredResult[0];
    // call the same handler as before
    handleSearchSelect(
      res.name,
      res.lon,
      res.lat,
      res.geom,
      res.osa,
      res.ajorata,
      res.etaisyys,
      res.osa_loppu,
      res.etaisyys_loppu,
      res.vkmType
    );

    // mark as shown and dismiss toast (these are safe here)
    store.dispatch(setFirstSearchResultShown(true));
    toast.dismiss('searchToast');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredResult, firstSearchResultShown]);

  return (
    <StyledDropDown
      id={'dropdown-content-address'}
      key={'dropdown-content-address'}
      variants={dropdownVariants}
      initial={'initial'}
      animate={'animate'}
      exit={'exit'}
      transition={'transition'}
    >
      {filteredResult && filteredResult.length > 0 ? (
        filteredResult.map(
          (
            {
              name,
              region,
              type,
              lon,
              lat,
              vkmType,
              geom,
              osa,
              ajorata,
              etaisyys,
              osa_loppu,
              etaisyys_loppu
            },
            index
          ) => {
            let visibleText;
            if (name === region) {
              visibleText = name;
              if (type) {
                visibleText += ' (' + type.toLowerCase() + ')';
              }
            } else if (region && type) {
              visibleText =
                name + ', ' + region + ' (' + type.toLowerCase() + ')';
            } else if (type) {
              visibleText = name + ' (' + type.toLowerCase() + ')';
            } else {
              visibleText = name;
            }

            return (
              <StyledDropdownContentItem
                id={'address-dropdown-'+ name + '_' + index}
                key={name + '_' + index}
                tabIndex={0}
                type={'searchResult'}
                onClick={() => {
                  handleSearchSelect(
                    name,
                    lon,
                    lat,
                    geom,
                    osa,
                    ajorata,
                    etaisyys,
                    osa_loppu,
                    etaisyys_loppu,
                    vkmType
                  );
                  setSearchClickedRow(index);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSelect(
                      name,
                      lon,
                      lat,
                      geom,
                      osa,
                      ajorata,
                      etaisyys,
                      osa_loppu,
                      etaisyys_loppu,
                      vkmType
                    );
                    setSearchClickedRow(index);
                  }
                }}
              >
                <StyledSearchIcon
                  active={searchClickedRow === index || locations.length === 1}
                >
                  <FontAwesomeIcon
                    icon={
                      vkmType && vkmType === 'road'
                        ? faRoad
                        : vkmType && vkmType === 'track'
                        ? faTrain
                        : faCity
                    }
                  />
                </StyledSearchIcon>
                <StyledDropdownContentItemTitle
                  id={'styled-dropdown-content-item-title' + name}
                  type={'searchResult'}
                  active={searchClickedRow === index || locations.length === 1}
                >
                  {visibleText}
                </StyledDropdownContentItemTitle>
              </StyledDropdownContentItem>
            );
          }
        )
      ) : (
        <div>
          {activeSwitch === 'track'
            ? strings.search.vkm.trackError.text
            : strings.search.address.error.text}
        </div>
      )}
    </StyledDropDown>
  );
};

export default AddressSearchResultPanel;
