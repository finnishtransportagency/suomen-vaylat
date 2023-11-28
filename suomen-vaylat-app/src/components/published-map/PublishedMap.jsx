import { useContext, useEffect } from 'react';
import OskariRPC from 'oskari-rpc';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import strings from '../../translations';
import {
    setActiveAnnouncements,
    setAllGroups,
    setAllTags,
    setAllThemesWithLayers,
    setChannel,
    setCurrentMapCenter,
    setCurrentState,
    setCurrentZoomLevel,
    setFeatures,
    setLegends,
    setLoading,
    setScaleBarState,
    setTagsWithLayers,
    setZoomRange,
    setGFILocations,
    setGFICroppingArea,
    setVKMData,
    setStartState,
    resetGFILocations,
    addMarkerRequest,
    removeMarkerRequest,
    setPointInfo
} from '../../state/slices/rpcSlice';

import {
    setIsFullScreen,
    setGfiCroppingTypes,
    setIsGfiOpen,
    setMinimizeGfi,
    addToDrawToolMarkers,
    removeFromDrawToolMarkers,
    addToGeoJsonArray,
} from '../../state/slices/uiSlice';
import { getActiveAnnouncements, updateLayers } from '../../utils/rpcUtil';
import SvLoder from '../../components/loader/SvLoader';
import './PublishedMap.scss';
import { theme } from '../../theme/theme';

const GFI_GEOMETRY_LAYER_ID = 'drawtools-geometry-layer';

const StyledPublishedMap = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
`;

const StyledIframe = styled.iframe`
    width: 100%;
    height: 100%;
    border: none;
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


//fetch and save announcements to state
const fetchAnnounmentsAsync = async (data, channel, store) => {
    let activeAnnoucements = [];
    await new Promise((resolve) => {   
        setTimeout(() => {
            if (data.getSelectedAnnouncements) {
                channel.getSelectedAnnouncements(function (data) {
                    activeAnnoucements = getActiveAnnouncements(data);
                    if (activeAnnoucements && activeAnnoucements.length > 0){
                        store.dispatch(
                            setActiveAnnouncements(activeAnnoucements)
                        );
                    }
                });
            }
            resolve(activeAnnoucements);
        }, 1000);
    }).then( (announments) => {
        //due bug announments not showing on safari, check again after 3 seconds if announcements list empty
        if (announments.length ===0){
            setTimeout(() => {
                if (data.getSelectedAnnouncements) {
                    channel.getSelectedAnnouncements(function (data) {
                        activeAnnoucements = getActiveAnnouncements(data);
                        if (activeAnnoucements && activeAnnoucements.length > 0){
                            store.dispatch(
                                setActiveAnnouncements(activeAnnoucements)
                            );
                        }
                    });
                }
            }, 8000);
        }
    } );
}


const PublishedMap = () => {
    const { store } = useContext(ReactReduxContext);
    const { loading } = useAppSelector((state) => state.rpc);
    const language = useAppSelector((state) => state.language);
    const lang = language.current;

    const hideSpinner = () => {
        store.dispatch(setLoading(false));
    };

    useEffect(() => {
        const handleFullScreenChange = () => {
            if (document.webkitIsFullScreen) {
                store.dispatch(setIsFullScreen(true));
            } else if (document.fullscreenElement) {
                store.dispatch(setIsFullScreen(true));
            } else {
                store.dispatch(setIsFullScreen(false));
            }
        };

        store.dispatch(setLoading(true));

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        document.addEventListener(
            'mozfullscreenchange',
            handleFullScreenChange
        );
        document.addEventListener(
            'webkitfullscreenchange',
            handleFullScreenChange
        );
        document.addEventListener('msfullscreenchange', handleFullScreenChange);

        const iframe = document.getElementById('sv-iframe');
        var handlers = [];

        var channel = OskariRPC.connect(
            iframe,
            process.env.REACT_APP_PUBLISHED_MAP_DOMAIN
        );
        var synchronizer = OskariRPC.synchronizerFactory(channel, handlers);

        
        channel.onReady(() => {
            store.dispatch(setChannel(channel));
            channel.getSupportedFunctions(function (data) {
                //minor hack to make sure announcements are shown
                fetchAnnounmentsAsync(data, channel, store);
                if (data.getTags) {
                    channel.getTags(function (data) {
                        store.dispatch(setAllTags(data));
                    });
                }

                if (data.getTagsWithLayers) {
                    channel.getTagsWithLayers(function (data) {
                        store.dispatch(setTagsWithLayers(data));
                    });
                }

                if (data.getGfiCroppingTypes) {
                    channel.getGfiCroppingTypes(function (data) {
                        store.dispatch(setGfiCroppingTypes(data));
                    });
                }

                if (data.getThemesWithLayers) {
                    channel.getThemesWithLayers(function (data) {
                        store.dispatch(setAllThemesWithLayers(data));
                    });
                }

                if (data.getZoomRange) {
                    channel.getZoomRange(function (data) {
                        store.dispatch(setZoomRange(data));
                        data.hasOwnProperty('current') &&
                            store.dispatch(setCurrentZoomLevel(data.current));
                    });
                }

                if (data.getAllGroups) {
                    channel.getAllGroups(function (data) {
                        const arrangeAlphabetically = (x, y) => {
                            if (x.name < y.name) {
                                return -1;
                            }
                            if (x.name > y.name) {
                                return 1;
                            }
                            return 0;
                        };
                        store.dispatch(
                            setAllGroups(data.sort(arrangeAlphabetically))
                        );
                    });
                }

                updateLayers(store, channel);

                if (data.getCurrentState) {
                    channel.getCurrentState(function (data) {
                        store.dispatch(setCurrentState(data));
                    });
                }

                if (data.getFeatures) {
                    channel.getFeatures(function (data) {
                        store.dispatch(setFeatures(data));
                    });
                }

                if (data.getLegends) {
                    // need use global window variable to limit legend updates
                    window.legendUpdateTimer = setTimeout(function () {
                        channel.getLegends(function (data) {
                            store.dispatch(setLegends(data));
                        });
                    }, 500);
                }

                if (data.getMapPosition) {
                    channel.getMapPosition((data) => {
                        store.dispatch(setCurrentMapCenter(data));
                    });
                }
            });

            channel.getSupportedEvents(function (data) {
                if (data.MapClickedEvent && store.getState().ui.activeTool === null) {
                    channel.handleEvent('MapClickedEvent', (data) => {
                        store.getState().ui.activeTool !== strings.tooltips.drawingTools.marker && store.dispatch(resetGFILocations([]));
                        store.dispatch(setPointInfo(data));
                    });
                }

                channel.handleEvent('DrawingEvent', (data) => {
                    if (store.getState().ui.activeTool) {
                        if (data.isFinished && data.isFinished === true && data.geojson.features.length > 0) {
                            store.getState().ui.activeTool !== strings.tooltips.drawingTools.marker && store.dispatch(addToGeoJsonArray(data));
                        }
                    }
                });

                channel.handleEvent('PointInfoEvent', (data) => {
                    if (data.vkm !== null && store.getState().ui.activeSelectionTool === null && store.getState().ui.activeTool === null && store.getState().ui.selectedMarker !== 7) {
                        store.dispatch(setMinimizeGfi(false));
                        store.dispatch(setVKMData(data));
                        store.dispatch(setIsGfiOpen(true));

                        channel && channel.postRequest(
                            'MapModulePlugin.RemoveFeaturesFromMapRequest',
                            [null, null, GFI_GEOMETRY_LAYER_ID]
                        );

                        var MARKER_ID = 'VKM_MARKER';

                        store.dispatch(
                            addMarkerRequest({
                                x: data.coordinates.x,
                                y: data.coordinates.y,
                                markerId: MARKER_ID,
                                shape: '<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="#0064af" viewBox="0 0 384 512"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/></svg>',
                                size: 5,
                                offsetX: 13,
                                offsetY: 7,
                            })
                        );
                    }
                    if (store.getState().ui.activeTool === strings.tooltips.drawingTools.marker) {
                        let marker_id = data.coordinates.x + data.coordinates.y + "_id";
                        const customMarker = {
                            x: data.coordinates.x,
                            y: data.coordinates.y,
                            markerId: marker_id,
                            shape: store.getState().ui.selectedMarker,
                            msg: store.getState().ui.markerLabel,
                            color: theme.colors.mainColor2,
                            size: 5,
                            offsetX: 0,
                            offsetY: 7,
                        }
                        if (store.getState().ui.selectedMarker !== 7) {
                            store.dispatch(addToDrawToolMarkers(customMarker));
                            store.getState().ui.selectedMarker !== 7 && store.dispatch(
                                addMarkerRequest(customMarker)
                            );
                        }
                    }
                })

                channel.handleEvent('DataForMapLocationEvent', (data) => {
                    if (data.content && data.content.features) {
                        data.content.features.forEach(f => {
                            if (f.properties) {
                                Object.keys(f.properties).forEach(k => {
                                    if (typeof f.properties[k] === 'object') {
                                        f.properties[k] = JSON.stringify(f.properties[k]);
                                    }
                                });
                            }
                        });
                    }

                    // reformat data to same way croppings are
                    // might need to be 'fixed' later
                    const features = data.content;
                    let geojson = {"geojson": features}
                    let reformattedData = {};
                    reformattedData.content = [geojson];
                    data.content = reformattedData.content;
                    if (store.getState().ui.activeSelectionTool === null && store.getState().ui.activeTool === null) {
                        store.dispatch(resetGFILocations([]));
                        const croppingArea = {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [data.x, data.y],
                            },
                        };

                        store.dispatch(setGFICroppingArea(croppingArea));
                        store.dispatch(setMinimizeGfi(false));
                        store.dispatch(setIsGfiOpen(true));
                        store.dispatch(setGFILocations(data));
                    }
                });

                if (data.MarkerClickEvent) {
                    channel.handleEvent('MarkerClickEvent', (event) => {
                        if(store.getState().ui.selectedMarker === 7 && store.getState().ui.drawToolMarkers.length > 0) {
                            store.dispatch(removeMarkerRequest({markerId: event.id}));
                            store.dispatch(removeFromDrawToolMarkers(event.id));
                        }
                    });
                }

                if (data.AfterMapMoveEvent) {
                    channel.handleEvent('AfterMapMoveEvent', (event) => {
                        store.dispatch(setCurrentMapCenter(event));
                    });
                }

                if (data.SearchResultEvent) {
                    channel.handleEvent('SearchResultEvent', (event) => {});
                }

                if (data.ScaleBarEvent) {
                    channel.handleEvent('ScaleBarEvent', function (data) {
                        store.dispatch(setScaleBarState(data));
                    });
                }

                if (data.UserLocationEvent) {
                    channel.postRequest(
                        'MapModulePlugin.RemoveMarkersRequest',
                        ['my_location']
                    );

                    channel.handleEvent('UserLocationEvent', (event) => {
                        var data = {
                            x: event.lon,
                            y: event.lat,
                            msg: '',
                            shape: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#0064af"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/><circle cx="12" cy="9" r="2.5"/></svg>',
                            offsetX: 0, // center point x position from left to right
                            offsetY: 10, // center point y position from bottom to up
                            size: 100
                        };
                        channel.postRequest(
                            'MapModulePlugin.AddMarkerRequest',
                            [data, 'my_location']
                        );

                        var routeSteps = [
                            {
                                lon: event.lon,
                                lat: event.lat,
                                duration: 3000,
                                zoom: 4,
                                animation: 'zoomPan',
                            },
                            {
                                lon: event.lon,
                                lat: event.lat,
                                duration: 3000,
                                zoom: 10,
                                animation: 'zoomPan',
                            },
                        ];
                        var stepDefaults = {
                            zoom: 5,
                            animation: 'fly',
                            duration: 3000,
                            srsName: 'EPSG:3067',
                        };
                        channel.postRequest('MapTourRequest', [
                            routeSteps,
                            stepDefaults,
                        ]);
                    });
                }
            });

            // save start state
            channel.getPublishedMapState(function (data) {
                store.dispatch(setStartState(data));
            });
        });

        synchronizer.synchronize();

        return () => {
            synchronizer.destroy();
        };
    }, [store]);

    return (
        <StyledPublishedMap>
            {loading && (
                <StyledLoaderWrapper>
                    <SvLoder />
                </StyledLoaderWrapper>
            )}
            <StyledIframe
                id="sv-iframe"
                title="iframe"
                src={process.env.REACT_APP_PUBLISHED_MAP_URL + '&lang=' + lang}
                allow="geolocation"
                onLoad={() => hideSpinner()}
            ></StyledIframe>
        </StyledPublishedMap>
    );
};

export default PublishedMap;
