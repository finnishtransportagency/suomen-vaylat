import Dialog from '../../../../dialog/Dialog';
import strings from '../../../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../../../state/hooks';
import CustomLayerDialogContent from '../CustomLayerDialogContent';

import { setIsCustomFilterOpen, setUpdateCustomLayers, setSelectedCustomFilterLayers, setShowSavedLayers } from '../../../../../state/slices/uiSlice';

import styled from 'styled-components';

const StyledDialogWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledDialogContent = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 350px) {
    margin-left: 5px;
    min-width: 300px;
    max-width: 450px;
  }
`;

const StyledDialogBody = styled.div`
  margin-top: 5px;
  color: ${(props) => props.theme.colors.black};
`;

const CustomLayerDialog = () => {
  const { store } = useContext(ReactReduxContext);

  const { isCustomFilterOpen } = useAppSelector((state) => state.ui);
  
  const handleCustomFilterClose = () => {
    store.dispatch(setIsCustomFilterOpen(false));
    store.dispatch(setUpdateCustomLayers(false));
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
        strings.layerlist.customLayerInfo.dialogTitle
      } /* Dialog header title */
      type={'normal'} /* Dialog type */
      closeAction={
        handleCustomFilterClose
      } /* Action when pressing dialog close button or backdrop */
      isOpen={isCustomFilterOpen} /* Dialog state */
      id="custom_layer_dialog"
      minHeight="860px"
    >
      <StyledDialogWrapper>
        <StyledDialogContent>
          <StyledDialogBody>
            <CustomLayerDialogContent />
          </StyledDialogBody>
        </StyledDialogContent>
      </StyledDialogWrapper>
    </Dialog>
  )
  : null ;
};

export default CustomLayerDialog;
