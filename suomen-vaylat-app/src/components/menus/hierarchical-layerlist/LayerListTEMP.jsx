import { useState, useEffect } from 'react';
import store from '../../../state/store';
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
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
import { setIsCustomFilterOpen, setIsSavedLayer } from '../../../state/slices/uiSlice';
import Layer from './Layer';
import { Switch } from './Layer';
import { updateLayers } from '../../../utils/rpcUtil';
import { useSelector } from 'react-redux';

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

const StyledFilterList = styled(motion.div)`
    height: ${props => props.isOpen ? "auto" : 0};
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: ${props => props.theme.colors.mainColor1};
    background-color: ${props => props.theme.colors.mainWhite};
`;

const StyledListSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    color: ${props => props.theme.colors.mainColor1};
    padding: 0px 0px 16px 0px;
    font-size: 14px;
    svg {
      margin-left: 8px;
      font-size: 20px;
      transition: all 0.3s ease-out;
    };
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
    align-items: flex-start;
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 16px;
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
  width: 42px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  background-color: ${props => props.isOpen ? "#004477" : props.theme.colors.mainColor1};
  margin-right: 6px;
  margin-top: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #fff;
  svg {
    margin-right: 5px;
    font-size: 12px;
    color: ${props => props.theme.colors.mainWhite};
  };
`;

const StyledLayerGroups = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    //opacity: 0;
    background-color: ${props => props.theme.colors.mainWhite};
    margin: ${props => props.parentId === -1 && '10px 0px 10px 0px'};
    margin-bottom: 10px;
    border-radius: 2px;
    &:last-child {
        ${props => props.parentId === -1 ? '1px solid '+props.theme.colors.mainColor2 : 'none'};
    };
`;

const StyledSavedLayers = styled.div`
  margin-top: 20px;
`;

const StyledSavedLayersTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const StyledSavedLayersList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const StyledSavedLayerItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const StyledSavedLayerName = styled.span`
  margin-left: 10px;
`;

const StyledRemoveLayerButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: red;
  margin-left: 5px;
`;

const StyledSavedLayer = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  background-color: #f5f5f5;
  margin-bottom: 4px;
`;

const SavedLayer = (layer) => {
  const { isSavedLayer } = useAppSelector(state => state.ui)
  
  store.dispatch(setIsSavedLayer(isSavedLayer));
  const customLayers = localStorage.getItem("checkedLayers");
  const parsedLayers = JSON.parse(customLayers);

  if (isSavedLayer) {
    return (
      <div>
        {parsedLayers && parsedLayers.map((layer) => (
          <Layer layer={layer} key={layer.id} /> // Render a Layer component for each saved layer
        ))}
      </div>
    );
  }

  // Return null or an alternative component if isSavedLayer is false
  return null; 
};

const LayerListTEMP = ({
  groups,
  layers,
  tags,
  isChecked
}) => {
  useAppSelector((state) => state.language);

  const [isOpen, setIsOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [savedLayers, setSavedLayers] = useState([]);
  const { isSavedLayer } = useAppSelector((state) => state.ui);

  const selectedLayers = localStorage.getItem("checkedLayers");
  const parsedLayers = selectedLayers ? JSON.parse(selectedLayers) : [];

  const shouldShowSavedLayer = parsedLayers.length > 0;
  const shouldShowLayerList = !shouldShowSavedLayer;


  const emptyFilters = () => {
    store.dispatch(setTagLayers([]));
    store.dispatch(setTags([]));
  };

  const customFilterToggle = () => {
    if (isCustomOpen === true) {
      store.dispatch(setIsCustomFilterOpen(true));
      console.log("on true");
      setShowSaveButton(true);
      setShowCheckboxes(true);
    } else {
      console.error();
    }
  };

  const removeLayer = (layer) => {
    if (!layer || savedLayers.length === 0) {
      return; // Exit early if layer is undefined or savedLayers is empty
    }
  
    const updatedLayers = savedLayers.filter(
      (savedLayer) => savedLayer.id !== layer.id
    );
    setSavedLayers(updatedLayers);
  
    // Update localStorage with the updated saved layers
    localStorage.setItem("checkedLayers", JSON.stringify(updatedLayers));
  };


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
      <StyledListSubtitle>
        {strings.layerlist.layerlistLabels.filterOrSearchLayers}
      </StyledListSubtitle>
      <StyledSearchAndFilter>
        <StyledFilterButton
          data-tip
          data-for="layerlist-filter"
          onClick={() => setIsOpen(!isOpen)}
          isOpen={isOpen}
        >
          <FontAwesomeIcon icon={faFilter} />
        </StyledFilterButton>
        <LayerSearch layers={layers} />
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
        <StyledListSubtitle>
          {strings.layerlist.layerlistLabels.filterByType}
        </StyledListSubtitle>
        <StyledFiltersContainer>
        <StyledCustomFilterButton
          onClick={() => {
            setIsCustomOpen(true);
            customFilterToggle();
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

      {shouldShowSavedLayer && <SavedLayer />}
     
      {shouldShowLayerList && (
        <LayerList
          label={strings.layerlist.layerlistLabels.allLayers}
          groups={groups}
          layers={layers}
          recurse={false}
        />
      )}
    </>
  );
};


export default LayerListTEMP;