import styled, { keyframes } from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import LayerList from './LayerList';

//VÄLIAIKAINEN PALIKKA VÄLITTÄMÄÄN TESTIDATAA HIERARKISELLE TASOVALIKOLLE

const StyledLayerList = styled.div`
  width: 300px;
  position: absolute;
  top: 6%;
  left: 0px;
  z-index: 10;
  height: calc(100% - 6%);
  overflow-y: auto;
  &::-webkit-scrollbar {
        display: none;
  }
`;


export const LayerListTEMP = () => {

  const allGroups = useAppSelector((state) => state.rpc.allGroups);
  const allLayers = useAppSelector((state) => state.rpc.allLayers);

    return (
      <StyledLayerList>
        {/* <div style={{position: "absolute",margin: "15px",width: "300px",zIndex: "10"}}> */}
        <LayerList groups={allGroups} layers={allLayers} recurse={false} />
        {/* </div> */}
      </StyledLayerList>
      );
};


export default LayerListTEMP;