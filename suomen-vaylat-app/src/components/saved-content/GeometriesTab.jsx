import { useState, useEffect, useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import strings from '../../translations';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  setIsSaveViewOpen,
  setWarning,
  addToActiveGeometries,
  removeActiveGeometry,
  removeFromDrawToolMarkers
} from '../../state/slices/uiSlice';
import { faPlus, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { theme } from '../../theme/theme';
import {
  addMarkerRequest,
  removeMarkerRequest
} from '../../state/slices/rpcSlice';

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
  margin-bottom: 12px;
  margin-top: 22px;
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

const StyledSavedGeometriesWrapper = styled.div``;

const StyledGeometryListWrapper = styled.div`
  position: relative;
  margin-top: 6px;
`;

const StyledGeometryList = styled.div`
  overflow: auto;
  max-height: 300px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  position: relative;
`;

const StyledNoSavedGeometries = styled(motion.div)`
  font-size: 14px;
  text-align: center;
  padding: 16px;
`;

const StyledDeleteAllSavedGeometries = styled.div`
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
  opacity: ${(props) => (props.disabled ? '0.58' : '1')};

  &:hover {
    background-color: ${(props) =>
      props.theme.colors.secondaryColorDarkOrangeSelected};
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
  padding: 8px 0px 8px 0px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  @-moz-document url-prefix() {
    position: initial;
  }
`;

const StyledRemoveGeometry = styled.div`
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

const StyledGeometryName = styled.p`
  user-select: none;
  max-width: 240px;
  color: ${(props) => props.theme.colors.mainWhite};
  margin: 0;
  padding: 0px;
  font-size: 14px;
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

const StyleGeometryIcon = styled.div`
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

const StyledGeometryTitleContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const GeometriesTab = () => {
  const { store } = useContext(ReactReduxContext);
  const { channel } = useSelector((state) => state.rpc);
  const { activeGeometries, drawToolMarkers } = useSelector(
    (state) => state.ui
  );
  const [geometries, setGeometries] = useState([]);
  const [geometryName, setGeometryName] = useState('');
  const [geometryDescription, setGeometryDescription] = useState('');
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

  const handleSaveGeometry = () => {
    let layerId = uuidv4();
    let markers = drawToolMarkers.map((d) => ({
      ...d,
      markerId: uuidv4(),
      color: '#ff5100b3'
    }));

    let newGeometry = {
      id: layerId,
      name: geometryName,
      description: geometryDescription,
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
    setGeometryName('');
    setGeometryDescription('');
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
      return;
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
      <div>
        <StyledSubtitle>
          {strings.savedContent.saveGeometry.saveNewGeometry}
        </StyledSubtitle>
        <StyledForm
          onSubmit={(e) => {
            e.preventDefault();
            if (geometryName && itemsToSave) handleSaveGeometry();
          }}
          autoComplete="off"
        >
          <StyledFormGroup>
            <StyledLabel htmlFor="geometry-name">
              {strings.savedContent.saveGeometry.geometryName} *
            </StyledLabel>
            <StyledInput
              id="geometry-name"
              type="text"
              value={geometryName}
              placeholder={
                !itemsToSave && strings.savedContent.saveGeometry.noGeometry
              }
              onChange={(e) => setGeometryName(e.target.value)}
              disabled={!itemsToSave}
              maxLength={80}
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <StyledLabel htmlFor="geometry-description">
              {strings.savedContent.saveGeometry.description || 'Kuvaus'}
            </StyledLabel>
            <StyledTextarea
              id="geometry-description"
              value={geometryDescription}
              placeholder={
                !itemsToSave && strings.savedContent.saveGeometry.noGeometry
              }
              disabled={!itemsToSave}
              onChange={(e) => setGeometryDescription(e.target.value)}
              maxLength={200}
            />
          </StyledFormGroup>
          <StyledButtonsRow>
            <StyledCancel
              type="button"
              onClick={() => store.dispatch(setIsSaveViewOpen(false))}
            >
              {strings.general.cancel || 'Peruuta'}
            </StyledCancel>
            <StyledSave type="submit" disabled={!geometryName || !itemsToSave}>
              <FontAwesomeIcon icon={faSave} />
              {strings.savedContent.saveGeometry.saveGeometryButton}
            </StyledSave>
          </StyledButtonsRow>
        </StyledForm>
      </div>

      <StyledSavedGeometriesWrapper>
        <StyledSubtitle>
          {strings.savedContent.saveGeometry.savedGeometries}:
        </StyledSubtitle>
        <StyledGeometryListWrapper>
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
                          <StyleGeometryIcon>
                            <p>{geometry.name.charAt(0).toUpperCase()}</p>
                          </StyleGeometryIcon>
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
                              <Moment format="DD.MM.YYYY" tz="Europe/Helsinki">
                                {geometry.saveDate}
                              </Moment>
                            </StyledGeometryDescription>
                          </StyledGeometryTitleContent>
                        </StyledLeftContent>
                        <StyledRightContent />
                      </StyledGeometryItem>
                      <StyledRemoveGeometry>
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={() => handleRemoveGeometry(geometry)}
                        />
                      </StyledRemoveGeometry>
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
        </StyledGeometryListWrapper>
        <StyledDeleteAllSavedGeometries
          onClick={() =>
            geometries.length > 0 &&
            store.dispatch(
              setWarning({
                title: strings.savedContent.saveGeometry.confirmDeleteAll,
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
          <p>{strings.savedContent.saveGeometry.deleteAllSavedGeometries}</p>
        </StyledDeleteAllSavedGeometries>
      </StyledSavedGeometriesWrapper>
    </StyledMainContainer>
  );
};

export default GeometriesTab;
