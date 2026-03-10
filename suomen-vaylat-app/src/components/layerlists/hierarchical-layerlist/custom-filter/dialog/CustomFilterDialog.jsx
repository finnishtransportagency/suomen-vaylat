import Dialog from '../../../../dialog/Dialog';
import strings from '../../../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../../../state/hooks';
import CustomFilterDialogContent from '../CustomFilterDialogContent';
import { setIsCustomFilterOpen, setSelectedCustomFilterLayers, setShowSavedLayers } from '../../../../../state/slices/uiSlice';

const CustomFilterDialog = ({ constraintsRef }) => {
  const { store } = useContext(ReactReduxContext);

  const { isCustomFilterOpen } = useAppSelector((state) => state.ui);
  
  const handleCustomFilterClose = () => {
    store.dispatch(setIsCustomFilterOpen(false));
    store.dispatch(setSelectedCustomFilterLayers([]));

    const checkedLayers = localStorage.getItem('checkedLayers');
    if (!checkedLayers || JSON.parse(checkedLayers).length === 0) {
      store.dispatch(setShowSavedLayers(false));
    }
  };

  return isCustomFilterOpen ? (
    <Dialog
      drag={true} /* Enable (true) or disable (false) drag */
      resize={false}
      fullScreenOnMobile={
        true
      } /* Scale dialog full width / height when using mobile device */
      titleIcon={null} /* Use icon on title or null */
      title={
        strings.layerlist.customFilterInfo.dialogTitle
      } /* Dialog header title */
      type={'normal'} /* Dialog type */
      closeAction={
        handleCustomFilterClose
      } /* Action when pressing dialog close button or backdrop */
      id="custom_layer_dialog"
      minHeight="860px"
    >
      <CustomFilterDialogContent />
    </Dialog>
  )
  : null ;
};

export default CustomFilterDialog;
