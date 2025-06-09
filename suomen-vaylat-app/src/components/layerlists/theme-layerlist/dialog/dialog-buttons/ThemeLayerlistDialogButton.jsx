import React, { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import CircleButton from '../../../../../utils/components/CircleButton';
import { useAppSelector } from '../../../../../state/hooks';
import {
  setIsThemeMenuOpen,
  setIsSideMenuOpen
} from '../../../../../state/slices/uiSlice';
import strings from '../../../../../translations';

const ThemeLayerlistDialogButton = ({
  animationUnfinished,
  waitForAnimationFinish
}) => {
  const { store } = useContext(ReactReduxContext);
  const { isSideMenuOpen, isThemeMenuOpen } = useAppSelector((state) => ({
    isSideMenuOpen: state.ui.isSideMenuOpen,
    isThemeMenuOpen: state.ui.isThemeMenuOpen
  }));

  const handleThemeMenuClick = () => {
    if (!animationUnfinished) {
      if (isSideMenuOpen) {
        store.dispatch(setIsSideMenuOpen(false));
        waitForAnimationFinish();
        setTimeout(() => {
          store.dispatch(setIsThemeMenuOpen(true));
        }, 600);
      } else {
        store.dispatch(setIsThemeMenuOpen(!isThemeMenuOpen));
        waitForAnimationFinish();
      }
    }
  };

  return (
    <CircleButton
      icon={faMap}
      text={strings.layerlist.layerlistLabels.themeLayers}
      toggleState={isThemeMenuOpen}
      tooltipDirection="right"
      clickAction={handleThemeMenuClick}
    />
  );
};

export default ThemeLayerlistDialogButton;
