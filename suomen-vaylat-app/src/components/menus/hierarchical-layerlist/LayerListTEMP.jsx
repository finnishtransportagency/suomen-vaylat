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
import { CustomLayerModal } from './CustomLayerModal';

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

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
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

const SavedLayer = (isSelected) => {
  const { isSavedLayer } = useAppSelector(state => state.ui)
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  
  const customLayers = localStorage.getItem("checkedLayers");
  const parsedLayers = JSON.parse(customLayers);

  const customFilterToggle = () => {
    if (isCustomOpen === true) {
      // Dispatch the action to store the selected layers in the Redux state
      const selectedLayers = parsedLayers || []; // If parsedLayers is null, set an empty array
      store.dispatch(setIsSavedLayer(selectedLayers));
      store.dispatch(setIsCustomFilterOpen(true));
    } else {
      console.error();
    }
  };
  if (isSavedLayer) {
    return (
      <div>
      <StyledButtonContainer>
        <StyledSaveButton onClick={() => {
            setIsCustomOpen(true);
            customFilterToggle();
          }}>
        {strings.layerlist.customLayerInfo.editLayers}
        </StyledSaveButton>
      </StyledButtonContainer>
        {parsedLayers && parsedLayers.map((layer) => (
          <Layer layer={layer} key={layer.id} isSelected={isSelected} />
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

  const [isOpen, setIsOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
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
    } else {
      console.error();
    }
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

      {isSavedLayer && <SavedLayer />}
     
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