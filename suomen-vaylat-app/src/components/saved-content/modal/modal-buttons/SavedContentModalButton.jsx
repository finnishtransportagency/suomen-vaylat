import React, { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import CircleButton from '../../../../utils/components/CircleButton';
import { useAppSelector } from '../../../../state/hooks';
import { setIsSaveViewOpen } from '../../../../state/slices/uiSlice';
import strings from '../../../../translations';

const SavedContentModalButton = () => {
  const { store } = useContext(ReactReduxContext);
  const { isSaveViewOpen } = useAppSelector((state) => state.ui);

  return (
    <CircleButton
      icon={faSave}
      text={strings.savedContent.saveView.saveView}
      toggleState={isSaveViewOpen}
      tooltipDirection="right"
      clickAction={() => store.dispatch(setIsSaveViewOpen(!isSaveViewOpen))}
    />
  );
};

export default SavedContentModalButton;
