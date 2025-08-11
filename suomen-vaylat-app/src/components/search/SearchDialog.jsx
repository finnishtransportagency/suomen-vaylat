import styled from 'styled-components';
import strings from '../../translations';
import { ReactReduxContext } from 'react-redux';
import { setActiveSwitch } from '../../state/slices/uiSlice';
import { useAppSelector } from '../../state/hooks';
import { useEffect, useContext, useState, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SearchSwitch from './utils/SearchSwitch';
import { faChevronDown, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import SearchResultPanel from './SearchResultPanel';
import { resetFeatureSearchResults } from '../../state/slices/rpcSlice';
import { removeMarkersAndFeatures } from './utils/SearchUtil';
import { isMobile } from '../../theme/theme';
import SearchInput from './SearchInput';

const StyledSearchDialog = styled.div`
  border: none;
  width: 100%;
  padding: 1em;
  &:focus {
    outline: none;
  }
  position: absolute;
  top: 24px;
  right: 24px;
  background-color: white;
  border-radius: 5px;
  box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 6px 6px;
  font-size: 15px;
  font-weight: 400;
  max-height: ${(props) =>
    props.isMobile
      ? window.innerHeight - 50 + 'px'
      : window.innerHeight - 200 + 'px'};
  overflow: auto;
`;

const DropdownWrapper = styled.div`
  width: 100%;
  margin-bottom: 1em;
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: ${(props) => props.theme.colors.mainColor1};
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 12px;
  padding: 8px 0;
  user-select: none;
`;

const DropdownContent = styled.div`
  padding-left: 2px;
  padding-bottom: 8px;
  transition: all 0.3s;
  display: ${(props) => (props.open ? 'block' : 'none')};
`;

const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const InfoText = styled.div`
  background: #eef3fb;
  border-radius: 5px;
  padding: 10px 16px;
  margin: 6px 0 6px 34px;
  font-size: 0.97em;
  color: #234167;
`;

const switchDefinitions = [
  {
    id: 'road',
    title: strings.search.vkm.title,
    tooltipText: strings.search.tips.vkmRoadExamples,
    tooltipAddress: strings.search.tips.vkmRoad
  },
  {
    id: 'track',
    title: strings.search.vkm.trackTitle,
    tooltipText: strings.search.tips.vkmTrackExamples,
    tooltipAddress: strings.search.tips.vkmTrack
  },
  {
    id: 'address',
    title: strings.tooltips.searchButton,
    tooltipText: strings.search.tips.addressExamples,
    tooltipAddress: strings.search.tips.address
  },
  {
    id: 'nomenclature',
    title: strings.search.nomenclature.title,
    tooltipText: strings.search.tips.nomenclatureExamples,
    tooltipAddress: strings.search.tips.nomenclature
  },
  {
    id: 'premise',
    title: strings.search.premise.title,
    tooltipText: strings.search.tips.realEstateUnitIdentifierExamples,
    tooltipAddress: strings.search.tips.realEstateUnitIdentifier
  },
  {
    id: 'layer',
    title: strings.search.layer.title,
    tooltipText: strings.search.tips.layerExamples,
    tooltipAddress: strings.search.tips.layer
  },
  {
    id: 'feature',
    title: strings.search.feature.title,
    tooltipText: strings.search.tips.featureExamples,
    tooltipAddress: strings.search.tips.feature
  }
];

const SearchDialog = ({
  searchValue,
  setSearchValue,
  searchResults,
  setSearchResults,
  firstSearchResultShown,
  setFirstSearchResultShown,
  setShowSearchResults,
  setSearchClickedRow,
  searchClickedRow,
  allLayers,
  isSearchOpen,
  showSearchResults,
  searchType,
  setSearchType,
  handleSeach,
  carriageWaySearch,
  setCarriageWaySearch,
  trackErrors,
  setTrackErrors,
  validateTrackSearch,
  featureErrors,
  handleFeatureSearch,
  lastSearchValue
}) => {
  const { store } = useContext(ReactReduxContext);
  const { selectedLayersByType, channel } = useAppSelector(
    (state) => state.rpc
  );
  const { activeSwitch } = useAppSelector((state) => state.ui);
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const [infoOpenId, setInfoOpenId] = useState(null);

  const updateActiveSwitch = (type) => {
    // if no specific search is selected, default to address
    if (activeSwitch !== type) {
      store.dispatch(setActiveSwitch(type));
      if (type === 'layer') setSearchType('metadata');
      else if (type === 'feature') setSearchType('feature');
      else setSearchType('address');
    } else {
      store.dispatch(setActiveSwitch(null));
      setSearchType('address');
    }
    setSearchResults(null);
    setShowSearchResults(false);
    setSearchValue('');
    store.dispatch(resetFeatureSearchResults());
    removeMarkersAndFeatures(channel);
  };

  useEffect(() => {
    //track validation every time searchValue changes
    if (activeSwitch === 'track') {
      validateTrackSearch(searchValue, setTrackErrors);
    }
    setSearchValue(searchValue);
  }, [
    activeSwitch,
    searchValue,
    setSearchValue,
    setTrackErrors,
    validateTrackSearch
  ]);

  const handleSwitchInfo = (id) => {
    setInfoOpenId(infoOpenId === id ? null : id);
  };

  return (
    <StyledSearchDialog>
      <SearchInput
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        firstSearchResultShown={firstSearchResultShown}
        setFirstSearchResultShown={setFirstSearchResultShown}
        setShowSearchResults={setShowSearchResults}
        setSearchClickedRow={setSearchClickedRow}
        searchClickedRow={searchClickedRow}
        allLayers={allLayers}
        isSearchOpen={isSearchOpen}
        showSearchResults={showSearchResults}
        searchType={searchType}
        setSearchType={setSearchType}
        handleSeach={handleSeach}
        carriageWaySearch={carriageWaySearch}
        setCarriageWaySearch={setCarriageWaySearch}
        removeMarkersAndFeatures={removeMarkersAndFeatures}
        trackErrors={trackErrors}
        setTrackErrors={setTrackErrors}
        validateTrackSearch={validateTrackSearch}
        featureErrors={featureErrors}
        handleFeatureSearch={handleFeatureSearch}
        lastSearchValue={lastSearchValue}
      />

      <DropdownWrapper>
        <DropdownHeader onClick={() => setDropdownOpen((o) => !o)}>
          <span>Hakuasetukset</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            rotation={dropdownOpen ? 180 : undefined}
          />
        </DropdownHeader>
        <DropdownContent open={dropdownOpen}>
          {switchDefinitions.map((sw, index) => (
            <Fragment key={sw.id}>
              <SwitchRow id={"swrow_" + index}>
                <SearchSwitch
                  isSelected={activeSwitch === sw.id}
                  action={() => updateActiveSwitch(sw.id)}
                  title={sw.title}
                  tooltipText={sw.tooltipText}
                  tooltipAddress={sw.tooltipAddress}
                  id={sw.id}
                  isMobile={isMobile}
                />
              </SwitchRow>
              {infoOpenId === sw.id && (
                <InfoText>
                  <strong>{sw.title}</strong>
                  <div>{sw.tooltipAddress}</div>
                  <div style={{ marginTop: 6, color: "#666", fontSize: "0.96em"}}>
                    {Array.isArray(sw.tooltipText)
                      ? sw.tooltipText.map((txt, i) => <div key={i}>{txt}</div>)
                      : sw.tooltipText}
                  </div>
                </InfoText>
              )}
            </Fragment>
          ))}
        </DropdownContent>
      </DropdownWrapper>


      <SearchResultPanel
        isSearchOpen={isSearchOpen}
        searchResults={searchResults}
        showSearchResults={showSearchResults}
        searchType={searchType}
        firstSearchResultShown={firstSearchResultShown}
        setFirstSearchResultShown={setFirstSearchResultShown}
        setShowSearchResults={setShowSearchResults}
        setSearchClickedRow={setSearchClickedRow}
        handleFeatureSearch={handleFeatureSearch}
        lastSearchValue={lastSearchValue}
        searchClickedRow={searchClickedRow}
        allLayers={allLayers}
      />
    </StyledSearchDialog>
  );
};

export default SearchDialog;
