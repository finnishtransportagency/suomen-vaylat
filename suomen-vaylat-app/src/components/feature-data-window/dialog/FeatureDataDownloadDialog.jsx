import Dialog from '../../dialog/Dialog';
import strings from '../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import FeatureDataDownload from '../download/FeatureDataDownload';

import { setIsGfiDownloadOpen } from '../../../state/slices/uiSlice';

import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { GFI_GEOMETRY_LAYER_ID } from '../../../utils/constants';

const FeatureDataDownloadDialog = ({ constraintsRef }) => {
  const { store } = useContext(ReactReduxContext);
  const { channel } = useAppSelector((state) => state.rpc);

  const { isGfiOpen, isGfiDownloadOpen } = useAppSelector((state) => state.ui);

  const handleCloseGfiDownloadDialog = () => {
    store.dispatch(setIsGfiDownloadOpen(false));

    !isGfiOpen &&
      channel &&
      channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
        null,
        null,
        GFI_GEOMETRY_LAYER_ID
      ]);
  };

  return (
    <Dialog
      constraintsRef={
        constraintsRef
      } /* Reference div for dialog drag boundaries */
      drag={false} /* Enable (true) or disable (false) drag */
      resize={false}
      backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
      fullScreenOnMobile={
        true
      } /* Scale dialog full width / height when using mobile device */
      titleIcon={faDownload} /* Use icon on title or null */
      title={strings.downloads.downloads} /* Dialog header title */
      type={'normal'} /* Dialog type */
      closeAction={
        handleCloseGfiDownloadDialog
      } /* Action when pressing dialog close button or backdrop */
      isOpen={isGfiDownloadOpen} /* Dialog state */
      id="gfi_download_dialog"
      minWidth={'600px'}
    >
      <FeatureDataDownload />
    </Dialog>
  );
};

export default FeatureDataDownloadDialog;
