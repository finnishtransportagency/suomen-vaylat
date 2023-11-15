import { useState, useEffect, useMemo } from "react";
import store from "../../../state/store";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { useAppSelector } from "../../../state/hooks";
import { motion } from "framer-motion";
import strings from "../../../translations";
import {
  setMapLayerVisibility,
  setTagLayers,
  setTags,
} from "../../../state/slices/rpcSlice";
import Filter from "./Filter";
import LayerList, { TagLayerList } from "./LayerList";
import LayerSearch from "./LayerSearch";
import ReactTooltip from "react-tooltip";
import { isMobile, theme } from "../../../theme/theme";
import {
  setIsCustomFilterOpen,
  setIsSavedLayer,
  setShowSavedLayers,
  setIsCheckmark,
  setShowCustomLayerList,
  setCheckedLayer,
  setSelectedCustomFilterLayers,
} from "../../../state/slices/uiSlice";
import Layer from "./Layer";
import { useSelector } from "react-redux";

const listVariants = {
  visible: {
    height: "auto",
    opacity: 1,
  },
  hidden: {
    height: 0,
    opacity: 0,
  },
};

const StyledRowContainer = styled.div`

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
  background-color: ${(props) =>
    props.isOpen ? "#004477" : props.theme.colors.mainColor1};
  cursor: pointer;
  font-size: 13px;
  color: #fff;
`;

const StyledFilterList = styled(motion.div)`
  height: ${(props) => (props.isOpen ? "auto" : 0)};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${(props) => props.theme.colors.mainColor1};
  background-color: ${(props) => props.theme.colors.mainWhite};
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
  color: ${(props) => props.theme.colors.mainWhite};
  background-color: ${(props) => props.theme.colors.mainColor1};
  margin: 16px 0px 16px 0px;
  border-radius: 15px;
  svg {
    font-size: 16px;
  }
  p {
    margin: 0;
    font-size: 12px;
    font-weight: bold;
  }
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
  background-color: ${(props) =>
    props.isSelected
      ? props.theme.colors.mainColor2
      : props.theme.colors.white};
  margin: 2px;
  border: 1px solid ${(props) => props.theme.colors.mainColor2};
  border-radius: 20px;
  font-size: 13px;
  transition: all 0.1s ease-out;
  &:hover {
    background-color: ${(props) => props.theme.colors.mainColor3};
  }
`;

const StyledFilterButton = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  border-radius: 1px;
  color: ${(props) =>
    props.isOpen ? "#004477" : props.theme.colors.mainColor1};
  margin: 4px 0px 1px 70px;
  cursor: pointer;
  svg {
    font-size: 18px;
    margin: 5px;
    top: 2px;
    position: relative;
    color: ${(props) => props.theme.colors.mainColor1};
  }
  span {
    white-space: nowrap;
    position: relative;
  }
`;

const StyledLayerList = styled.div`

`;

const SavedLayer = ({layers, groups}) => {
  const customLayers = localStorage.getItem("checkedLayers");
  const parsedLayers = JSON.parse(customLayers) || [];
  const parsedAllLayers = layers.filter(l => parsedLayers.filter(p => p.id === l.id).length > 0)

  const { tagLayers, tags } = useSelector((state) => state.rpc);
  
  if (parsedLayers.length > 0) {
    return (
      <>
            {tagLayers.length > 0 ?
                <StyledLayerList>
                    {
                        tags.map((tag, index) => {
                            return (
                                <TagLayerList
                                    tag={tag}
                                    layers={parsedAllLayers}
                                    index={index}
                                    groups={groups}
                                    key={'taglayerlist-' + tag + '-' + index}
                                />
                            );
                        })
                    }
                </StyledLayerList>
                :
                parsedAllLayers &&
                parsedAllLayers.map((layer) => (
                    <StyledRowContainer key={layer.id}>
                        <Layer layer={layer} />
                    </StyledRowContainer>
                ))
            }
        <StyledButtonContainer>
          <StyledSaveButton
            onClick={() => {
              store.dispatch(setIsCustomFilterOpen(true));
            }}
          >
            {strings.layerlist.customLayerInfo.editLayers}
          </StyledSaveButton>
        </StyledButtonContainer>
      </>
    );
  }

  return null;
};

const LayerListTEMP = ({ groups, layers, tags }) => {
  useAppSelector((state) => state.language);

  const { isSavedLayer, showSavedLayers } = useAppSelector((state) => state.ui);

  const [isOpen, setIsOpen] = useState(false);

  const selectedLayers = localStorage.getItem("checkedLayers");
  const parsedLayers = useMemo(() => {
    return selectedLayers ? JSON.parse(selectedLayers) : [];
  }, [selectedLayers]);

  const emptyFilters = () => {
    store.dispatch(setTagLayers([]));
    store.dispatch(setTags([]));
    store.dispatch(setCheckedLayer([]));
    store.dispatch(setShowSavedLayers(false));
    store.dispatch(setSelectedCustomFilterLayers([]));
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
      <StyledSearchAndFilter>
        <LayerSearch layers={layers} groups={groups} />
        <StyledFilterButton
          data-tip
          data-for="layerlist-filter"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          isOpen={isOpen}
        >
          <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown} />
          <span>{strings.layerlist.layerlistLabels.filterByType}</span>
        </StyledFilterButton>
      </StyledSearchAndFilter>
      <StyledFilterList
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        variants={listVariants}
        transition={{
          duration: 0.3,
          type: "tween",
        }}
      >
        <StyledFiltersContainer>
          <StyledCustomFilterButton
            isSelected={showSavedLayers}
            onClick={() => {
              if (parsedLayers && parsedLayers.length > 0) {
                store.dispatch(setShowSavedLayers(!showSavedLayers));
              } else {
                store.dispatch(setIsCustomFilterOpen(true));
                store.dispatch(setShowSavedLayers(false));
              }
            }}
          >
            {strings.layerlist.layerlistLabels.createCustomFilter}
          </StyledCustomFilterButton>
          {tags?.map((tag, index) => {
            return (
              <Filter isOpen={isOpen} key={"fiter-tag-" + index} filter={tag} />
            );
          })}
        </StyledFiltersContainer>
        <StyledDeleteAllSelectedFilters onClick={() => emptyFilters()}>
          <p>{strings.layerlist.layerlistLabels.clearFilters}</p>
        </StyledDeleteAllSelectedFilters>
      </StyledFilterList>

      {showSavedLayers && parsedLayers.length > 0 ? (
        <SavedLayer layers={layers} />
      ) : (
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
