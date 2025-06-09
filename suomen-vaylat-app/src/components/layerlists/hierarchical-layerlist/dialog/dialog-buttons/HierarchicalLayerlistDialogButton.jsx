import React, { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import CircleButton from '../../../../../utils/components/CircleButton';
import styled from 'styled-components';
import { useAppSelector } from '../../../../../state/hooks';
import {
  setIsSideMenuOpen,
  setIsThemeMenuOpen
} from '../../../../../state/slices/uiSlice';
import strings from '../../../../../translations';

const StyledLayerCount = styled.div`
  position: absolute;
  top: -7px;
  right: -8px;
  width: 24px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  color: ${(props) => props.theme.colors.mainWhite};
  background-color: ${(props) => props.theme.colors.secondaryColorDarkOrange};
  font-size: 14px;
  font-weight: 600;
`;

const HierarchicalLayerlistDialogButton = ({
  animationUnfinished,
  waitForAnimationFinish
}) => {
  const { store } = useContext(ReactReduxContext);
  const { selectedLayers, isThemeMenuOpen, isSideMenuOpen } = useAppSelector(
    (state) => ({
      selectedLayers: state.rpc.selectedLayers,
      isThemeMenuOpen: state.ui.isThemeMenuOpen,
      isSideMenuOpen: state.ui.isSideMenuOpen
    })
  );

  const handleSideMenuClick = () => {
    if (!animationUnfinished) {
      if (isThemeMenuOpen) {
        store.dispatch(setIsThemeMenuOpen(false));
        waitForAnimationFinish();
        setTimeout(() => {
          store.dispatch(setIsSideMenuOpen(true));
        }, 600);
      } else {
        store.dispatch(setIsSideMenuOpen(!isSideMenuOpen));
        waitForAnimationFinish();
      }
    }
  };

  return (
    <CircleButton
      icon={faLayerGroup}
      text={strings.layerlist.layerlistLabels.mapLayers}
      toggleState={isSideMenuOpen}
      tooltipDirection="right"
      clickAction={handleSideMenuClick}
    >
      <StyledLayerCount>{selectedLayers.length}</StyledLayerCount>
    </CircleButton>
  );
};

export default HierarchicalLayerlistDialogButton;
