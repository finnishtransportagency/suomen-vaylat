import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import SelectedLayers from '../selected-layers/SelectedLayers';
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
  const allThemes = useAppSelector((state) => state.rpc.allThemes);

    return (
        <StyledLayerList>
          <Tabs>
            <LayerList label="Kaikki tasot" groups={allGroups} layers={allLayers} recurse={false} />
            <LayerList label="Teema tasot" groups={allGroups} layers={allLayers} recurse={false} />
            <SelectedLayers label="Valitut tasot" layers={allLayers} />
          </Tabs> 
        </StyledLayerList>
      );
};


export default LayerListTEMP;