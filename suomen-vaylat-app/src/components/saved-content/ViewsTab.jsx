import { useState, useEffect, useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { updateLayers } from '../../utils/rpcUtil';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import strings from '../../translations';
import Moment from 'react-moment';
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
import { addMarkerRequest, removeMarkerRequest } from '../../state/slices/rpcSlice';

const StyledMainContainer = styled.div`
`;

const StyledHeaderText = styled.div`
    font-size: 16px;
    color: #151515;
    margin-bottom: 20px;
`;

const StyledForm = styled.form`
    margin-bottom: 28px;
    display: flex;
    flex-direction: column;
`;

const StyledFormGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;
`;

const StyledLabel = styled.label`
    font-size: 15px;
    color: #292929;
    margin-bottom: 6px;
    font-weight: 500;
`;

const StyledInput = styled.input`
    font-size: 15px;
    padding: 8px 12px;
    border: 1px solid #c7c6c9;
    border-radius: 7px;
    width: 100%;
    background: #f6f7fa;
    outline: none;
    transition: border .13s;
    &:focus {
        border-color: #1964e0;
        background: #f0f2ff;
    }
`;

const StyledTextarea = styled.textarea`
    font-size: 15px;
    min-height: 36px;
    padding: 8px 12px;
    border: 1px solid #c7c6c9;
    border-radius: 7px;
    width: 100%;
    background: #f6f7fa;
    outline: none;
    transition: border .13s;
    resize: vertical;
    &:focus {
        border-color: #1964e0;
        background: #f0f2ff;
    }
`;

const StyledSwitchRow = styled.div`
    display: flex;
    align-items: center;
    margin-top: 3px;
    margin-bottom: 6px;
`;

const StyledSwitchLabel = styled.div`
    font-size: 15px;
    color: #292929;
    margin-left: 10px;
`;

const StyledLink = styled.a`
    margin-left: 12px;
    color: #8e3fff !important;
    font-size: 13px;
    cursor: pointer;
    &:hover { text-decoration: underline; }
`;

const StyledButtonsRow = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-top: 19px;
`;

const StyledCancel = styled.button`
    background: transparent;
    color: #333;
    border: 1px solid #b7bfc8;
    border-radius: 24px;
    font-size: 15px;
    padding: 8px 26px;
    cursor: pointer;
    transition: 0.1s;
    &:hover {
        border-color: #1c478e;
        color: #1c478e;
    }
`;

const StyledSave = styled.button`
    color: #fff;
    background: #1964e0;
    border: none;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 600;
    padding: 10px 36px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: 0.1s;
    svg {
        margin-right: 7px;
        font-size: 18px;
    }
    &:hover {
        background: #154cb5;
    }
    &:disabled {
        opacity: 0.45;
        cursor: default;
    }
`;

const StyledSubtitle = styled.div`
    font-size: 16px;
    font-weight: bold;
    color: ${(props) => props.theme?.colors?.mainColor1 || "#1964e0"};
    margin-bottom: 12px;
    margin-top: 22px;
`;
const StyledSavedViews = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;
const StyledNoSavedViews = styled.div`
    font-size: 14px;
    text-align: center;
    color: #888;
    padding: 32px 0 18px 0;
`;

const StyledSavedViewDate = styled.div`
    font-size: 12px;
    color: #858d99;
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
    display: flex;
    flex-direction: column;
    justify-content: center;
`;


const StyledDeleteAllSavedViews = styled.div`
    width: 250px;
    height: 40px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-color: ${(props) =>
        props.disabled
            ? "#d8d8d8"
            : "#e0603a"};
    margin: 32px auto 20px auto;
    border-radius: 20px;
    p {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
    }
    opacity: ${props => props.disabled ? "0.58" : "1"};
`;


const ViewsTab = () => {
    const { store } = useContext(ReactReduxContext);
    const [views, setViews] = useState([]);
    const [viewName, setViewName] = useState('');
    const [viewDescription, setViewDescription] = useState('');
    const [includeGeometries, setIncludeGeometries] = useState(false);

    const { selectedLayers, channel } = useAppSelector((state) => state.rpc);
    const { geoJsonArray, drawToolMarkers, activeGeometries } = useAppSelector((state) => state.ui);

    // Load saved views on mount
    useEffect(() => {
        window.localStorage.getItem('views') &&
            setViews(JSON.parse(window.localStorage.getItem('views')));
    }, []);

    const handleSaveView = () => {
        let markers = drawToolMarkers?.map(d => ({
            ...d,
            markerId : uuidv4(),
            color: "#ff5100b3"
        }));

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
            const updatedViews = [...views, newView];
            window.localStorage.setItem('views', JSON.stringify(updatedViews));
            setViews(updatedViews);
            setViewName('');
            setViewDescription('');
            setIncludeGeometries(false);
        });
    };

    const handleActivateView = (view) => {
        channel.getMapPosition(function () {
            var routeSteps = [{
                lon: view.data.x, lat: view.data.y, duration: 3000, zoom: view.data.zoom, animation: 'zoomPan',
            }];
            var stepDefaults = {
                lon: view.data.x, lat: view.data.y,
                zoom: view.data.zoom, animation: 'zoomPan',
                duration: 3000, srsName: 'EPSG:3067',
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

        // Restore geometries if present
        if (view.data.geometries) {
            const geometry = view.data.geometries;
            // Add markers
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
        const updatedViews = views.filter((viewData) => viewData.id !== view.id);
        window.localStorage.setItem('views', JSON.stringify(updatedViews));
        setViews(updatedViews);
    };

    const handleDeleteAllViews = () => {
        window.localStorage.setItem('views', JSON.stringify([]));
        setViews([]);
        store.dispatch(setWarning(null));
    };

    // --- RENDER ---
    return (
      <StyledMainContainer>
        <StyledSubtitle>{strings.savedContent.saveView.title || "Tallenna näkymä"}:</StyledSubtitle>


        <StyledForm
          onSubmit={e => {
            e.preventDefault();
            if (viewName) handleSaveView();
          }}
          autoComplete="off"
        >
          <StyledFormGroup>
            <StyledLabel htmlFor="view-name">
              {strings.savedContent.saveView.viewName || "Näkymän nimi"} *
            </StyledLabel>
            <StyledInput
              id="view-name"
              type="text"
              value={viewName}
              maxLength={80}
              onChange={e => setViewName(e.target.value)}
              required
              aria-label={strings.savedContent.saveView.viewName}
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <StyledLabel htmlFor="view-description">
              {strings.savedContent.saveView.description || "Kuvaus"}
            </StyledLabel>
            <StyledTextarea
              id="view-description"
              value={viewDescription}
              maxLength={200}
              onChange={e => setViewDescription(e.target.value)}
              aria-label={strings.savedContent.saveView.description}
            />
          </StyledFormGroup>
          <StyledSwitchRow>
            <Switch
              checked={includeGeometries}
              onChange={e => setIncludeGeometries(e.target.checked)}
              color="primary"
              inputProps={{ "aria-label": strings.savedContent.saveView.includeGeometries }}
            />
            <StyledSwitchLabel>
              {strings.savedContent.saveView.includeGeometries || "Tallenna omat geometriat mukaan."}
            </StyledSwitchLabel>
          </StyledSwitchRow>
          <StyledSwitchRow>
            <Switch
              checked={false}
              disabled
              color="primary"
              inputProps={{ "aria-label": strings.savedContent.saveView.includeDatasets || "Tallenna omat aineistot mukaan." }}
            />
            <StyledSwitchLabel>
              {strings.savedContent.saveView.includeDatasets || "Tallenna omat aineistot mukaan."}
            </StyledSwitchLabel>
          </StyledSwitchRow>
          <StyledButtonsRow>
            <StyledCancel type="button" onClick={() => store.dispatch(setIsSaveViewOpen(false))}>
              {strings.general.cancel || "Peruuta"}
            </StyledCancel>
            <StyledSave type="submit" disabled={!viewName}>
              <FontAwesomeIcon icon={faPlus}/>
              {strings.savedContent.saveView.saveViewButton || "Tallenna karttanäkymä"}
            </StyledSave>
          </StyledButtonsRow>
        </StyledForm>

        <StyledSubtitle>{strings.savedContent.saveView.savedViews || "Tallennetut näkymät"}:</StyledSubtitle>
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
      </StyledMainContainer>
    );
};

export default ViewsTab;
