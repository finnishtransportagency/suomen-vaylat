import { useContext, useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'motion/react';
import {
  faTimes,
  faSearchLocation,
  faMapMarkedAlt,
  faDownload,
  faAngleLeft,
  faAngleRight,
  faLayerGroup,
  faStreetView
} from '@fortawesome/free-solid-svg-icons';
import proj4 from 'proj4';
import { Tooltip } from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import strings from '../../translations';
import { useAppSelector } from '../../state/hooks';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Controller, FreeMode } from 'swiper/modules';
import {
  setIsGfiDownloadToolsOpen,
  setMinimizeGfi,
  setWarning,
} from '../../state/slices/uiSlice';
import {
  resetGFILocations,
  addFeaturesToGFILocations,
  setFilters,
  removeMarkerRequest
} from '../../state/slices/rpcSlice';
import FeatureDataTabContent from './tabs/FeatureDataTabContent';
import FeatureDataDownloadTools from './download/FeatureDataDownloadTools';
import SVLoader from '../../utils/components/SvLoader';
import { theme, isMobile } from '../../theme/theme';
import { filterFeature } from '../../utils/gfiUtil';
import { renderLinksInText } from '../../utils/commonUtil';
import { SortingMode, PagingPosition } from 'ka-table/enums';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import PillButton from '../../utils/components/PillButton';

// Max amount of features that wont trigger react-data-table-component
const KUNTA_IMAGE_URL =
  'https://www.kuntaliitto.fi/sites/default/files/styles/narrow_320_x_600_/public/media/profile_pictures/';



const StyledAccordion = styled(Accordion)`
  margin: 0px !important;
  box-shadow: none !important;
  border-bottom: 1px solid ${(props) => props.theme.colors.lightGrey};
`;

const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
  svg {
    font-size: 34px !important;
  }
  color: ${(props) => props.theme.colors.mainColor1};
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  padding: 0 12px !important;
  min-height: 0px !important;
  .Mui-expanded {
    margin: 12px 0 !important;
  }
`;

const AccordionSummaryLabel = styled(Typography)`
  color: ${(props) => props.theme.colors.mainColor1};
  font-weight: 600 !important;
`;

const StyledGfiContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 480px;
`;

const StyledVKMDataContainer = styled(motion.div)`
    user-select: text;
    display: flex;
    align-items: flex-start;
    color: ${(props) => props.theme.colors.mainColor1};
    justify-content: space-evenly;
    img {s
        max-width: 100px;
    };
    h5 {
        margin: 0;
        font-size: 22px;
        font-weight: 600;
    };
    @media ${(props) => props.theme.device.mobileM} {
        margin: 0px 5px;
        img {
            max-width: 70px;
        };
        h5 {
            font-size: 18px;
        };
        h6 {
            font-size: 15px;
        };
        p {
            font-size: 13px;
        };
    };
`;

const StyledVKMDataMunacipalityImageWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-right: 8px;
  img {
    max-height: 100px;
  }
  user-select: text;
`;

const StyledVkmInstruction = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  && p {
    font-size: 14px;
  }
  margin-left: 16px;
  @media ${(props) => props.theme.device.mobileM} {
    margin-left: 5px;
  }
`;

const StyledCoordinatesWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  margin-left: 16px;
  p {
    margin: 0px;
    font-size: 14px;
  }
  @media ${(props) => props.theme.device.mobileM} {
    margin: 0px;
  }
`;

const StyledVKMDataInfoWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-left: 16px;
  user-select: text;
  @media ${(props) => props.theme.device.mobileM} {
    margin-left: 5px;
  }
`;

const StyledVkmDataItems = styled.div`
  display: flex;
  flex-direction: column;
  && p {
    font-size: 14px;
    margin: 0px;
  }
`;

const StyledTabSwiperContainer = styled.div`
  z-index: 2;
  display: flex;
  background-color: ${(props) => props.theme.colors.mainColor1};
`;

const StyledTabName = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  @media ${(props) => props.theme.device.mobileL} {
    font-size: 14px;
  }
`;

const StyledNoGfisContainer = styled.div`
  max-width: 520px;
  height: max-content;
  display: flex;
  padding: 24px;
  flex-direction: column;
  font-size: 18px;
  color: ${(props) => props.theme.colors.mainColor1};
`;

const StyledSubtitle = styled.div`
  display: flex;
  justify-content: flex-start;
  color: ${(props) => props.theme.colors.mainColor1};
  padding: 10px 0px 10px 5px;
  font-size: 16px;
  font-weight: bold;
`;

const StyledInfoTextContainer = styled.ul`
  li {
    font-size: 14px;
    color: ${(props) => props.theme.colors.mainColor1};
  }
`;

const StyledSwiper = styled(Swiper)`
  width: 100%;
  .swiper-slide {
    height: 1px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .swiper-slide-active {
    height: auto;
  }
`;

const StyledTabsSwiper = styled(Swiper)`
  margin-left: unset;
  width: 100%;
  padding-top: 8px;
  .swiper-slide {
    max-width: 200px;
  }
  .swiper-slide-active {
  }
`;

const StyledSwiperNavigatorButton = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  background-color: ${(props) => props.theme.colors.mainColor1};
  svg {
    font-size: 20px;
    color: white;
  }
`;

const StyledGfiTab = styled.div`
  z-index: 10;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${(props) =>
    props.selected
      ? props.theme.colors.mainColor1
      : props.theme.colors.mainWhite};
  background-color: ${(props) =>
    props.selected
      ? props.theme.colors.mainWhite
      : props.theme.colors.mainColor1};
  border-left: 2px solid ${(props) => props.theme.colors.mainWhite};
  border-top: 2px solid ${(props) => props.theme.colors.mainWhite};
  border-right: 2px solid ${(props) => props.theme.colors.mainWhite};
  padding: 8px 16px 8px 8px;
  border-radius: 4px 4px 0px 0px;
`;

const StyledTabCloseButton = styled.div`
  display: flex;
  justify-content: center;
  margin-left: 12px;
`;

const StyledTabContent = styled.div`
  user-select: text;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;    /* grow/shrink and take remaining space */
  min-height: 0;     /* critical: allow child to scroll */
  overflow-y: auto;  /* scroll when content overflows */

  /* rest of your styles preserved... */
  div.contentWrapper-infobox {
    @media ${(props) => props.theme.device.mobileL} {
      font-size: 14px;
    }
  }

  hr.infoboxLine {
    border: 1px solid;
    margin-top: 10px;
  }

  span.infoboxActionLinks {
    padding-right: 15px;
  }

  table {
    border-top: 1px solid #ddd;
    padding-right: 0px !important;
    width: 100%;
    tr:nth-child(odd) {
      background-color: #f2f2f2;
    }
  }

  .ka-thead-cell {
    background-color: white;
    width: ${(props) => (props.isMobile ? '10em' : 'auto')};
    min-width: 120px;
    span {
      color: ${(props) => props.theme.colors.mainColor1};
    }
  }

  .ka-cell-text {
    -webkit-user-select: text; /* Chrome / Safari */
    -moz-user-select: text; /* Firefox */
    -ms-user-select: text; /* IE 10+ */
    user-select: text;
    max-height: 150px;
    overflow: hidden;
  }

  .ka-thead-cell-content,
  .ka-cell-text {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ka-thead-cell-resize {
    width: 5px;
  }

  .low-priority-table {
    margin-left: 0px;
  }

  .ka-thead-cell-content {
    font-size: 14px;
    font-weight: 600;
    color: #212529;
  }
`;

const StyledFeaturesInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledFeatureAmount = styled.p`
  text-align: center;
  color: ${(props) => props.theme.colors.mainColor1};
  margin: 5px 0px 10px 0px;
  font-weight: 500;
`;

const StyledShowMoreButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledDownloadAndLocationButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const StyledButtonsContainer = styled.div`
  border-top: 1px solid #cdcdcd;
  margin-top: auto;
  padding: 12px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  pointer-events: auto; /* allow clicks */
  background: transparent;
`;

const StyledGfiToolsContainer = styled(motion.div)`
  display: flex;
  position: absolute;
  height: 100%;
  z-index: 3;
`;

const StyledGfiBackdrop = styled(motion.div)`
  z-index: 2;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
`;

const StyledLoadingOverlay = styled(motion.div)`
  z-index: 2;
  position: fixed;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
`;

const StyledLoaderWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 999;
  height: 100%;
  max-width: 200px;
  max-height: 200px;
  transform: translate(-50%, -50%);
  svg {
    width: 100%;
    height: 100%;
    fill: none;
  }
`;

export const FeatureDataPopup = () => {
  const LAYER_ID = 'gfi-result-layer';

  const { store } = useContext(ReactReduxContext);
  const {
    channel,
    allLayers,
    gfiLocations,
    vkmData,
    pointInfoImageError,
    setPointInfoImageError,
    gfiCroppingArea,
    pointInfo,
    filters,
  } = useAppSelector((state) => state.rpc);

  const { isGfiDownloadToolsOpen } = useAppSelector((state) => state.ui);

  const [point, setPoint] = useState(null);

  const [selectedTab, setSelectedTab] = useState(0);
  const [tabsIds, setTabsIds] = useState([]);

  const [isVKMInfoOpen, setIsVKMInfoOpen] = useState(vkmData ? true : false);
  const [gfiTabsSwiper, setGfiTabsSwiper] = useState(null);
  const [gfiTabsSnapGridLength, setGfiTabsSnapGridLength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [disableDownload, setDisableDownload] = useState(false);

  // Number of total features of current tab
  const [totalfeaturesCount, setTotalfeaturesCount] = useState(0);
  // Number of features present (like with filter on) on tab
  const [featuresCount, setFeaturesCount] = useState(0);
  // Are there more features for this tab
  const [moreFeatures, setMoreFeatures] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const gfiInputEl = useRef(null);

  useEffect(() => {
    if (gfiLocations.length === 0) {
      setSelectedTab(0);
      setDisableDownload(true);
      setTabsIds([]);
    } else {
      const onlyUserLayers = gfiLocations.every(
        l => typeof l.layerId === 'string' && l.layerId.startsWith('userlayer_')
      );
      setDisableDownload(onlyUserLayers);

      let layerIds = [];
      gfiLocations.forEach((location) => {
        layerIds.push(location.layerId);
      });

      setTabsIds(layerIds);
    }
  }, [gfiLocations]);

  useEffect(() => {
    if (gfiLocations === null || gfiLocations.length === 0) return;
    const location = gfiLocations[selectedTab];
    setSelectedLocation(location);

    let totalFeaturesCount = 0;
    location?.content?.forEach((cont) => {
      totalFeaturesCount += cont.geojson.totalFeatures;
    });

    let featuresCount = 0;

    // count the amount of results when filtered
    location?.content?.forEach((cont) => {
      cont.geojson?.features?.forEach((feature) => {
        if (filterFeature(feature, location, filters, channel)) {
          featuresCount += 1;
        }
      });
    });
    setTotalfeaturesCount(totalFeaturesCount);
    setFeaturesCount(featuresCount);
    setMoreFeatures(location.moreFeatures);
  }, [selectedTab, channel, filters, gfiLocations]);

  const handleLinkClick = (event) => {
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
              window.open(
                'http://maps.google.com/maps?q=&layer=c&cbll=' + point,
                '_blank'
              );
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
      window.open(
        'http://maps.google.com/maps?q=&layer=c&cbll=' + point,
        '_blank'
      );
    }
  };

  // If download tools is open when me make a new feature selection, close it
  useEffect(() => {
    isGfiDownloadToolsOpen && store.dispatch(setIsGfiDownloadToolsOpen(false));
  }, [gfiLocations]);

  // Zoom to features
  const handleOverlayGeometry = (layerId) => {
    const geoJson = gfiLocations.filter((l) => l.layerId === layerId)[0]
      .content;
    // empty possible earlier overlays
    channel &&
      channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
        null,
        null,
        LAYER_ID
      ]);

    // add new overlay
    if (geoJson !== null) {
      channel &&
        channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
          geoJson[0].geojson,
          {
            layerId: LAYER_ID,
            centerTo: true,
            maxZoomLevel: 13,
            cursor: 'pointer',
            featureStyle: {
              fill: {
                color: 'rgba(10, 140, 247, 0.3)'
              },
              stroke: {
                color: 'rgba(10, 140, 247, 0.3)',
                width: 5,
                lineDash: 'solid',
                lineCap: 'round',
                lineJoin: 'round',
                area: {
                  color: 'rgba(100, 255, 95, 0.7)',
                  width: 4,
                  lineJoin: 'round'
                }
              },
              image: {
                shape: 2,
                size: 5,
                fill: {
                  color: 'rgba(100, 255, 95, 0.7)'
                }
              }
            }
          }
        ]);
    }
  };

  const addGFIResultsToMap = (filteredFeatures) => {
    if (filteredFeatures.length === 0) {
      channel &&
        channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
          null,
          null,
          LAYER_ID
        ]);
    } else {
      filteredFeatures[0].geometry?.type === 'Point' &&
        store.dispatch(removeMarkerRequest({ markerId: 'VKM_MARKER' }));

      let featureStyle = {
        fill: {
          color: 'rgba(10, 140, 247, 0.3)'
        },
        stroke: {
          color: 'rgba(10, 140, 247, 0.3)',
          width: 5,
          lineDash: 'solid',
          lineCap: 'round',
          lineJoin: 'round',
          area: {
            color: 'rgba(100, 255, 95, 0.8)',
            width: 4,
            lineJoin: 'round'
          }
        },
        image: {
          shape: 2,
          size: 5,
          fill: {
            color: 'rgba(100, 255, 95, 0.8)'
          }
        }
      };

      let options = {
        featureStyle: featureStyle,
        layerId: LAYER_ID,
        animationDuration: 200,
        clearPrevious: true
      };

      let rn = 'MapModulePlugin.AddFeaturesToMapRequest';

      var geojsonObject = {
        type: 'FeatureCollection',
        crs: {
          type: 'name',
          properties: {
            name: 'EPSG:3067'
          }
        },
        features: filteredFeatures
      };

      channel.postRequest(rn, [geojsonObject, options]);
    }
  };

  const tablePropsInit = (index, data) => {
    // Handle legacy geojson structure
    if (data.type === 'geojson') {
      const properties =
        data &&
        data.content &&
        data.content[0] &&
        data.content[0].geojson &&
        data.content[0].geojson.features &&
        data.content[0].geojson.features[0].properties;

      var highPriorityColumns =
        properties?._orderHigh && JSON.parse(properties?._orderHigh);
      var lowPriorityColumns =
        properties?._order && JSON.parse(properties?._order);

      const curLayerMeta = allLayers.filter((l) => l.id === data.layerId)[0];
      var columnsArray = [];
      var columns =
        highPriorityColumns && highPriorityColumns.concat(lowPriorityColumns);
      columns &&
        columns.forEach((column) => {
          if (column !== 'UID') {
            columnsArray.push({
              key: column,
              title: column,
              width: 180,
              colGroup: { style: { minWidth: 120 } }
            });
          }
        });

      var filterColumnsArray = [];

      curLayerMeta?.config?.gfi?.filterFields &&
        curLayerMeta?.config?.gfi?.filterFields.forEach((column) => {
          if (column.field && column.type) {
            filterColumnsArray.push({
              key: column.field,
              title: column.field,
              type: column.type
            });
          }
        });

      var cells = [];
      var filteredFeatures = [];

      data &&
        data?.content?.forEach((cont) => {
          var featureCells = cont.geojson?.features
            ? cont.geojson.features
                .filter((feature) =>
                  filterFeature(feature, data, filters, channel)
                )
                .map((feature) => {
                  if (!feature.hasOwnProperty('id')) {
                    var extendedFeature = { ...feature };
                    extendedFeature.id = uuidv4();
                    filteredFeatures.push(extendedFeature);
                  } else {
                    filteredFeatures.push(feature);
                  }
                  var cell = { ...feature.properties };
                  if (cell.hasOwnProperty('id')) {
                    cell['id'] = feature.id || uuidv4();
                  } else {
                    cell.id = feature.id || uuidv4();
                  }
                  cell.hasOwnProperty('UID') && delete cell['UID'];
                  cell.hasOwnProperty('_orderHigh') &&
                    delete cell['_orderHigh'];
                  cell.hasOwnProperty('_order') && delete cell['_order'];
                  return cell;
                })
            : [];
          cells.push(...featureCells);
        });

      // Set filtered results to map
      selectedTab === index && addGFIResultsToMap(filteredFeatures);

      const tablePropsInit = {
        columns: columnsArray,
        filterableColumns: filterColumnsArray,
        filteredFeatures: filteredFeatures,
        data: cells,
        rowKeyField: 'id',
        sortingMode: SortingMode.SingleTripleState,
        columnResizing: true,
        paging: {
          enabled: true,
          pageIndex: 0,
          pageSize: 100,
          pageSizes: [10, 50, 100],
          position: PagingPosition.Bottom
        },
        format: ({ value }) => {return renderLinksInText(value)}
      };
      return tablePropsInit;
    }

    // === Handle new flat json structure ===
    if (data.type === 'json') {
      // (support both cases: data.content can be [{...}] or something else)
      let rows = [];
      if (data.content && Array.isArray(data.content)) {
        // If entries have "geojson" field, it's not our new structure
        if (
          data.content[0] &&
          typeof data.content[0] === 'object' &&
          data.content[0].geojson
        ) {
          rows = data.content;
        }
      }
      // Defensive, in case content is a single object (not array)
      if (
        !rows.length &&
        data.content &&
        typeof data.content === 'object' &&
        !Array.isArray(data.content)
      ) {
        rows = [data.content];
      }

      let columnsArray = [];
      if (rows.length > 0) {
        columnsArray = Object.keys(rows[0])
          .filter((k) => k !== 'id' && k !== 'UID')
          .map((key) => ({
            key,
            title: key,
            width: 180,
            colGroup: { style: { minWidth: 120 } }
          }));
      }

      // For filterable columns support
      let filterColumnsArray = columnsArray.map(({ key }) => ({
        key,
        title: key,
        type: 'text'
      }));

      // Ensure every row/cell has a unique id (for Table needs)
      const cells = rows.map((row, idx) => ({
        ...row,
        id: row.id || `${strings.row}-${idx}`
      }));

      // Compose for Table
      const tablePropsInit = {
        columns: columnsArray,
        filterableColumns: filterColumnsArray,
        filteredFeatures: cells,
        data: cells,
        rowKeyField: 'id',
        sortingMode: SortingMode.SingleTripleState,
        columnResizing: true,
        paging: {
          enabled: true,
          pageIndex: 0,
          pageSize: 100,
          pageSizes: [10, 50, 100],
          position: PagingPosition.Bottom
        },
        format: ({ value }) => {return renderLinksInText(value)}
      };
      return tablePropsInit;
    }

    // Defensive: If falls through, return empty table structure
    return {
      columns: [],
      filterableColumns: [],
      filteredFeatures: [],
      data: [],
      rowKeyField: 'id',
      sortingMode: SortingMode.SingleTripleState,
      columnResizing: true,
      paging: {
        enabled: true,
        pageIndex: 0,
        pageSize: 100,
        pageSizes: [10, 50, 100],
        position: PagingPosition.Bottom
      },
      format: ({ value }) => value
    };
  };

  const closeTab = (index, id) => {
    const updatedFilters = filters.filter((filter) => filter.layer !== id);
    store.dispatch(setFilters(updatedFilters));

    var filteredLocations = gfiLocations.filter((gfi) => gfi.layerId !== id);
    store.dispatch(resetGFILocations(filteredLocations));
    channel &&
      channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
        null,
        null,
        LAYER_ID
      ]);
    if (index > 0) {
      setSelectedTab(index - 1);
    } else {
      setSelectedTab(0);
    }
  };

  useEffect(() => {
    gfiInputEl?.current?.swiper?.slideTo(selectedTab);
  }, [selectedTab]);

  const getMoreFeatures = (content, layerId) => {
    setIsLoading(true);

    for (var i = 0; i < content.length; i++) {
      content[i].moreFeatures &&
        channel.getFeaturesByGeoJSON &&
        channel.getFeaturesByGeoJSON(
          [[gfiCroppingArea[i]], content[i].nextStartIndex, [layerId]],
          function (data) {
            data.gfi.forEach((gfi) => {
              gfi.content.length > 0 &&
                store.dispatch(
                  addFeaturesToGFILocations({
                    layerId: gfi.layerId,
                    content: gfi.content[0],
                    moreFeatures: gfi.content[0].moreFeatures,
                    selectedGFI: selectedTab
                  })
                );
            });
            setIsLoading(false);
          },
          () => {
            store.dispatch(
              setWarning({
                title: strings.bodySizeWarning,
                subtitle: null,
                cancel: {
                  text: strings.general.ok,
                  action: () => {
                    setIsLoading(false);
                    store.dispatch(setWarning(null));
                  }
                }
              })
            );
          }
        );
    }
  };

  useEffect(() => {
    vkmData ? setIsVKMInfoOpen(true) : setIsVKMInfoOpen(false);
    if (pointInfo.lon && pointInfo.lat) {
      // our projection EPSG:3067
      var oskariProjection =
        '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs';
      // Google maps EPSG:4326
      var mapsProjection = '+proj=longlat +datum=WGS84 +no_defs +type=crs';
      const pointCoords = proj4(oskariProjection, mapsProjection, [
        pointInfo.lon,
        pointInfo.lat
      ]);
      // our coords are flipped compared to google so we need to flip them back for the right point
      setPoint([pointCoords[1], pointCoords[0]].toString());
    }
  }, [vkmData, pointInfo]);

  const DownloadButton = () => {
    return (
      <PillButton
        id={'baselayer-selector-base-layer-cancel-button'}
        icon={faDownload}
        text={strings.gfi.downloadMaterials}
        disabled={disableDownload}
        variant='inverse'
        onClick={() => store.dispatch(setIsGfiDownloadToolsOpen(!isGfiDownloadToolsOpen))}
        aria-label={
          gfiLocations.length > 0 && !disableDownload
            ? strings.gfi.downloadMaterials
            : strings.gfi.downloadMaterialsDisabled
        }
      />
    );
  };

  const LocationButton = () => {
    return (
      <PillButton
        id={'feature-data-location-button'}
        icon={faSearchLocation}
        text={strings.gfi.focusToLocations}
        disabled={gfiLocations.length === 0 || disableDownload}
        variant='inverse'
        onClick={() => {
          handleOverlayGeometry(tabsIds[selectedTab]);
          isMobile && store.dispatch(setMinimizeGfi(true));
        }}
        aria-label={strings.gfi.focusToLocations}
      />
    );
  };

  return (
    <StyledGfiContainer id="gfi_container">
      <Tooltip
        style={{ backgroundColor: theme.colors.mainColor1 }}
        disable={isMobile}
        anchorSelect="#streetview_link"
        id="streetview_tooltip"
        place="bottom"
        effect="float"
      >
        <span>{strings.gfi.streetView.openGoogleStreetView}</span>
      </Tooltip>

      <AnimatePresence>
        {isLoading && (
          <StyledLoadingOverlay
            transition={{
              duration: 0.4,
              type: 'tween'
            }}
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
          >
            <StyledLoaderWrapper id="loader_wrapper">
              <SVLoader />
            </StyledLoaderWrapper>
          </StyledLoadingOverlay>
        )}
      </AnimatePresence>

      <StyledAccordion
        expanded={isVKMInfoOpen}
        onChange={(_, isExpanded) => setIsVKMInfoOpen(isExpanded)}
        id="vkm-info-accordion"
      >
        <StyledAccordionSummary expandIcon={<StyledExpandMoreIcon />}>
          <AccordionSummaryLabel>{strings.vkm.title}</AccordionSummaryLabel>
        </StyledAccordionSummary>
        <AccordionDetails>
          <StyledVKMDataContainer>
            { vkmData &&
              <StyledVKMDataMunacipalityImageWrapper>
                {vkmData && vkmData.vkm.kuntakoodi && !pointInfoImageError && (
                  <img
                    src={
                      KUNTA_IMAGE_URL +
                      vkmData.vkm.kuntakoodi.toString().padStart(3, '0') +
                      '.gif'
                    }
                    alt={vkmData.vkm.kuntanimi}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      setPointInfoImageError(true);
                    }}
                  />
                )}
                {vkmData && vkmData.vkm.kuntanimi && (
                  <h5>{vkmData.vkm.kuntanimi}</h5>
                )}
              </StyledVKMDataMunacipalityImageWrapper>
            }
            {vkmData && vkmData.coordinates && (
              <StyledCoordinatesWrapper>
                <div>
                  <h6>{strings.vkm.locationInfo}</h6>
                  <p style={{ fontWeight: '600' }}>{vkmData.vkm.Katunimi}</p>
                  <p>
                    Lat:{' '}
                    <span style={{ fontWeight: '600' }}>
                      {vkmData.coordinates.y}
                    </span>
                  </p>
                  <p>
                    Lon:{' '}
                    <span style={{ fontWeight: '600' }}>
                      {vkmData.coordinates.x}
                    </span>
                  </p>
                  <a
                    data-tip
                    data-for={'streetview'}
                    href={
                      'http://maps.google.com/maps?q=&layer=c&cbll=' + point
                    }
                    rel="noreferrer"
                    target="_blank"
                    onClick={handleLinkClick}
                  >
                    <FontAwesomeIcon icon={faStreetView} />
                    <span style={{ fontSize: '14px', marginLeft: '.5em' }}>
                      {strings.gfi.streetView.title}
                    </span>
                  </a>
                </div>
              </StyledCoordinatesWrapper>
            )}
            {vkmData &&
            vkmData.vkm._orderHigh &&
            vkmData.vkm._orderHigh.filter((value) => value !== 'kuntanimi')
              .length > 0 ? (
              <StyledVKMDataInfoWrapper>
                <h6>{strings.vkm.roadAddressInfo}</h6>
                <StyledVkmDataItems>
                  {vkmData.vkm._orderHigh
                    .filter((value) => value !== 'kuntanimi')
                    .map((property) => {
                      if (property !== 'Katunimi')
                        return (
                          <p
                            key={'vkm-info-box-li' + property}
                            style={{
                              color: '#0064af'
                            }}
                          >
                            <span
                              style={{
                                fontSize: '14px',
                                fontWeight: 'light',
                                margin: '0'
                              }}
                            >
                              {property + ':'}
                            </span>
                            &nbsp;
                            <span
                              style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                margin: '0'
                              }}
                            >
                              {vkmData.vkm[property]}
                            </span>
                          </p>
                        );
                      else return null;
                    })}
                </StyledVkmDataItems>
              </StyledVKMDataInfoWrapper>
            ) : (
              <StyledVkmInstruction>
                <h6>{strings.vkm.roadAddressInfo}</h6>
                <p>{strings.vkm.roadAddressInstructions}</p>
              </StyledVkmInstruction>
            )}
          </StyledVKMDataContainer>
        </AccordionDetails>
      </StyledAccordion>

      {tabsIds.length > 0 && (
        <StyledTabSwiperContainer>
          {!isMobile && gfiTabsSnapGridLength > 1 && (
            <StyledSwiperNavigatorButton
              onClick={() => {
                gfiTabsSwiper.slidePrev();
              }}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </StyledSwiperNavigatorButton>
          )}

          <StyledTabsSwiper
            id={'gfi-tabs-swiper'}
            spaceBetween={4}
            slidesPerView={'auto'}
            freeMode={true}
            modules={[Controller, FreeMode]}
            onSwiper={setGfiTabsSwiper}
            controller={{ control: gfiTabsSwiper }}
            onSnapGridLengthChange={(e) =>
              setGfiTabsSnapGridLength(e.snapGrid.length)
            }
          >
            {tabsIds.map((tabId, index) => {
              return (
                <SwiperSlide id={'tab_' + index} key={'tab_' + index}>
                  <StyledGfiTab
                    onClick={() => setSelectedTab(index)}
                    selected={selectedTab === index}
                  >
                    <StyledTabName>
                      {allLayers.filter((layer) => layer.id === tabId).length >
                      0
                        ? allLayers.filter((layer) => layer.id === tabId)[0]
                            .name
                        : tabId}
                    </StyledTabName>
                    <StyledTabCloseButton
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(index, tabId);
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </StyledTabCloseButton>
                  </StyledGfiTab>
                </SwiperSlide>
              );
            })}
          </StyledTabsSwiper>
          {!isMobile && gfiTabsSnapGridLength > 1 && (
            <StyledSwiperNavigatorButton
              onClick={() => {
                gfiTabsSwiper.slideNext();
              }}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </StyledSwiperNavigatorButton>
          )}
        </StyledTabSwiperContainer>
      )}
      <StyledTabContent id="feature-data-tab-content" isMobile={isMobile}>
        {tabsIds[selectedTab] === undefined ? (
          <StyledNoGfisContainer>
            <StyledSubtitle>{strings.gfi.choosingGfi}:</StyledSubtitle>
            <StyledInfoTextContainer>
              <li>
                {strings.gfi.choosingGfiDescription0}.&nbsp;{' '}
                <FontAwesomeIcon
                  icon={faLayerGroup}
                  style={{ fontSize: '16px' }}
                />
              </li>
              <li>
                {strings.gfi.choosingGfiDescription1}.&nbsp;{' '}
                <FontAwesomeIcon
                  icon={faMapMarkedAlt}
                  style={{ fontSize: '16px' }}
                />
              </li>
              <li>{strings.gfi.choosingGfiDescription2}.</li>
            </StyledInfoTextContainer>
            <StyledSubtitle>
              {strings.gfi.streetView.googleStreetviewTitle}:
            </StyledSubtitle>
            <StyledInfoTextContainer>
              <li>
                {strings.gfi.streetView.googleStreetviewContent}.&nbsp;{' '}
                <FontAwesomeIcon
                  icon={faStreetView}
                  style={{ fontSize: '16px' }}
                />
              </li>
            </StyledInfoTextContainer>
          </StyledNoGfisContainer>
        ) : (
          <StyledSwiper
            ref={gfiInputEl}
            id={'gfi-swiper'}
            onSlideChange={(e) => {
              setSelectedTab(e.activeIndex);
            }}
            tabIndex={selectedTab}
            allowTouchMove={false} // Disable swiping
            speed={300}
          >
            {gfiLocations.map((location, index) => {
              const layers = allLayers.filter(
                (layer) => layer.id === location.layerId
              );
              const title = layers.length > 0 && layers[0].name;
              const tableProps = tablePropsInit(index, location);

              if (location.type === 'geojson') {
                return (
                  <SwiperSlide
                    id={'gfi_tab_content_' + location.layerId}
                    key={'gfi_tab_content_' + location.layerId}
                  >
                    <FeatureDataTabContent
                      layer={layers[0]}
                      data={location}
                      title={title}
                      tablePropsInit={tableProps}
                      filters={filters}
                    />
                  </SwiperSlide>
                );
              } else if (location.type === 'json') {
                return (
                  <SwiperSlide
                    id={'gfi_tab_content_' + location.layerId}
                    key={'gfi_tab_content_' + location.layerId}
                  >
                    <FeatureDataTabContent
                      layer={layers[0]}
                      title={title}
                      tablePropsInit={tableProps}
                      filters={filters}
                    />
                  </SwiperSlide>
                );
              }
              return null;
            })}
          </StyledSwiper>
        )}
        {gfiLocations.content && gfiLocations.content[0].noContent && (
          <StyledNoGfisContainer>
            <StyledSubtitle>{strings.gfi.noResultsTitle}</StyledSubtitle>
            <StyledInfoTextContainer>
              <p>{strings.gfi.noResultsDesc}</p>
            </StyledInfoTextContainer>
          </StyledNoGfisContainer>
        )}
      </StyledTabContent>
      <StyledButtonsContainer>
        <StyledFeaturesInfo>
          <StyledFeatureAmount>
            {`${strings.gfi.featureAmount} : `}
            <span>
              {featuresCount} {moreFeatures && ` / ${totalfeaturesCount}`}
            </span>
          </StyledFeatureAmount>
          { moreFeatures && (
            <StyledShowMoreButtonWrapper>
              <PillButton
                id={'feature-data-show-more-results-button'}
                text={strings.gfi.getMoreFeatures}
                onClick={() =>
                  getMoreFeatures(selectedLocation.content, selectedLocation.layerId)
                }
                aria-label={strings.gfi.getMoreFeatures}
              />
            </StyledShowMoreButtonWrapper>
          )}
        </StyledFeaturesInfo>
        <StyledDownloadAndLocationButtonsWrapper>
          <DownloadButton />
          <LocationButton />
        </StyledDownloadAndLocationButtonsWrapper>
      </StyledButtonsContainer>

      <AnimatePresence>
        {isGfiDownloadToolsOpen && (
          <StyledGfiToolsContainer
            transition={{
              duration: 0.4,
              type: 'tween'
            }}
            initial={{
              opacity: 0,
              x: '-100%'
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: '-100%'
            }}
          >
            <FeatureDataDownloadTools/>
          </StyledGfiToolsContainer>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isGfiDownloadToolsOpen && (
          <StyledGfiBackdrop
            transition={{
              duration: 0.4,
              type: 'tween'
            }}
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            onClick={() => store.dispatch(setIsGfiDownloadToolsOpen(!isGfiDownloadToolsOpen))}
          />
        )}
      </AnimatePresence>
    </StyledGfiContainer>
  );
};

export default FeatureDataPopup;