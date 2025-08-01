import { useState, useEffect, useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import strings from '../../translations';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  setWarning,
  addToActiveGeometries,
  removeActiveGeometry,
  removeFromDrawToolMarkers,
  setShowSavedContentGeometryForm
} from '../../state/slices/uiSlice';
import { faPlus, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isMobile, theme } from '../../theme/theme';
import {
  addMarkerRequest,
  removeMarkerRequest
} from '../../state/slices/rpcSlice';
import GeometryForm from './GeometryForm';

const StyledGeometryActions = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
`;

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

const StyledSubtitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.mainColor1};
  margin-top: 1em;
`;

const StyledSave = styled.button`
  border: none;
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

const StyledSavedGeometriesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2em;

  @media ${(props) => props.theme.device.mobileL} {
    gap: 1em;
  }
`;

const StyledGeometryList = styled.div`
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

const StyledNoSavedGeometries = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme?.colors?.black};
  text-align: center;
  padding: 16px;
`;

const StyledDeleteAllSavedGeometries = styled.button`
  border: none;
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

const StyledGeometryItemContainer = styled(motion.div)`
  display: flex;
`;

const StyledGeometryItem = styled.div`
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
  @-moz-document url-prefix() {
    position: initial;
  }
`;

const StyledRemoveGeometry = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.mainWhite};
  font-size: 16px;
  &:hover {
    color: ${(props) => props.theme.colors.hover};
  }
`;

const StyledGeometryName = styled.p`
  user-select: none;
  max-width: 240px;
  color: ${(props) => props.theme.colors.mainWhite};
  margin: 0;
  padding: 0px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.1s ease-in;
`;

const StyledGeometryDescription = styled.p`
  margin: 0;
  padding: 0px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
`;

const StyledLeftContent = styled.div`
  display: flex;
  align-items: center;
`;

const StyledRightContent = styled.div`
  display: flex;
  align-items: center;
`;

const StyledGeometryTitleContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledGeometriesButtonsWrapper = styled.div`
  justify-content: space-around;
  display: flex;
  @media ${(props) => props.theme.device.mobileL} {
    flex-direction: column;
  }
`;

const GeometriesTab = () => {
  const { store } = useContext(ReactReduxContext);
  const { channel } = useSelector((state) => state.rpc);
  const { activeGeometries, drawToolMarkers, showSavedContentGeometryForm } =
    useSelector((state) => state.ui);
  const [geometries, setGeometries] = useState([]);
  const [editingGeometry, setEditingGeometry] = useState(null);
  const { geoJsonArray } = useSelector((state) => state.ui);

  useEffect(() => {
    window.localStorage.getItem('geometries') !== null &&
      setGeometries(JSON.parse(window.localStorage.getItem('geometries')));
  }, []);

  const handleActivateGeometry = (geometry) => {
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
    if (activeGeometries?.find((g) => g.id === geometry.id)) {
      store.dispatch(removeActiveGeometry(geometry.id));
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
    const savedGeometries = [...geometry.data];

    savedGeometries?.forEach((geometry) => {
      geometry.data &&
        geometry.data.geom &&
        channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
          geometry.data.geom,
          addFeaturesToMapParams
        ]);
      geometry.features &&
        geometry.features.forEach((feature) => {
          channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
            feature.geojson,
            addFeaturesToMapParams
          ]);
        });
      geometry.geojson &&
        channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
          geometry.geojson,
          addFeaturesToMapParams
        ]);
    });

    store.dispatch(addToActiveGeometries(geometry));
  };

  const handleSaveGeometry = (formData) => {
    let layerId = editingGeometry?.id || uuidv4();
    let markers = drawToolMarkers.map((d) => ({
      ...d,
      markerId: uuidv4(),
      color: '#ff5100b3'
    }));

    let newGeometry = {
      id: layerId,
      name: formData.name,
      description: formData.description,
      saveDate: Date.now(),
      data: editingGeometry ? editingGeometry.data : [...geoJsonArray],
      markers: editingGeometry ? editingGeometry.markers : [...markers]
    };

    let updatedGeometries;

    if (editingGeometry) {
      // update
      updatedGeometries = geometries?.map((g) =>
        g.id === editingGeometry.id ? newGeometry : g
      );
    } else {
      // new
      updatedGeometries = [...geometries, newGeometry];
    }

    window.localStorage.setItem(
      'geometries',
      JSON.stringify(updatedGeometries)
    );
    setGeometries(updatedGeometries);
    setEditingGeometry(null); // Reset editing
    store.dispatch(setShowSavedContentGeometryForm(false));
  };

  const handleEditGeometry = (geometry) => {
    setEditingGeometry(geometry);
    store.dispatch(setShowSavedContentGeometryForm(true));
  };

  const handleCancelForm = () => {
    setEditingGeometry(null);
    store.dispatch(setShowSavedContentGeometryForm(false));
  };

  const handleRemoveGeometry = (geometry) => {
    let updatedGeometries = geometries?.filter(
      (geometryData) => geometryData.id !== geometry.id
    );
    window.localStorage.setItem(
      'geometries',
      JSON.stringify(updatedGeometries)
    );
    setGeometries(updatedGeometries);
    geometry.markers.forEach((marker) => {
      store.dispatch(removeMarkerRequest({ markerId: marker.markerId }));
      store.dispatch(removeFromDrawToolMarkers(marker.markerId));
    });
    if (activeGeometries?.find((g) => g.id === geometry.id)) {
      store.dispatch(removeActiveGeometry(geometry.id));
      channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
        null,
        null,
        geometry.id
      ]);
    }
  };

  const handleDeleteAllGeometries = () => {
    activeGeometries?.forEach((geometry) => {
      geometry.markers.forEach((marker) => {
        store.dispatch(removeMarkerRequest({ markerId: marker.markerId }));
        store.dispatch(removeFromDrawToolMarkers(marker.markerId));
      });
      store.dispatch(removeActiveGeometry(geometry.id));
      channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
        null,
        null,
        geometry.id
      ]);
    });
    window.localStorage.setItem('geometries', JSON.stringify([]));
    setGeometries([]);
    store.dispatch(setWarning(null));
  };

  const itemsToSave = !!editingGeometry
    ? true
    : geoJsonArray.length > 0 || drawToolMarkers.length > 0;

  return (
    <StyledMainContainer>
      {showSavedContentGeometryForm ? (
        <>
          <GeometryForm
            initialData={editingGeometry || {}}
            onSave={handleSaveGeometry}
            onCancel={handleCancelForm}
            itemsToSave={itemsToSave}
            strings={strings}
          />
        </>
      ) : (
        <>
          <StyledSavedGeometriesWrapper>
            <StyledSubtitle id="geometries-tab-heading">
              {strings.savedContent.saveGeometry.savedGeometries}:
            </StyledSubtitle>
            <StyledGeometryList
              id="geometries-tab-list"
              role="list"
              aria-labelledby="geometries-tab-heading"
            >
              <AnimatePresence>
                {geometries?.length > 0 ? (
                  geometries?.map((geometry, idx) => {
                    const geometryId = `geometries-tab-item-${geometry.id}`;
                    const editBtnId = `geometries-tab-edit-${geometry.id}`;
                    const deleteBtnId = `geometries-tab-delete-${geometry.id}`;
                    return (
                      <StyledGeometryItemContainer
                        key={geometry.id}
                        transition={{ duration: 0.2, type: 'tween' }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <StyledGeometryItem
                          id={geometryId}
                          tabIndex={0}
                          aria-labelledby={`${geometryId}-name`}
                          aria-describedby={`${geometryId}-desc`}
                          role="listitem"
                          style={{
                            backgroundColor: activeGeometries?.find(
                              (g) => g.id === geometry.id
                            )
                              ? theme.colors.buttonActive
                              : theme.colors.button
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleActivateGeometry(geometry);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleActivateGeometry(geometry);
                            }
                          }}
                        >
                          <StyledLeftContent>
                            <StyledGeometryTitleContent>
                              <StyledGeometryName id={`${geometryId}-name`}>
                                {geometry.name?.length > 30
                                  ? geometry.name.slice(0, 30) + '…'
                                  : geometry.name}
                              </StyledGeometryName>
                              {geometry.description && (
                                <StyledGeometryDescription
                                  id={`${geometryId}-desc`}
                                >
                                  {geometry.description?.length > 100
                                    ? geometry.description.slice(0, 100) + '…'
                                    : geometry.description}
                                </StyledGeometryDescription>
                              )}
                              <StyledGeometryDescription>
                                <Moment
                                  format="DD.MM.YYYY"
                                  tz="Europe/Helsinki"
                                >
                                  {geometry.saveDate}
                                </Moment>
                              </StyledGeometryDescription>
                            </StyledGeometryTitleContent>
                          </StyledLeftContent>
                          <StyledGeometryActions>
                            {/* EDIT BUTTON */}
                            <StyledRemoveGeometry
                              id={editBtnId}
                              type="button"
                              aria-label={
                                strings.savedContent.saveGeometry
                                  .editGeometry || 'Edit geometry'
                              }
                              aria-controls={geometryId}
                              aria-describedby={`${geometryId}-name`}
                              title={
                                strings.savedContent.saveGeometry.editGeometry
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditGeometry(geometry);
                              }}
                            >
                              <FontAwesomeIcon icon={faPen} />
                            </StyledRemoveGeometry>
                            {/* DELETE BUTTON */}
                            <StyledRemoveGeometry
                              id={deleteBtnId}
                              type="button"
                              aria-label={
                                strings.savedContent.saveGeometry
                                  .deleteSavedGeometry + ` ${geometry.name}`
                              }
                              aria-controls={geometryId}
                              aria-describedby={`${geometryId}-name`}
                              title={
                                strings.savedContent.saveGeometry
                                  .deleteSavedGeometry + ` ${geometry.name}`
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveGeometry(geometry);
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </StyledRemoveGeometry>
                          </StyledGeometryActions>
                        </StyledGeometryItem>
                      </StyledGeometryItemContainer>
                    );
                  })
                ) : (
                  <StyledNoSavedGeometries
                    key="no-saved-geometry"
                    transition={{ duration: 0.3, type: 'tween' }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    id="geometries-tab-empty"
                    role="alert"
                    aria-live="polite"
                    tabIndex={0}
                  >
                    {strings.savedContent.saveGeometry.noSavedGeometries}
                  </StyledNoSavedGeometries>
                )}
              </AnimatePresence>
            </StyledGeometryList>
            {isMobile ? (
              <StyledGeometriesButtonsWrapper>
                <StyledSave
                  type="button"
                  id="geometries-tab-add-btn"
                  aria-label={
                    strings.savedContent?.saveGeometry?.addNewGeometry
                  }
                  aria-controls="geometries-tab-list"
                  onClick={() =>
                    store.dispatch(setShowSavedContentGeometryForm(true))
                  }
                >
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
                  <p>{strings.savedContent?.saveGeometry?.addNewGeometry}</p>
                </StyledSave>
                <StyledDeleteAllSavedGeometries
                  id="geometries-tab-delall-btn"
                  aria-label={
                    strings.savedContent.saveGeometry.deleteAllSavedGeometries
                  }
                  aria-controls="geometries-tab-list"
                  onClick={() =>
                    geometries?.length > 0 &&
                    store.dispatch(
                      setWarning({
                        title:
                          strings.savedContent.saveGeometry.confirmDeleteAll,
                        subtitle: null,
                        cancel: {
                          text: strings.general.cancel,
                          action: () => store.dispatch(setWarning(null))
                        },
                        confirm: {
                          text: strings.general.continue,
                          action: () => {
                            handleDeleteAllGeometries();
                            store.dispatch(setWarning(null));
                          }
                        }
                      })
                    )
                  }
                  disabled={geometries?.length === 0}
                >
                  <p>
                    {strings.savedContent.saveGeometry.deleteAllSavedGeometries}
                  </p>
                </StyledDeleteAllSavedGeometries>
              </StyledGeometriesButtonsWrapper>
            ) : (
              <StyledGeometriesButtonsWrapper>
                <StyledDeleteAllSavedGeometries
                  id="geometries-tab-delall-btn"
                  aria-label={
                    strings.savedContent.saveGeometry.deleteAllSavedGeometries
                  }
                  aria-controls="geometries-tab-list"
                  onClick={() =>
                    geometries?.length > 0 &&
                    store.dispatch(
                      setWarning({
                        title:
                          strings.savedContent.saveGeometry.confirmDeleteAll,
                        subtitle: null,
                        cancel: {
                          text: strings.general.cancel,
                          action: () => store.dispatch(setWarning(null))
                        },
                        confirm: {
                          text: strings.general.continue,
                          action: () => {
                            handleDeleteAllGeometries();
                            store.dispatch(setWarning(null));
                          }
                        }
                      })
                    )
                  }
                  disabled={geometries?.length === 0}
                >
                  <p>
                    {strings.savedContent.saveGeometry.deleteAllSavedGeometries}
                  </p>
                </StyledDeleteAllSavedGeometries>
                <StyledSave
                  id="geometries-tab-add-btn"
                  aria-label={
                    strings.savedContent?.saveGeometry?.addNewGeometry
                  }
                  aria-controls="geometries-tab-list"
                  onClick={() =>
                    store.dispatch(setShowSavedContentGeometryForm(true))
                  }
                >
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
                  <p>{strings.savedContent.saveGeometry.addNewGeometry}</p>
                </StyledSave>
              </StyledGeometriesButtonsWrapper>
            )}
          </StyledSavedGeometriesWrapper>
        </>
      )}
    </StyledMainContainer>
  );
};

export default GeometriesTab;
