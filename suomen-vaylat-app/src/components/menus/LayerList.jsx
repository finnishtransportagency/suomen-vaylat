import styled from 'styled-components';
import shortid from 'shortid';
import LayerGroup from './LayerGroup';

const StyledLayerList = styled.div`
`;

export const LayerList = ({ groups, layers, recurse = false}) => {
    return (
        <StyledLayerList>
        {groups.map((group, index) => {
            var hasChildren = false;
            if(group.groups) {
                hasChildren = group.groups.length > 0;
            }
            return (
            <LayerGroup
                key={shortid.generate()}
                index={index}
                group={group}
                layers={layers}
                hasChildren={hasChildren}
            />
            );
        })
        }
        </StyledLayerList>
    );
  };

  export default LayerList;