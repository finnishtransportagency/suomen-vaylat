import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
  useRef
} from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faTrash,
  faPen,
  faInfoCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch, ReactReduxContext } from 'react-redux';
import moment from 'moment';
import strings from '../../../../../translations';
import {
  addMarkerRequest,
  removeMarkerRequest,
  setEditingGeometry,
  setGeometries
} from '../../../../../state/slices/rpcSlice';
import {
  addToActiveGeometries,
  removeActiveGeometry,
  removeFromDrawToolMarkers,
  setIsSaveGeometriesOpen,
  setWarning
} from '../../../../../state/slices/uiSlice';

/* animation variants */
const masterHeaderIconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 }
};

const listVariants = {
  visible: { height: 'auto', opacity: 1 },
  hidden: { height: 0, opacity: 0 }
};

const StyledGroupHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 4px;
  padding: 8px;
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  &:focus {
    outline: 2px solid ${(p) => p.theme.colors.mainColor1Selected};
    outline-offset: 2px;
  }
`;

const StyledLefContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledSelectButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    color: ${(p) => p.theme.colors.mainColor1};
    font-size: 18px;
  }
`;

const StyledGroupName = styled.p`
  max-width: 220px;
  user-select: none;
  margin: 0;
  padding-left: 0;
  font-size: 14px;
  font-weight: bold;
  color: ${(p) => p.theme.colors.mainColor1};
`;

const StyledSubGroupLayersCount = styled.p`
  margin: 0;
  padding: 0;
  font-size: 12px;
  color: ${(p) => p.theme.colors.mainColor1};
`;

const StyledGroup = styled(motion.div)`
  margin: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  padding: 0 0 8px 25px;
  display: flex;
  flex-direction: column;
`;

const StyledItem = styled.div`
  min-height: 33px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 8px;
  padding-right: 16px;
  background: transparent;
`;

const StyledItemsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  width: 100%;
`;

const StyledItemLeft = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const StyledItemTitle = styled.p`
  margin: 0;
  font-weight: 500;
  color: ${(p) => p.theme.colors.mainColor1};
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledItemsRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const StyledIconButton = styled.button`
  color: ${(p) => p.theme.colors.mainColor1};
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: ${(p) => p.theme.colors.mainColor2};
  }
`;

const StyledSwitchContainer = styled.div`
  position: relative;
  min-width: 32px;
  height: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  background-color: ${(props) => (props.isSelected ? '#8DCB6D' : '#AAAAAA')};
  cursor: pointer;
`;

const StyledSwitchButton = styled.button`
  position: absolute;
  left: ${(props) => (props.isSelected ? '15px' : '0px')};
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-left: 2px;
  margin-right: 2px;
  transition: all 0.3s ease-out;
  background-color: ${(props) => props.theme.colors.mainWhite};

  /* remove default button chrome */
  border: none;
  padding: 0;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-shadow: none;
  cursor: pointer;

  /* keep visuals identical, but provide a subtle focus ring for keyboard users */
  &:focus {
    outline: 2px solid ${(p) => p.theme.colors.mainColor1Selected};
    outline-offset: 2px;
  }
`;

/* Modal styles (prefixed with Styled) */
const StyledModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 30, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 6000;
`;

const StyledModal = styled.div`
  width: 480px;
  max-width: calc(100% - 32px);
  background: ${(p) => p.theme.colors.mainWhite};
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  color: ${(p) => p.theme.colors.black};
`;

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const StyledModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: ${(p) => p.theme.colors.mainColor1};

  /* ellipsis when title is too long */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* ensure it can shrink inside flex containers */
  display: block;
  max-width: 100%;
`;

const StyledCloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${(p) => p.theme.colors.mainColor1};
  font-size: 20px;
  cursor: pointer;
`;

const StyledModalBody = styled.div`
  max-height: 60vh;
  overflow: auto;
  font-size: 13px;
  line-height: 1.4;
`;

const StyledMetaRow = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: baseline;
  flex-wrap: wrap;
  color: ${(p) => p.theme.colors.black};

  & > b {
    min-width: 90px;
  }

  & > span {
    word-break: break-word;
  }
`;

const GeometriesGroup = () => {
  const [open, setOpen] = useState(false);
  const { store } = useContext(ReactReduxContext);

  const dispatch = useDispatch();
  const channel = useSelector((s) => s.rpc.channel);
  const geometries = useSelector((s) => s.rpc.geometries) || [];

  const activeGeometriesSelector = useSelector((s) => s.ui.activeGeometries);
  const activeGeometries = useMemo(
    () => activeGeometriesSelector || [],
    [activeGeometriesSelector]
  );

  const prefix = 'layerlist-geometries-group-';
  const headerId = `${prefix}header`;
  const listId = `${prefix}list`;
  const countId = `${prefix}count`;

  const activateGeometry = useCallback(
    (geometry) => {
      const isActive = !!activeGeometries.find((g) => g.id === geometry.id);
      if (isActive) {
        geometry.markers?.forEach((m) => {
          dispatch(removeMarkerRequest({ markerId: m.markerId }));
          dispatch(removeFromDrawToolMarkers(m.markerId));
        });
        channel &&
          channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
            null,
            null,
            geometry.id
          ]);
        dispatch(removeActiveGeometry(geometry.id));
        return;
      }

      geometry.markers?.forEach((m) => dispatch(addMarkerRequest(m)));

      const addFeaturesToMapParams = {
        clearPrevious: false,
        layerId: geometry.id,
        featureStyle: {
          fill: { color: 'rgba(10, 140, 247, 0.1)' },
          stroke: {
            color: 'rgba(10, 140, 247, 0.3)',
            width: 5,
            lineDash: 'solid',
            lineCap: 'round',
            lineJoin: 'round',
            area: { color: '#ff5100b3', width: 4, lineJoin: 'round' }
          },
          image: { shape: 5, size: 3, fill: { color: '#ff5100b3' } }
        }
      };

      const saved = [...(geometry.data || [])];
      saved.forEach((geom) => {
        if (geom.data && geom.data.geom) {
          channel &&
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
              geom.data.geom,
              addFeaturesToMapParams
            ]);
        }
        if (geom.features) {
          geom.features.forEach((feature) => {
            channel &&
              channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
                feature.geojson,
                addFeaturesToMapParams
              ]);
          });
        }
        if (geom.geojson) {
          channel &&
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
              geom.geojson,
              addFeaturesToMapParams
            ]);
        }
      });

      dispatch(addToActiveGeometries(geometry));
    },
    [activeGeometries, channel, dispatch]
  );

  const editGeometry = useCallback(
    (geometry) => {
      store.dispatch(setEditingGeometry(geometry));
      store.dispatch(setIsSaveGeometriesOpen(true));
    },
    [dispatch]
  );

  const deleteGeometry = useCallback(
    (geometry) => {
      let updatedGeometries = geometries?.filter(
        (geometryData) => geometryData.id !== geometry.id
      );
      try {
        window.localStorage.setItem(
          'geometries',
          JSON.stringify(updatedGeometries)
        );
      } catch (err) {
        console.warn('Could not persist geometries to localStorage', err);
      }
      store.dispatch(setGeometries(updatedGeometries));

      geometry.markers?.forEach((marker) => {
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
    },
    [geometries, activeGeometries, channel, store]
  );

  // Info modal state & helpers
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoGeometry, setInfoGeometry] = useState(null);
  const lastActiveElRef = useRef(null);
  const closeBtnRef = useRef(null);
  const modalRef = useRef(null);

  const openInfo = (ev, geometry) => {
    ev && ev.stopPropagation();
    lastActiveElRef.current = document.activeElement;
    setInfoGeometry(geometry);
    setInfoOpen(true);
  };

  const closeInfo = () => {
    setInfoOpen(false);
    setInfoGeometry(null);
    try {
      lastActiveElRef.current && lastActiveElRef.current.focus();
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (!infoOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeInfo();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [infoOpen]);

  // focus the close button after modal mounts for accessibility
  useEffect(() => {
    if (infoOpen) {
      const t = setTimeout(() => {
        try {
          closeBtnRef.current && closeBtnRef.current.focus();
        } catch (e) {}
      }, 40);
      return () => clearTimeout(t);
    }
  }, [infoOpen]);

  // simple focus trap: keep Tab/Shift+Tab within modal
  const handleModalKeyDown = useCallback((e) => {
    if (e.key !== 'Tab') return;
    const modal = modalRef.current;
    if (!modal) return;

    const focusable = modal.querySelectorAll(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable || focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (e.shiftKey) {
      // backward
      if (active === first || active === modal) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // forward
      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  // helper to compute geometry summary info (features count)
  const computeFeatureCount = (geometry) => {
    if (!geometry) return 0;
    const d = geometry.data;
    if (!d) return 0;
    if (Array.isArray(d)) return d.length;
    if (d.geoJsonArray && Array.isArray(d.geoJsonArray))
      return d.geoJsonArray.length;
    // fallback: if single geo object present
    return 0;
  };

  return (
    <div
      role="region"
      aria-roledescription="saved geometries group"
      aria-labelledby={headerId}
    >
      <StyledGroupHeader
        id={headerId}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((s) => !s)}
        type="button"
      >
        <StyledLefContent>
          <StyledSelectButton aria-hidden="true">
            <motion.div
              initial="closed"
              animate={open ? 'open' : 'closed'}
              variants={masterHeaderIconVariants}
              transition={{ duration: 0.22, type: 'tween' }}
            >
              <FontAwesomeIcon icon={faAngleDown} />
            </motion.div>
          </StyledSelectButton>

          <div>
            <StyledGroupName id={`${prefix}label`}>
              {strings.layerlist?.userContent?.geometries?.title}
            </StyledGroupName>
            <StyledSubGroupLayersCount id={countId}>
              {activeGeometries.length} / {geometries.length}
            </StyledSubGroupLayersCount>
          </div>
        </StyledLefContent>
      </StyledGroupHeader>

      <StyledGroup
        id={listId}
        parentId={-1}
        role="list"
        aria-labelledby={headerId}
        initial="hidden"
        animate={open ? 'visible' : 'hidden'}
        variants={listVariants}
        transition={{ duration: 0.22, type: 'tween' }}
      >
        {geometries?.length > 0 ? (
          [...geometries]
            .slice() // defensive copy
            .sort((a, b) => {
              const aVal =
                typeof a.saveDate === 'number'
                  ? a.saveDate
                  : Date.parse(a.saveDate) || 0;
              const bVal =
                typeof b.saveDate === 'number'
                  ? b.saveDate
                  : Date.parse(b.saveDate) || 0;
              return bVal - aVal; // newest first
            })
            .map((g) => {
              const isActive = !!activeGeometries.find((ag) => ag.id === g.id);
              const itemId = `${prefix}item-${g.id}`;
              const nameId = `${itemId}-name`;
              const descId = `${itemId}-desc`;
              const deleteId = `${itemId}-delete`;
              const editId = `${itemId}-edit`;
              const infoId = `${itemId}-info`;
              const switchId = `${itemId}-switch`;

              return (
                <StyledItem
                  key={g.id}
                  id={itemId}
                  role="listitem"
                  aria-labelledby={nameId}
                  aria-describedby={descId}
                >
                  <StyledItemsWrapper>
                    <StyledItemLeft>
                      <StyledItemTitle id={nameId}>{g.name}</StyledItemTitle>
                    </StyledItemLeft>

                    <StyledItemsRight>
                      <StyledIconButton
                        id={deleteId}
                        aria-label={
                          strings.savedContent?.saveGeometry
                            ?.deleteSavedGeometry || 'Delete geometry'
                        }
                        onClick={(ev) => {
                          ev.stopPropagation();
                          store.dispatch(
                            setWarning({
                              title:
                                strings.savedContent.saveGeometry.confirmDelete,
                              subtitle: null,
                              cancel: {
                                text: strings.general.cancel,
                                action: () => store.dispatch(setWarning(null))
                              },
                              confirm: {
                                text: strings.general.continue,
                                action: () => {
                                  deleteGeometry(g);
                                  store.dispatch(setWarning(null));
                                }
                              }
                            })
                          );
                        }}
                        title={
                          strings.savedContent?.saveGeometry
                            ?.deleteSavedGeometry
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </StyledIconButton>

                      <StyledIconButton
                        id={editId}
                        aria-label={
                          strings.savedContent?.saveGeometry?.editGeometry ||
                          'Edit geometry'
                        }
                        onClick={(ev) => {
                          ev.stopPropagation();
                          editGeometry(g);
                        }}
                        title={strings.savedContent?.saveGeometry?.editGeometry}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </StyledIconButton>

                      <StyledIconButton
                        id={infoId}
                        aria-label={
                          strings.savedContent?.saveGeometry?.viewInfo ||
                          'Geometry info'
                        }
                        onClick={(ev) => openInfo(ev, g)}
                        title={
                          strings.savedContent?.saveGeometry?.viewInfo || 'Info'
                        }
                      >
                        <FontAwesomeIcon
                          style={{ width: '1em' }}
                          icon={faInfoCircle}
                        />
                      </StyledIconButton>

                      <StyledSwitchContainer
                        id={switchId}
                        isSelected={isActive}
                        role="switch"
                        aria-checked={isActive}
                        aria-label={
                          isActive ? 'Deactivate geometry' : 'Activate geometry'
                        }
                        onClick={() => activateGeometry(g)}
                        title={
                          isActive ? 'Deactivate geometry' : 'Activate geometry'
                        }
                      >
                        <StyledSwitchButton isSelected={isActive} />
                      </StyledSwitchContainer>
                    </StyledItemsRight>
                  </StyledItemsWrapper>
                </StyledItem>
              );
            })
        ) : (
          <div role="status" aria-live="polite">
            {strings.savedContent?.saveGeometry?.noSavedGeometries ||
              'No saved geometries'}
          </div>
        )}
      </StyledGroup>

      {infoOpen && infoGeometry && (
        <StyledModalOverlay
          role="dialog"
          aria-modal="true"
          id={`${prefix}info-modal`}
          aria-labelledby={`${prefix}info-modal-title`}
          aria-describedby={
            infoGeometry.description ? `${prefix}info-modal-desc` : undefined
          }
          aria-label={
            strings.savedContent?.saveGeometry?.viewInfo ||
            'Geometry information'
          }
        >
          <StyledModal
            role="document"
            aria-describedby={`${prefix}info-modal-body`}
            ref={modalRef}
            onKeyDown={handleModalKeyDown}
          >
            <StyledModalHeader>
              <StyledModalTitle id={`${prefix}info-modal-title`}>
                {infoGeometry.name}
              </StyledModalTitle>
              <StyledCloseButton
                aria-label="Close"
                onClick={closeInfo}
                id={`${prefix}info-modal-close`}
                ref={closeBtnRef}
              >
                <FontAwesomeIcon icon={faTimes} />
              </StyledCloseButton>
            </StyledModalHeader>

            <StyledModalBody id={`${prefix}info-modal-body`}>
              <StyledMetaRow id={`${prefix}info-modal-meta-name`}>
                <b>{strings.general?.name || 'Name'}:</b>
                <span>{infoGeometry.name || '-'}</span>
              </StyledMetaRow>

              {infoGeometry.description && (
                <StyledMetaRow id={`${prefix}info-modal-desc`}>
                  <b>{strings.general?.description || 'Description'}:</b>
                  <span>{infoGeometry.description}</span>
                </StyledMetaRow>
              )}

              <StyledMetaRow id={`${prefix}info-modal-saved`}>
                <b>{strings.savedContent?.saveGeometry?.savedAt || 'Saved'}:</b>
                <span>
                  <div>
                    {moment(infoGeometry.saveDate).format('DD.MM.YYYY HH:mm').tz('Europe/Helsinki')}
                  </div>
                </span>
              </StyledMetaRow>

              <StyledMetaRow id={`${prefix}info-modal-active`}>
                <b>{strings.savedContent?.saveGeometry?.active || 'Active'}:</b>
                <span>
                  {activeGeometries.some((ag) => ag.id === infoGeometry.id)
                    ? strings.general?.yes || 'Yes'
                    : strings.general?.no || 'No'}
                </span>
              </StyledMetaRow>

              <StyledMetaRow id={`${prefix}info-modal-markers`}>
                <b>
                  {strings.savedContent?.saveGeometry?.markers || 'Markers'}:
                </b>
                <span>
                  {Array.isArray(infoGeometry.markers)
                    ? infoGeometry.markers.length
                    : 0}
                </span>
              </StyledMetaRow>

              <StyledMetaRow id={`${prefix}info-modal-features`}>
                <b>
                  {strings.savedContent?.saveGeometry?.features || 'Features'}:
                </b>
                <span>{computeFeatureCount(infoGeometry)}</span>
              </StyledMetaRow>
            </StyledModalBody>
          </StyledModal>
        </StyledModalOverlay>
      )}
    </div>
  );
};

export default GeometriesGroup;
