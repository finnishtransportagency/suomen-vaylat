import Modal from '../../../../modals/Modal';
import strings from '../../../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../../../state/hooks';
import CustomLayerModalContent from '../CustomLayerModalContent';

import { setIsCustomFilterOpen, setUpdateCustomLayers, setSelectedCustomFilterLayers, setShowSavedLayers } from '../../../../../state/slices/uiSlice';

import styled from 'styled-components';

const StyledModalWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledModalContent = styled.div`
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

const StyledModalBody = styled.div`
  margin-top: 5px;
  color: ${(props) => props.theme.colors.black};
`;

const CustomLayerModal = ({ constraintsRef }) => {
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

  return (
    <Modal
      constraintsRef={
        constraintsRef
      } /* Reference div for modal drag boundaries */
      drag={true} /* Enable (true) or disable (false) drag */
      resize={false}
      backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
      fullScreenOnMobile={
        true
      } /* Scale modal full width / height when using mobile device */
      titleIcon={null} /* Use icon on title or null */
      title={
        strings.layerlist.customLayerInfo.modalTitle
      } /* Modal header title */
      type={'normal'} /* Modal type */
      closeAction={
        handleCustomFilterClose
      } /* Action when pressing modal close button or backdrop */
      isOpen={isCustomFilterOpen} /* Modal state */
      id="custom_layer_modal"
      height="860px"
    >
      <StyledModalWrapper>
        <StyledModalContent>
          <StyledModalBody>
            <CustomLayerModalContent />
          </StyledModalBody>
        </StyledModalContent>
      </StyledModalWrapper>
    </Modal>
  );
};

export default CustomLayerModal;
