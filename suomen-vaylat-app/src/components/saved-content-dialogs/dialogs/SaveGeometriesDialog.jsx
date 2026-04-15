import React, { useEffect, useContext, useCallback } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Dialog from '../../dialog/Dialog';
import GeometryForm from '../Geometries/GeometryForm';
import strings from '../../../translations';
import { setIsSaveGeometriesOpen } from '../../../state/slices/uiSlice';
import { faDrawPolygon } from '@fortawesome/free-solid-svg-icons';
import {
  setEditingGeometry,
  setGeometries
} from '../../../state/slices/rpcSlice';
import { Slide, toast } from 'react-toastify';

const SaveGeometriesDialog = () => {
  const { store } = useContext(ReactReduxContext);
  const isSaveGeometriesOpen = useSelector((s) => s.ui.isSaveGeometriesOpen);
  const geoJsonArray = useSelector((s) => s.ui.geoJsonArray) || [];
  const drawToolMarkers = useSelector((s) => s.ui.drawToolMarkers) || [];
  const editingGeometry = useSelector((s) => s.rpc.editingGeometry) || null;
  const geometries = useSelector((s) => s.rpc.geometries) || [];

  // Load any persisted views into local state if needed (we use store + localStorage)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('geometries');
      // don't overwrite store-managed views; this is defensive
      if (
        raw &&
        typeof raw === 'object' &&
        (!geometries || geometries.length === 0)
      ) {
        const parsed = JSON.parse(raw);
        store.dispatch(setGeometries(parsed));
      }
    } catch (err) {
      // ignore
    }
  }, [store, geometries]);

  // Close handler for the dialog (mirrors your example)
  const handleCloseSaveGeometriesDialog = useCallback(() => {
    store.dispatch(setIsSaveGeometriesOpen(false));
    store.dispatch(setEditingGeometry(null));
  }, [store]);

  // Compose markers (generate ids) and save geometry (new or update)
  const handleSaveGeometry = useCallback(
    (formData) => {
      // Determine id (existing editingGeometry or new)
      const layerId = editingGeometry?.id || uuidv4();

      // Create marker objects (give them markerId)
      const markers =
        editingGeometry?.markers ||
        drawToolMarkers.map((d) => ({
          ...d,
          markerId: uuidv4(),
          color: '#ff5100b3'
        }));

      const newGeometry = {
        id: layerId,
        name: formData.name,
        description: formData.description,
        saveDate: Date.now(),
        data: editingGeometry ? editingGeometry.data : [...geoJsonArray],
        markers
      };

      let updatedGeometries;
      if (editingGeometry) {
        // update existing
        updatedGeometries = (geometries || []).map((g) =>
          g.id === editingGeometry.id ? newGeometry : g
        );
      } else {
        // append new geometry
        updatedGeometries = [...(geometries || []), newGeometry];
      }

      // Persist and update state
      try {
        window.localStorage.setItem(
          'geometries',
          JSON.stringify(updatedGeometries)
        );
        store.dispatch(setGeometries(updatedGeometries));

        // Close form & dialog and reset editing state
        store.dispatch(setEditingGeometry(null));
        store.dispatch(setIsSaveGeometriesOpen(false));

        toast.success(
          `${strings.savedContent.geometry} "${formData.name}" ${strings.general.saveScuccessful}`,
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
        console.error('Could not persist geometries to localStorage', err);

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
    },
    [editingGeometry, drawToolMarkers, geoJsonArray, geometries, store]
  );

  // Cancel handler from the form -> closes dialog and resets editing state
  const handleCancelForm = useCallback(() => {
    store.dispatch(setEditingGeometry(null));
    store.dispatch(setIsSaveGeometriesOpen(false));
  }, [store]);

  // Compute whether form has items to save (same logic as the tab)
  const itemsToSave =
    !!editingGeometry || geoJsonArray.length > 0 || drawToolMarkers.length > 0;

  const helpContent = (
    <ul>
      <li>{strings.savedContent?.saveGeometry?.saveGeometryDescription1}</li>
      <li>{strings.savedContent?.saveGeometry?.saveGeometryDescription2}</li>
    </ul>
  );

  return isSaveGeometriesOpen ? (
    <Dialog
      drag={true}
      resize={false}
      fullScreenOnMobile={true}
      titleIcon={faDrawPolygon}
      title={strings.savedContent?.saveGeometry?.title}
      type={'normal'}
      closeAction={handleCloseSaveGeometriesDialog}
      id="saved_content_dialog"
      minWidth={'30rem'}
      minHeight={'27rem'}
      hasHelp={true}
      helpId={'show_geometries_help'}
      helpContent={helpContent}
    >
      <GeometryForm
        initialData={editingGeometry}
        onSave={handleSaveGeometry}
        onCancel={handleCancelForm}
        itemsToSave={itemsToSave}
      />
    </Dialog>
  )
  : null ;
};

export default SaveGeometriesDialog;
