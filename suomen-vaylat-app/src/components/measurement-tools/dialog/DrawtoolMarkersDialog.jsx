import Dialog from '../../dialog/Dialog';
import strings from '../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import DrawtoolMarkers from '../DrawtoolMarkers';
import { setActiveTool } from '../../../state/slices/uiSlice';

const DrawtoolMarkersDialog = ({ constraintsRef }) => {
  const { store } = useContext(ReactReduxContext);

  return (
    <Dialog
      constraintsRef={
        constraintsRef
      } /* Reference div for dialog drag boundaries */
      drag={true} /* Enable (true) or disable (false) drag */
      resize={false}
      backdrop={false} /* Is backdrop enabled (true) or disabled (false) */
      fullScreenOnMobile={
        false
      } /* Scale dialog full width / height when using mobile device */
      title={strings.tooltips.drawingTools.marker} /* Dialog header title */
      type={'normal'} /* Dialog type */
      closeAction={() =>
        store.dispatch(setActiveTool(null))
      } /* Action when pressing dialog close button or backdrop */
      isOpen={false} /* Dialog state */
      id="metadata_dialog"
      maxWidth={'800px'}
    >
      <DrawtoolMarkers />
    </Dialog>
  );
};

export default DrawtoolMarkersDialog;
