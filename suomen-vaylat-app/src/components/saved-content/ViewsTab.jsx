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
  addToActiveGeometries,
  removeActiveGeometry,
  setShowSavedContentViewForm
} from '../../state/slices/uiSlice';
import {
  faPlus,
  faSave,
  faTrash,
  faPen
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Switch } from '@mui/material';
import {
  addMarkerRequest,
  removeMarkerRequest
} from '../../state/slices/rpcSlice';
import ViewForm from './ViewForm';
import { isMobile } from '../../theme/theme';

const StyledMainContainer = styled.div`
  overflow: auto;
  padding: 0 12px 12px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media ${(props) => props.theme.device.lowResDesktop} {
    max-height: 500px;
  }
`;

const StyledSave = styled.button`
  border: none;
  width: 250px;
  height: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.darkGrey
      : props.theme.colors.mainColor1};
  border-radius: 20px;
  p {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
  }
  opacity: ${(props) => (props.disabled ? '0.58' : '1')};
  &:hover {
    background-color: ${(props) => props.theme.colors.mainColor1Selected};
  }

  @media ${(props) => props.theme.device.mobileL} {
    margin: 18px 0px;
    width: 100%;
  }
`;

const StyledSubtitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => props.theme?.colors?.mainColor1};
  margin-top: 1em;
`;

const StyledSavedViews = styled.div`
  overflow: auto;
  max-height: 400px;
  @media ${(props) => props.theme.device.lowResDesktop} {
    max-height: 300px;
  }
  display: flex;
  flex-direction: column;
  gap: 8px;
  @media ${(props) => props.theme.device.mobileL} {
    padding: 8px;
  }
`;

const StyledNoSavedViews = styled.div`
  font-size: 14px;
  text-align: center;
  color: #888;
  padding: 32px 0 18px 0;
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
  padding: 8px 1em;
  gap: 1em;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
`;

const StyledViewActions = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
`;

const StyledRemoveSavedView = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  svg {
    color: ${(props) => props.theme.colors.mainWhite};
    cursor: pointer;
    &:hover {
      color: ${(props) => props.theme.colors.hover};
    }
  }
`;

const StyledSavedViewName = styled.p`
  user-select: none;
  max-width: 240px;
  color: ${(props) => props.theme.colors.mainWhite};
  margin: 0;
  padding: 0px;
  font-size: 16px;
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

const StyledDeleteAllSavedViews = styled.button`
  border: none;
  width: 250px;
  height: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.darkGrey
      : props.theme.colors.secondaryColorDarkOrange};
  border-radius: 20px;
  p {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
  }
  opacity: ${(props) => (props.disabled ? '0.58' : '1')};
  &:hover {
    background-color: ${(props) =>
      props.theme.colors.secondaryColorDarkOrangeSelected};
  }

  @media ${(props) => props.theme.device.mobileL} {
    margin: 0px;
    width: 100%;
  }
`;

const StyledIconButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.mainWhite};
  font-size: 16px;
  &:hover {
    color: ${(props) => props.theme.colors.hover};
  }
`;

const StyledIsDefault = styled.div`
  color: ${(props) => props.theme.colors.mainWhite};
  font-size: 14px;
  margin-right: 8px;
`;

const StyledViewsButtonsWrapper = styled.div`
  justify-content: space-around;
  display: flex;
  @media ${(props) => props.theme.device.mobileL} {
    flex-direction: column;
  }
`;

const StyledSaveGeometryWrapper = styled.div``;

const StyledSavedGeometriesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2em;
  @media ${(props) => props.theme.device.mobileL} {
    gap: 1em;
  }
`;

const ViewsTab = () => {
  const { store } = useContext(ReactReduxContext);
  const [views, setViews] = useState([]);
  const [editingView, setEditingView] = useState(null);
  const [defaultViewId, setDefaultViewId] = useState(null);
  const { selectedLayers, channel } = useAppSelector((state) => state.rpc);
  const {
    geoJsonArray,
    drawToolMarkers,
    activeGeometries,
    showSavedContentViewForm
  } = useAppSelector((state) => state.ui);

  // Load on mount
  useEffect(() => {
    const storedViews = window.localStorage.getItem('views');
    if (storedViews) setViews(JSON.parse(storedViews));
    const defaultId = window.localStorage.getItem('defaultViewId');
    setDefaultViewId(defaultId ? defaultId : null);
  }, []);

  // Persist defaultViewId
  useEffect(() => {
    if (defaultViewId !== null) {
      window.localStorage.setItem('defaultViewId', defaultViewId);
    }
  }, [defaultViewId]);

  // Opens form to add a new view
  const handleAddNew = () => {
    setEditingView(null);
    store.dispatch(setShowSavedContentViewForm(true));
  };

  // Opens form to edit existing view
  const handleEdit = (view) => {
    setEditingView({
      ...view,
      includeGeometries: Boolean(view.data?.geometries),
      isDefault: view.id === defaultViewId
    });
    store.dispatch(setShowSavedContentViewForm(true));
  };

  // Saves new or edited view
  const handleSave = (formData) => {
    // Gather map data via channel, then update or add view
    channel.getMapPosition((center) => {
      let markers = drawToolMarkers?.map((d) => ({
        ...d,
        markerId: uuidv4(),
        color: '#ff5100b3'
      }));

      let thisId = editingView?.id || uuidv4();
      let newView = {
        id: thisId,
        name: formData.name,
        description: formData.description,
        saveDate: Date.now(),
        data: {
          zoom: center.zoom && center.zoom,
          x: center.centerX && center.centerX,
          y: center.centerY && center.centerY,
          layers: selectedLayers,
          language: strings.getLanguage(),
          geometries: formData.includeGeometries
            ? { geoJsonArray, markers, id: thisId }
            : undefined
        }
      };

      let updatedViews;
      if (editingView) {
        updatedViews = views.map((v) =>
          v.id === editingView.id ? { ...newView, id: editingView.id } : v
        );
      } else {
        updatedViews = [...views, newView];
      }
      setViews(updatedViews);
      window.localStorage.setItem('views', JSON.stringify(updatedViews));

      // Handle default view logic
      if (formData.isDefault) {
        setDefaultViewId(thisId);
        window.localStorage.setItem('defaultViewId', thisId);
      } else if (editingView && editingView.id === defaultViewId) {
        setDefaultViewId(null);
        window.localStorage.removeItem('defaultViewId');
      }
      store.dispatch(setShowSavedContentViewForm(false));
      setEditingView(null);
    });
  };

  // Remove a single view
  const handleRemoveView = (view) => {
    const updatedViews = views.filter((viewData) => viewData.id !== view.id);
    window.localStorage.setItem('views', JSON.stringify(updatedViews));
    setViews(updatedViews);

    if (view.id === defaultViewId) {
      setDefaultViewId(null);
      window.localStorage.removeItem('defaultViewId');
    }
    if (editingView && view.id === editingView.id) {
      setEditingView(null);
      store.dispatch(setShowSavedContentViewForm(false));
    }
  };

  // Delete all views
  const handleDeleteAllViews = () => {
    window.localStorage.setItem('views', JSON.stringify([]));
    setViews([]);
    setDefaultViewId(null);
    window.localStorage.removeItem('defaultViewId');
    store.dispatch(setWarning(null));
  };

  const handleActivateView = (view) => {
    channel.getMapPosition(function () {
      var routeSteps = [
        {
          lon: view.data.x,
          lat: view.data.y,
          duration: 3000,
          zoom: view.data.zoom,
          animation: 'zoomPan'
        }
      ];
      var stepDefaults = {
        lon: view.data.x,
        lat: view.data.y,
        zoom: view.data.zoom,
        animation: 'zoomPan',
        duration: 3000,
        srsName: 'EPSG:3067'
      };
      channel.postRequest('MapTourRequest', [routeSteps, stepDefaults]);
    });

    selectedLayers.forEach((layer) => {
      channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [
        layer.id,
        false
      ]);
    });

    view.data.layers.forEach((layer) => {
      channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [
        layer.id,
        true
      ]);
      channel.postRequest('ChangeMapLayerOpacityRequest', [
        layer.id,
        layer.opacity
      ]);
    });

    if (view.data.geometries) {
      const geometry = view.data.geometries;
      geometry.markers.forEach((marker) => {
        store.dispatch(addMarkerRequest(marker));
      });

      const addFeaturesToMapParams = {
        clearPrevious: false,
        layerId: geometry.id,
        featureStyle: {
          fill: {
            color: 'rgba(10, 140, 247, 0.1)'
          },
          stroke: {
            color: 'rgba(10, 140, 247, 0.3)',
            width: 5,
            lineDash: 'solid',
            lineCap: 'round',
            lineJoin: 'round',
            area: {
              color: '#ff5100b3',
              width: 4,
              lineJoin: 'round'
            }
          },
          image: {
            shape: 5,
            size: 3,
            fill: {
              color: '#ff5100b3'
            }
          }
        }
      };
      if (activeGeometries.find((g) => g.id === view.id)) {
        store.dispatch(removeActiveGeometry(view.id));
        geometry.markers.forEach((marker) => {
          store.dispatch(removeMarkerRequest({ markerId: marker.markerId }));
        });
        channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
          null,
          null,
          geometry.id
        ]);
        return;
      }
      const savedGeometries = [...geometry.geoJsonArray];

      savedGeometries.forEach((g) => {
        //tiehaku
        g.data &&
          g.data.geom &&
          channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
            geometry.data.geom,
            addFeaturesToMapParams
          ]);

        g.features &&
          g.features.forEach((feature) => {
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
              feature.geojson,
              addFeaturesToMapParams
            ]);
          });

        g.geojson &&
          channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
            g.geojson,
            addFeaturesToMapParams
          ]);
      });

      store.dispatch(addToActiveGeometries(geometry));
    }

    updateLayers(store, channel);
    store.dispatch(setIsSaveViewOpen(false));
  };

  return (
    <StyledMainContainer>
      {showSavedContentViewForm ? (
        <ViewForm
          initialData={editingView}
          onSave={handleSave}
          onCancel={() => {
            store.dispatch(setShowSavedContentViewForm(false));
            setEditingView(null);
          }}
          isEditing={!!editingView}
          strings={strings}
        />
      ) : (
        <>
          <StyledSavedGeometriesWrapper>
            <StyledSubtitle>
              {strings.savedContent.saveView.savedViews ||
                'Tallennetut näkymät'}
              :
            </StyledSubtitle>
            <StyledSavedViews>
              <AnimatePresence>
                {views.length > 0 ? (
                  [
                    ...views.filter((v) => v.id === defaultViewId),
                    ...views
                      .filter((v) => v.id !== defaultViewId)
                      .sort((a, b) => b.saveDate - a.saveDate)
                  ].map((view) => {
                    const isDefaultView = view.id === defaultViewId;
                    return (
                      <StyledSavedViewContainer
                        key={view.id}
                        transition={{ duration: 0.2, type: 'tween' }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <StyledSavedView
                          onClick={(e) => {
                            // Prevent edit/delete from triggering activate
                            if (
                              e.target.closest('[data-action="edit"]') ||
                              e.target.closest('[data-action="remove"]')
                            )
                              return;
                            e.preventDefault();
                            handleActivateView(view);
                          }}
                        >
                          <StyledLeftContent>
                            <StyledSavedViewTitleContent>
                              <StyledSavedViewName>
                                {view.name}
                              </StyledSavedViewName>
                              {view.description && (
                                <StyledSavedViewDescription>
                                  {view.description &&
                                  view.description.length > 40
                                    ? view.description.slice(0, 40) + '…'
                                    : view.description}
                                </StyledSavedViewDescription>
                              )}
                              <StyledSavedViewDescription>
                                <Moment
                                  format="DD.MM.YYYY"
                                  tz="Europe/Helsinki"
                                >
                                  {view.saveDate}
                                </Moment>
                              </StyledSavedViewDescription>
                            </StyledSavedViewTitleContent>
                          </StyledLeftContent>
                          <StyledViewActions>
                            {isDefaultView && (
                              <StyledIsDefault>
                                {strings.savedContent.saveView.defaultView}
                              </StyledIsDefault>
                            )}
                            <StyledIconButton
                              type="button"
                              data-action="edit"
                              title={
                                strings.savedContent.saveView.editView ||
                                'Muokkaa'
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(view);
                              }}
                            >
                              <FontAwesomeIcon icon={faPen} />
                            </StyledIconButton>
                            <StyledIconButton
                              type="button"
                              data-action="remove"
                              title={
                                strings.savedContent.saveView.deleteSavedView
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveView(view);
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </StyledIconButton>
                          </StyledViewActions>
                        </StyledSavedView>
                      </StyledSavedViewContainer>
                    );
                  })
                ) : (
                  <StyledNoSavedViews
                    key="no-saved-views"
                    transition={{ duration: 0.3, type: 'tween' }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {strings.savedContent.saveView.noSavedViews}
                  </StyledNoSavedViews>
                )}
              </AnimatePresence>
            </StyledSavedViews>
            {isMobile ? (
              <StyledViewsButtonsWrapper>
                <StyledSave type="button" onClick={handleAddNew}>
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
                  <p>
                    {strings.savedContent.saveView.addNewView || 'Uusi näkymä'}
                  </p>
                </StyledSave>

                <StyledDeleteAllSavedViews
                  onClick={() =>
                    views.length > 0 &&
                    store.dispatch(
                      setWarning({
                        title: strings.savedContent.saveView.confirmDeleteAll,
                        subtitle: null,
                        cancel: {
                          text: strings.general.cancel,
                          action: () => store.dispatch(setWarning(null))
                        },
                        confirm: {
                          text: strings.general.continue,
                          action: () => {
                            handleDeleteAllViews();
                            store.dispatch(setWarning(null));
                          }
                        }
                      })
                    )
                  }
                  disabled={views.length === 0}
                >
                  <p>{strings.savedContent.saveView.deleteAllSavedViews}</p>
                </StyledDeleteAllSavedViews>
              </StyledViewsButtonsWrapper>
            ) : (
              <StyledViewsButtonsWrapper>
                <StyledDeleteAllSavedViews
                  onClick={() =>
                    views.length > 0 &&
                    store.dispatch(
                      setWarning({
                        title: strings.savedContent.saveView.confirmDeleteAll,
                        subtitle: null,
                        cancel: {
                          text: strings.general.cancel,
                          action: () => store.dispatch(setWarning(null))
                        },
                        confirm: {
                          text: strings.general.continue,
                          action: () => {
                            handleDeleteAllViews();
                            store.dispatch(setWarning(null));
                          }
                        }
                      })
                    )
                  }
                  disabled={views.length === 0}
                >
                  <p>{strings.savedContent.saveView.deleteAllSavedViews}</p>
                </StyledDeleteAllSavedViews>
                <StyledSave type="button" onClick={handleAddNew}>
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
                  <p>
                    {strings.savedContent.saveView.addNewView || 'Uusi näkymä'}
                  </p>
                </StyledSave>
              </StyledViewsButtonsWrapper>
            )}
          </StyledSavedGeometriesWrapper>
        </>
      )}
    </StyledMainContainer>
  );
};

export default ViewsTab;
