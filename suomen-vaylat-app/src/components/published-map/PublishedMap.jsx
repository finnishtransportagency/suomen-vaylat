import React, { useContext, useEffect } from 'react';
import OskariRPC from 'oskari-rpc';
import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';

import {
    setLoading,
    setChannel,
    setAllGroups,
    setAllLayers,
    setAllTags,
    setCurrentState,
    setFeatures,
    setTagLayers,
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
                if(data.getZoomRange) {
                    channel.getZoomRange(function (data) {
                        //console.log('getZoomRange: ', data);
                        store.dispatch(setZoomRange(data));
                        data.hasOwnProperty('current') && store.dispatch(setCurrentZoomLevel(data.current));
                    });
                }
                if (data.getAllGroups) {
                    channel.getAllGroups(function (data) {
                        //console.log('getAllGroups: ', data);
                        store.dispatch(setAllGroups(data));
                    });
                }
                if (data.getAllLayers) {
                    channel.getAllLayers(function (data) {
                        //console.log('getAllLayers: ', data);
                        store.dispatch(setAllLayers(data));
                    });
                }
                if (data.getAllTags) {
                    channel.getAllTags(function (data) {
                        //console.log('getAllTags: ', data);
                        store.dispatch(setAllTags(data));
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
                if (data.getTagLayers) {
                    channel.getTagLayers(function (data) {
                        //console.log('getTagLayers: ', data);
                        store.dispatch(setTagLayers(data));
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