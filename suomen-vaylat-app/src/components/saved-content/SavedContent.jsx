import { useState, useEffect, useContext, useRef } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { updateLayers } from '../../utils/rpcUtil';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import strings from '../../translations';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
    setIsSaveViewOpen,
    setWarning,
    setSavedTabIndex,
    addToActiveGeometries,
    removeActiveGeometry,
    removeFromDrawToolMarkers
} from '../../state/slices/uiSlice';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TextField, Switch, FormControlLabel } from '@mui/material';

import CircleButton from '../../utils/components/CircleButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { theme } from '../../theme/theme';
import { addMarkerRequest, removeMarkerRequest } from '../../state/slices/rpcSlice';

// -- Styled Components (unchanged unless noted) --
const StyledContent = styled.div`
    max-width: 660px;
    overflow: hidden;
    flex-direction: column;
    display: flex;
    height: 100%;
`;

const StyledTabs = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    max-height: 100px;
    background-color: #F2F2F2;
    &::before {
        z-index: 2;
        position: absolute;
        content: '';
        width: ${props => 'calc(100% /' + props.tabsCount + ')'};
        height: 100%;
        background-color: ${props => props.theme.colors.mainWhite};
        bottom: 0px;
        left: ${props => props.tabIndex * (100 / (props.tabsCount - 1)) +'%'};
        border-radius: 4px 4px 0px 0px;
        transform: translateX(
            ${props => {
                return props.tabIndex * -(100 / (props.tabsCount - 1)) + '%';
            }}
        );
        transition: all 0.3s ease-out;
    };
    &::after {
        position: absolute;
        content: '';
        width: ${props => 'calc(100% /' + props.tabsCount + ')'};
        height: 100%;
        bottom: 0px;
        left: ${props => props.tabIndex * (100 / (props.tabsCount - 1)) + '%'};
        border-radius: 4px 4px 0px 0px;
        transform: translateX(
            ${props => {
                return props.tabIndex * -(100 / (props.tabsCount - 1)) + '%';
            }}
        );
        transition: all 0.3s ease-out;
        box-shadow: 0px -1px 11px rgba(0, 99, 175, 0.3);
    };
`;

const StyledTab = styled.div`
    z-index: 2;
    user-select: none;
    width: ${props => 'calc(100% /' + props.tabsCount + ')'};
    cursor: pointer;
    color: ${props => props.isSelected ? props.theme.colors[props.color] : "#656565"};
    text-align: center;
    transition: color 0.2s ease-out;
    display: flex;
    justify-content: center;

    p {
        font-size: 15px;
        font-weight: bold;
        margin: 0;
        padding: 10px;
    }
`;

const StyledSwiper = styled(Swiper)`
    margin-left: 0;
    margin-right: 0;

    .swiper-slide {
        background-color: ${props => props.theme.colors.mainWhite};
        padding: 16px 16px 16px 16px;
        overflow-y: auto;
        height:100%;
    };
  transition: box-shadow 0.3s ease-out;
`;

const StyledViewsContainer = styled.div`
    padding: 24px;
    max-height: 500px;
    overflow: auto;
    @media ${(props) => props.theme.device.mobileL} {
        max-height: unset;
    }
`;

const StyledSavedViews = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const StyledNoSavedViews = styled(motion.div)`
    font-size: 14px;
    text-align: center;
    padding: 16px;
`;

const StyledDeleteAllSavedViews = styled.div`
    width: 250px;
    height: 40px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props) => props.theme.colors.mainWhite};
    background-color: ${(props) =>
        props.disabled
            ? props.theme.colors.darkGrey
            : props.theme.colors.secondaryColorDarkOrange};
    margin: 20px auto 20px auto;
    border-radius: 20px;
    p {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
    }
`;

const StyledSaveNewViewContainer = styled.div`
    margin-bottom: 20px;
`;

const StyledSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    color: ${(props) => props.theme.colors.mainColor1};
    padding: 10px 0px 10px 5px;
    font-size: 16px;
    font-weight: bold;
`;

const StyledSavedViewContainer = styled(motion.div)`
    display: flex;
`;

const StyledSavedView = styled.div`
    width: 100%;
    z-index: 1;
    min-height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.button};
    border-radius: 4px;
    padding: 8px 0px 8px 0px;
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    @-moz-document url-prefix() {
        position: initial;
    }
`;

const StyledRemoveSavedView = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    svg {
        color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        &:hover {
            color: ${(props) => props.theme.colors.mainColor1};
        }
    }
`;

const StyledSavedViewName = styled.p`
    user-select: none;
    max-width: 240px;
    color: ${(props) => props.theme.colors.mainWhite};
    margin: 0;
    padding: 0px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.1s ease-in;
`;

const StyledSavedViewDescription = styled.p`
    margin: 0;
    padding: 0px;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
`;

const StyledLeftContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledRightContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyleSavedViewHeaderIcon = styled.div`
    width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        font-size: 20px;
        color: ${(props) => props.theme.colors.mainWhite};
    }
    p {
        margin: 0;
        font-weight: bold;
        font-size: 22px;
        color: ${(props) => props.theme.colors.mainWhite};
    }
`;

const StyledSavedViewTitleContent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const StyledSaveNewViewWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    min-height: 48px;
    background-color: ${(props) => props.theme.colors.mainWhite};
    border-radius: 24px;
    box-shadow: 0px 2px 4px #0000004d;
    overflow: hidden;
    padding: 8px;
    gap: 8px;
    @media ${(props) => props.theme.device.mobileL} {
        min-height: 40px;
    }
`;

const StyledViewName = styled.input`
    width: 160px;
    height: 36px;
    border: none;
    padding-left: 16px;
    border-radius: 16px;
    margin-right: 8px;
    font-size: 15px;
    @media ${(props) => props.theme.device.mobileL} {
        width: 100%;
        margin-bottom: 8px;
    }
    &:focus {
        outline: 0;
        outline-color: transparent;
        outline-style: none;
    }
`;

const StyledDeleteSavedGeometriesText = styled.p``;

// ------ MAIN COMPONENT WITH TABS -----
export const SavedContent = () => {
    const inputEl = useRef(null);

    const { store } = useContext(ReactReduxContext);
    const { savedTabIndex } = useAppSelector((state) => state.ui);
    const tabsContent = [
        {
            title: strings.savedContent.viewTitle,
            titleColor: 'mainColor1',
            content: <Views/>
        },
        {
            title: strings.savedContent.geometryTitle,
            titleColor: 'mainColor1',
            content: <Geometries/>
        }
    ];

    useEffect(() => {
        inputEl.current.swiper.slideTo(savedTabIndex);
    },[savedTabIndex]);

    return (
        <>
            <StyledContent>
                <StyledTabs
                    tabIndex={savedTabIndex}
                    tabsCount={tabsContent.length}
                >
                    {
                        tabsContent.map((tab, index) => {
                            return (
                                <StyledTab
                                    key={'sc_tab_' + tab.title}
                                    isSelected={index === savedTabIndex}
                                    color={tab.titleColor}
                                    onClick={() => {
                                        store.dispatch(setSavedTabIndex(index));
                                    }}
                                    tabsCount={tabsContent.length}
                                >
                                    <p>{tab.title}</p>
                                </StyledTab>
                            )
                        })
                    }
                </StyledTabs>
                <StyledSwiper
                    ref={inputEl}
                    id={'app-info-swiper'}
                    tabIndex={savedTabIndex}
                    onSlideChange={e => {
                        store.dispatch(setSavedTabIndex(e.activeIndex));
                    }}
                    allowTouchMove={false}
                    speed={300}
                >
                    {
                        tabsContent.map((tab, index) => {
                            return (
                                <SwiperSlide
                                    id={'sc_tab_content_' + index}
                                    key={'sc_tab_content_' + index}
                                >
                                    {tab.content}
                                </SwiperSlide>
                            )
                        })
                    }
                </StyledSwiper>
            </StyledContent>
        </>
    );
};

// ------------- VIEWS TAB -----------------
const Views = () => {
    const { store } = useContext(ReactReduxContext);
    const [views, setViews] = useState([]);
    const [viewName, setViewName] = useState('');
    const [viewDescription, setViewDescription] = useState('');
    const [includeGeometries, setIncludeGeometries] = useState(false);

    const { selectedLayers, channel } = useAppSelector((state) => state.rpc);
    const { geoJsonArray, drawToolMarkers, activeGeometries } = useAppSelector((state) => state.ui);

    useEffect(() => {
        window.localStorage.getItem('views') !== null &&
            setViews(JSON.parse(window.localStorage.getItem('views')));
    }, []);

    const handleSaveView = () => {

        let markers = drawToolMarkers?.map(d => ({
            ...d,
            markerId : uuidv4(),
            color: "#ff5100b3"
        }))
        channel.getMapPosition(function (center) {
            let newView = {
                id: uuidv4(),
                name: viewName,
                description: viewDescription,
                saveDate: Date.now(),
                data: {
                    zoom: center.zoom && center.zoom,
                    x: center.centerX && center.centerX,
                    y: center.centerY && center.centerY,
                    layers: selectedLayers,
                    language: strings.getLanguage(),
                    geometries: includeGeometries
                        ? { geoJsonArray, markers }
                        : undefined
                },
            };
            // Save
            views.push(newView);
            window.localStorage.setItem('views', JSON.stringify(views));
            setViews(JSON.parse(window.localStorage.getItem('views')));
            setViewName('');
            setViewDescription('');
            setIncludeGeometries(false);
        });
    };

    const handleActivateView = (view) => {
        channel.getMapPosition(function () {
            var routeSteps = [
                {
                    lon: view.data.x,
                    lat: view.data.y,
                    duration: 3000,
                    zoom: view.data.zoom,
                    animation: 'zoomPan',
                },
            ];
            var stepDefaults = {
                lon: view.data.x,
                lat: view.data.y,
                zoom: view.data.zoom,
                animation: 'zoomPan',
                duration: 3000,
                srsName: 'EPSG:3067',
            };
            channel.postRequest('MapTourRequest', [routeSteps, stepDefaults]);
        });

        selectedLayers.forEach((layer) => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, false]);
        });

        view.data.layers.forEach((layer) => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, true]);
            channel.postRequest('ChangeMapLayerOpacityRequest', [layer.id, layer.opacity]);
        });

        // --- Restore geometries if present and requested ---
        if (view.data.geometries) {
            const geometry = view.data.geometries;
            // You would plug your geometry restore code here:
            // For example: store.dispatch(setGeometries(view.data.geometries.geoJsonArray));
            // and logic to restore drawToolMarkers if needed.
            // You may want to coordinate this with your Geometries Redux slice/component.
            // For now, you could do nothing or show a notification/mock:
            // alert('Would restore geometries: ' + JSON.stringify(view.data.geometries));
            geometry.markers.forEach(marker => {
                store.dispatch(addMarkerRequest(marker));
            });

            const addFeaturesToMapParams =
            {
                clearPrevious: false,
                layerId: geometry.id,
                featureStyle: {
                    fill: {
                    color: "rgba(10, 140, 247, 0.1)",
                    },
                    stroke: {
                    color: "rgba(10, 140, 247, 0.3)",
                    width: 5,
                    lineDash: "solid",
                    lineCap: "round",
                    lineJoin: "round",
                    area: {
                        color: "#ff5100b3",
                        width: 4,
                        lineJoin: "round",
                    },
                    },
                    image: {
                    shape: 5,
                    size: 3,
                    fill: {
                        color: "#ff5100b3",
                    },
                    },
                },
            };
            if(activeGeometries.find(g => g.id === view.id)) {
                store.dispatch(removeActiveGeometry(view.id));
                geometry.markers.forEach(marker => {
                    store.dispatch(removeMarkerRequest({markerId: marker.markerId}));
                })
                channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, geometry.id]);
                return;
            }
            const savedGeometries = [...geometry.geoJsonArray];

            savedGeometries.forEach(g => {
                //tiehaku
                g.data && g.data.geom &&
                channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
                    geometry.data.geom,
                    addFeaturesToMapParams
                ]);

                g.features && g.features.forEach(feature => {
                    channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
                        feature.geojson,
                        addFeaturesToMapParams
                    ]);
                })

                g.geojson &&
                channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
                    g.geojson ,
                    addFeaturesToMapParams
                ]);
            })


            store.dispatch(addToActiveGeometries(geometry));
        }

        updateLayers(store, channel);
        store.dispatch(setIsSaveViewOpen(false));
    };

    const handleRemoveView = (view) => {
        let updatedViews = views.filter((viewData) => viewData.id !== view.id);
        window.localStorage.setItem('views', JSON.stringify(updatedViews));
        setViews(JSON.parse(window.localStorage.getItem('views')));
    };

    const handleDeleteAllViews = () => {
        window.localStorage.setItem('views', JSON.stringify([]));
        setViews(JSON.parse(window.localStorage.getItem('views')));
        store.dispatch(setWarning(null));
    };

    return (
        <StyledViewsContainer>
            <StyledSaveNewViewContainer>
                <StyledSubtitle>{strings.savedContent.saveView.saveNewView}</StyledSubtitle>
                <StyledSaveNewViewWrapper>
                    <StyledViewName
                        id="view-name"
                        type="text"
                        value={viewName}
                        onChange={(e) => setViewName(e.target.value)}
                        placeholder={strings.savedContent.saveView.viewName}
                        aria-label={strings.savedContent.saveView.viewName}
                    />
                    <TextField
                        id="view-description"
                        value={viewDescription}
                        onChange={(e) => setViewDescription(e.target.value)}
                        placeholder={strings.savedContent.saveView.description}
                        size="small"
                        variant="outlined"
                        sx={{ flex: 1, marginLeft: 8, marginRight: 8, background: "#fff" }}
                        aria-label={strings.savedContent.saveView.description}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={includeGeometries}
                                onChange={(e) => setIncludeGeometries(e.target.checked)}
                                color="primary"
                                inputProps={{ 'aria-label': strings.savedContent.saveView.includeGeometries }}
                            />
                        }
                        label={strings.savedContent.saveView.includeGeometries}
                        style={{ marginLeft: "6px", marginRight: "6px" }}
                    />
                    <CircleButton
                        text={strings.savedContent.saveView.saveViewButton}
                        icon={faPlus}
                        clickAction={() => {
                            viewName !== '' && handleSaveView();
                        }}
                        disabled={viewName === ''}
                    />
                </StyledSaveNewViewWrapper>
            </StyledSaveNewViewContainer>
            <StyledSubtitle>{strings.savedContent.saveView.savedViews}:</StyledSubtitle>
            <StyledSavedViews>
                <AnimatePresence>
                    {views.length > 0 ? (
                        views.map((view) => {
                            return (
                                <StyledSavedViewContainer
                                    key={view.id}
                                    transition={{
                                        duration: 0.2,
                                        type: 'tween',
                                    }}
                                    initial={{
                                        opacity: 0,
                                        height: 0,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        height: 'auto',
                                    }}
                                    exit={{
                                        opacity: 0,
                                        height: 0,
                                    }}
                                >
                                    <StyledSavedView
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleActivateView(view);
                                        }}
                                    >
                                        <StyledLeftContent>
                                            <StyleSavedViewHeaderIcon>
                                                <p>
                                                    {view.name.charAt(0).toUpperCase()}
                                                </p>
                                            </StyleSavedViewHeaderIcon>
                                            <StyledSavedViewTitleContent>
                                                <StyledSavedViewName>
                                                    {view.name}
                                                </StyledSavedViewName>
                                                {view.description && (
                                                    <StyledSavedViewDescription>
                                                        {view.description}
                                                    </StyledSavedViewDescription>
                                                )}
                                                <StyledSavedViewDescription>
                                                    <Moment format="DD.MM.YYYY" tz="Europe/Helsinki">
                                                        {view.saveDate}
                                                    </Moment>
                                                </StyledSavedViewDescription>
                                            </StyledSavedViewTitleContent>
                                        </StyledLeftContent>
                                        <StyledRightContent />
                                    </StyledSavedView>
                                    <StyledRemoveSavedView>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            onClick={() => handleRemoveView(view)}
                                        />
                                    </StyledRemoveSavedView>
                                </StyledSavedViewContainer>
                            );
                        })
                    ) : (
                        <StyledNoSavedViews
                            key="no-saved-views"
                            transition={{
                                duration: 0.3,
                                type: 'tween',
                            }}
                            initial={{
                                opacity: 0,
                                height: 0,
                            }}
                            animate={{
                                opacity: 1,
                                height: 'auto',
                            }}
                            exit={{
                                opacity: 0,
                                height: 0,
                            }}
                        >
                            {strings.savedContent.saveView.noSavedViews}
                        </StyledNoSavedViews>
                    )}
                </AnimatePresence>
                <StyledDeleteAllSavedViews
                    onClick={() =>
                        views.length > 0 &&
                        store.dispatch(
                            setWarning({
                                title: strings.savedContent.saveView.confirmDeleteAll,
                                subtitle: null,
                                cancel: {
                                    text: strings.general.cancel,
                                    action: () =>
                                        store.dispatch(setWarning(null)),
                                },
                                confirm: {
                                    text: strings.general.continue,
                                    action: () => {
                                        handleDeleteAllViews();
                                        store.dispatch(setWarning(null));
                                    },
                                },
                            })
                        )
                    }
                    disabled={views.length === 0}
                >
                    <p>{strings.savedContent.saveView.deleteAllSavedViews}</p>
                </StyledDeleteAllSavedViews>
            </StyledSavedViews>
        </StyledViewsContainer>
    );
};

// ----- GEOMETRIES TAB (unchanged) -----
const Geometries = () => {
    const { store } = useContext(ReactReduxContext);
    const { channel } = useSelector((state) => state.rpc);
    const { activeGeometries, drawToolMarkers } = useSelector(state => state.ui);
    const [geometries, setGeometries] = useState([]);
    const [geometryName, setGeometryName] = useState('');
    const { geoJsonArray } = useSelector((state) => state.ui);

    useEffect(() => {
        window.localStorage.getItem('geometries') !== null &&
        setGeometries(JSON.parse(window.localStorage.getItem('geometries')));
    }, []);

    const handleActivateGeometry = (geometry) => {
        geometry.markers.forEach(marker => {
            store.dispatch(addMarkerRequest(marker));
        });

        const addFeaturesToMapParams =
        {
            clearPrevious: false,
            layerId: geometry.id,
            featureStyle: {
                fill: {
                  color: "rgba(10, 140, 247, 0.1)",
                },
                stroke: {
                  color: "rgba(10, 140, 247, 0.3)",
                  width: 5,
                  lineDash: "solid",
                  lineCap: "round",
                  lineJoin: "round",
                  area: {
                    color: "#ff5100b3",
                    width: 4,
                    lineJoin: "round",
                  },
                },
                image: {
                  shape: 5,
                  size: 3,
                  fill: {
                    color: "#ff5100b3",
                  },
                },
            },
        };
        if(activeGeometries.find(g => g.id === geometry.id)) {
            store.dispatch(removeActiveGeometry(geometry.id));
            geometry.markers.forEach(marker => {
                store.dispatch(removeMarkerRequest({markerId: marker.markerId}));
            })
            channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, geometry.id]);
            return;
        }
        const savedGeometries = [...geometry.data];

        savedGeometries.forEach(geometry => {
            //tiehaku
            geometry.data && geometry.data.geom &&
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
                geometry.data.geom,
                addFeaturesToMapParams
            ]);

            geometry.features && geometry.features.forEach(feature => {
                channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
                    feature.geojson,
                    addFeaturesToMapParams
                ]);
            })

            geometry.geojson &&
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
                geometry.geojson ,
                addFeaturesToMapParams
            ]);
        })


        store.dispatch(addToActiveGeometries(geometry));
    };

    const handleSaveGeometry = () => {
        let layerId = uuidv4();
        let markers = drawToolMarkers.map(d => ({
            ...d,
            markerId : uuidv4(),
            color: "#ff5100b3"
        }))

        let newGeometry = {
            id: layerId,
            name: geometryName,
            saveDate: Date.now(),
            data: [...geoJsonArray],
            markers: [...markers]
        };

        geometries.push(newGeometry);
        window.localStorage.setItem('geometries', JSON.stringify(geometries));
        setGeometries(JSON.parse(window.localStorage.getItem('geometries')));
        setGeometryName('');
    };

    const handleRemoveGeometry = (geometry) => {
        let updatedGeometries = geometries.filter((geometryData) => geometryData.id !== geometry.id);
        window.localStorage.setItem('geometries', JSON.stringify(updatedGeometries));
        setGeometries(JSON.parse(window.localStorage.getItem('geometries')));
        geometry.markers.forEach(marker => {
            store.dispatch(removeMarkerRequest({markerId: marker.markerId}));
            store.dispatch(removeFromDrawToolMarkers(marker.markerId));
        });

        if(activeGeometries.find(g => g.id === geometry.id)) {
            store.dispatch(removeActiveGeometry(geometry.id));
            channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, geometry.id]);
            return;
        };
    };

    const handleDeleteAllGeometries = () => {
        activeGeometries.forEach(geometry => {
            geometry.markers.forEach(marker => {
                store.dispatch(removeMarkerRequest({markerId: marker.markerId}));
                store.dispatch(removeFromDrawToolMarkers(marker.markerId));
            });
            store.dispatch(removeActiveGeometry(geometry.id));
            channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, geometry.id]);
        });
        window.localStorage.setItem('geometries', JSON.stringify([]));
        setGeometries(JSON.parse(window.localStorage.getItem('geometries')));
        store.dispatch(setWarning(null));
    };

    const itemsToSave = geoJsonArray.length > 0 || drawToolMarkers.length > 0;

    return (
        <StyledViewsContainer>
            <StyledSaveNewViewContainer>
                <StyledSubtitle>{strings.savedContent.saveGeometry.saveNewGeometry}</StyledSubtitle>
                <StyledSaveNewViewWrapper>
                    <StyledViewName
                        id="geometry-name"
                        type="text"
                        value={geometryName}
                        onChange={(e) => setGeometryName(e.target.value)}
                        placeholder={itemsToSave ? strings.savedContent.saveGeometry.geometryName : strings.savedContent.saveGeometry.noGeometry}
                        disabled={!itemsToSave}
                    />
                    <CircleButton
                        text={strings.savedContent.saveView.saveViewButton}
                        icon={faPlus}
                        clickAction={() => {
                            geometryName !== '' && itemsToSave && handleSaveGeometry();
                        }}
                        disabled={geometryName === ''}
                    />
                </StyledSaveNewViewWrapper>
            </StyledSaveNewViewContainer>
            <StyledSubtitle>{strings.savedContent.saveGeometry.savedGeometries}:</StyledSubtitle>
            <StyledSavedViews>
                <AnimatePresence>
                    {geometries.length > 0 ? (
                        geometries.map((geometry) => {
                            return (
                                <StyledSavedViewContainer
                                    key={geometry.id}
                                    transition={{
                                        duration: 0.2,
                                        type: 'tween',
                                    }}
                                    initial={{
                                        opacity: 0,
                                        height: 0,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        height: 'auto',
                                    }}
                                    exit={{
                                        opacity: 0,
                                        height: 0,
                                    }}
                                >
                                    <StyledSavedView
                                        style={{
                                            backgroundColor: activeGeometries.find(g => g.id === geometry.id) ? theme.colors.buttonActive : theme.colors.button
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleActivateGeometry(geometry);
                                        }}
                                    >
                                        <StyledLeftContent>
                                            <StyleSavedViewHeaderIcon>
                                                {
                                                    <p>
                                                        {geometry.name.charAt(0).toUpperCase()}
                                                    </p>
                                                }
                                            </StyleSavedViewHeaderIcon>
                                            <StyledSavedViewTitleContent>
                                                <StyledSavedViewName>
                                                    {geometry.name}
                                                </StyledSavedViewName>
                                                <StyledSavedViewDescription>
                                                    <Moment format="DD.MM.YYYY" tz="Europe/Helsinki">
                                                        {geometry.saveDate}
                                                    </Moment>
                                                </StyledSavedViewDescription>
                                            </StyledSavedViewTitleContent>
                                        </StyledLeftContent>
                                        <StyledRightContent />
                                    </StyledSavedView>
                                    <StyledRemoveSavedView>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            onClick={() => handleRemoveGeometry(geometry)}
                                        />
                                    </StyledRemoveSavedView>
                                </StyledSavedViewContainer>
                            );
                        })
                    ) : (
                        <StyledNoSavedViews
                            key="no-saved-views"
                            transition={{
                                duration: 0.3,
                                type: 'tween',
                            }}
                            initial={{
                                opacity: 0,
                                height: 0,
                            }}
                            animate={{
                                opacity: 1,
                                height: 'auto',
                            }}
                            exit={{
                                opacity: 0,
                                height: 0,
                            }}
                        >
                            {strings.savedContent.saveGeometry.noSavedGeometries}
                        </StyledNoSavedViews>
                    )}
                </AnimatePresence>
                <StyledDeleteAllSavedViews
                    onClick={() =>
                        geometries.length > 0 &&
                        store.dispatch(
                            setWarning({
                                title: strings.savedContent.saveGeometry.confirmDeleteAll,
                                subtitle: null,
                                cancel: {
                                    text: strings.general.cancel,
                                    action: () => store.dispatch(setWarning(null)),
                                },
                                confirm: {
                                    text: strings.general.continue,
                                    action: () => {
                                        handleDeleteAllGeometries();
                                        store.dispatch(setWarning(null));
                                    },
                                },
                            })
                        )
                    }
                    disabled={geometries.length === 0}
                >
                    <StyledDeleteSavedGeometriesText>{strings.savedContent.saveGeometry.deleteAllSavedGeometries}</StyledDeleteSavedGeometriesText>
                </StyledDeleteAllSavedViews>
            </StyledSavedViews>
        </StyledViewsContainer>
    );
};

export default SavedContent;
