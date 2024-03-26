import { useContext, useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from "framer-motion";
import {
  faTimes,
  faSearchLocation,
  faMapMarkedAlt,
  faFileDownload,
  faAngleLeft,
  faAngleRight,
  faLayerGroup,
  faMapMarkerAlt,
  faStreetView,
} from "@fortawesome/free-solid-svg-icons";
import proj4 from "proj4";
import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactReduxContext } from "react-redux";
import styled from "styled-components";
import strings from "../../translations";
import { useAppSelector } from "../../state/hooks";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Controller } from "swiper";
import {
  setMinimizeGfi,
  setWarning,
} from "../../state/slices/uiSlice";
import {
  resetGFILocations,
  addFeaturesToGFILocations,
  setActiveGFILayer,
  setFilters,
  removeMarkerRequest
} from "../../state/slices/rpcSlice";
import { FormattedGFI } from "./FormattedGFI";
import GfiTabContent from "./GfiTabContent";
import GfiToolsMenu from "./GfiToolsMenu";
import GfiDownloadMenu from "./GfiDownloadMenu";
import CircleButton from "../circle-button/CircleButton";
import SVLoader from "../loader/SvLoader";
import { isValidUrl } from "../../utils/validUrlUtil";
import { theme, isMobile } from "../../theme/theme";
import { filterFeature } from "../../utils/gfiUtil";
import { SortingMode, PagingPosition } from "ka-table/enums";

// Max amount of features that wont trigger react-data-table-component
const GFI_MAX_LENGTH = 5;
const KUNTA_IMAGE_URL =
  "https://www.kuntaliitto.fi/sites/default/files/styles/narrow_320_x_600_/public/media/profile_pictures/";

const StyledGfiContainer = styled.div`
  position: relative;
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
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
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
  position: absolute;
  width: 100%;
  max-width: 520px;
  height: 100%;
  display: flex;
  padding: 24px;
  left: 50%;
  transform: translateX(-50%);
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
  overflow: hidden;
  display: flex;
  height: 100%;
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
    width: ${(props) => (props.isMobile ? "10em" : "auto")};
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
  align-items: center;
`;

const StyledFeatureAmount = styled.p`
  text-align: center;
  color: ${(props) => props.theme.colors.mainColor1};
  margin: 5px 0px 10px 0px;
`;

const StyledShowMoreButtonWrapper = styled.div`
  text-align: center;
`;

const StyledShowMoreButton = styled.button`
  width: 250px;
  height: 35px;
  color: ${(props) => props.theme.colors.mainWhite};
  background-color: ${(props) => props.theme.colors.mainColor1};
  border-radius: 20px;
  box-shadow: 0px 1px 3px #0000001f;
  border: none;
`;

const StyledButtonsContainer = styled.div`
  margin-top: auto;
  padding: 16px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 8px;
  pointer-events: none;
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

export const GFIPopup = ({ handleGfiDownload }) => {
  const LAYER_ID = "gfi-result-layer";
  const { store } = useContext(ReactReduxContext);
  const {
    channel,
    allLayers,
    gfiLocations,
    vkmData,
    pointInfoImageError,
    setPointInfoImageError,
    gfiCroppingArea,
    selectedLayers,
    pointInfo,
    filters,
    selectedLayersByType
  } = useAppSelector((state) => state.rpc);

  const [point, setPoint] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [tabsContent, setTabsContent] = useState([]);
  const [isGfiToolsOpen, setIsGfiToolsOpen] = useState(false);
  const [isDataTable, setIsDataTable] = useState(false);
  const [isGfiDownloadsOpen, setIsGfiDownloadsOpen] = useState(false);
  const [isVKMInfoOpen, setIsVKMInfoOpen] = useState(vkmData ? true : false);
  const [gfiTabsSwiper, setGfiTabsSwiper] = useState(null);
  const [gfiTabsSnapGridLength, setGfiTabsSnapGridLength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const gfiInputEl = useRef(null);

  const handleLinkClick = (event) => {
    event.preventDefault();
    const savedState = localStorage.getItem("dontShowExitLinkWarn");
    if (!savedState) {
      store.dispatch(setWarning({
      title: strings.exitConfirmation,
      subtitle: null,
      confirm: {
        text: strings.general.continue,
         action: () => {
          window.open("http://maps.google.com/maps?q=&layer=c&cbll=" + point, "_blank");
          store.dispatch(setWarning(null));
        }
      },
      cancel: {
        text: strings.general.cancel,
          action: () => {
            store.dispatch(setWarning(null))
          }
      },
      dontShowAgain: {
        id: "dontShowExitLinkWarn"
      }
      }))
    } else {
        window.open("http://maps.google.com/maps?q=&layer=c&cbll=" + point, "_blank");
    }
  };

  useEffect(() => {
    let mapResults = [];
    gfiLocations.forEach((location) => {
      const isBackgroundMap = selectedLayersByType.backgroundMaps.filter(l => 
        l.id === location.layerId
      ).length > 0;
      if (isBackgroundMap) {
        return;
      }
      location.content &&
        location?.content[0]?.features?.length > GFI_MAX_LENGTH &&
        setIsDataTable(true);
      const layers = allLayers.filter((layer) => layer.id === location.layerId);
      const layerIds =
        layers && layers.length > 0 ? layers[0].id : location.layerId;
      let content;
      if (location.type === "text") {
        content = location.content;
        const popupContent = (
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        );
        var contentWrapper = <div>{popupContent}</div>;
        const contentDiv = <div id={layerIds}>{contentWrapper}</div>;
        return contentDiv;
      } else if (location.type === "geojson") {
        mapResults.push(
          <FormattedGFI
            id={layerIds}
            data={location.content}
            type="geoJson"
            isDataTable={isDataTable}
          />
        );
      }
      return;
    });

    setTabsContent(mapResults);
  }, [allLayers, gfiLocations, isDataTable, selectedTab, selectedLayersByType.backgroundMaps]);

  useEffect(() => {
    isGfiDownloadsOpen && setIsGfiDownloadsOpen(false);
  }, [gfiLocations]);

  // Zoom to features
  const handleOverlayGeometry = (geoJson) => {
    // empty possible earlier overlays
    channel &&
      channel.postRequest("MapModulePlugin.RemoveFeaturesFromMapRequest", [
        null,
        null,
        LAYER_ID,
      ]);
    
    // add new overlay
    if (geoJson !== null) {
      channel &&
        channel.postRequest("MapModulePlugin.AddFeaturesToMapRequest", [
          geoJson[0].geojson,
          {
            layerId: LAYER_ID,
            centerTo: true,
            cursor: "pointer",
            featureStyle: {
              fill: {
                  color: 'rgba(10, 140, 247, 0.3)',
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
                  size: 4,
                  fill: {
                      color: 'rgba(100, 255, 95, 0.7)',
                  }
              }
            },
          },
        ]);
    }
  };

  const handleVKMInfo = () => {
    setIsVKMInfoOpen(!isVKMInfoOpen);
  };

  const addGFIResultsToMap = (filteredFeatures) => {
    if (filteredFeatures.length === 0) {
      channel &&
      channel.postRequest("MapModulePlugin.RemoveFeaturesFromMapRequest", [
        null,
        null,
        LAYER_ID,
      ]);
    } else {
      filteredFeatures[0].geometry.type === 'Point' && store.dispatch(removeMarkerRequest({ markerId: "VKM_MARKER" }));
      
      let featureStyle = {
        fill: {
            color: 'rgba(10, 140, 247, 0.3)',
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
            size: 4,
            fill: {
                color: 'rgba(100, 255, 95, 0.8)',
            }
        }
      };

      let options = {
        featureStyle: featureStyle,
        layerId: LAYER_ID,
        animationDuration: 200,
        clearPrevious: true,
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
  }

  const tablePropsInit = (index, data) => {
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
        if (column !== "UID") {
          columnsArray.push({
            key: column,
            title: column,
            width: 180,
            colGroup: { style: { minWidth: 120 } },
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
            type: column.type,
          });
        }
      });

    var cells = [];
    var filteredFeatures = [];

    data &&
      data?.content?.forEach((cont) => {
        var featureCells =
          cont.geojson.features ?
          cont.geojson.features
            .filter((feature) => filterFeature(feature, data, filters, channel))
            .map((feature) => {
              if (!feature.hasOwnProperty("id")) {
                var extendedFeature = { ...feature };
                extendedFeature.id = uuidv4();
                filteredFeatures.push(extendedFeature);
              } else {
                filteredFeatures.push(feature);
              }
              var cell = { ...feature.properties };
              if (cell.hasOwnProperty("id")) {
                cell["id"] = feature.id || uuidv4();
              } else {
                cell.id = feature.id || uuidv4();
              }
              cell.hasOwnProperty("UID") && delete cell["UID"];
              cell.hasOwnProperty("_orderHigh") && delete cell["_orderHigh"];
              cell.hasOwnProperty("_order") && delete cell["_order"];
              return cell;
            }) : [];
        cells.push(...featureCells);
      });

    // Set filtered results to map
    selectedTab == index && addGFIResultsToMap(filteredFeatures)

    const tablePropsInit = {
      columns: columnsArray,
      filterableColumns: filterColumnsArray,
      filteredFeatures: filteredFeatures,
      data: cells,
      rowKeyField: "id",
      sortingMode: SortingMode.SingleTripleState,
      columnResizing: true,
      paging: {
        enabled: true,
        pageIndex: 0,
        pageSize: 100,
        pageSizes: [10, 50, 100],
        position: PagingPosition.Bottom,
      },
      format: ({ value }) => {
        if (isValidUrl(value)) {
          return (
            <a target="_blank" rel="noreferrer" href={value}>
              {value}
            </a>
          );
        }
      },
    };
    return tablePropsInit;
  };

  const handleGfiToolsMenuWithConfirmDialog = () => {
    const fetchableLayers = selectedLayers.filter((layer) =>
      layer.groups?.every((group) => group !== 1)
    );
    if (fetchableLayers.length >= 10) {
      //delete group 1 taustakartat
      store.dispatch(
        setWarning({
          title: strings.multipleLayersFetchWarning,
          subtitle: null,
          cancel: {
            text: strings.general.cancel,
            action: () => store.dispatch(setWarning(null)),
          },
          confirm: {
            text: strings.general.continue,
            action: () => {
              store.dispatch(setWarning(null));
              handleGfiToolsMenu();
            },
          },
        })
      );
    } else {
      handleGfiToolsMenu();
    }
  };

  const handleGfiToolsMenu = () => {
    setIsGfiDownloadsOpen(false);
    setIsGfiToolsOpen(!isGfiToolsOpen);

    channel &&
      channel.postRequest("DrawTools.StopDrawingRequest", [
        "gfi-selection-tool",
        true,
      ]);

    isGfiToolsOpen &&
      channel &&
      channel.postRequest("VectorLayerRequest", [
        {
          layerId: "download-tool-layer",
          remove: true,
        },
      ]);
  };

  const handleGfiDownloadsMenu = () => {
    setIsGfiToolsOpen(false);
    setIsGfiDownloadsOpen(!isGfiDownloadsOpen);
  };

  const closeTab = (index, id, tabcontent) => {
    const updatedFilters = filters.filter(
      (filter) => filter.layer !== tabcontent.props.id
    );
    store.dispatch(setFilters(updatedFilters));

    var filteredLocations = gfiLocations.filter((gfi) => gfi.layerId !== id);
    store.dispatch(resetGFILocations(filteredLocations));
    channel &&
      channel.postRequest("MapModulePlugin.RemoveFeaturesFromMapRequest", [
        null,
        null,
        LAYER_ID,
      ]);
    if (index > 0) {
      handleSelectTab(index - 1);
    } else {
      handleSelectTab(0);
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
                    selectedGFI: selectedTab,
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
                  },
                },
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
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs";
      // Google maps EPSG:4326
      var mapsProjection = "+proj=longlat +datum=WGS84 +no_defs +type=crs";
      const pointCoords = proj4(oskariProjection, mapsProjection, [
        pointInfo.lon,
        pointInfo.lat,
      ]);
      // our coords are flipped compared to google so we need to flip them back for the right point
      setPoint([pointCoords[1], pointCoords[0]].toString());
    }
  }, [vkmData, pointInfo]);

  const handleSelectTab = (index) => {
    setSelectedTab(index);
    const layer = selectedLayers.filter(
      (l) => l.id == tabsContent[index]?.props?.id
    );
    store.dispatch(setActiveGFILayer(layer));
  };

  // Download is disabled if there's no layers/locations that aren't background maps
  const filteredGFILocations = gfiLocations.filter(g => selectedLayersByType.backgroundMaps.filter(l => l.id === g.layerId).length === 0);

  return (
    <StyledGfiContainer>
      <AnimatePresence>
        {isLoading && (
          <StyledLoadingOverlay
            transition={{
              duration: 0.4,
              type: "tween",
            }}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <StyledLoaderWrapper>
              <SVLoader />
            </StyledLoaderWrapper>
          </StyledLoadingOverlay>
        )}
      </AnimatePresence>
      <StyledVKMDataContainer
        initial={{
          height: !isVKMInfoOpen && !vkmData && 0,
        }}
        animate={{
          height: isVKMInfoOpen ? "auto" : 0,
          opacity: isVKMInfoOpen ? 1 : 0,
          marginTop: isVKMInfoOpen ? "16px" : "0px",
          marginBottom: isVKMInfoOpen ? "16px" : "0px",
          y: isVKMInfoOpen ? 0 : -100,
        }}
        transition={{ duration: 0.4 }}
      >
        <StyledVKMDataMunacipalityImageWrapper>
          {vkmData && vkmData.vkm.kuntakoodi && !pointInfoImageError && (
            <img
              src={
                KUNTA_IMAGE_URL +
                vkmData.vkm.kuntakoodi.toString().padStart(3, "0") +
                ".gif"
              }
              alt=""
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                setPointInfoImageError(true);
              }}
            />
          )}
          {vkmData && vkmData.vkm.kuntanimi && <h5>{vkmData.vkm.kuntanimi}</h5>}
        </StyledVKMDataMunacipalityImageWrapper>
        {vkmData && vkmData.coordinates && (
          <StyledCoordinatesWrapper>
            <div>
              <h6>{strings.vkm.locationInfo}</h6>
              <p style={{ fontWeight: "600" }}>{vkmData.vkm.Katunimi}</p>
              <p>
                Lat:{" "}
                <span style={{ fontWeight: "600" }}>
                  {vkmData.coordinates.y}
                </span>
              </p>
              <p>
                Lon:{" "}
                <span style={{ fontWeight: "600" }}>
                  {vkmData.coordinates.x}
                </span>
              </p>
              <a
                data-tip
                data-for={"streetview"}
                href={"http://maps.google.com/maps?q=&layer=c&cbll=" + point}
                rel="noreferrer"
                target="_blank"
                onClick={handleLinkClick}
              >
                <FontAwesomeIcon icon={faStreetView} />
                <span style={{ fontSize: "14px", marginLeft: ".5em" }}>
                  {strings.gfi.streetView.title}
                </span>
                <ReactTooltip
                  backgroundColor={theme.colors.mainColor1}
                  textColor={theme.colors.mainWhite}
                  disable={isMobile}
                  id="streetview"
                  place="bottom"
                  type="dark"
                  effect="float"
                >
                  <span>{strings.gfi.streetView.openGoogleStreetView}</span>
                </ReactTooltip>
              </a>
            </div>
          </StyledCoordinatesWrapper>
        )}
        {vkmData &&
        vkmData.vkm._orderHigh &&
        vkmData.vkm._orderHigh.filter((value) => value !== "kuntanimi").length >
          0 ? (
          <StyledVKMDataInfoWrapper>
            <h6>{strings.vkm.roadAddressInfo}</h6>
            <StyledVkmDataItems>
              {vkmData.vkm._orderHigh
                .filter((value) => value !== "kuntanimi")
                .map((property) => {
                  if (property !== "Katunimi")
                    return (
                      <p
                        key={"vkm-info-box-li" + property}
                        style={{
                          color: "#0064af",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "light",
                            margin: "0",
                          }}
                        >
                          {property + ":"}
                        </span>
                        &nbsp;
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            margin: "0",
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
      {tabsContent.length > 0 && (
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
            id={"gfi-tabs-swiper"}
            spaceBetween={4}
            slidesPerView={"auto"}
            freeMode={true}
            modules={[Controller, FreeMode]}
            onSwiper={setGfiTabsSwiper}
            controller={{ control: gfiTabsSwiper }}
            onSnapGridLengthChange={(e) =>
              setGfiTabsSnapGridLength(e.snapGrid.length)
            }
          >
            {tabsContent.map((tabContent, index) => {
              return (
                <SwiperSlide id={"tab_" + index} key={"tab_" + index}>
                  <StyledGfiTab
                    onClick={() => handleSelectTab(index)}
                    selected={selectedTab === index}
                  >
                    <StyledTabName>
                      {allLayers.filter(
                        (layer) => layer.id === tabContent.props.id
                      ).length > 0
                        ? allLayers.filter(
                            (layer) => layer.id === tabContent.props.id
                          )[0].name
                        : tabContent.props.id}
                    </StyledTabName>
                    <StyledTabCloseButton
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(index, tabContent.props.id, tabContent);
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
      <StyledTabContent isMobile={isMobile}>
        {tabsContent[selectedTab] === undefined ?
         (
          <StyledNoGfisContainer>
            <StyledSubtitle>{strings.gfi.choosingGfi}:</StyledSubtitle>
            <StyledInfoTextContainer>
              <li>
                {strings.gfi.choosingGfiDescription0}.&nbsp;{" "}
                <FontAwesomeIcon
                  icon={faLayerGroup}
                  style={{ fontSize: "16px" }}
                />
              </li>
              <li>
                {strings.gfi.choosingGfiDescription1}.&nbsp;{" "}
                <FontAwesomeIcon
                  icon={faMapMarkedAlt}
                  style={{ fontSize: "16px" }}
                />
              </li>
              <li>{strings.gfi.choosingGfiDescription2}.</li>
            </StyledInfoTextContainer>
            <StyledSubtitle>
              {strings.gfi.streetView.googleStreetviewTitle}:
            </StyledSubtitle>
            <StyledInfoTextContainer>
              <li>
                {strings.gfi.streetView.googleStreetviewContent}.&nbsp;{" "}
                <FontAwesomeIcon
                  icon={faStreetView}
                  style={{ fontSize: "16px" }}
                />
              </li>
            </StyledInfoTextContainer>
          </StyledNoGfisContainer>
        )
        :
        (
          <StyledSwiper
            ref={gfiInputEl}
            id={"gfi-swiper"}
            onSlideChange={(e) => {
              handleSelectTab(e.activeIndex);
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
              let totalFeatures = 0;
              location?.content?.forEach((cont) => {
                totalFeatures += cont.geojson.totalFeatures;
              });

              let featuresAmount = 0;

              // count the amount of results when filtered
              location?.content?.forEach((cont) => {
                cont.geojson?.features?.forEach((feature) => {
                  if (filterFeature(feature, location, filters, channel)) {
                    featuresAmount += 1;
                  }
                });
              });

              if (location.type === "geojson") {
                return (
                  <SwiperSlide
                    id={"gfi_tab_content_" + location.layerId}
                    key={"gfi_tab_content_" + location.layerId}
                  >
                    <GfiTabContent
                      layer={layers[0]}
                      data={location}
                      title={title}
                      tablePropsInit={tableProps}
                      filters={filters}
                    />
                    {location?.content?.some(
                      (content) => content.geojson.features
                    ) && (
                      <StyledFeaturesInfo>
                        <StyledFeatureAmount>
                          {`${strings.gfi.featureAmount} : `}
                          <span>
                            {featuresAmount}{" "}
                            {location.moreFeatures && ` / ${totalFeatures}`}
                          </span>
                        </StyledFeatureAmount>
                        {location.moreFeatures && (
                          <StyledShowMoreButtonWrapper>
                            <StyledShowMoreButton
                              onClick={() =>
                                getMoreFeatures(
                                  location.content,
                                  location.layerId
                                )
                              }
                            >
                              {strings.gfi.getMoreFeatures}
                            </StyledShowMoreButton>
                          </StyledShowMoreButtonWrapper>
                        )}
                      </StyledFeaturesInfo>
                    )}
                  </SwiperSlide>
                );
              }
              return null;
            })}
          </StyledSwiper>
        )
      }
        {gfiLocations.content && gfiLocations.content[0].noContent && (
          <StyledNoGfisContainer>
            <StyledSubtitle>{strings.gfi.noResultsTitle}</StyledSubtitle>
            <StyledInfoTextContainer>
              <p>
                {strings.gfi.noResultsDesc}
              </p>
            </StyledInfoTextContainer>
          </StyledNoGfisContainer>
        )}
        
      </StyledTabContent>
      <StyledButtonsContainer>
        {vkmData && (
          <CircleButton
            icon={faMapMarkerAlt}
            text={strings.vkm.locationInfo}
            toggleState={isVKMInfoOpen}
            tooltipDirection={"bottom"}
            clickAction={handleVKMInfo}
          />
        )}
        <CircleButton
          icon={faMapMarkedAlt}
          text={strings.gfi.selectLocations}
          toggleState={isGfiToolsOpen}
          tooltipDirection={"bottom"}
          clickAction={handleGfiToolsMenuWithConfirmDialog}
          disabled={
            !selectedLayers.some((layer) =>
              layer.groups?.every((group) => group !== 1)
              && selectedLayersByType.backgroundMaps.filter(l => l.id === layer.id).length === 0
            )
          }
        />
        <CircleButton
          icon={faFileDownload}
          text={
            gfiLocations.length > 0
              ? strings.gfi.downloadMaterials
              : strings.gfi.downloadMaterialsDisabled
          }
          toggleState={isGfiDownloadsOpen}
          tooltipDirection={"bottom"}
          clickAction={handleGfiDownloadsMenu}
          disabled={filteredGFILocations.length === 0}
        />
        <CircleButton
          icon={faSearchLocation}
          text={strings.gfi.focusToLocations}
          tooltipDirection={"bottom"}
          clickAction={() => {
            handleOverlayGeometry(tabsContent[selectedTab].props.data);
            isMobile && store.dispatch(setMinimizeGfi(true));
          }}
          disabled={gfiLocations.length === 0 || filteredGFILocations.length === 0}
        />
      </StyledButtonsContainer>

      <AnimatePresence>
        {isGfiToolsOpen && (
          <StyledGfiToolsContainer
            transition={{
              duration: 0.4,
              type: "tween",
            }}
            initial={{
              opacity: 0,
              x: "-100%",
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: "-100%",
            }}
          >
            <GfiToolsMenu
              handleGfiToolsMenu={handleGfiToolsMenu}
              filters={filters}
            />
          </StyledGfiToolsContainer>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isGfiDownloadsOpen && (
          <StyledGfiToolsContainer
            transition={{
              duration: 0.4,
              type: "tween",
            }}
            initial={{
              opacity: 0,
              x: "-100%",
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: "-100%",
            }}
          >
            <GfiDownloadMenu
              handleGfiDownloadsMenu={handleGfiDownloadsMenu}
              handleGfiDownload={handleGfiDownload}
            />
          </StyledGfiToolsContainer>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {(isGfiDownloadsOpen || isGfiToolsOpen) && (
          <StyledGfiBackdrop
            transition={{
              duration: 0.4,
              type: "tween",
            }}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => {
              isGfiToolsOpen && handleGfiToolsMenu();
              isGfiDownloadsOpen && handleGfiDownloadsMenu();
            }}
          />
        )}
      </AnimatePresence>
    </StyledGfiContainer>
  );
};

export default GFIPopup;
