import styled from 'styled-components';
import LayerGroup from './LayerGroup';
import { useAppSelector } from '../../../state/hooks';

const StyledLayerList = styled.div`

`;

export const LayerList = ({ groups, layers, recurse = false}) => {
  const tagLayers = useAppSelector((state) => state.rpc.tagLayers);

  if (tagLayers.length > 0) {
    layers = layers.filter(layer => tagLayers.includes(layer.id));
  }
    return (
        <StyledLayerList>
            {groups.map((group, index) => {
                var hasChildren = false;
                if(group.groups) {
                    hasChildren = group.groups.length > 0;
                }
                return (
                    <>
                        { hasChildren || layers.length > 0 ? (
                            <LayerGroup
                                key={group.id}
                                index={index}
                                group={group}
                                layers={layers}
                                hasChildren={hasChildren}
                            />) : null}
                    </>
                );
            })
            }
        </StyledLayerList>
    );
  };

  export default LayerList;