import React, { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import CircleButton from '../../../../utils/components/CircleButton';
import styled from 'styled-components';
import { useAppSelector } from '../../../../state/hooks';
import { setIsGfiOpen, setMinimizeGfi } from '../../../../state/slices/uiSlice';
import { setVKMData } from '../../../../state/slices/rpcSlice';
import strings from '../../../../translations';

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

const FeatureDataWindowModalButton = () => {
  const { store } = useContext(ReactReduxContext);
  const { filters, isGfiOpen } = useAppSelector((state) => ({
    filters: state.rpc.filters,
    isGfiOpen: state.ui.isGfiOpen
  }));

  return (
    <CircleButton
      icon={faMapMarkedAlt}
      text={strings.gfi.title}
      toggleState={isGfiOpen}
      tooltipDirection="right"
      clickAction={() => {
        isGfiOpen && store.dispatch(setVKMData(null));
        isGfiOpen && store.dispatch(setMinimizeGfi(false));
        store.dispatch(setIsGfiOpen(!isGfiOpen));
      }}
    >
      {filters?.filters?.length > 0 && (
        <StyledLayerCount>{filters.filters.length}</StyledLayerCount>
      )}
    </CircleButton>
  );
};

export default FeatureDataWindowModalButton;
