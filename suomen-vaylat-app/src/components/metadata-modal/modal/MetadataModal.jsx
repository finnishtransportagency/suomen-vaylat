import Modal from '../../modals/Modal';
import strings from '../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../../state/hooks';
import MetadataModalContent from '../MetadataModalContent';

import { clearLayerMetadata } from '../../../state/slices/rpcSlice';

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const MetadataModal = ({ constraintsRef }) => {
  const { store } = useContext(ReactReduxContext);

  const { layerMetadata } = useAppSelector((state) => state.rpc);

  const handleCloseMetadataModal = () => {
      store.dispatch(clearLayerMetadata());
    };

  return (
    <Modal
          constraintsRef={
            constraintsRef
          } /* Reference div for modal drag boundaries */
          drag={false} /* Enable (true) or disable (false) drag */
          resize={false}
          backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            true
          } /* Scale modal full width / height when using mobile device */
          titleIcon={faInfoCircle} /* Use icon on title or null */
          title={strings.formatString(
            strings.metadata.title,
            layerMetadata.layer ? layerMetadata.layer.name : ""
          )} /* Modal header title */
          type={"normal"} /* Modal type */
          closeAction={
            handleCloseMetadataModal
          } /* Action when pressing modal close button or backdrop */
          isOpen={layerMetadata.data !== null} /* Modal state */
          id="metadata_modal"
          maxWidth={"800px"}
          overflow={"auto"}
        >
          <MetadataModalContent metadata={layerMetadata} />
        </Modal>
  );
};

export default MetadataModal;
