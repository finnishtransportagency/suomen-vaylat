import { useContext } from 'react';
import Dialog from '../../dialog/Dialog';
import { useAppSelector } from '../../../state/hooks';
import strings from '../../../translations';
import BaseLayerSelectorMenu from '../BaseLayersSelectorMenu';
import { setIsBaseLayerSelectorMenuOpen } from '../../../state/slices/uiSlice';
import { ReactReduxContext } from 'react-redux';

const BaseLayerSelectorDialog = () => {
  const { isBaseLayerSelectorMenuOpen } = useAppSelector((state) => state.ui);
  const { store } = useContext(ReactReduxContext);

  const handleCloseBaseLayerSelectorDialog = () => {
    store.dispatch(setIsBaseLayerSelectorMenuOpen(false));
  };

  return isBaseLayerSelectorMenuOpen ? (
    <Dialog
      drag={false}
      resize={false}
      fullScreenOnMobile={true}
      title={strings.baseLayerSelector.title}
      type={'normal'}
      closeAction={handleCloseBaseLayerSelectorDialog}
      id="base_layer_selector_menu"
      minWidth="52rem"
      minHeight="36rem"
    >
      <BaseLayerSelectorMenu />
    </Dialog>
  ) : null;
};

export default BaseLayerSelectorDialog;
