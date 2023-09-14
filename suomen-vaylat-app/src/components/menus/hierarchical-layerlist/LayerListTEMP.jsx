import { useState, useEffect, useMemo } from 'react';
import store from '../../../state/store';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import { motion } from "framer-motion";
import strings from '../../../translations';
import { setMapLayerVisibility, setTagLayers, setTags } from '../../../state/slices/rpcSlice';
import Filter from './Filter';
import LayerList from './LayerList';
import LayerSearch from './LayerSearch';
import ReactTooltip from 'react-tooltip';
import { isMobile, theme } from '../../../theme/theme';
import { setIsCustomFilterOpen, setIsSavedLayer, setShowSavedLayers, setIsCheckmark, setShowCustomLayerList, setUpdateCustomLayers, setCheckedLayer } from '../../../state/slices/uiSlice';
import Layer from './Layer';
import { Switch } from './Layer';
import { useSelector } from 'react-redux';
import { updateLayers } from '../../../utils/rpcUtil';

const listVariants = {
  visible: {
      height: "auto",
      opacity: 1
  },
  hidden: {
      height: 0,
      opacity: 0
  },
};

const StyledRowContainer = styled.div`
  display: flex;
  align-items: center; // Align items vertically in the center
  justify-content: space-between; // Distribute space between items evenly
`;

const StyledSwitchContainer = styled.div`
    position: relative;
    width: 32px; // add a specific width
    height: 16px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    background-color: ${props => props.checked ? "#8DCB6D" : "#AAAAAA"};
    cursor: pointer;
    margin-right: 16px;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px;
  align-items: center;
  margin-top: 20px;
  gap: 30px;
`;

const StyledSaveButton = styled.div`
  width: 78px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  background-color: ${props => props.isOpen ? "#004477" : props.theme.colors.mainColor1};
  cursor: pointer;
  font-size: 13px;
  color: #fff;
`;

const StyledFilterList = styled(motion.div)`
    height: ${props => props.isOpen ? "auto" : 0};
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: ${props => props.theme.colors.mainColor1};
    background-color: ${props => props.theme.colors.mainWhite};
`;

const StyledFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledDeleteAllSelectedFilters = styled.div`
    cursor: pointer;
    max-width: 184px;
    min-height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.mainColor1};
    margin: 16px 0px 16px 0px;
    border-radius: 15px;
    svg {
        font-size: 16px;
    };
    p {
        margin: 0;
        font-size: 12px;
        font-weight: bold;
    };
`;

const StyledSearchAndFilter = styled.div`
    display: flex;
    flex-direction: column;
    margin: 5px 8px 8px 16px;
`;

const StyledCustomFilterButton = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: center;
    cursor: pointer;
    padding: 0px 6px 0px 6px;
    background-color: ${props => props.isSelected ? props.theme.colors.mainColor2 : props.theme.colors.white};
    margin: 2px;
    border: 1px solid ${props => props.theme.colors.mainColor2};
    border-radius: 20px;
    font-size: 13px;
    transition: all 0.1s ease-out;
    &:hover{
        background-color: ${props => props.theme.colors.mainColor3};
    };
`;

const StyledFilterButton = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  border-radius: 1px;
  color: ${props => props.isOpen ? "#004477" : props.theme.colors.mainColor1};
  margin: 4px 0px 1px 70px;
  cursor: pointer;
  svg {
    font-size: 18px;
    margin: 5px;
    top: 2px;
    position: relative;
    color: ${props => props.theme.colors.mainColor1};
  };
  span {
    white-space: nowrap;
    position: relative;
  }
`;

const SavedLayer = ({isSelected, action, layer}) => {
  const { isSavedLayer, triggerUpdate } = useAppSelector(state => state.ui);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [savedLayers, setSavedLayers] = useState([]);
  const { channel } = useSelector(state => state.rpc);
  const [selectedLayers, setSelectedLayers] = useState({});

  const customLayers = localStorage.getItem("checkedLayers");
  const parsedLayers = JSON.parse(customLayers);

      const handleLayerVisibility = (channel, layer) => {
      store.dispatch(setMapLayerVisibility(layer));
      updateLayers(store, channel);
  };

    // Load saved layers from local storage when component mounts
    useEffect(() => {
      const handleStorageChange = () => {
        const loadedLayers = localStorage.getItem("checkedLayers");
        if (loadedLayers) {
          const layersWithVisibility = JSON.parse(loadedLayers).map(layer => ({ ...layer, visible: true }));
          setSavedLayers(layersWithVisibility);
          localStorage.setItem("checkedLayers", JSON.stringify(layersWithVisibility));
    
          // Call MapLayerVisibilityRequest for each layer
          layersWithVisibility.forEach(layer => {
            try {
              channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, true]);
            } catch (error) {
              console.error('Error posting MapLayerVisibilityRequest:', error);
            }
          });
        }
      };
    
      // Listen to storage event across tabs
      window.addEventListener('storage', handleStorageChange);
    
      // Initial load
      handleStorageChange();
    
      // Cleanup
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }, [triggerUpdate]);
  
    const toggleLayerVisibility = (id) => {

      const newLayers = savedLayers.map(layer => 
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      );

      setSavedLayers(newLayers);

      localStorage.setItem("checkedLayers", JSON.stringify(newLayers));

      // Call MapLayerVisibilityRequest for the modified layer
      const modifiedLayer = newLayers.find(layer => layer.id === id);
      try {
        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [id, modifiedLayer.visible]);
      } catch (error) {
        console.error('Error posting MapLayerVisibilityRequest:', error);
      }
    };
  
  if (isSavedLayer === true) {
    return (
      <div>
        <StyledButtonContainer>
          <StyledSaveButton onClick={() => {
            setIsCustomOpen(true);
            const selectedLayers = parsedLayers || [];
            store.dispatch(setIsSavedLayer(selectedLayers));
            store.dispatch(setIsCustomFilterOpen(true));
            store.dispatch(setIsCheckmark(true));
          }}>
            {strings.layerlist.customLayerInfo.editLayers}
          </StyledSaveButton>
        </StyledButtonContainer>
        {parsedLayers && parsedLayers.map((layer) => (
          <StyledRowContainer key={layer.id}>
            <Layer layer={layer} isSelected={isSelected} />
            <StyledSwitchContainer isSelected={selectedLayers[layer.id]} onClick={action}>
            <Switch action={() => {
              toggleLayerVisibility(layer.id);
              handleLayerVisibility(channel, layer);
            }} isSelected={layer.visible} />
            </StyledSwitchContainer>
          </StyledRowContainer>
        ))}
      </div>
    );
  }

  return null; 
};

const LayerListTEMP = ({
  groups,
  layers,
  tags
}) => {
  useAppSelector((state) => state.language);

  const {isSavedLayer, showSavedLayers} = useAppSelector((state) => state.ui);

  const [isOpen, setIsOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const selectedLayers = localStorage.getItem("checkedLayers");
  const parsedLayers = useMemo(() => {
      return selectedLayers ? JSON.parse(selectedLayers) : [];
  }, [selectedLayers]);
  
  // const shouldShowSavedLayer = parsedLayers.length > 0;
  const emptyFilters = () => {
    store.dispatch(setTagLayers([]));
    store.dispatch(setTags([]));
    localStorage.removeItem("checkedLayers");
    store.dispatch(setIsSavedLayer(false));
    store.dispatch(setShowCustomLayerList(false));
    store.dispatch(setUpdateCustomLayers(false));
    store.dispatch(setCheckedLayer([]));
  };
/*
  // Re-renders layers saved to local storage if page is refreshed
  useEffect(() => {
    const selectedLayers = localStorage.getItem("checkedLayers");
    const parsedLayers = selectedLayers ? JSON.parse(selectedLayers) : [];
    if (parsedLayers.length > 0) {
      store.dispatch(setIsSavedLayer(true));
    }
  }, []);
*/
  return (
    <>
      <ReactTooltip
        backgroundColor={theme.colors.mainColor1}
        disable={isMobile}
        id="layerlist-filter"
        place="right"
        type="dark"
        effect="float"
      >
        <span>{strings.tooltips.layerlist.filter}</span>
      </ReactTooltip>
      <StyledSearchAndFilter>
        <LayerSearch layers={layers} groups={groups} />
        <StyledFilterButton
              data-tip 
              data-for='layerlist-filter'
              onClick={() =>{ 
              setIsOpen(!isOpen)}}
              isOpen={isOpen}
            >
            <FontAwesomeIcon
              icon={isOpen ? faAngleUp : faAngleDown}
            />
              <span>{strings.layerlist.layerlistLabels.filterByType}</span>
        </StyledFilterButton>
      </StyledSearchAndFilter>
      <StyledFilterList
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        variants={listVariants}
        transition={{
          duration: 0.3,
          type: "tween"
        }}
      >
        <StyledFiltersContainer>
        <StyledCustomFilterButton
        isSelected={showSavedLayers && parsedLayers.length > 0}
          onClick={() => {
              if (parsedLayers && parsedLayers.length > 0) {
                  store.dispatch(setShowSavedLayers(!showSavedLayers));
              } else {
                  setIsCustomOpen(true);
                  store.dispatch(setIsSavedLayer(parsedLayers));
                  store.dispatch(setIsCustomFilterOpen(true));
              }
          }}
        >
          {strings.layerlist.layerlistLabels.createCustomFilter}
        </StyledCustomFilterButton>
          {tags?.map((tag, index) => {
            return <Filter isOpen={isOpen} key={"fiter-tag-" + index} filter={tag} />;
          })}
        </StyledFiltersContainer>
        <StyledDeleteAllSelectedFilters onClick={() => emptyFilters()}>
          <p>{strings.layerlist.layerlistLabels.clearFilters}</p>
        </StyledDeleteAllSelectedFilters>
      </StyledFilterList>

      {
  showSavedLayers && isSavedLayer ? (
    <SavedLayer />
  ) : (
    <LayerList
      label={strings.layerlist.layerlistLabels.allLayers}
      groups={groups}
      layers={layers}
      recurse={false}
    />
  )
}
    </>
  );
};


export default LayerListTEMP;