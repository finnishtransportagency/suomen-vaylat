import { useContext } from 'react';
import Dialog from '../../dialog/Dialog';
import { useAppSelector } from '../../../state/hooks';
import strings from '../../../translations';
import BaseLayerSelectorMenu from '../BaseLayersSelectorMenu';
import { setIsBaseLayerSelectorMenuOpen } from '../../../state/slices/uiSlice';
import { ReactReduxContext } from 'react-redux';

const BaseLayerSelectorDialog = () => {
  const { isBaseLayerSelectorMenuOpen } = useAppSelector((state) => state.ui)

  const { store } = useContext(ReactReduxContext);

  const handleCloseBaseLayerSelectorDialog = () => {
    store.dispatch(setIsBaseLayerSelectorMenuOpen(false));
  };

  return (
    <Dialog
      drag={false}
      resize={false}
      fullScreenOnMobile={true}
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
