import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import SelectedLayers from './selected-layers/SelectedLayers';
import LayerList from './LayerList';

//VÄLIAIKAINEN PALIKKA VÄLITTÄMÄÄN TESTIDATAA HIERARKISELLE TASOVALIKOLLE

const StyledLayerList = styled.div`
  width: 100%;
  max-width: 420px;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
  height: 100%;
  overflow-y: auto;
  padding: 10px;
  &::-webkit-scrollbar {
    display: none;
  };
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