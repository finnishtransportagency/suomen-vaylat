import React, { useContext } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import Dialog from '../../dialog/Dialog';
import strings from '../../../translations';
import { theme } from '../../../theme/theme';
import { setIsProfileOpen } from '../../../state/slices/uiSlice';
import ProfileInfo from '../ProfileInfo';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProfileInfoDialog = () => {
  const { store } = useContext(ReactReduxContext);
  const isProfileOpen = useSelector((s) => s.ui.isProfileOpen) || false;  
  const isLowResScreen = window.matchMedia(theme.device.lowResDesktop).matches;

  const handleCloseProfileDialog = () => {
    store.dispatch(setIsProfileOpen(false));
  };

  return isProfileOpen ? (
    <Dialog
      drag={true}
      resize={false}
      fullScreenOnMobile={true}
      titleIcon={<AccountCircleIcon style={{fontSize: "26px"}}/>}
      title={strings.tooltips.profile}
      type={'normal'}
      closeAction={handleCloseProfileDialog}
      id="profile_info_dialog"
      maxWidth='25rem'
    >
      <ProfileInfo/>
    </Dialog>
  )
  : null ;
};

export default ProfileInfoDialog;
