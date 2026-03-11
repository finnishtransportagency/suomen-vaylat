import { useAppSelector } from '../../state/hooks';
import { useContext, useState } from 'react';
import {
  removeMarkersAndFeatures,
} from './utils/SearchUtil';
import { ReactReduxContext } from 'react-redux';
import DefaultSearchInput from './search-input-types/DefaultSearchInput';
import RoadSearchInput from './search-input-types/RoadSearchInput';
import TrackSearchInput from './search-input-types/TrackSearchInput';
import FeatureSearchInput from './search-input-types/FeatureSearchInput';
import {
  searchVKMTrack,
  setFirstSearchResultShown,
  setIsSearchingActive,
  setSearchResults,
  setSearchValue
} from '../../state/slices/rpcSlice';
import {
  setGeoJsonArray,
  setIsMoreSearchOpen
} from '../../state/slices/uiSlice';


const SearchInputs = ({ setDropdownOpen }) => {
  const { store } = useContext(ReactReduxContext);
  const [carriageWaySearch, setCarriageWaySearch] = useState(false);

  const {
    channel,
    isMoreSearchOpen,
  } = useAppSelector((state) => state.rpc);

  const { activeSwitch } = useAppSelector((state) => state.ui);

  const handleGeneralSearch = (value) => {
    setDropdownOpen(false);
    let searchValueCopy = value;
    //special case, roadsearch with 3 params is road/part/distance,
    //unless search ajorata and etaisyys flag ( carriageWaySearch ) found

    //TODO if and when we implement track range search, this should be enabled also to track, for now only road search
    if (
      (activeSwitch === 'road' || activeSwitch === 'default') &&
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
    store.dispatch(setFirstSearchResultShown(false));
    removeMarkersAndFeatures(channel);
    store.dispatch(setIsSearchingActive(true));
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
              store.dispatch(setIsSearchingActive(false));
            }
          }
        })
      );
    } else {
      // TODO: swap to rpcSlice function
      channel.postRequest('SearchRequest', [searchValueCopy]);
    }
    store.dispatch(setSearchValue(value));
    store.dispatch(setSearchResults(null));
  };

  const handleMetadataSearch = (value) => {
    setDropdownOpen(false);
    removeMarkersAndFeatures(channel);
    store.dispatch(setIsSearchingActive(true));
    channel.postRequest('MetadataSearchRequest', [
      {
        search: value,
        srs: 'EPSG:3067',
        OrganisationName: 'Väylävirasto'
      }
    ]);
  };

  return (
    <>
      {['default', 'address', 'nomenclature', 'premise', 'layer'].includes(
        activeSwitch) && (
        <DefaultSearchInput
          handleGeneralSearch={handleGeneralSearch}
          handleMetadataSearch={handleMetadataSearch}
          emptySearchInputs={() => store.dispatch(setSearchValue(''))}
        />
      )}

      {activeSwitch === 'road' && (
        <RoadSearchInput
          carriageWaySearch={carriageWaySearch}
          setCarriageWaySearch={setCarriageWaySearch}
          handleGeneralSearch={handleGeneralSearch}
          emptySearchInputs={() => store.dispatch(setSearchValue(''))}
        />
      )}

      {activeSwitch === 'track' && (
        <TrackSearchInput
          handleGeneralSearch={handleGeneralSearch}
          emptySearchInputs={() => store.dispatch(setSearchValue(''))}
        />
      )}

      {activeSwitch === 'feature' && (
        <FeatureSearchInput
          setDropdownOpen={setDropdownOpen}
          emptySearchInputs={() => store.dispatch(setSearchValue(''))}
        />
      )}
    </>
  );
};

export default SearchInputs;
