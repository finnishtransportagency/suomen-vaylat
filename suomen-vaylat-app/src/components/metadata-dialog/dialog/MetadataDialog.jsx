import Dialog from '../../dialog/Dialog';
import strings from '../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import MetadataDialogContent from '../MetadataDialogContent';

import { clearLayerMetadata } from '../../../state/slices/rpcSlice';

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const MetadataDialog = () => {
  const { store } = useContext(ReactReduxContext);

  const { layerMetadata } = useAppSelector((state) => state.rpc);
  
  const handleCloseMetadataDialog = () => {
      store.dispatch(clearLayerMetadata());
    };

  return layerMetadata.data !== null ? (
    <Dialog
          drag={false} /* Enable (true) or disable (false) drag */
          resize={false}
          fullScreenOnMobile={
            true
          } /* Scale dialog full width / height when using mobile device */
          titleIcon={faInfoCircle} /* Use icon on title or null */
          title={strings.formatString(
            strings.metadata.title,
            layerMetadata.layer ? layerMetadata.layer.name : ""
          )} /* Dialog header title */
          type={"normal"} /* Dialog type */
          closeAction={
            handleCloseMetadataDialog
          } /* Action when pressing dialog close button or backdrop */
          id="metadata_dialog"
          maxWidth={"800px"}
        >
          <MetadataDialogContent metadata={layerMetadata} />
        </Dialog>
  )
  : null ;
};

export default MetadataDialog;
