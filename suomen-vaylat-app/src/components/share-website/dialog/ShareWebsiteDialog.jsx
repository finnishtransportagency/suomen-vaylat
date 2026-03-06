import { useContext } from 'react';
import Dialog from '../../dialog/Dialog';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '../../../state/hooks';
import strings from '../../../translations';
import { ShareWebsiteContent }  from '../ShareWebsiteContent';
import { setShareUrl } from '../../../state/slices/uiSlice';
import { ReactReduxContext } from 'react-redux';

const ShareWebsiteDialog = () => {
  const { shareUrl } = useAppSelector((state) => state.ui);
  const isShareOpen = shareUrl && shareUrl.length > 0;

  const { store } = useContext(ReactReduxContext);

  const handleCloseShareWebSite = () => {
    store.dispatch(setShareUrl(''));
  };

  return (
    <Dialog
      drag={false}
      resize={false}
      fullScreenOnMobile={true}
      titleIcon={faShareAlt}
      title={strings.share.title}
      type={'normal'}
      closeAction={handleCloseShareWebSite}
      isOpen={isShareOpen}
      id="share_website_popup"
    >
      <ShareWebsiteContent />
    </Dialog>
  );
};

export default ShareWebsiteDialog;
