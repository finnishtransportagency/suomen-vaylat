import React, { useContext } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import Dialog from '../../dialog/Dialog';
import strings from '../../../translations';
import { theme } from '../../../theme/theme';
import { setIsProfileOpen } from '../../../state/slices/uiSlice';
import ProfileInfo from '../ProfileInfo';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProfileInfoDialog = ({ constraintsRef }) => {
  const { store } = useContext(ReactReduxContext);
  const isProfileOpen = useSelector((s) => s.ui.isProfileOpen) || false;
  const isLowResScreen = window.matchMedia(theme.device.lowResDesktop).matches;

  const handleCloseProfileDialog = () => {
    store.dispatch(setIsProfileOpen(false));
  };

  return (
    <Dialog
      constraintsRef={constraintsRef}
      drag={true}
      resize={false}
      backdrop={false}
      fullScreenOnMobile={true}
      titleIcon={<AccountCircleIcon style={{fontSize: "26px"}}/>}
      title={strings.tooltips.profile}
      type={'normal'}
      closeAction={handleCloseProfileDialog}
      isOpen={isProfileOpen}
      id="profile_info_dialog"
      minWidth={'600px'}
      minHeight={isLowResScreen ? '300px' : '400px'}
    >
      <ProfileInfo/>
    </Dialog>
  );
};

export default ProfileInfoDialog;
