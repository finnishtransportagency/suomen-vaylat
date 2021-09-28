import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import LayerList from './LayerList';
import ThemeLayerList from './ThemeLayerList';
import Tabs from "./Tabs";
import strings from '../../../translations';
import Filter from './Filter';
import SelectedLayers from '../../menus/selected-layers/SelectedLayers';
import LayerSearch from './LayerSearch';
import Dropdown from './Dropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
//VÄLIAIKAINEN PALIKKA VÄLITTÄMÄÄN TESTIDATAA HIERARKISELLE TASOVALIKOLLE


const StyledLayerListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const StyledLayerList = styled.div`
  justify-content: flex-start;
  background-color:  ${props => props.theme.colors.mainWhite};
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

const StyledListSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    color: ${props => props.theme.colors.maincolor1};
    padding: 10px 0px 10px 5px;
    font-size: 15px;
`;

const StyledFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledDeleteAllSelectedFilters = styled.div`
    cursor: not-allowed;
    width: 250px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.colors.maincolor1};
    color: ${props => props.theme.colors.mainWhite};
    border-radius: 15px;
    margin: 10px auto 20px auto;
    svg {
        font-size: 16px;
    };
    p {
        padding-left: 10px;
        margin: 0;
        font-size: 15px;
    }
`;

const LayerListTEMP = ({groups, layers, themes, tags, selectedLayers, suomenVaylatLayers}) => {
  useAppSelector((state) => state.language);

    return (
      <StyledLayerListContainer>
          <SelectedLayers
            label={strings.layerlist.layerlistLabels.selectedLayers.toUpperCase()}
            layers={layers}
            selectedLayers={selectedLayers}
            suomenVaylatLayers={suomenVaylatLayers}
          />
          <Dropdown title={strings.layerlist.layerlistLabels.searchForLayers.toUpperCase()}>
            <StyledLayerList>
              <Tabs allTags={tags}>
                <div label={strings.layerlist.layerlistLabels.themeLayers}>
                <StyledListSubtitle>
                      {strings.layerlist.layerlistLabels.searchResults}
                </StyledListSubtitle>
                <ThemeLayerList
                  label={strings.layerlist.layerlistLabels.themeLayers}
                  allLayers={layers}
                  allThemes={themes}
                />
                </div>
                <div label={strings.layerlist.layerlistLabels.allLayers}>
                <LayerSearch layers={layers}/>
                  <StyledFilterList>
                    <StyledListSubtitle>
                      {strings.layerlist.layerlistLabels.filterByType}
                    </StyledListSubtitle>
                    <StyledFiltersContainer>
                      {tags.map((tag, index) => {
                        return(
                            <Filter key={index} filter={tag} />
                        );
                      })}
                    </StyledFiltersContainer>
                      <StyledDeleteAllSelectedFilters>
                        <FontAwesomeIcon
                                icon={faTrash}
                        />
                        <p>{strings.layerlist.layerlistLabels.clearFilters}</p>
                    </StyledDeleteAllSelectedFilters>
                  </StyledFilterList>
                  <StyledListSubtitle>
                      {strings.layerlist.layerlistLabels.searchResults}
                  </StyledListSubtitle>
                  <LayerList
                    label={strings.layerlist.layerlistLabels.allLayers}
                    groups={groups}
                    layers={layers}
                    recurse={false}
                  />
                </div>
              </Tabs>
            </StyledLayerList>
          </Dropdown>
      </StyledLayerListContainer>
      );
};


export default LayerListTEMP;