// src/components/coordinate-tool/dialog/CoordinateToolDialog.jsx
import strings from '../../../translations';
import { useAppSelector } from '../../../state/hooks';
import { setIsCoordinateToolOpen } from '../../../state/slices/uiSlice';
import Dialog from '../../dialog/Dialog';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import CoordinateTool from '../CoordinateTool';

const CoordinateToolDialog = () => {
  const { isCoordinateToolOpen, isSearchResultPanelVisible } = useAppSelector(
    (state) => state.ui
  );
  const { store } = useContext(ReactReduxContext);

  return isCoordinateToolOpen ? (
    <Dialog
      drag
      resize={false}
      backdrop={false}
      fullScreenOnMobile={false}
      titleIcon={null}
      title={strings.coordinateTool.title}
      type="normal"
      closeAction={() => store.dispatch(setIsCoordinateToolOpen(false))}
      id="coordinate_tool_dialog"
      width='auto'
      height='auto'
      minWidth={'23rem'}
      minHeight={'23rem'}
      anchorX='end'
      anchorY='end'
      anchorOriginX = '90%'
      anchorOriginY = '95%'
    >
      <CoordinateTool />
    </Dialog>
  ) : null;
};

export default CoordinateToolDialog;
