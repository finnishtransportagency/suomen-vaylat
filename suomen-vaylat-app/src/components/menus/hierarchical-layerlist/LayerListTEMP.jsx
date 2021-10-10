import { useContext } from 'react';
import { faTrash, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import { useParams } from 'react-router';
import styled, { keyframes } from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import { setSelectedLayerListType } from '../../../state/slices/uiSlice';
import strings from '../../../translations';
import SelectedLayers from '../../menus/selected-layers/SelectedLayers';
import Dropdown from './Dropdown';
import { setTagLayers, setTags } from '../../../state/slices/rpcSlice';
import Filter from './Filter';
import LayerList from './LayerList';
import LayerSearch from './LayerSearch';
import Tabs from "./Tabs";
import ThemeLayerList from './ThemeLayerList';


//VÄLIAIKAINEN PALIKKA VÄLITTÄMÄÄN TESTIDATAA HIERARKISELLE TASOVALIKOLLE

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const StyledLayerListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
        display: none;
  };
`;

const StyledLayerList = styled.div`
  justify-content: flex-start;
  background-color:  ${props => props.theme.colors.mainWhite};
`;

const StyledFilterList = styled.div`
    opacity: 0;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    animation-duration: 0.5s;
    animation-name: ${fadeIn};
    transition: all .3s ease-in-out;
    height: ${props => props.isOpen ? "100%" : 0};
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: ${props => props.theme.colors.maincolor1};
    background-color: ${props => props.theme.colors.mainWhite};
    padding: 0px 10px 15px 10px;
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
    cursor: pointer;
    width: 250px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.maincolor1};
    margin: 10px auto 20px auto;
    border-radius: 15px;
    svg {
        font-size: 16px;
    };
    p {
        padding-left: 10px;
        margin: 0;
        font-size: 15px;
    }
`;

const StyledSelectButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    border: none;
    background-color: transparent;
    svg {
        font-size: 1rem;
        transition: all 0.5s ease-out;
        color: ${props => props.theme.colors.black};
    };
`;

const StyledSearchAndFilter = styled.div`
    display: flex;
    align-items: center;
`;

const LayerListTEMP = ({
  groups,
  layers,
  themes,
  tags,
  selectedLayers,
  suomenVaylatLayers
}) => {

    const { store } = useContext(ReactReduxContext);

    useAppSelector((state) => state.language);

    const selectedTheme = useAppSelector((state) => state.ui.selectedTheme);

    const setLayerListType = (type) => {
      store.dispatch(setSelectedLayerListType(type));
    };

    const { layerlistType } = useParams();

    const [isOpen, setIsOpen] = useState(false);
  
    const emptyFilters = () => {
      store.dispatch(setTagLayers([]));
      store.dispatch(setTags([]));
    }

    return (
      <StyledLayerListContainer>
          <SelectedLayers
            label={strings.layerlist.layerlistLabels.selectedLayers.toUpperCase()}
            layers={layers}
            selectedLayers={selectedLayers}
            suomenVaylatLayers={suomenVaylatLayers}
          />
          <Dropdown title={strings.layerlist.layerlistLabels.searchForLayers.toUpperCase()} isOpen={selectedTheme !== null}>
            <StyledLayerList>
              <Tabs allTags={tags} layerlistType={layerlistType} setLayerListType={setLayerListType}>
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
                  <StyledSearchAndFilter>
                    <StyledSelectButton
                      onClick={() => setIsOpen(!isOpen)}
                    >
                        <FontAwesomeIcon
                            icon={faFilter}
                        />
                    </StyledSelectButton>
                    <LayerSearch layers={layers}/>
                  </StyledSearchAndFilter>
                  { isOpen &&
                    <StyledFilterList isOpen={isOpen}>
                      <StyledListSubtitle>
                        {strings.layerlist.layerlistLabels.filterByType}
                      </StyledListSubtitle>
                      <StyledFiltersContainer>
                        {tags.map((tag, index) => {
                          return(
                              <Filter isOpen={isOpen} key={index} index={index} filter={tag} />
                          );
                        })}
                      </StyledFiltersContainer>
                      <StyledDeleteAllSelectedFilters
                        onClick={() => emptyFilters()}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                        />
                        <p>{strings.layerlist.layerlistLabels.clearFilters}</p>
                      </StyledDeleteAllSelectedFilters>
                    </StyledFilterList>
                  }
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