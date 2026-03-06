import Dialog from '../../dialog/Dialog';
import strings from '../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import DatasetImport from '../DatasetImport'

import { setIsDatasetImportOpen } from '../../../state/slices/uiSlice';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const DatasetImportDialog = () => {
  const { store } = useContext(ReactReduxContext);

  const { isDatasetImportOpen } = useAppSelector((state) => state.ui);
  const handleCloseDatasetImport = () => {
    store.dispatch(setIsDatasetImportOpen(false));
  };

  return isDatasetImportOpen ? (
    <Dialog
      drag={true} /* Enable (true) or disable (false) drag */
      resize={false}
      fullScreenOnMobile={
        true
      } /* Scale dialog full width / height when using mobile device */
      titleIcon={faUpload} /* Use icon on title or null */
      title={strings.datasetImport.title} /* Dialog header title */
      type={'normal'} /* Dialog type */
      closeAction={
        handleCloseDatasetImport
      } /* Action when pressing dialog close button or backdrop */
      id='dataset-import-dialog'
      maxWidth={'800px'}
    >
      <DatasetImport/>
    </Dialog>
  )
  : null ;
};

export default DatasetImportDialog;
