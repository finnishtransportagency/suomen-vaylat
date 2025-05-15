import { useContext, useEffect, useState } from "react";
import { ReactReduxContext, useSelector } from "react-redux";
import styled from "styled-components";
import {
  changeLayerStyle,
  getLegends,
  setLegends,
} from "../../../../state/slices/rpcSlice";
import {
  setSelectedCustomFilterLayers,
} from "../../../../state/slices/uiSlice";
import LayerMetadataButton from "../LayerMetadataButton";
import { useAppSelector } from "../../../../state/hooks";
import { toast, Slide } from "react-toastify";
import strings from "../../../../translations"
import LayerlistSwitch from "../LayerlistSwitch";

const StyledLayerContainer = styled.div`
  background-color: ${(props) => props.themeStyle && "#F5F5F5"};
  overflow: hidden;
  min-height: 32px;
  display: flex;
  align-items: center;
  margin-top: ${(props) => props.themeStyle && "8px"};
  border-radius: 4px;
  margin-bottom: 4px;
`;

const StyledlayerHeader = styled.div`
  margin-right: 0.5em;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const StyledLayerName = styled.p`
  word-break: break-word;
  user-select: none;
  color: ${(props) =>
    props.themeStyle
      ? props.theme.colors.secondaryColorGreen
      : props.theme.colors.mainColor1};
  margin: 0px;
  font-size: 14px;
  padding-left: 8px;
`;

export const findGroupForLayer = (groups, layerId) => {
  for (let group of groups) {
    if (group.layers && group.layers.includes(layerId)) {
      return group;
    }
    if (group.groups) {
      const nestedGroup = findGroupForLayer(group.groups, layerId);
      if (nestedGroup) return nestedGroup;
    }
  }
  return null;
};

export const FilterLayer = ({ layer, theme, groupName }) => {
  const { store } = useContext(ReactReduxContext);
  const [layerStyle, setLayerStyle] = useState(null);
  const { selectedCustomFilterLayers } = useAppSelector(
    (state) => state.ui
  );

  const { channel, selectedTheme } = useSelector((state) => state.rpc);

  const excludeGroups = ["Digiroad", "Tierekisteri (Poistuva)"];

  const handleLayerSelect = (layer) => {
      // lisää valitut tasot väliaikaiseen arrayhyn
      if (
        selectedCustomFilterLayers.filter(
          (selectedLayer) => selectedLayer.id === layer.id
        ).length > 0
      ) {
        const filteredLayers = selectedCustomFilterLayers.filter(
          (filterLayer) => filterLayer.id !== layer.id
        );
        store.dispatch(setSelectedCustomFilterLayers(filteredLayers));
      } else {
        store.dispatch(
          setSelectedCustomFilterLayers([...selectedCustomFilterLayers, layer])
        );
      }
  };

  const updateLayerLegends = () => {
    // need use global window variable to limit legend updates
    clearTimeout(window.legendUpdateTimer);
    window.legendUpdateTimer = setTimeout(function () {
      store.dispatch(
        getLegends({
          handler: (data) => {
            store.dispatch(setLegends(data));
          },
        })
      );
    }, 1000);
  };

  const themeStyle = theme || null;


  useEffect(() => {
    // needs only get new style or legends when toggling theme selection
    if (layer.visible && selectedTheme && selectedTheme.layers.includes(layer.id)) {
      const themeName = selectedTheme.locale?.["fi"]?.name || null;
      channel.getLayerThemeStyle(
        [
          layer.id,
          themeName,
        ],
        function (styleName) {
          if (styleName && styleName !== layerStyle) {
            setLayerStyle(styleName);
            store.dispatch(
              changeLayerStyle({ layerId: layer.id, style: styleName })
            );
            // update layers legends
            updateLayerLegends();
          }
        },
        function (error) {
          toast.error(strings.themelayerlist.errors.themeStyleError + error, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "colored",
            transition: Slide
          });
        }
      );  
    }
  }, [selectedTheme])  

  const isSelected =
    selectedCustomFilterLayers.filter(
      (selectedLayer) => selectedLayer.id === layer.id
    ).length > 0;

  return (
    <StyledLayerContainer
      themeStyle={themeStyle}
      className={`list-layer ${layer.visible && "list-layer-active"}`}
      key={"layer" + layer.id + "_" + theme}
    >
      <StyledlayerHeader>
        <StyledLayerName themeStyle={themeStyle}>
          {layer.name}{" "}
          {groupName &&
            groupName !== "Unknown" &&
            !excludeGroups.includes(groupName) &&
            ` (${groupName})`}
        </StyledLayerName>
      </StyledlayerHeader>
      {layer.metadataIdentifier && <LayerMetadataButton layer={layer} />}
        <LayerlistSwitch
          action={() => handleLayerSelect(layer)}
          isSelected={isSelected}
          layer={layer}
        />
    </StyledLayerContainer>
  );
};

export default FilterLayer;
