import styled from 'styled-components';
import shortid from 'shortid';
import LayerGroup from './LayerGroup';
import Filter from './Filter';

const StyledLayerList = styled.div`
`;

export const LayerList = ({ groups, layers, tags, filters, recurse = false}) => {
    console.log(layers);
    console.log(groups);
    console.log(tags);
    return (
        <StyledLayerList>
            {groups.map((group, index) => {
                var hasChildren = false;
                if(group.groups) {
                    hasChildren = group.groups.length > 0;
                }
                return (
                <LayerGroup
                    key={group.id}
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

  /*
            
  {filters.map((filter) => {
      <Filter filter={filter} />
  })}
  */