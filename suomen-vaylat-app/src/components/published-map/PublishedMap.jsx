import React, { useContext, useEffect } from 'react';
import OskariRPC from 'oskari-rpc';
import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';

import {
    setLoading,
    setChannel,
    setAllGroups,
    setAllThemesWithLayers,
    setAllLayers,
    setAllTags,
    setCurrentState,
    setFeatures,
    setZoomRange,
    setZoomLevelsLayers,
    setCurrentZoomLevel
} from '../../state/slices/rpcSlice';

import CenterSpinner from '../center-spinner/CenterSpinner';

import './PublishedMap.scss';

const PublishedMap = ({lang}) => {

    const { store } = useContext(ReactReduxContext);
    const loading = useAppSelector((state) => state.rpc.loading);

    const hideSpinner = () => {
        store.dispatch(setLoading(false));
    };

    useEffect(() => {
        store.dispatch(setLoading(true));
        const iframe = document.getElementById('sv-iframe');
        var handlers = [
                //new AllGroupsHandler(getAllGroups),
                //new GroupsHandler(this.groupsGetted)
        ];

        var channel = OskariRPC.connect(iframe, process.env.REACT_APP_PUBLISHED_MAP_DOMAIN);
        var synchronizer = OskariRPC.synchronizerFactory(channel,handlers);

        channel.onReady(() => {

            store.dispatch(setChannel(channel));
            channel.getSupportedFunctions(function (data) {
                //console.log('GetSupportedFunctions: ', data);
                if (data.getAllTags) {
                    channel.getAllTags(function (data) {
                        console.log('getAllTags: ', data);
                        store.dispatch(setAllTags(data));
                    });
                }
                if(data.getAllThemes) {
                    channel.getAllThemes(function (data) {
                        console.log('getAllThemes: ', data);
                    });
                }
                if(data.getSuomenVaylatLayers) {
                    channel.getSuomenVaylatLayers(function (data) {
                        console.log('getSuomenVaylatLayers: ', data);
                    });
                }
                if(data.getSVData) {
                    channel.getSVData(function (data) {
                        console.log('getSVData: ', data);
                    });
                }
                if(data.getThemesWithLayers) {
                    channel.getThemesWithLayers(function (data) {
                        console.log('getThemesWithLayers: ', data);
                        store.dispatch(setAllThemesWithLayers(data));
                    });
                }
                if(data.getLayerThemes) {
                    channel.getLayerThemes([826],function (data) {
                        console.log('getLayerThemes: ', data);
                    });
                }
                if(data.getThemeLayers) {
                    channel.getThemeLayers(["Päällysteiden kuntokartta"],function (data) {
                        console.log('getThemeLayers: ', data);
                    });
                }
                if(data.getZoomRange) {
                    channel.getZoomRange(function (data) {
                        //console.log('getZoomRange: ', data);
                        store.dispatch(setZoomRange(data));
                        data.hasOwnProperty('current') && store.dispatch(setCurrentZoomLevel(data.current));
                    });
                }
                if (data.getAllGroups) {
                    channel.getAllGroups(function (data) {
                        console.log('getAllGroups: ', data);
                        store.dispatch(setAllGroups(data));
                    });
                }
                if (data.getAllLayers) {
                    channel.getAllLayers(function (data) {
                        console.log('getAllLayers: ', data);
                        store.dispatch(setAllLayers(data));
                    });
                }
                if (data.getCurrentState) {
                    channel.getCurrentState(function (data) {
                        //console.log('getCurrentState: ', data);
                        store.dispatch(setCurrentState(data));
                    });
                }
                if (data.getFeatures) {
                    channel.getFeatures(function (data) {
                        //console.log('getFeatures: ', data);
                        store.dispatch(setFeatures(data));
                    });
                }
                if (data.getZoomLevelsLayers) {
                    channel.getZoomLevelsLayers(function (data) {
                        //console.log('getZoomLevelsLayers: ', data);
                        store.dispatch(setZoomLevelsLayers(data));
                    });
                }
                if (data.getLayerTags) {
                    const layerId = 299;
                    channel.getLayerTags([layerId], function (tags) {
                        console.log('getLayerTags', tags);
                    });
                }
            });

            channel.getSupportedEvents(function (data) {
                //console.log('GetSupportedEvents: ', data);
                if (data.MapClickedEvent) {
                    channel.handleEvent('MapClickedEvent', event => {
                        //console.log('MapClickedEvent: ', event);
                    });
                }
                if (data.MarkerClickEvent) {
                    channel.handleEvent('MarkerClickEvent', event => {
                        //console.log('MarkerClickEvent: ', event);
                    });
                }
                if (data.AfterMapMoveEvent) {
                    channel.handleEvent('AfterMapMoveEvent', event => {
                        //console.log('AfterMapMoveEvent: ', event);
                        event.hasOwnProperty('zoom') &&
                        store.dispatch(setCurrentZoomLevel(event.zoom));
                    });
                }
                if (data.SearchResultEvent) {
                    channel.handleEvent('SearchResultEvent', event => {
                        console.log('SearchResultEvent: ', event);
                    });
                }
                if (data.UserLocationEvent) {

                    channel.postRequest('MapModulePlugin.RemoveMarkersRequest', ["my_location"]);

                    channel.handleEvent('UserLocationEvent', event => {
                        var data = {
                            x: event.lon,
                            y: event.lat,
                            msg : '',
                            shape: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#0064af"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/><circle cx="12" cy="9" r="2.5"/></svg>',
                            offsetX: 0, // center point x position from left to right
                            offsetY: 10, // center point y position from bottom to up
                            size: 6
                          };
                        channel.postRequest('MapModulePlugin.AddMarkerRequest', [data, "my_location"]);

                        var routeSteps = [
                            {
                              "lon": event.lon,
                              "lat": event.lat,
                              "duration": 5000,
                              "zoom": 10,
                              "animation": "zoomPan"
                            }
                          ];
                          var stepDefaults = {
                            "zoom": 5,
                            "animation": "fly",
                            "duration": 5000,
                            "srsName": "EPSG:3067"
                          };
                          channel.postRequest('MapTourRequest', [routeSteps, stepDefaults]);
                    });
                }
            });

            channel.getSupportedRequests(function (data) {
                //console.log('getSupportedRequests: ', data);
            });
        });

        synchronizer.synchronize();

        return () => {
            synchronizer.destroy();
        };

    },[store]);

    return (
        <div id="published-map-container">
            {loading ? (
                <CenterSpinner/>
            ) : null}
            <iframe id="sv-iframe" title="iframe" src={process.env.REACT_APP_PUBLISHED_MAP_URL + "&lang=" + lang}
                allow="geolocation" onLoad={() => hideSpinner()}>
            </iframe>
        </div>
    )
};

export default PublishedMap;