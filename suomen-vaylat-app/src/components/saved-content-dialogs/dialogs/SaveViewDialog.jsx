import React, { useEffect, useContext, useCallback } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Dialog from '../../dialog/Dialog';
import ViewForm from '../Views/ViewForm';
import strings from '../../../translations';
import { theme } from '../../../theme/theme';
import { setIsSaveViewOpen } from '../../../state/slices/uiSlice';
import { setEditingView, setViews } from '../../../state/slices/rpcSlice';
import { faCamera } from '@fortawesome/free-regular-svg-icons';
import { Slide, toast } from 'react-toastify';

const SaveViewsDialog = () => {
  const { store } = useContext(ReactReduxContext);
  const isSaveViewOpen = useSelector((s) => s.ui.isSaveViewOpen);
  const channel = useSelector((s) => s.rpc.channel);
  const selectedLayers = useSelector((s) => s.rpc.selectedLayers) || [];
  const editingView = useSelector((s) => s.rpc.editingView) || null;
  const views = useSelector((s) => s.rpc.views) || [];
  const geoJsonArray = useSelector((s) => s.ui.geoJsonArray) || [];
  const drawToolMarkers = useSelector((s) => s.ui.drawToolMarkers) || [];

  const isLowResScreen = window.matchMedia(theme.device.lowResDesktop).matches;

  // Load any persisted views into local state if needed (we use store + localStorage)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('views');
      // don't overwrite store-managed views; this is defensive
      if (raw && typeof raw === 'object' && (!views || views.length === 0)) {
        const parsed = JSON.parse(raw);
        store.dispatch(setViews(parsed));
      }
    } catch (err) {
      // ignore
    }
  }, [store, views]);

  const handleCloseSaveViewDialog = useCallback(() => {
    store.dispatch(setIsSaveViewOpen(false));
    store.dispatch(setEditingView(null));
  }, [store]);

  const handleSave = useCallback(
    (formData) => {
      // helper to create and persist a view (center resolved via channel if available)
      const persistView = (center) => {
        const thisId = editingView?.id || uuidv4();
        const markers = drawToolMarkers?.map((d) => ({
          ...d,
          markerId: uuidv4(),
          color: '#ff5100b3'
        }));

        // If we have an editingView, only update metadata
        // and keep the original data object unchanged.
        let newView;
        if (editingView) {
          newView = {
            ...editingView,
            // keep the same id as editingView
            id: thisId,
            // only change metadata fields
            name: formData.name,
            description: formData.description,
            saveDate: Date.now(),
            default: !!formData.default,
            // preserve the existing data object exactly
            data: editingView.data
          };
        } else {
          // create a full new view
          newView = {
            id: thisId,
            name: formData.name,
            description: formData.description,
            saveDate: Date.now(),
            default: !!formData.default,
            data: {
              zoom: center?.zoom ?? editingView?.data?.zoom ?? undefined,
              x:
                center?.centerX ??
                editingView?.data?.x ??
                editingView?.data?.center?.x,
              y:
                center?.centerY ??
                editingView?.data?.y ??
                editingView?.data?.center?.y,
              layers: selectedLayers || [],
              language: strings.getLanguage ? strings.getLanguage() : undefined,
              geometries: formData.includeGeometries
                ? { geoJsonArray, markers, id: thisId }
                : undefined
            }
          };
        }

        const existingViews = Array.isArray(views) ? views : [];

        let updatedViews;
        if (editingView) {
          // replace edited view; if new default, clear default on others
          updatedViews = existingViews.map((v) =>
            v.id === editingView.id
              ? { ...newView, id: editingView.id }
              : formData.default
              ? { ...v, default: false }
              : v
          );
        } else {
          // creating: if new default, clear default on existing views
          updatedViews = [
            ...existingViews.map((v) => ({
              ...v,
              default: formData.default ? false : v.default
            })),
            newView
          ];
        }

        try {
          window.localStorage.setItem('views', JSON.stringify(updatedViews));

          store.dispatch(setViews(updatedViews));

          store.dispatch(setEditingView(null));
          store.dispatch(setIsSaveViewOpen(false));

          toast.success(
            `${strings.savedContent.view} "${formData.name}" ${strings.general.saveScuccessful}`,
            {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
              theme: 'colored',
              transition: Slide
            }
          );
        } catch (err) {
          console.error('Could not persist views to localStorage', err);

          toast.error(`"${formData.name}" ${strings.general.saveFailed}`, {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: 'colored',
            transition: Slide
          });
        }
      };

      // get center from map if channel API available; otherwise persist with undefined center
      if (channel && typeof channel.getMapPosition === 'function') {
        try {
          channel.getMapPosition((center) => {
            persistView(center || {});
          });
        } catch (err) {
          console.warn('Failed to get map position', err);
          persistView({});
        }
      } else {
        persistView({});
      }
    },
    [
      channel,
      drawToolMarkers,
      editingView,
      geoJsonArray,
      selectedLayers,
      store,
      views
    ]
  );

  const helpContent = (
    <ul>
      <li>{strings.savedContent?.saveView?.saveViewDescription1}</li>
      <li>{strings.savedContent?.saveView?.saveViewDescription2}</li>
    </ul>
  );

  return isSaveViewOpen ? (
    <Dialog
      drag
      resize
      title={strings.savedContent?.saveView?.saveView}
      titleIcon={faCamera}
      isOpen={isSaveViewOpen}
      closeAction={handleCloseSaveViewDialog}
      type="normal"
      minWidth="600px"
      minHeight={isLowResScreen ? '400px' : '500px'}
      maxWidth="90vw"
      maxHeight="90vh"
      hasHelp
      helpId="show_view_help"
      helpContent={helpContent}

  anchorOriginX="50%"
  anchorOriginY="50%"
  anchorX="end"
  anchorY="center"

    >
      <ViewForm
        initialData={editingView}
        onSave={handleSave}
        onCancel={() => {
          store.dispatch(setEditingView(null));
          store.dispatch(setIsSaveViewOpen(false));
        }}
      />
    </Dialog>
  )
  : null ;
};

export default SaveViewsDialog;
