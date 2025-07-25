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
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isMobile, theme } from '../../theme/theme';
import {
  addMarkerRequest,
  removeMarkerRequest
} from '../../state/slices/rpcSlice';
import GeometryForm from './GeometryForm';

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

const StyledNoSavedGeometries = styled(motion.div)`
  font-size: 14px;
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
    if (activeGeometries.find((g) => g.id === geometry.id)) {
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

    savedGeometries.forEach((geometry) => {
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
    let layerId = uuidv4();
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
      data: [...geoJsonArray],
      markers: [...markers]
    };
    const updatedGeometries = [...geometries, newGeometry];
    window.localStorage.setItem(
      'geometries',
      JSON.stringify(updatedGeometries)
    );
    setGeometries(updatedGeometries);
    store.dispatch(setShowSavedContentGeometryForm(false));
  };

  const handleRemoveGeometry = (geometry) => {
    let updatedGeometries = geometries.filter(
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
    if (activeGeometries.find((g) => g.id === geometry.id)) {
      store.dispatch(removeActiveGeometry(geometry.id));
      channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
        null,
        null,
        geometry.id
      ]);
    }
  };

  const handleDeleteAllGeometries = () => {
    activeGeometries.forEach((geometry) => {
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

  const itemsToSave = geoJsonArray.length > 0 || drawToolMarkers.length > 0;

  return (
    <StyledMainContainer>
      {showSavedContentGeometryForm ? (
        <>
          <GeometryForm
            initialData={{}}
            onSave={handleSaveGeometry}
            onCancel={() =>
              store.dispatch(setShowSavedContentGeometryForm(false))
            }
            itemsToSave={itemsToSave}
            strings={strings}
          />
        </>
      ) : (
        <>
          <StyledSavedGeometriesWrapper>
            <StyledSubtitle>
              {strings.savedContent.saveGeometry.savedGeometries}:
            </StyledSubtitle>
            <StyledGeometryList>
              <AnimatePresence>
                {geometries.length > 0 ? (
                  geometries.map((geometry) => {
                    return (
                      <StyledGeometryItemContainer
                        key={geometry.id}
                        transition={{
                          duration: 0.2,
                          type: 'tween'
                        }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <StyledGeometryItem
                          style={{
                            backgroundColor: activeGeometries.find(
                              (g) => g.id === geometry.id
                            )
                              ? theme.colors.buttonActive
                              : theme.colors.button
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleActivateGeometry(geometry);
                          }}
                        >
                          <StyledLeftContent>
                            <StyledGeometryTitleContent>
                              <StyledGeometryName>
                                {geometry.name}
                              </StyledGeometryName>
                              {geometry.description && (
                                <StyledGeometryDescription>
                                  {geometry.description}
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
                          <StyledRightContent>
                            <StyledRemoveGeometry>
                              <FontAwesomeIcon
                                icon={faTrash}
                                onClick={() => handleRemoveGeometry(geometry)}
                              />
                            </StyledRemoveGeometry>
                          </StyledRightContent>
                        </StyledGeometryItem>
                      </StyledGeometryItemContainer>
                    );
                  })
                ) : (
                  <StyledNoSavedGeometries
                    key="no-saved-geometry"
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
                    {strings.savedContent.saveGeometry.noSavedGeometries}
                  </StyledNoSavedGeometries>
                )}
              </AnimatePresence>
            </StyledGeometryList>
            {isMobile ? (
              <StyledGeometriesButtonsWrapper>
                <StyledSave
                  type="button"
                  onClick={() =>
                    store.dispatch(setShowSavedContentGeometryForm(true))
                  }
                >
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
                  <p>
                    {strings.savedContent.saveGeometry.addNewGeometry ||
                      'Uusi geometria'}
                  </p>
                </StyledSave>
                <StyledDeleteAllSavedGeometries
                  onClick={() =>
                    geometries.length > 0 &&
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
                  disabled={geometries.length === 0}
                >
                  <p>
                    {strings.savedContent.saveGeometry.deleteAllSavedGeometries}
                  </p>
                </StyledDeleteAllSavedGeometries>
              </StyledGeometriesButtonsWrapper>
            ) : (
              <StyledGeometriesButtonsWrapper>
                <StyledDeleteAllSavedGeometries
                  onClick={() =>
                    geometries.length > 0 &&
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
                  disabled={geometries.length === 0}
                >
                  <p>
                    {strings.savedContent.saveGeometry.deleteAllSavedGeometries}
                  </p>
                </StyledDeleteAllSavedGeometries>
                <StyledSave
                  onClick={() =>
                    store.dispatch(setShowSavedContentGeometryForm(true))
                  }
                >
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
                  <p>
                    {strings.savedContent.saveGeometry.addNewGeometry ||
                      'Uusi geometria'}
                  </p>
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
