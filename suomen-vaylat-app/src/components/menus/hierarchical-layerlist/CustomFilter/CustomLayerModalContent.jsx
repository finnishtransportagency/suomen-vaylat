import { useState, useEffect } from "react";
import { useAppSelector } from "../../../../state/hooks";
import strings from "../../../../translations";
import styled from "styled-components";
import FilterLayerGroup from "./FilterLayerGroup";
import store from "../../../../state/store";
import {
  setIsSavedLayer,
  incrementTriggerUpdate,
  setIsCustomFilterOpen,
  setShowCustomLayerList,
  setUpdateCustomLayers,
  setCheckedLayer,
  setShowSavedLayers,
  setSelectedCustomFilterLayers,
} from "../../../../state/slices/uiSlice";
import { theme, isMobile } from "../../../../theme/theme";
import ReactTooltip from "react-tooltip";

const StyledModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StyledGuideContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  margin-right: 35px;
  flex-direction: column;
  align-items: flex-end;
  gap: 25px;
`;

const StyledSaveButton = styled.div`
  width: 78px;
  height: 32px;
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  background-color: ${(props) =>
    props.isDisabled ? "#DDDDDD" : props.theme.colors.mainColor1};
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
  font-size: 13px;
  color: #fff;
`;

const StyledRemoveButton = styled.div`
  width: 78px;
  height: 15px;
  white-space: nowrap;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  cursor: pointer;
  font-size: 15px;
  color: ${(props) =>
    props.isOpen ? "#004477" : props.theme.colors.mainColor1};
`;

const StyledLayerList = styled.div`
  max-height: 520px;
  padding: 0 5px 15px 5px;
  margin: 0 5px 10px 5px;
  overflow: auto;

  @media (max-width: 1024px) {
    // For devices larger than 480px but not desktop
    padding: 5px 10px 5px 10px;
    height: 450px;
  }

  @media (max-width: 350px) {
    padding: 5px 10px 55px 10px;
    height: 450px;
  }
`;

const StyledLayerGroupWrapper = styled.div``;

// Layer list that renders in CustomLayerModal
// Checkbox logic and rendering is done in Layer.jsx

export const CustomLayerList = ({ groups, layers, recurse = false }) => {
  const [savedLayers, setSavedLayers] = useState([]);

  // const slicedGroups = groups ? groups.slice() : [];
  const slicedGroups = groups.slice();

  const currentLang = strings.getLanguage();

  const sortedGroups =
    slicedGroups.length > 0
      ? slicedGroups.sort(function (a, b) {
          const aName =
            a.locale[currentLang] && a.locale[currentLang].name
              ? a.locale[currentLang].name
              : null;
          const bName =
            b.locale[currentLang] && b.locale[currentLang].name
              ? b.locale[currentLang].name
              : null;

          // b.id 727 is Tierekisteri (Poistuva) and should be the lowest element on the list
          if (b.id === 727) {
            return -1;
          }
          // a.id 727 is Tierekisteri (Poistuva) only on Firefox
          else if (a.id === 727) {
            return 1;
          } else if (aName && bName) {
            return aName.toLowerCase().localeCompare(bName.toLowerCase());
          } else {
            return 0;
          }
        })
      : [];

  return (
    <>
      <StyledLayerList>
        {sortedGroups.map((group) => {
          const recursiveCheckSubGroupLayers = (group) => {
            var hasChildrenLayers = false;
            if (group.layers && group.layers.length) {
              hasChildrenLayers = true;
            } else if (group.groups && group.groups.length > 0) {
              group.groups.forEach((subgroup) => {
                const hasLayers = recursiveCheckSubGroupLayers(subgroup);
                if (hasLayers === true) {
                  hasChildrenLayers = true;
                }
              });
            }
            return hasChildrenLayers;
          };

          var hasChildren = recursiveCheckSubGroupLayers(group);
          let isVisible =
            (group.layers && group.layers.length > 0) || hasChildren;
          return (
            group.id !== 826 && (
              <StyledLayerGroupWrapper key={"group-sl-" + group.id}>
                {isVisible ? (
                  <FilterLayerGroup
                    key={"layer-group-" + group.id}
                    group={group}
                    layers={layers}
                    hasChildren={hasChildren}
                  />
                ) : null}
              </StyledLayerGroupWrapper>
            )
          );
        })}
      </StyledLayerList>
    </>
  );
};

// Renders custom filter guide for user and CustomLayerList
export const CustomLayerModalContent = ({
  tooltipBackgroundColor = theme.colors.mainColor1,
  tooltipColor = theme.colors.mainWhite,
  isChecked,
}) => {
  useAppSelector((state) => state.language);

  const { allGroups, allLayers } = useAppSelector((state) => state.rpc);

  const { updateCustomLayer, selectedCustomFilterLayers } = useAppSelector((state) => state.ui);
  const modalContent = [
    {
      titleColor: "mainColor1",
      content: (
        <StyledGuideContent>
          {strings.layerlist.customLayerInfo.infoContent}
        </StyledGuideContent>
      ),
      layerlist: (
        <CustomLayerList
          label={strings.layerlist.layerlistLabels.allLayers}
          groups={allGroups}
          layers={allLayers}
          recurse={false}
        />
      ),
    },
  ];

  

  useEffect(() => {
    const checkedLayers = localStorage.getItem('checkedLayers')

    if (checkedLayers) {
      const checkedLayersJson = JSON.parse(checkedLayers);
      checkedLayersJson.length !== selectedCustomFilterLayers.length && store.dispatch(setUpdateCustomLayers(true));
    } else if (selectedCustomFilterLayers.length > 0) {
      store.dispatch(setUpdateCustomLayers(true));
    } else {
      store.dispatch(setUpdateCustomLayers(false));
    }
  }, [selectedCustomFilterLayers]);


  const saveLayers = () => {
    if (!updateCustomLayer) return;
    store.dispatch(incrementTriggerUpdate());
    store.dispatch(setIsCustomFilterOpen(false));
    if (selectedCustomFilterLayers.length > 0) {
      localStorage.setItem("checkedLayers", JSON.stringify(selectedCustomFilterLayers));
      store.dispatch(setShowSavedLayers(true));
    } else {
      localStorage.removeItem("checkedLayers");
      store.dispatch(setShowSavedLayers(false));
    }
  };

  const removeLayers = () => {
    localStorage.removeItem("checkedLayers");
    store.dispatch(setCheckedLayer([]));
    store.dispatch(setSelectedCustomFilterLayers([]));
  };

  return (
    <StyledModalContainer>
      <ReactTooltip
        id={"save-button-tooltip"}
        backgroundColor={tooltipBackgroundColor}
        textColor={tooltipColor}
        place="bottom"
        type="dark"
        effect="float"
        disable={!updateCustomLayer}
      >
        <span>{strings.layerlist.customLayerInfo.saveTooltip}</span>
      </ReactTooltip>
      {modalContent.map((content) => (
        <div key={content.content}>
          <div>{content.content}</div>

          <StyledButtonContainer>
            <StyledSaveButton
              onClick={() => {
                saveLayers();
              }}
              data-tip={strings.layerlist.customLayerInfo.saveTooltip}
              data-for="save-button-tooltip"
              isDisabled={!updateCustomLayer}
            >
              {strings.layerlist.layerlistLabels.saveCustomFilter}
            </StyledSaveButton>
            <StyledRemoveButton onClick={removeLayers} checked={!isChecked}>
              {strings.layerlist.customLayerInfo.removeLayers}
            </StyledRemoveButton>
          </StyledButtonContainer>

          <div>{content.layerlist}</div>
        </div>
      ))}
    </StyledModalContainer>
  );
};
