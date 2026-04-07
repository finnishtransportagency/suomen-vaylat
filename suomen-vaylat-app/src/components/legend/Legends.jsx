import { useSelector } from 'react-redux';
import '../../resources/css/custom.scss';
import styled from 'styled-components';
import { LegendGroup } from './LegendGroup';

const StyledGroupsContainer = styled.div`
  padding: 8px 4px 8px 8px;
`;

export const Legends = () => {
  const legends = [];
  const noLegends = [];
  const allLegends = useSelector((state) => state.rpc.legends);
  const { currentZoomLevel, selectedLayers } = useSelector(
    (state) => state.rpc
  );

  if (selectedLayers) {
    selectedLayers.forEach((layer) => {
      if (layer.opacity !== 0) {
        const legend = allLegends.filter((l) => l.layerId === layer.id);
        const hasVisible =
          !isNaN(layer.maxZoomLevel) && !isNaN(layer.minZoomLevel)
            ? layer.maxZoomLevel >= currentZoomLevel &&
              layer.minZoomLevel <= currentZoomLevel
            : true;
        if (legend[0] && legend[0].legend && hasVisible) {
          legends.push(legend[0]);
        } else if (legend[0] && hasVisible) {
          noLegends.push(legend[0]);
        }
      }
    });
  }
  legends.push.apply(legends, noLegends);

  return (
    <StyledGroupsContainer id="legend-main-container">
      {legends.map((legend) => (
        <LegendGroup key={'legend-group-' + legend.layerId} legend={legend} />
      ))}
    </StyledGroupsContainer>
  );
};
