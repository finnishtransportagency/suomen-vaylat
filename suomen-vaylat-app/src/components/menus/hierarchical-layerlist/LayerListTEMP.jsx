import { useState } from 'react';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import { motion } from "framer-motion";
import strings from '../../../translations';
import { setTagLayers, setTags } from '../../../state/slices/rpcSlice';
import Filter from './Filter';
import LayerList from './LayerList';
import LayerSearch from './LayerSearch';
import ReactTooltip from 'react-tooltip';
import { isMobile, theme } from '../../../theme/theme';
import store from '../../../state/store';

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
    //height: ${props => props.isOpen ? "auto" : 0};
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
    align-items: column;
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 16px;
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
  margin-right: 4px;
  margin-top: 4px;
  cursor: pointer;
  svg {
    font-size: 16px;
    margin: 10px;
    position: relative;
    top: 2px;
    color: ${props => props.theme.colors.mainColor1};
  };
`;

const LayerListTEMP = ({
  groups,
  layers,
  tags
}) => {

    useAppSelector((state) => state.language);

    const [isOpen, setIsOpen] = useState(false);

    const emptyFilters = () => {
      store.dispatch(setTagLayers([]));
      store.dispatch(setTags([]));
    };

    return (
      <>
      <ReactTooltip backgroundColor={theme.colors.mainColor1} disable={isMobile} id='layerlist-filter' place="right" type="dark" effect="float">
          <span>{strings.tooltips.layerlist.filter}</span>
      </ReactTooltip>
       <StyledListSubtitle>{strings.layerlist.layerlistLabels.filterOrSearchLayers}</StyledListSubtitle>
       <StyledSearchAndFilter>
          <LayerSearch layers={layers}/>
          <StyledFilterButton
            data-tip data-for='layerlist-filter'
            onClick={() =>{ 
              console.log("Button clicked");
            setIsOpen(!isOpen)}}
            isOpen={isOpen}
          >
          <FontAwesomeIcon
            icon={isOpen ? faAngleUp : faAngleDown}
          />
            {strings.layerlist.layerlistLabels.filterByType}
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
          <StyledListSubtitle>
            {strings.layerlist.layerlistLabels.filterByType}
          </StyledListSubtitle>
          <StyledFiltersContainer>
            {tags?.map((tag, index) => {
              return(
                  <Filter isOpen={isOpen} key={'fiter-tag-'+index} filter={tag} />
              );
            })}
          </StyledFiltersContainer>
          <StyledDeleteAllSelectedFilters
            onClick={() => emptyFilters()}
          >
            <p>{strings.layerlist.layerlistLabels.clearFilters}</p>
          </StyledDeleteAllSelectedFilters>
        </StyledFilterList>
        <LayerList
          label={strings.layerlist.layerlistLabels.allLayers}
          groups={groups}
          layers={layers}
          recurse={false}
        />
      </>
    );
};


export default LayerListTEMP;