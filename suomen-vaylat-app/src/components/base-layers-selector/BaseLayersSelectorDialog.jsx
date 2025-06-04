import { useContext } from 'react';
import Dialog from '../dialog/Dialog';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '../../state/hooks';
import strings from '../../translations';
import BaseLayerSelectorMenu from './BaseLayersSelectorMenu';
import { setSelectedBaseLayers } from '../../state/slices/uiSlice';
import { setIsBaseLayerSelectorMenuOpen } from '../../state/slices/uiSlice';
import { ReactReduxContext } from 'react-redux';
import ModeEditOutlineTwoToneIcon from '@mui/icons-material/ModeEditOutlineTwoTone';

const BaseLayerSelectorDialog = ({ constraintsRef }) => {
  const { isBaseLayerSelectorMenuOpen } = useAppSelector((state) => state.ui)

  const { store } = useContext(ReactReduxContext);

  const handleCloseBaseLayerSelectorDialog = () => {
    store.dispatch(setIsBaseLayerSelectorMenuOpen(false));
  };

  return (
    <Dialog
      constraintsRef={constraintsRef}
      drag={false}
      resize={false}
      backdrop={true}
      fullScreenOnMobile={true}
      titleIcon={<ModeEditOutlineTwoToneIcon />}
      title={strings.baseLayerSelector.title}
      type={'normal'}
      closeAction={handleCloseBaseLayerSelectorDialog}
      isOpen={isBaseLayerSelectorMenuOpen}
      id="base_layer_selector_menu"
    >
      <BaseLayerSelectorMenu />
    </Dialog>
  );
};

export default BaseLayerSelectorDialog;
