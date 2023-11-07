import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { ReactReduxContext, useSelector } from "react-redux";
import { motion } from "framer-motion";
import FilterLayerList from "./FilterLayerList";
import FilterLayers from "./FilterLayers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleDown,
  faCar,
  faHardHat,
  faLandmark,
  faMap,
  faRoad,
  faShip,
  faTrain,
  faGlobeEurope,
} from "@fortawesome/free-solid-svg-icons";


import { setSelectedCustomFilterLayers } from "../../../../state/slices/uiSlice";
import strings from "../../../../translations";
import { useAppSelector } from "../../../../state/hooks";

const masterHeaderIconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const layerGroupIconVariants = {
  open: { rotate: 90 },
  closed: { rotate: 0 },
};

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

const StyledLayerGroups = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: ${(props) =>
    props.parentId === -1 ? props.theme.colors.mainWhite : "#F2F2F2"};
  margin: 8px 0px 8px 0px;
  border-radius: 4px;

  &:last-child {
    ${(props) =>
      props.parentId === -1
        ? "1px solid " + props.theme.colors.mainColor2
        : "none"};
  }
`;

const StyledMasterGroupHeader = styled.div`
  position: sticky;
  top: -8px;
  z-index: 1;
  min-height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.mainColor1};
  border-radius: 4px;
  padding-top: 8px;
  padding-bottom: 8px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  @-moz-document url-prefix() {
    position: initial;
  }
`;

const StyledLeftContent = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
`;

const StyledMasterGroupHeaderIcon = styled.div`
  width: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    font-size: 20px;
    color: ${(props) => props.theme.colors.mainWhite};
  }
  p {
    margin: 0;
    font-weight: bold;
    font-size: 22px;
    color: ${(props) => props.theme.colors.mainWhite};
  }
`;

const StyledMasterGroupTitleContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledMasterGroupName = styled.p`
  user-select: none;
  max-width: 240px;
  color: ${(props) => props.theme.colors.mainWhite};
  margin: 0;
  padding: 0px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.1s ease-in;

  @media ${(props) => props.theme.device.mobileL} {
    //font-size: 13px;
  }
`;

const StyledSubHeader = styled.p`
  height: 30px;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.mainColor1};
  margin: 0px;
  margin-top: 8px;
  padding-left: 8px;
  font-size: 13px;
  font-weight: bold;
`;

const StyledSubText = styled.p`
  color: ${(props) => props.theme.colors.black};
  transition: all 0.1s ease-in;
  margin: 0px;
  padding: 0px 8px 8px 8px;
  font-size: 12px;
  font-weight: 400;
`;

const StyledReadMoreButton = styled.span`
  cursor: pointer;
  color: ${(props) => props.theme.colors.mainColor1};
  font-size: 12px;
  font-weight: 400;
`;

const StyledLinkButton = styled.a`
  cursor: pointer;
  color: ${(props) => props.theme.colors.mainColor1};
  font-size: 12px;
  font-weight: 400;
`;

const StyledMasterGroupLayersCount = styled.p`
  margin: 0;
  padding: 0px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`;

const StyledSubGroupLayersCount = styled.p`
  margin: 0;
  padding: 0px;
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.mainColor2};
`;

const StyledLefContent = styled.div`
  display: flex;
  align-items: center;
`;

const StyledRightContent = styled.div`
  display: flex;
  align-items: center;
`;

const StyledGroupHeader = styled.div`
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 4px;
  padding: 8px 0px 8px 8px;
`;

const StyledGroupName = styled.p`
  max-width: 220px;
  user-select: none;
  margin: 0;
  padding-left: 0px;
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.mainColor1};
  @media ${(props) => props.theme.device.mobileL} {
    font-size: 12px;
  }
`;

const StyledSelectButton = styled.button`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  margin-right: 8px;
  border: none;
  svg {
    color: ${(props) =>
      props.subGroup
        ? props.theme.colors.mainColor1
        : props.theme.colors.mainWhite};
    font-size: 19px;
    transition: all 0.3s ease-out;
  }
`;

const StyledMotionIconWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledLayerGroup = styled(motion.ul)`
  list-style-type: none;
  margin: 0;
  padding-inline-start: ${(props) => (props.parentId === -1 ? "8px" : "25px")};
  overflow: hidden;
  transition: max-height 0.3s ease-out;
`;

const themeStyles = {
  100: {
    icon: faCar,
  },
  101: {
    icon: faShip,
  },
  34: {
    icon: faHardHat,
  },
  2: {
    icon: faTrain,
  },
  199: {
    icon: faLandmark,
  },
  265: {
    icon: faRoad,
  },
  1: {
    icon: faMap,
  },
  562: {
    icon: faGlobeEurope,
  },
};

const StyledSwitchContainer = styled.div`
  position: relative;
  min-width: 32px;
  height: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  background-color: ${(props) => (props.isSelected ? "#8DCB6D" : "#AAAAAA")};
  cursor: pointer;
  margin-right: 16px;
`;

const StyledSwitchButton = styled.div`
  position: absolute;
  left: ${(props) => (props.isSelected ? "15px" : "0px")};
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-left: 2px;
  margin-right: 2px;
  transition: all 0.3s ease-out;
  background-color: ${(props) => props.theme.colors.mainWhite};
`;

const Switch = ({ action, isSelected }) => {
  return (
    <StyledSwitchContainer
      isSelected={isSelected}
      onClick={(event) => {
        action(event);
      }}
    >
      <StyledSwitchButton isSelected={isSelected} />
    </StyledSwitchContainer>
  );
};

export const FilterLayerGroup = ({ group, layers, hasChildren }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExcerptOpen, setIsExcerptOpen] = useState(false);
  const { store } = useContext(ReactReduxContext);
  const [isChecked, setIsChecked] = useState(false);

  const [filteredLayers, setFilteredLayers] = useState([]);
  const [totalGroupLayersCount, setTotalGroupLayersCoun] = useState(0);
  const [totalVisibleGroupLayersCount, setTotalVisibleGroupLayersCount] =
    useState(0);

  const { isCustomFilterOpen, selectedCustomFilterLayers } = useAppSelector((state) => state.ui);
  const { allLayers } = useAppSelector((state) => state.rpc);

  //Find matching layers from all layers and groups, then push this group's layers into 'filteredLayers'
  useEffect(() => {
    if (group.layers) {
      var getLayers = [];
      // need use group.layers because it is layer name ordered list
      group.layers.forEach((gl) => {
        var layer = layers.filter((l) => l.id === gl);
        if (layer && layer[0]) {
          getLayers.push(layer[0]);
        }
      });
      setFilteredLayers(getLayers);
    }

    var layersCount = 0;
    var visibleLayersCount = 0;
    const layersCounter = (group) => {
      if (group.hasOwnProperty("layers") && group.layers.length > 0) {

        //EI KATSOTA layer.visible vaan otetaan suoraan slice listasta valitut
        visibleLayersCount += selectedCustomFilterLayers.filter(
          (l) => group.layers.includes(l.id)
        ).length;
        layersCount = layersCount + group.layers.length;
      }

      var hasGroups = group.hasOwnProperty("groups") && group.groups.length > 0;
      hasGroups &&
        group.groups.forEach((group) => {
          layersCounter(group);
        });
      setTotalGroupLayersCoun(layersCount);
      setTotalVisibleGroupLayersCount(visibleLayersCount);

    };
    layersCounter(group);
  }, [group, layers, selectedCustomFilterLayers]);

  useEffect(() => {
    totalVisibleGroupLayersCount === totalGroupLayersCount &&
      totalVisibleGroupLayersCount !== 0 &&
      setIsChecked(true);
  }, [totalVisibleGroupLayersCount, totalGroupLayersCount]);

  const truncatedString = (string, characterAmount, text) => {
    return string.length > characterAmount + 20 ? (
      <>
        {string.substring(0, characterAmount) + "..."}{" "}
        <StyledReadMoreButton onClick={() => setIsExcerptOpen(!isExcerptOpen)}>
          {text}
        </StyledReadMoreButton>
      </>
    ) : (
      string
    );
  };

  const setFilteredLayersVisible = (boolean) => {
        
    if (!boolean) {
        const filteredCustomLayers = selectedCustomFilterLayers.filter(
            (filterLayer) => !filteredLayers.includes(filterLayer)
          );
        store.dispatch(setSelectedCustomFilterLayers(filteredCustomLayers));
    } else {
        store.dispatch(setSelectedCustomFilterLayers([...selectedCustomFilterLayers, ...filteredLayers]))
    }
};

const setGroupLayersVisible = (boolean, group) => {
  const filteredCustomLayers = [...selectedCustomFilterLayers];

  // Recursive function to traverse and select layers in nested groups
  const selectLayersInNestedGroups = (groups) => {
    for (const nestedGroup of groups) {
      if (nestedGroup.groups) {
        // If the nested group has further nested groups, recurse
        selectLayersInNestedGroups(nestedGroup.groups);
      }
      
      if (!boolean) {
        nestedGroup.layers.forEach((layerId) => {
          const index = filteredCustomLayers.findIndex(
            (filterLayer) => filterLayer.id === layerId
          );
          if (index !== -1) {
            filteredCustomLayers.splice(index, 1);
          }
        });
      } else {
        nestedGroup.layers.forEach((layerId) => {
          const layer = allLayers.find((l) => l.id === layerId);
          if (layer) {
            filteredCustomLayers.push(layer);
          }
        });
      }
    }
  };

  if (group.groups) {
    selectLayersInNestedGroups(group.groups);
  }

  store.dispatch(setSelectedCustomFilterLayers(filteredCustomLayers));
};


const setLayersVisible = (boolean) => {
        
    if (!boolean) {
        const filteredCustomLayers = selectedCustomFilterLayers.filter(
            (filterLayer) => !filteredLayers.includes(filterLayer)
          );
        store.dispatch(setSelectedCustomFilterLayers(filteredCustomLayers));
    } else {
        store.dispatch(setSelectedCustomFilterLayers([...selectedCustomFilterLayers, ...filteredLayers]))
    }

    
  group.groups.forEach((group) => {
    
    if (!boolean) {
        const filteredCustomLayers = selectedCustomFilterLayers.filter(
            (filterLayer) => !filteredLayers.includes(filterLayer)
          );
        store.dispatch(setSelectedCustomFilterLayers(filteredCustomLayers));
    } else {
        const layers = allLayers.filter(l => group.layers.includes(l.id))
        store.dispatch(setSelectedCustomFilterLayers([...selectedCustomFilterLayers, ...layers]))
    }

  });
};


const groupLayersVisibility = (e) => {
  e.stopPropagation();

  if (group.hasOwnProperty("groups")) {
    // Select or deselect the first group
    if (
      totalGroupLayersCount === totalVisibleGroupLayersCount &&
      totalGroupLayersCount !== 0
    ) {
      setFilteredLayersVisible(false);
      setGroupLayersVisible(false, group);
      setIsChecked(false);
    } else if (totalGroupLayersCount !== totalVisibleGroupLayersCount) {
      setFilteredLayersVisible(true);
      setGroupLayersVisible(true, group);
      setIsChecked(true);
    }
  } else {
    // Handle the case when the group contains only layers
    if (filteredLayers.length === selectedCustomFilterLayers.length && isChecked) {
      setFilteredLayersVisible(false);
      setIsChecked(false);
    } else {
      setFilteredLayersVisible(true);
      setIsChecked(true);
    }
  }
};

  const currentLang = strings.getLanguage();
  const defaultLang = strings.getAvailableLanguages()[0];
  const hasGroupDescription =
    (group.locale[currentLang] && group.locale[currentLang].desc) ||
    (strings.groupLayerList.hasOwnProperty(group.id) &&
      strings.groupLayerList[group.id].description !== null);
  const hasGroupName =
    group.locale[currentLang].name ||
    (strings.groupLayerList.hasOwnProperty(group.id) &&
      strings.groupLayerList[group.id].title !== null);
  const groupDescription =
    group.locale[currentLang] && group.locale[currentLang].desc
      ? group.locale[currentLang].desc
      : strings.groupLayerList.hasOwnProperty(group.id) &&
        strings.groupLayerList[group.id].description !== null
      ? strings.groupLayerList[group.id].description
      : null;

  return (
    <>
      <StyledLayerGroups>
        {group.parentId === -1 ? (
          <StyledMasterGroupHeader
            key={"smgh_" + group.parentId + "_" + group.id}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <StyledLeftContent>
              <StyledMasterGroupHeaderIcon>
                {themeStyles.hasOwnProperty(group.id) ? (
                  <FontAwesomeIcon icon={themeStyles[group.id].icon} />
                ) : (
                  <p>
                    {group.locale[currentLang] && group.locale[currentLang].name
                      ? group.locale[currentLang].name.charAt(0).toUpperCase()
                      : group.locale[defaultLang] &&
                        group.locale[defaultLang].name
                      ? group.locale[defaultLang].name.charAt(0).toUpperCase()
                      : group.id}
                  </p>
                )}
              </StyledMasterGroupHeaderIcon>
              <StyledMasterGroupTitleContent>
                <StyledMasterGroupName>
                  {group.locale[currentLang] && group.locale[currentLang].name
                    ? group.locale[currentLang].name
                    : group.locale[defaultLang] &&
                      group.locale[defaultLang].name
                    ? group.locale[defaultLang].name
                    : group.id}
                </StyledMasterGroupName>
                <StyledMasterGroupLayersCount>
                  {totalVisibleGroupLayersCount + " / " + totalGroupLayersCount}
                </StyledMasterGroupLayersCount>
              </StyledMasterGroupTitleContent>
            </StyledLeftContent>
            <StyledRightContent>
              <StyledSelectButton>
                <StyledMotionIconWrapper
                  initial="closed"
                  animate={isOpen ? "open" : "closed"}
                  variants={masterHeaderIconVariants}
                  transition={{
                    duration: 0.3,
                    type: "tween",
                  }}
                >
                  <FontAwesomeIcon icon={faAngleDown} />
                </StyledMotionIconWrapper>
              </StyledSelectButton>
            </StyledRightContent>
          </StyledMasterGroupHeader>
        ) : (
          <StyledGroupHeader
            key={"smgh_" + group.parentId + "_" + group.id}
            onClick={() => setIsOpen(!isOpen)}
          >
            <StyledLefContent>
              <StyledSelectButton subGroup={true}>
                <StyledMotionIconWrapper
                  initial="closed"
                  animate={isOpen ? "open" : "closed"}
                  variants={layerGroupIconVariants}
                  transition={{
                    duration: 0.3,
                    type: "tween",
                  }}
                >
                  <FontAwesomeIcon icon={faAngleRight} />
                </StyledMotionIconWrapper>
              </StyledSelectButton>
              <div>
                <StyledGroupName>
                  {group.locale[currentLang] && group.locale[currentLang].name
                    ? group.locale[currentLang].name
                    : group.locale[defaultLang] &&
                      group.locale[defaultLang].name
                    ? group.locale[defaultLang].name
                    : group.id}
                </StyledGroupName>
                <StyledSubGroupLayersCount>
                  {totalVisibleGroupLayersCount + " / " + totalGroupLayersCount}
                </StyledSubGroupLayersCount>
              </div>
            </StyledLefContent>
            <StyledRightContent>
              <Switch
                isSelected={
                  totalVisibleGroupLayersCount === totalGroupLayersCount &&
                  totalVisibleGroupLayersCount !== 0
                }
                action={groupLayersVisibility}
              />
            </StyledRightContent>
          </StyledGroupHeader>
        )}
        <StyledLayerGroup
          parentId={group.parentId}
          key={"slg_" + group.parentId + "_" + group.id}
          initial="hidden"
          animate={isOpen ? "visible" : "hidden"}
          variants={listVariants}
          transition={{
            duration: 0.3,
            type: "tween",
          }}
        >
          {group.parentId === -1 &&
            (group.locale[currentLang] ||
              strings.groupLayerList.hasOwnProperty(group.id)) && (
              <div>
                {hasGroupName && hasGroupDescription && (
                  <>
                    <StyledSubHeader>
                      {group.locale[currentLang].name ||
                        strings.groupLayerList[group.id].title}
                    </StyledSubHeader>
                  </>
                )}
                {hasGroupDescription && (
                  <>
                    <StyledSubText>
                      {isExcerptOpen ? (
                        <>
                          {" "}
                          {groupDescription}
                          {strings.groupLayerList[group.id] &&
                            strings.groupLayerList[group.id]
                              .link_description && (
                              <>
                                <StyledLinkButton
                                  target={"_blank"}
                                  href={strings.groupLayerList[group.id].link}
                                >
                                  {
                                    strings.groupLayerList[group.id]
                                      .link_description
                                  }
                                </StyledLinkButton>
                                <br />
                              </>
                            )}
                          <StyledReadMoreButton
                            onClick={() => setIsExcerptOpen(!isExcerptOpen)}
                          >
                            {" "}
                            {strings.groupLayerList.readLess}
                          </StyledReadMoreButton>
                        </>
                      ) : (
                        truncatedString(
                          groupDescription,
                          135,
                          strings.groupLayerList.readMore
                        )
                      )}
                    </StyledSubText>
                  </>
                )}
              </div>
            )}
          {hasChildren && (
            <>
              <FilterLayerList
                key={"layer-list" + group.id}
                groups={group.groups || []}
                layers={layers}
                recurse={true}
              />
              <FilterLayers layers={filteredLayers}/>
            </>
          )}
          {!hasChildren && <FilterLayers layers={filteredLayers} />}
        </StyledLayerGroup>
      </StyledLayerGroups>
    </>
  );
};

export default FilterLayerGroup;
