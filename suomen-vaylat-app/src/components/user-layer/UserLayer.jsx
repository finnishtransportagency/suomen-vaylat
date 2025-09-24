import { useContext, useEffect } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import Badge from 'react-bootstrap/Badge';
import { theme } from '../../theme/theme';
import strings from '../../translations';

import styled from 'styled-components';
import {
  setMapLayerVisibility
} from '../../state/slices/rpcSlice';
import { updateLayers } from '../../utils/rpcUtil';
import LayerlistSwitch from '../layerlists/hierarchical-layerlist/LayerlistSwitch';

const StyledLayerContainer = styled.div`
  background-color: ${(props) => props.themeStyle && '#F5F5F5'};
  overflow: hidden;
  min-height: 32px;
  display: flex;
  align-items: center;
  margin-top: ${(props) => props.themeStyle && '8px'};
  border-radius: 4px;
  margin-bottom: 4px;
`;

const StyledlayerHeader = styled.div`
  margin-right: 0.5em;
  display: flex;
  width: 100%;
  align-items: center;
`;

const StyledLayerName = styled.p`
  word-break: break-word;
  user-select: none;
  color: ${(props) =>
    props.themeStyle
      ? props.theme.colors.secondaryColorGreen
      : props.theme.colors.mainColor1};
  margin: 0px;
  font-size: 14px;
  padding-left: 8px;
`;

export const UserLayer = ({ layer, themeName, groupName }) => {
  const { store } = useContext(ReactReduxContext);
  const { channel } = useSelector((state) => state.rpc);

  const handleLayerVisibility = (channel, layer) => {
    store.dispatch(setMapLayerVisibility(layer));
    updateLayers(store, channel);
  };

  useEffect(() => {
    // Clear the timeout when the component unmounts
    return () => clearTimeout(window.legendUpdateTimer);
  }, []);

  return (
    <StyledLayerContainer
      themeStyle={themeStyle}
      className={`list-layer ${layer.visible && 'list-layer-active'}`}
      key={'layer' + layer.id + '_' + themeName}
    >
      <StyledlayerHeader>
        <StyledLayerName themeStyle={themeStyle}>
          {layer.name}{' '}
          {groupName &&
            groupName !== 'Unknown' &&
            !excludeGroups.includes(groupName) &&
            ` (${groupName})`}
          {layer.newLayer && (
            <Badge
              style={{
                color: theme.colors.mainWhite,
                backgroundColor: theme.colors.mainColor1,
                marginLeft: '.5em'
              }}
              pill
              bg="null"
            >
              {strings.tooltips.layerlist.newLayer}
            </Badge>
          )}
        </StyledLayerName>
      </StyledlayerHeader>

      <LayerlistSwitch
        action={() => handleLayerVisibility(channel, layer)}
        isSelected={layer.visible}
        layer={layer}
      />
    </StyledLayerContainer>
  );
};

export default UserLayer;
