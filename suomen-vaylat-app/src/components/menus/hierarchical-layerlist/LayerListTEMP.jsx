import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import LayerList from './LayerList';
import ThemeLayerList from './ThemeLayerList';
import Tabs from "./Tabs";
import strings from '../../../translations';
import Filter from './Filter';
import SelectedLayers from '../../menus/selected-layers/SelectedLayers';
//VÄLIAIKAINEN PALIKKA VÄLITTÄMÄÄN TESTIDATAA HIERARKISELLE TASOVALIKOLLE

const StyledLayerList = styled.div`
  overflow-y: auto;
  width: 100%;
  height: calc(var(--app-height) - 70px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  &::-webkit-scrollbar {
        display: none;
  };
`;


const StyledFilterList = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0px 10px 15px 10px;
    background-color: ${props => props.theme.colors.mainWhite};
    color: ${props => props.theme.colors.maincolor1};
`;

const StyledFilterListHeader = styled.div`
    display: flex;
    justify-content: flex-start;
    color: ${props => props.theme.colors.maincolor1};
    padding: 10px 0px 10px 5px;
    font-size: 12px;
`;

const StyledFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledFiltersMasterSelectors = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
`;

const StyledFiltersMasterSelector = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.maincolor1};
  color: ${props => props.theme.colors.mainWhite};
  height: 30px;
  border-radius: 15px;
  &:hover {
    background-color: ${props => props.theme.colors.maincolor2};
  }
`;

const StyledFiltersMasterSelectorText = styled.p`
  font-size: 15px;
  margin: 0px;
  padding: 0px 10px 0px 10px;
`;

const LayerListTEMP = ({groups, layers, themes, tags, selectedLayers, suomenVaylatLayers}) => {
  useAppSelector((state) => state.language);

    return (
      <StyledLayerList>
      <SelectedLayers label={strings.layerlist.layerlistLabels.selectedLayers} layers={layers} selectedLayers={selectedLayers} suomenVaylatLayers={suomenVaylatLayers}/>
        <Tabs allTags={tags}>
          <ThemeLayerList
            label={strings.layerlist.layerlistLabels.themeLayers}
            allLayers={layers}
            allThemes={themes}
          />
          <div label={strings.layerlist.layerlistLabels.allLayers}>
            <StyledFilterList>
              <StyledFilterListHeader>
                {strings.layerlist.layerlistLabels.layerFilters.toUpperCase()}
              </StyledFilterListHeader>
              <StyledFiltersContainer>
                {tags.map((tag, index) => {
                  return(
                      <Filter key={index} filter={tag} />
                  );
                })}
              </StyledFiltersContainer>
              <StyledFiltersMasterSelectors>
                <StyledFiltersMasterSelector>
                  <StyledFiltersMasterSelectorText>
                    {strings.layerlist.layerlistLabels.selectAll}
                  </StyledFiltersMasterSelectorText>
                </StyledFiltersMasterSelector>
                <StyledFiltersMasterSelector>
                  <StyledFiltersMasterSelectorText>
                  {strings.layerlist.layerlistLabels.deselectAll}
                  </StyledFiltersMasterSelectorText>
                </StyledFiltersMasterSelector>
              </StyledFiltersMasterSelectors>
            </StyledFilterList>
            <LayerList
              label={strings.layerlist.layerlistLabels.allLayers}
              groups={groups}
              layers={layers}
              recurse={false}
            />
          </div>
        </Tabs>
      </StyledLayerList>
      );
};


export default LayerListTEMP;