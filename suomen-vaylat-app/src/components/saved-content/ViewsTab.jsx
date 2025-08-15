import { useState, useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { activateView } from '../../utils/rpcUtil';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import strings from '../../translations';
import Moment from 'react-moment';
import { v4 as uuidv4 } from 'uuid';
import {
  setWarning,
  setShowSavedContentViewForm
} from '../../state/slices/uiSlice';
import {
  faPlus,
  faTrash,
  faPen,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setViews } from '../../state/slices/rpcSlice';
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
  color: ${(props) => props.theme?.colors?.black};
  padding: 16px;
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
  gap: 2em;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
`;

const StyledViewActions = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
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
  color: #ffd700;
  font-size: 16px;
  margin-right: 8px;
  cursor: auto;
`;

const StyledViewsButtonsWrapper = styled.div`
  justify-content: space-around;
  display: flex;
  @media ${(props) => props.theme.device.mobileL} {
    flex-direction: column;
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

const ViewsTab = () => {
  const { store } = useContext(ReactReduxContext);
  const [editingView, setEditingView] = useState(null);
  const { selectedLayers, channel, views } = useAppSelector(
    (state) => state.rpc
  );
  const { geoJsonArray, drawToolMarkers, showSavedContentViewForm } =
    useAppSelector((state) => state.ui);

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
      isDefault: !!view.default
    });
    store.dispatch(setShowSavedContentViewForm(true));
  };

  // Saves new or edited view
  const handleSave = (formData) => {
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
        default: formData.isDefault,
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

      // ensure we always have an array to work with
      const existingViews = Array.isArray(views) ? views : [];

      // Build updatedViews safely
      let updatedViews;
      if (editingView) {
        // editing: replace edited view and clear default flag on others if needed
        updatedViews = existingViews.map((v) =>
          v.id === editingView.id
            ? { ...newView, id: editingView.id }
            : { ...v, default: false }
        );
      } else {
        // creating: clear default flag on existing views if new is default
        updatedViews = [
          ...existingViews.map((v) => ({ ...v, default: false })),
          newView
        ];
      }

      // If not default and editing, ensure correct default flags (keeps existing defaults)
      if (!formData.isDefault && editingView) {
        updatedViews = updatedViews.map((v) =>
          v.id === newView.id ? { ...v, default: false } : v
        );
      }

      // dispatch to store
      store.dispatch(setViews(updatedViews));

      // Persist to localStorage but guard for errors (incognito / storage disabled)
      try {
        window.localStorage.setItem('views', JSON.stringify(updatedViews));
      } catch (err) {
        console.warn('Could not persist views to localStorage', err);
      }
      store.dispatch(setShowSavedContentViewForm(false));
      setEditingView(null);
    });
  };

  // Remove a single view
  const handleRemoveView = (view) => {
    const updatedViews = views.filter((viewData) => viewData.id !== view.id);
    window.localStorage.setItem('views', JSON.stringify(updatedViews));
    store.dispatch(setViews(updatedViews));
    if (editingView && view.id === editingView.id) {
      setEditingView(null);
      store.dispatch(setShowSavedContentViewForm(false));
    }
  };

  // Delete all views
  const handleDeleteAllViews = () => {
    window.localStorage.setItem('views', JSON.stringify([]));
    store.dispatch(setViews([]));
    store.dispatch(setWarning(null));
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
            <StyledSubtitle id="views-tab-heading">
              {strings.savedContent.saveView.savedViews ||
                'Tallennetut näkymät'}
              :
            </StyledSubtitle>
            <StyledSavedViews
              id="views-tab-list"
              role="list"
              aria-labelledby="views-tab-heading"
            >
              <AnimatePresence>
                {views?.length > 0 ? (
                  [
                    ...views.filter((v) => v.default),
                    ...views
                      .filter((v) => !v.default)
                      .sort((a, b) => b.saveDate - a.saveDate)
                  ].map((view) => {
                    const viewId = `views-tab-item-${view.id}`;
                    const editId = `views-tab-edit-${view.id}`;
                    const deleteId = `views-tab-delete-${view.id}`;
                    const isDefaultView = !!view.default;
                    return (
                      <StyledSavedViewContainer
                        key={view.id}
                        transition={{ duration: 0.2, type: 'tween' }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <StyledSavedView
                          id={viewId}
                          tabIndex={0}
                          role="listitem"
                          aria-labelledby={`${viewId}-name`}
                          aria-describedby={`${viewId}-desc`}
                          onClick={(e) => {
                            if (
                              e.target.closest('[data-action="edit"]') ||
                              e.target.closest('[data-action="remove"]')
                            )
                              return;
                            e.preventDefault();
                            activateView(store, channel, view);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              activateView(store, channel, view);
                            }
                          }}
                        >
                          <StyledLeftContent>
                            <StyledSavedViewTitleContent>
                              <StyledSavedViewName id={`${viewId}-name`}>
                                {view.name?.length > 30
                                  ? view.name.slice(0, 30) + '…'
                                  : view.name}
                              </StyledSavedViewName>
                              {view.description && (
                                <StyledSavedViewDescription
                                  id={`${viewId}-desc`}
                                >
                                  {view.description?.length > 100
                                    ? view.description.slice(0, 100) + '…'
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
                              <StyledIsDefault id={`${viewId}-default`}>
                                <FontAwesomeIcon
                                  icon={faStar}
                                  title={
                                    strings.savedContent.saveView.defaultView
                                  }
                                />
                              </StyledIsDefault>
                            )}
                            <StyledIconButton
                              id={editId}
                              type="button"
                              data-action="edit"
                              aria-label={
                                strings.savedContent.saveView.editView +
                                ' ' +
                                view.name
                              }
                              title={
                                strings.savedContent.saveView.editView +
                                ' ' +
                                view.name
                              }
                              aria-controls={viewId}
                              aria-describedby={`${viewId}-name`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(view);
                              }}
                            >
                              <FontAwesomeIcon icon={faPen} />
                            </StyledIconButton>
                            <StyledIconButton
                              id={deleteId}
                              type="button"
                              data-action="remove"
                              aria-label={
                                strings.savedContent.saveView.deleteSavedView +
                                ' ' +
                                view.name
                              }
                              title={
                                strings.savedContent.saveView.deleteSavedView +
                                ' ' +
                                view.name
                              }
                              aria-controls={viewId}
                              aria-describedby={`${viewId}-name`}
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
                    id="views-tab-empty"
                    role="alert"
                    aria-live="polite"
                    tabIndex={0}
                  >
                    {strings.savedContent.saveView.noSavedViews}
                  </StyledNoSavedViews>
                )}
              </AnimatePresence>
            </StyledSavedViews>
            {isMobile ? (
              <StyledViewsButtonsWrapper>
                <StyledSave
                  type="button"
                  id="views-tab-add-btn"
                  aria-label={strings.savedContent.saveView.addNewView}
                  aria-controls="views-tab-list"
                  onClick={handleAddNew}
                >
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
                  <p>{strings.savedContent.saveView.addNewView}</p>
                </StyledSave>
                <StyledDeleteAllSavedViews
                  id="views-tab-delall-btn"
                  aria-label={strings.savedContent.saveView.deleteAllSavedViews}
                  aria-controls="views-tab-list"
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
                  disabled={views?.length === 0}
                >
                  <p>{strings.savedContent.saveView.deleteAllSavedViews}</p>
                </StyledDeleteAllSavedViews>
              </StyledViewsButtonsWrapper>
            ) : (
              <StyledViewsButtonsWrapper>
                <StyledDeleteAllSavedViews
                  id="views-tab-delall-btn"
                  aria-label={strings.savedContent.saveView.deleteAllSavedViews}
                  aria-controls="views-tab-list"
                  onClick={() =>
                    views?.length > 0 &&
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
                  disabled={views?.length === 0}
                >
                  <p>{strings.savedContent.saveView.deleteAllSavedViews}</p>
                </StyledDeleteAllSavedViews>
                <StyledSave
                  type="button"
                  id="views-tab-add-btn"
                  aria-label={strings.savedContent.saveView.addNewView}
                  aria-controls="views-tab-list"
                  onClick={handleAddNew}
                >
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
                  <p>{strings.savedContent.saveView.addNewView}</p>
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
