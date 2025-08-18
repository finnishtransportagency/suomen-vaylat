
import strings from '../../../translations';
import { useAppSelector } from '../../../state/hooks';
import { setIsCoordinateToolOpen } from '../../../state/slices/uiSlice';
import Dialog from '../../dialog/Dialog';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import CoordinateTool from '../CoordinateTool';

const CoordinateToolDialog = ({ constraintsRef }) => {
  const { isCoordinateToolOpen, isSearchResultPanelVisible } = useAppSelector((state) => state.ui);
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
      titleIcon={null} /* Use icon on title or null */
      title={strings.coordinateTool.title} /* Dialog header title */
      type={'normal'} /* Dialog type */
      closeAction={() =>
        store.dispatch(setIsCoordinateToolOpen(false))
      } /* Action when pressing dialog close button or backdrop */
      isOpen={isCoordinateToolOpen} /* Dialog state */
      id="coordinate_tool_dialog"
      width={'400px'}
      overflow={'auto'}
      bottom={"10px"}
      right={isSearchResultPanelVisible ? "500px" : "80px"}
    >
      <CoordinateTool/>
    </Dialog>
  );
};
export default CoordinateToolDialog;
