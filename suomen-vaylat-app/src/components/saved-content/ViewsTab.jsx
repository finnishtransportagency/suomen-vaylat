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
  removeFromDrawToolMarkers
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

// --- Styled components ---
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
  transition: border 0.13s;
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
  transition: border 0.13s;
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
  color: ${(props) => props.theme?.colors?.mainWhite};
  background-color: ${(props) => props.theme?.colors?.mainColor1};
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
    margin-right: 12px;
    font-size: 16px;
  }
  &:hover {
    background-color: ${(props) => props.theme?.colors?.mainColorselected1};
  }
  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
`;

const StyledSubtitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => props.theme?.colors?.mainColor1 || '#1964e0'};
  margin-bottom: 12px;
  margin-top: 22px;
`;

const StyledSavedViews = styled.div`
  overflow: auto;
  max-height: 300px;
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
`;

const StyledViewActions = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
  margin-right: 8px;
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
      ? props.theme.colors.darkGrey
      : props.theme.colors.secondaryColorDarkOrange};
  margin: 32px auto 20px auto;
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

const StyledSaveGeometryWrapper = styled.div``;

const StyledSavedGeometriesWrapper = styled.div``;

const ViewsTab = () => {
  const { store } = useContext(ReactReduxContext);
  const [views, setViews] = useState([]);
  const [viewName, setViewName] = useState('');
  const [viewDescription, setViewDescription] = useState('');
  const [includeGeometries, setIncludeGeometries] = useState(false);
  const [editingViewId, setEditingViewId] = useState(null);
  const [defaultViewId, setDefaultViewId] = useState(null);
  const [isDefault, setIsDefault] = useState(false);

  const { selectedLayers, channel } = useAppSelector((state) => state.rpc);
  const { geoJsonArray, drawToolMarkers, activeGeometries } = useAppSelector(
    (state) => state.ui
  );

  // Load saved views and default view on mount
  useEffect(() => {
    const storedViews = window.localStorage.getItem('views');
    if (storedViews) setViews(JSON.parse(storedViews));
    const defaultId = window.localStorage.getItem('defaultViewId');
    setDefaultViewId(defaultId ? defaultId : null);
    setIsDefault(false);
  }, []);

  // Persist defaultViewId on change
  useEffect(() => {
    if (defaultViewId !== null) {
      window.localStorage.setItem('defaultViewId', defaultViewId);
    }
  }, [defaultViewId]);

  // When entering edit mode, reset toggle accordingly
  const handleEditView = (view) => {
    setViewName(view.name);
    setViewDescription(view.description);
    setIncludeGeometries(Boolean(view.data.geometries));
    setEditingViewId(view.id);
    setIsDefault(view.id === defaultViewId);
  };

  // Save or update a view
  const handleSaveView = () => {
    let markers = drawToolMarkers?.map((d) => ({
      ...d,
      markerId: uuidv4(),
      color: '#ff5100b3'
    }));

    channel.getMapPosition(function (center) {
      let thisId = editingViewId || uuidv4();
      let newView = {
        id: thisId,
        name: viewName,
        description: viewDescription,
        saveDate: Date.now(),
        data: {
          zoom: center.zoom && center.zoom,
          x: center.centerX && center.centerX,
          y: center.centerY && center.centerY,
          layers: selectedLayers,
          language: strings.getLanguage(),
          geometries: includeGeometries ? { geoJsonArray, markers } : undefined
        }
      };

      let updatedViews;

      if (editingViewId) {
        updatedViews = views.map((v) =>
          v.id === editingViewId ? { ...newView, id: editingViewId } : v
        );
      } else {
        updatedViews = [...views, newView];
      }

      setViews(updatedViews);
      window.localStorage.setItem('views', JSON.stringify(updatedViews));

      // Manage default toggling (set or clear)
      if (isDefault) {
        setDefaultViewId(thisId);
        window.localStorage.setItem('defaultViewId', thisId);
      } else if (editingViewId && defaultViewId === editingViewId) {
        setDefaultViewId(null);
        window.localStorage.removeItem('defaultViewId');
      }

      setViewName('');
      setViewDescription('');
      setIncludeGeometries(false);
      setEditingViewId(null);
      setIsDefault(false);
    });
  };

  // Handler for default in the view list
  const handleListSwitch = (id, checked) => {
    if (checked) {
      setDefaultViewId(id);
      window.localStorage.setItem('defaultViewId', id);
    } else {
      setDefaultViewId(null);
      window.localStorage.removeItem('defaultViewId');
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setViewName('');
    setViewDescription('');
    setEditingViewId(null);
    setIncludeGeometries(false);
    setIsDefault(false);
  };

  // Remove a view
  const handleRemoveView = (view) => {
    const updatedViews = views.filter((viewData) => viewData.id !== view.id);
    window.localStorage.setItem('views', JSON.stringify(updatedViews));
    setViews(updatedViews);

    if (view.id === defaultViewId) {
      setDefaultViewId(null);
      window.localStorage.removeItem('defaultViewId');
    }
    if (view.id === editingViewId) {
      setEditingViewId(null);
      setViewName('');
      setViewDescription('');
      setIncludeGeometries(false);
      setIsDefault(false);
    }
  };

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

  // --- RENDER ---
  return (
    <StyledMainContainer>
      <StyledSaveGeometryWrapper>
        <StyledSubtitle>
          {strings.savedContent.saveView.title || 'Tallenna näkymä'}:
        </StyledSubtitle>

        <StyledForm
          onSubmit={(e) => {
            e.preventDefault();
            if (viewName) handleSaveView();
          }}
          autoComplete="off"
        >
          <StyledFormGroup>
            <StyledLabel htmlFor="view-name">
              {strings.savedContent.saveView.viewName || 'Näkymän nimi'} *
            </StyledLabel>
            <StyledInput
              id="view-name"
              type="text"
              value={viewName}
              maxLength={80}
              onChange={(e) => setViewName(e.target.value)}
              required
              aria-label={strings.savedContent.saveView.viewName}
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <StyledLabel htmlFor="view-description">
              {strings.savedContent.saveView.description || 'Kuvaus'}
            </StyledLabel>
            <StyledTextarea
              id="view-description"
              value={viewDescription}
              maxLength={200}
              onChange={(e) => setViewDescription(e.target.value)}
              aria-label={strings.savedContent.saveView.description}
            />
          </StyledFormGroup>
          <StyledSwitchRow>
            <Switch
              checked={includeGeometries}
              onChange={(e) => setIncludeGeometries(e.target.checked)}
              color="primary"
              inputProps={{
                'aria-label': strings.savedContent.saveView.includeGeometries
              }}
            />
            <StyledSwitchLabel>
              {strings.savedContent.saveView.includeGeometries ||
                'Tallenna omat geometriat mukaan.'}
            </StyledSwitchLabel>
          </StyledSwitchRow>
          <StyledSwitchRow
            style={{
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginBottom: 16
            }}
          >
            <Switch
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              color="primary"
              inputProps={{
                'aria-label': isDefault
                  ? strings.savedContent.saveView.defaultView ||
                    'Poista oletusnäkymä'
                  : strings.savedContent.saveView.setDefaultView ||
                    'Aseta oletusnäkymä'
              }}
            />
            <StyledSwitchLabel>
              {isDefault
                ? strings.savedContent.saveView.defaultView || 'Oletusnäkymä'
                : strings.savedContent.saveView.setDefaultView ||
                  'Aseta oletusnäkymä'}
            </StyledSwitchLabel>
          </StyledSwitchRow>
          <StyledButtonsRow>
            <StyledCancel type="button" onClick={handleCancelEdit}>
              {strings.general.cancel || 'Peruuta'}
            </StyledCancel>
            <StyledSave type="submit" disabled={!viewName}>
              <FontAwesomeIcon icon={editingViewId ? faSave : faPlus} />
              {editingViewId
                ? strings.savedContent.saveView.saveViewButton ||
                  'Tallenna muutokset'
                : strings.savedContent.saveView.saveViewButton ||
                  'Tallenna karttanäkymä'}
            </StyledSave>
          </StyledButtonsRow>
        </StyledForm>
      </StyledSaveGeometryWrapper>

      <StyledSavedGeometriesWrapper>
        <StyledSubtitle>
          {strings.savedContent.saveView.savedViews || 'Tallennetut näkymät'}:
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
                    transition={{
                      duration: 0.2,
                      type: 'tween'
                    }}
                    initial={{
                      opacity: 0,
                      height: 0
                    }}
                    animate={{
                      opacity: 1,
                      height: 'auto'
                    }}
                    exit={{
                      opacity: 0,
                      height: 0
                    }}
                  >
                    <StyledSavedView
                      onClick={(e) => {
                        // Don't open if clicking edit or star or switch
                        if (
                          e.target.closest('[data-action="edit"]') ||
                          e.target.closest('[data-action="default"]') ||
                          e.target.closest('[data-action="remove"]')
                        )
                          return;
                        e.preventDefault();
                        handleActivateView(view);
                      }}
                    >
                      <StyledLeftContent>
                        <StyleSavedViewHeaderIcon>
                          <p>{view.name.charAt(0).toUpperCase()}</p>
                        </StyleSavedViewHeaderIcon>
                        <StyledSavedViewTitleContent>
                          <StyledSavedViewName>{view.name}</StyledSavedViewName>
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
                            strings.savedContent.saveView.editView || 'Muokkaa'
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditView(view);
                          }}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </StyledIconButton>
                        <StyledIconButton
                          type="button"
                          data-action="remove"
                          title={strings.savedContent.saveView.deleteSavedView}
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
                transition={{
                  duration: 0.3,
                  type: 'tween'
                }}
                initial={{
                  opacity: 0,
                  height: 0
                }}
                animate={{
                  opacity: 1,
                  height: 'auto'
                }}
                exit={{
                  opacity: 0,
                  height: 0
                }}
              >
                {strings.savedContent.saveView.noSavedViews}
              </StyledNoSavedViews>
            )}
          </AnimatePresence>
        </StyledSavedViews>

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
      </StyledSavedGeometriesWrapper>
    </StyledMainContainer>
  );
};

export default ViewsTab;
