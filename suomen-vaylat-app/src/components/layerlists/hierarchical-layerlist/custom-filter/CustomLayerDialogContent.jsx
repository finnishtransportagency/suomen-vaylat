import { useEffect } from "react";
import { useAppSelector } from "../../../../state/hooks";
import strings from "../../../../translations";
import styled from "styled-components";
import FilterLayerGroup from "./FilterLayerGroup";
import store from "../../../../state/store";
import {
  incrementTriggerUpdate,
  setIsCustomFilterOpen,
  setUpdateCustomLayers,
  setCheckedLayer,
  setShowSavedLayers,
  setSelectedCustomFilterLayers,
} from "../../../../state/slices/uiSlice";

const StyledDialogContainer = styled.div`
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
  margin: 1em;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const StyledSaveButton = styled.div`
  height: 2.5em;
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 1em;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  background-color: ${(props) =>
    props.isDisabled ? props.theme.colors.darkGrey : props.theme.colors.mainColor1};
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
  font-size: 14px;
  color:  ${(props) => props.theme.colors.mainWhite};
  font-weight: 500;
`;

const StyledRemoveButton = styled.div`
  height: 2.5em;
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 1em;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
  font-size: 14px;
  border-style: solid;
  color:  ${(props) => (props.isDisabled ? props.theme.colors.mainWhite : props.theme.colors.mainColor1)};
  background-color: ${(props) =>
    props.isDisabled ? props.theme.colors.darkGrey : props.theme.colors.mainWhite};
  font-weight: 500;
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

// Layer list that renders in CustomLayerDialog
// Checkbox logic and rendering is done in Layer.jsx

export const CustomLayerList = ({ groups, layers, recurse = false }) => {
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
            <StyledLayerGroupWrapper key={'group-sl-' + group.id}>
              {isVisible ? (
                <FilterLayerGroup
                  key={'layer-group-' + group.id}
                  group={group}
                  layers={layers}
                  hasChildren={hasChildren}
                />
              ) : null}
            </StyledLayerGroupWrapper>
          );
        })}
      </StyledLayerList>
    </>
  );
};

// Renders custom filter guide for user and CustomLayerList
const CustomLayerDialogContent = () => {
  useAppSelector((state) => state.language);

  const { allGroups, allLayers } = useAppSelector((state) => state.rpc);
  const { updateCustomLayer, selectedCustomFilterLayers } = useAppSelector((state) => state.ui);

  const checkedLayers = localStorage.getItem('checkedLayers')
  const checkedLayersJson = checkedLayers !== null ? JSON.parse(checkedLayers) : [];

  const dialogContent = [
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
    if (checkedLayersJson !== null && checkedLayersJson.length > 0 && selectedCustomFilterLayers.length === 0) {
      checkedLayers && store.dispatch(
        setSelectedCustomFilterLayers(checkedLayersJson)
      );
    }
  }, []);

  useEffect(() => {
    const selectedIds = selectedCustomFilterLayers.map(layer => layer.id).sort() || [];
    const checkedIds = checkedLayersJson.map(layer => layer.id).sort() || [];
    const matchingArrays = (selectedIds.length === checkedIds.length) && selectedIds.every((id, index) => id === checkedIds[index]);

    if (checkedLayersJson !== null && selectedIds.length > 0 && !matchingArrays) {
      store.dispatch(setUpdateCustomLayers(true));
    } else if (checkedLayersJson === null && selectedCustomFilterLayers.length > 0) {
      store.dispatch(setUpdateCustomLayers(true));
    } else {
      store.dispatch(setUpdateCustomLayers(false));
    }
  }, [selectedCustomFilterLayers, updateCustomLayer]);


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
    <StyledDialogContainer>
      {dialogContent.map((content) => (
        <div key={content.content}>
          <div>{content.content}</div>

          <StyledButtonContainer>
            <StyledRemoveButton onClick={removeLayers} isDisabled={selectedCustomFilterLayers.length === 0}>
              {strings.layerlist.customLayerInfo.removeLayers}
            </StyledRemoveButton>
            <StyledSaveButton
              onClick={() => {
                saveLayers();
              }}
              isDisabled={!updateCustomLayer}
            >
              {strings.layerlist.layerlistLabels.saveCustomFilter}
            </StyledSaveButton>
          </StyledButtonContainer>

          <div>{content.layerlist}</div>
        </div>
      ))}
    </StyledDialogContainer>
  );
};

export default CustomLayerDialogContent