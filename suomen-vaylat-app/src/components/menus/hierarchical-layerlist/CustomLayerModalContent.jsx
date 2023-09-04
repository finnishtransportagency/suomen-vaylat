import { useState, useEffect, useReducer} from 'react';
import { useAppSelector } from '../../../state/hooks';
import strings from "../../../translations";
import styled from "styled-components";
import LayerGroup from './LayerGroup';
import store from '../../../state/store';
import { setIsSavedLayer, incrementTriggerUpdate, setIsCustomFilterOpen, setShowCustomLayerList, setUpdateCustomLayers } from '../../../state/slices/uiSlice';

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
  background-color: ${props => props.isDisabled ? "#DDDDDD" : props.theme.colors.mainColor1};
  cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
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
  color: ${props => props.isOpen ? "#004477" : props.theme.colors.mainColor1};
`;

const StyledLayerList = styled.div`
  max-height: 520px;
  padding: 0 5px 15px 5px;
  margin: 0 5px 10px 5px;
  overflow: auto;

  @media (max-width: 1024px) {  // For devices larger than 480px but not desktop
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

export const CustomLayerList = ({
  groups,
  layers,
  recurse = false,
}) => {

    const [savedLayers, setSavedLayers] = useState([]);

  // Load saved layers from local storage when component mounts
  useEffect(() => {
    const loadedLayers = localStorage.getItem("checkedLayers");
    if (loadedLayers) {
      setSavedLayers(JSON.parse(loadedLayers));
    } else {
      setSavedLayers([]);
    }
  }, []);


  // const slicedGroups = groups ? groups.slice() : [];
  const slicedGroups = groups.slice();
  
  const currentLang = strings.getLanguage();

  const sortedGroups = slicedGroups.length > 0 ? slicedGroups.sort(function(a, b) {
      const aName = a.locale[currentLang] && a.locale[currentLang].name ? a.locale[currentLang].name : null;
      const bName = b.locale[currentLang] && b.locale[currentLang].name ? b.locale[currentLang].name : null;

      // b.id 727 is Tierekisteri (Poistuva) and should be the lowest element on the list 
      if(b.id === 727) {
          return -1
      }
      // a.id 727 is Tierekisteri (Poistuva) only on Firefox 
      else if(a.id === 727) {
          return 1;
      }
      else if (aName && bName) {
          return aName.toLowerCase().localeCompare(bName.toLowerCase());
      } else {
          return 0;
      }
  }) : []

  return (
      <>
              <StyledLayerList>
                  {sortedGroups.map((group) => {
                      const recursiveCheckSubGroupLayers = (group) => {
                          var hasChildrenLayers = false;
                          if (group.layers && group.layers.length) {
                              hasChildrenLayers = true;
                          } else if (group.groups && group.groups.length > 0) {
                              group.groups.forEach(subgroup => {
                                  const hasLayers = recursiveCheckSubGroupLayers(subgroup);
                                  if (hasLayers === true) {
                                      hasChildrenLayers = true;
                                  }
                              });
                          }
                          return hasChildrenLayers;
                      }

                      var hasChildren = recursiveCheckSubGroupLayers(group);
                      let isVisible = (group.layers && group.layers.length > 0) || hasChildren;
                      return group.id !== 826 && (
                          <StyledLayerGroupWrapper key={'group-sl-' + group.id }>
                          {isVisible ? (
                <LayerGroup
                  key={'layer-group-' + group.id}
                  group={group}
                  layers={layers}
                  hasChildren={hasChildren}
                />
              ) : null}
                          </StyledLayerGroupWrapper>
                      );
                  })
                  }
              </StyledLayerList>
      </>
  );
};

// Renders custom filter guide for user and CustomLayerList
export const CustomLayerModalContent = () => {
  useAppSelector((state) => state.language);

  const {
    allGroups,
    allLayers,
  } = useAppSelector((state) => state.rpc);

  const {updateCustomLayer} = useAppSelector((state) => state.ui);

  const modalContent = [
    {
      titleColor: 'mainColor1',
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
      )
    }
  ];


  const saveLayers = () => {
    if (!updateCustomLayer) return;
    store.dispatch(setIsSavedLayer(true));
    store.dispatch(incrementTriggerUpdate());
    store.dispatch(setIsCustomFilterOpen(false));
    store.dispatch(setShowCustomLayerList(true));
  };

  const removeLayers =() => {
    store.dispatch(setIsSavedLayer(false));
    store.dispatch(setShowCustomLayerList(false));
    localStorage.removeItem("checkedLayers");
    store.dispatch(setUpdateCustomLayers(false));
  }

  return (
    <StyledModalContainer>
        {modalContent.map((content) => (
            <div key={content.content}>
                <div>{content.content}</div>

                <StyledButtonContainer>
                    <StyledSaveButton 
                        onClick={() => {
                            saveLayers();
                        }}
                        isDisabled={!updateCustomLayer}>
                        {strings.layerlist.customLayerInfo.saveLayers}
                    </StyledSaveButton>
                    <StyledRemoveButton onClick={removeLayers}>
                        {strings.layerlist.customLayerInfo.removeLayers}
                    </StyledRemoveButton>
                </StyledButtonContainer>

                <div>{content.layerlist}</div>
            </div>
        ))}
    </StyledModalContainer>
);
};
