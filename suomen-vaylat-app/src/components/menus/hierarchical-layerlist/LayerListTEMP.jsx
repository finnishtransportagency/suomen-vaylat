import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import SelectedLayers from '../selected-layers/SelectedLayers';
import LayerList from './LayerList';
import ThemeLayerList from './ThemeLayerList';
import Tabs from "./Tabs"; 

//VÄLIAIKAINEN PALIKKA VÄLITTÄMÄÄN TESTIDATAA HIERARKISELLE TASOVALIKOLLE

const StyledLayerList = styled.div`
  width: 330px;
  position: absolute;
  left: 0px;
  z-index: 10;
  height: calc(90%);
  overflow-y: auto;
  &::-webkit-scrollbar {
        display: none;
  };
  padding: 20px;
`;

const layerlistLabels = {
  "allLayers" : {
    "fi": "Kaikki tasot",
    "en": "All layers",
    "sv": "All layers"
  },
  "themeLayers" : {
    "fi": "Teema tasot",
    "en": "Theme layers",
    "sv": "Theme layers"
  },
  "selectedLayers" : {
    "fi": "Valitut tasot",
    "en": "Selected layers",
    "sv": "Selected layers"
  }
}


export const LayerListTEMP = () => {

  const allGroups = useAppSelector((state) => state.rpc.allGroups);
  const allLayers = useAppSelector((state) => state.rpc.allLayers);
  const allThemes = useAppSelector((state) => state.rpc.allThemesWithLayers);
  const language = useAppSelector((state) => state.language);
  const lang = language.current;

    return (
        <StyledLayerList>
          <Tabs>
            <LayerList label={layerlistLabels.allLayers[lang]} groups={allGroups} layers={allLayers} recurse={false} />
            <ThemeLayerList label={layerlistLabels.themeLayers[lang]} allLayers={allLayers} allThemes={allThemes}/>
            <SelectedLayers label={layerlistLabels.selectedLayers[lang]} layers={allLayers} />
          </Tabs> 
        </StyledLayerList>
      );
};


export default LayerListTEMP;