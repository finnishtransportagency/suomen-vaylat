import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import SelectedLayers from '../selected-layers/SelectedLayers';
import LayerList from './LayerList';
import ThemeLayerList from './ThemeLayerList';
import Tabs from "./Tabs";
import strings from '../../../translations';

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
`

export const LayerListTEMP = () => {

  const allGroups = useAppSelector((state) => state.rpc.allGroups);
  const allLayers = useAppSelector((state) => state.rpc.allLayers);
  const suomenVaylatLayers = useAppSelector((state) => state.rpc.suomenVaylatLayers);
  const allThemes = useAppSelector((state) => state.rpc.allThemesWithLayers);
  useAppSelector((state) => state.language);

    return (
        <StyledLayerList>
          <Tabs>
            <LayerList label={strings.layerlist.layerlistLabels.allLayers} groups={allGroups} layers={allLayers} recurse={false} />
            <ThemeLayerList label={strings.layerlist.layerlistLabels.themeLayers} allLayers={allLayers} allThemes={allThemes}/>
            <SelectedLayers label={strings.layerlist.layerlistLabels.selectedLayers} layers={allLayers} suomenVaylatLayers={suomenVaylatLayers} />
          </Tabs>
        </StyledLayerList>
      );
};


export default LayerListTEMP;