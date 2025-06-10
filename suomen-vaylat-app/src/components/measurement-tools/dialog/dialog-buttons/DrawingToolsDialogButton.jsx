import React, { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { faPencilRuler } from '@fortawesome/free-solid-svg-icons';
import CircleButton from '../../../../utils/components/CircleButton';
import { useAppSelector } from '../../../../state/hooks';
import {
  setIsDrawingToolsOpen,
  setGeoJsonArray,
  setActiveTool,
  setSelectedMarker,
  removeFromDrawToolMarkers
} from '../../../../state/slices/uiSlice';
import { removeMarkerRequest } from '../../../../state/slices/rpcSlice';
import strings from '../../../../translations';
import styled from 'styled-components';
import DrawingTools from '../../DrawingTools';

const StyledMapToolsContainer = styled.div`
    background-color: ${(props) => props.theme.colors.mainWhite};
    border-radius: 24px;
    box-shadow: 1px 2px 6px #0000004d;
    z-index: -1;
`;

// TODO: this could be removed

const DrawingToolsDialogButton = () => {
  const { store } = useContext(ReactReduxContext);
  const { channel, drawToolMarkers, isDrawingToolsOpen } = useAppSelector(
    (state) => ({
      channel: state.rpc.channel,
      drawToolMarkers: state.ui.drawToolMarkers,
      isDrawingToolsOpen: state.ui.isDrawingToolsOpen
    })
  );

  const closeDrawingTools = (open) => {
    channel.postRequest('DrawTools.StopDrawingRequest');
    store.dispatch(setGeoJsonArray([]));
    store.dispatch(setActiveTool(null));
    drawToolMarkers.forEach((marker) => {
      store.dispatch(removeMarkerRequest({ markerId: marker.markerId }));
      store.dispatch(removeFromDrawToolMarkers(marker.markerId));
    });
    store.dispatch(setIsDrawingToolsOpen(open));
    store.dispatch(setSelectedMarker(2));
  };

  return (
    <StyledMapToolsContainer>
      <CircleButton
        icon={faPencilRuler}
        text={strings.tooltips.drawingTools.drawingToolsButton}
        toggleState={isDrawingToolsOpen}
        tooltipDirection="right"
        clickAction={() => closeDrawingTools(!isDrawingToolsOpen)}
      />
      <DrawingTools isOpen={isDrawingToolsOpen}/>
    </StyledMapToolsContainer>
  );
};

export default DrawingToolsDialogButton;
