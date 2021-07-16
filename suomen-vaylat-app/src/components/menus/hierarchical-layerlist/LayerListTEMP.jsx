import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import LayerList from './LayerList';
import Tabs from "./Tabs"; 

//VÄLIAIKAINEN PALIKKA VÄLITTÄMÄÄN TESTIDATAA HIERARKISELLE TASOVALIKOLLE

const StyledLayerList = styled.div`
  width: 330px;
  position: absolute;
  top: 6%;
  left: 0px;
  z-index: 10;
  height: calc(100% - 6%);
  overflow-y: auto;
  &::-webkit-scrollbar {
        display: none;
  };
  padding: 20px;
`;


export const LayerListTEMP = () => {

  const allGroups = useAppSelector((state) => state.rpc.allGroups);
  const allLayers = useAppSelector((state) => state.rpc.allLayers);
  const allTags = useAppSelector((state) => state.rpc.allTags);
  console.log(allTags);

    return (
        <StyledLayerList>
          <Tabs> 
            <LayerList label="layerlist" groups={allGroups} layers={allLayers} tags={allTags} recurse={false} />
            <div></div>
          </Tabs> 
        </StyledLayerList>
      );
};


export default LayerListTEMP;