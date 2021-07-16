import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import SelectedLayers from './selected-layers/SelectedLayers';
import LayerList from './LayerList';

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

    return (
      <StyledLayerList>
        <SelectedLayers layers={allLayers}/>
        <LayerList groups={allGroups} layers={allLayers} recurse={false} />
      </StyledLayerList>
      );
};


export default LayerListTEMP;