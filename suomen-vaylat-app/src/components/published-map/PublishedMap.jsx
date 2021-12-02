import { useContext, useEffect } from 'react';
import OskariRPC from 'oskari-rpc';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import {
    setActiveAnnouncements, setAllGroups, setAllTags, setAllThemesWithLayers, setChannel, setCurrentMapCenter, setCurrentState, setCurrentZoomLevel, setFeatures, setLegends, setLoading, setTagsWithLayers, setZoomLevelsLayers, setZoomRange, setGFILocations
} from '../../state/slices/rpcSlice';
import { updateLayers } from '../../utils/rpcUtil';
import { AnnouncementsModal } from '../announcements-modal/AnnouncementsModal';

import SvLoder from '../../components/loader/SvLoader';

import { GFIPopup } from '../infobox/GFIPopup';
import './PublishedMap.scss';

const StyledPublishedMap = styled.div`
    height: calc(var(--app-height) - 60px);
`;

const StyledIframe = styled.iframe`
    width: 100%;
    height: 100%;
    border: none;
`;

const ANNOUNCEMENTS_LOCALSTORAGE = 'oskari-announcements';


const PublishedMap = () => {

    const { store } = useContext(ReactReduxContext);
    const loading = useAppSelector((state) => state.rpc.loading);
    const gfiLocations = useAppSelector((state) => state.rpc.gfiLocations);
    const language = useAppSelector((state) => state.language);
    const lang = language.current;

    const hideSpinner = () => {
        store.dispatch(setLoading(false));
    };

    useEffect(() => {
        store.dispatch(setLoading(true));
        const iframe = document.getElementById('sv-iframe');
        var handlers = [];

        var channel = OskariRPC.connect(iframe, process.env.REACT_APP_PUBLISHED_MAP_DOMAIN);
        var synchronizer = OskariRPC.synchronizerFactory(channel, handlers);

        channel.onReady(() => {
            store.dispatch(setChannel(channel));
            channel.getSupportedFunctions(function (data) {

                if (data.getTags) {
                    channel.getTags(function (data) {
                        store.dispatch(setAllTags(data));
                    });
                };

                if (data.getTagsWithLayers) {
                    channel.getTagsWithLayers(function (data) {
                        store.dispatch(setTagsWithLayers(data));
                    });
                };

                if (data.getAnnouncements) {
                    channel.getAnnouncements(function (data) {
                        if (data.data && data.data.length > 0) {
                            var localStorageAnnouncements = localStorage.getItem(ANNOUNCEMENTS_LOCALSTORAGE) ? localStorage.getItem(ANNOUNCEMENTS_LOCALSTORAGE) : [];
                            const activeAnnouncements = data.data.filter(announcement => announcement.active && localStorageAnnouncements && !localStorageAnnouncements.includes(announcement.id));
                            store.dispatch(setActiveAnnouncements(activeAnnouncements));
                        }
                    });
                };

                if (data.getThemesWithLayers) {
                    channel.getThemesWithLayers(function (data) {
                        store.dispatch(setAllThemesWithLayers(data));
                    });
                };

                if (data.getZoomRange) {
                    channel.getZoomRange(function (data) {
                        store.dispatch(setZoomRange(data));
                        data.hasOwnProperty('current') && store.dispatch(setCurrentZoomLevel(data.current));
                    });
                };

                if (data.getAllGroups) {
                    channel.getAllGroups(function (data) {
                        const arrangeAlphabetically = (x, y) => {
                            if (x.name < y.name) { return -1; }
                            if (x.name > y.name) { return 1; }
                            return 0;
                        };
                        store.dispatch(setAllGroups(data.sort(arrangeAlphabetically)));
                    });
                };

                updateLayers(store, channel);

                if (data.getCurrentState) {
                    channel.getCurrentState(function (data) {
                        store.dispatch(setCurrentState(data));
                    });
                };

                if (data.getFeatures) {
                    channel.getFeatures(function (data) {
                        store.dispatch(setFeatures(data));
                    });
                };

                if (data.getZoomLevelsLayers) {
                    channel.getZoomLevelsLayers(function (data) {
                        store.dispatch(setZoomLevelsLayers(data));
                    });
                };

                if (data.getLegends) {
                    channel.getLegends((data) => {
                        store.dispatch(setLegends(data));
                    });
                };

                if (data.getMapPosition) {
                    channel.getMapPosition((data) => {
                        store.dispatch(setCurrentMapCenter(data));
                    });
                };
            });

            channel.getSupportedEvents(function (data) {

                if (data.MapClickedEvent) {
                    channel.handleEvent('MapClickedEvent', event => {

                    });
                };

                if (data.DataForMapLocationEvent) {
                    channel.handleEvent('DataForMapLocationEvent', (data) => {
                        store.dispatch(setGFILocations(data));
                    });
                }

                if (data.MarkerClickEvent) {
                    channel.handleEvent('MarkerClickEvent', event => {

                    });
                };

                if (data.AfterMapMoveEvent) {
                    channel.handleEvent('AfterMapMoveEvent', event => {
                        store.dispatch(setCurrentMapCenter(event));
                    });
                };

                if (data.SearchResultEvent) {
                    channel.handleEvent('SearchResultEvent', event => {
                    });
                };

                if (data.UserLocationEvent) {
                    channel.postRequest('MapModulePlugin.RemoveMarkersRequest', ['my_location']);

                    channel.handleEvent('UserLocationEvent', event => {
                        var data = {
                            x: event.lon,
                            y: event.lat,
                            msg: '',
                            shape: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#0064af"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/><circle cx="12" cy="9" r="2.5"/></svg>',
                            offsetX: 0, // center point x position from left to right
                            offsetY: 10, // center point y position from bottom to up
                            size: 6
                        };
                        channel.postRequest('MapModulePlugin.AddMarkerRequest', [data, 'my_location']);

                        var routeSteps = [
                            {
                                'lon': event.lon,
                                'lat': event.lat,
                                'duration': 3000,
                                'zoom': 4,
                                'animation': 'zoomPan'
                            },
                            {
                                'lon': event.lon,
                                'lat': event.lat,
                                'duration': 3000,
                                'zoom': 10,
                                'animation': 'zoomPan'
                            }
                        ];
                        var stepDefaults = {
                            'zoom': 5,
                            'animation': 'fly',
                            'duration': 3000,
                            'srsName': 'EPSG:3067'
                        };
                        channel.postRequest('MapTourRequest', [routeSteps, stepDefaults]);
                    });
                };
            });

            channel.getSupportedRequests(function (data) {

            });
        });

        synchronizer.synchronize();

        return () => {
            synchronizer.destroy();
        };

    }, [store]);

    let announcements = useAppSelector((state) => state.rpc.activeAnnouncements);

    return (
        <StyledPublishedMap>
            {loading ? (
                <SvLoder />
            ) : null}
            {announcements.map((announcement) => {
                return (
                    <AnnouncementsModal
                        id={announcement.id}
                        title={announcement.title}
                        content={announcement.content}
                        key={announcement.id}
                    />
                );
            })}
            {gfiLocations.length > 0 ? (
                <GFIPopup gfiLocations={gfiLocations}/>
            ) : null}
            <StyledIframe id='sv-iframe' title='iframe' src={process.env.REACT_APP_PUBLISHED_MAP_URL + '&lang=' + lang}
                allow='geolocation' onLoad={() => hideSpinner()}>
            </StyledIframe>
        </StyledPublishedMap>

    )
};

export default PublishedMap;