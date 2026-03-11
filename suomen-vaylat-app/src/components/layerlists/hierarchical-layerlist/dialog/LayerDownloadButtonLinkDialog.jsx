import { useContext } from 'react';
import Dialog from '../../../dialog/Dialog';
import strings from '../../../../translations';
import { useAppSelector } from '../../../../state/hooks';
import LayerDownloadLinkButtonDialogContent from '../LayerDownloadLinkButtonDialogContent';

import { setIsDownloadLinkDialogOpen } from '../../../../state/slices/uiSlice';
import { ReactReduxContext } from 'react-redux';

const LayerDownloadLinkButtonDialog = () => {
  const { downloadLink } = useAppSelector((state) => state.ui);
  const { store } = useContext(ReactReduxContext);

  const handleCloseDownloadLinkDialog = () => {
    store.dispatch(
      setIsDownloadLinkDialogOpen({
        layerDownloadLinkDialogOpen: false,
        layerDownloadLink: null,
        layerDownloadLinkName: null
      })
    );
  };

  return downloadLink.layerDownloadLinkDialogOpen ? (
    <Dialog
      drag={false}
      resize={false}
      fullScreenOnMobile={true}
      title={strings.downloadLink.downloadLinkDialogHeader}
      type={'normal'}
      closeAction={handleCloseDownloadLinkDialog}
      id="layer_download_link_dialog"
    >
      <LayerDownloadLinkButtonDialogContent downloadLink={downloadLink} />
    </Dialog>
  )
  : null ;
};

export default LayerDownloadLinkButtonDialog;
