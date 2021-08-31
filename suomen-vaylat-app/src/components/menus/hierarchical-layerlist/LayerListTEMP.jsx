import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import LayerList from './LayerList';
import ThemeLayerList from './ThemeLayerList';
import Tabs from "./Tabs";
import strings from '../../../translations';
import SelectedLayers from '../../menus/selected-layers/SelectedLayers';
//VÄLIAIKAINEN PALIKKA VÄLITTÄMÄÄN TESTIDATAA HIERARKISELLE TASOVALIKOLLE

const StyledLayerList = styled.div`
  position: absolute;
  left: 0px;
  overflow-y: auto;
  width: 100%;
  height: calc(var(--app-height) - 120px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  &::-webkit-scrollbar {
        display: none;
  };
`;

export const LayerListTEMP = ({groups, layers, themes, tags, selectedLayers}) => {
  useAppSelector((state) => state.language);

    return (
      <>
      <StyledLayerList>
      <SelectedLayers label={strings.layerlist.layerlistLabels.selectedLayers} layers={layers} selectedLayers={selectedLayers} />
          <Tabs allTags={tags}>
            <ThemeLayerList
              label={strings.layerlist.layerlistLabels.themeLayers}
              allLayers={layers}
              allThemes={themes}
            />
            <LayerList
              label={strings.layerlist.layerlistLabels.allLayers}
              groups={groups}
              layers={layers}
              recurse={false}
            />
          </Tabs>
        </StyledLayerList>
        </>
      );
};


export default LayerListTEMP;