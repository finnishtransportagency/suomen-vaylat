import Dialog from '../../dialog/Dialog';
import strings from '../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from "../../../state/hooks";

import {
  setIsLegendOpen
} from "../../../state/slices/uiSlice";
import { faList } from '@fortawesome/free-solid-svg-icons';
import { Legends } from '../Legends';

const LegendsDialog = () => {
  const { store } = useContext(ReactReduxContext);
  const {
    isLegendOpen
  } = useAppSelector((state) => state.ui);
  console.log(isLegendOpen)

  return isLegendOpen ? (
    <Dialog
      id="legends_dialog_container"
      drag={true} /* Enable (true) or disable (false) drag */
      resize={false}
      fullScreenOnMobile={
        false
      } /* Scale dialog full width / height when using mobile device */
      titleIcon={faList} /* Use icon on title or null */
      title={strings.legend.title} /* Dialog header title */
      closeAction={
        () => store.dispatch(setIsLegendOpen(false))
      } /* Action when pressing dialog close button or backdrop */
      maxWidth={'20rem'}
      maxHeight={'25rem'}
      width={'20rem'}
      height={'25rem'}
      minWidth={'20rem'}
      minHeight={'25rem'}
      anchorX='end'
      anchorY='end'
      anchorOriginX = '95%'
      anchorOriginY = '95%'
    >
        <Legends/>
    </Dialog>
  )
  : null ;
};

export default LegendsDialog;
