import { useState, useEffect} from 'react';
import { useAppSelector } from '../../../state/hooks';
import strings from "../../../translations";
import styled from "styled-components";
import LayerGroup from './LayerGroup';
import store from '../../../state/store';
import { setIsSavedLayer, incrementTriggerUpdate, setIsCustomFilterOpen } from '../../../state/slices/uiSlice';

const StyledGuideContent = styled.div`
`;

const StyledSearchAndFilter = styled.div`
    display: flex;
    align-items: flex-start;
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 16px;
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

const StyledRemoveButton = styled.div`
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
  margin-right: 5px;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 30px;
`;

const StyledLayerList = styled.div`
  max-height: 520px;
  padding: 5px;
  margin: 5px;
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
  shouldReset,
  onResetComplete
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

  useEffect(() => {
    if (shouldReset) {
      setSavedLayers([]);
      if (typeof onResetComplete === 'function') {
        onResetComplete();
      }
    }
}, [shouldReset, onResetComplete]);


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
  const [areLayersSelected, setAreLayersSelected] = useState(false);

  const [shouldReset, setShouldReset] = useState(false);

  useEffect(() => {
    const loadedLayers = localStorage.getItem("checkedLayers");
    if (loadedLayers && JSON.parse(loadedLayers).length > 0) {
      setAreLayersSelected(true);
    } else {
      setAreLayersSelected(false);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const loadedLayers = localStorage.getItem("checkedLayers");
      if (loadedLayers && JSON.parse(loadedLayers).length > 0) {
        setAreLayersSelected(true);
      } else {
        setAreLayersSelected(false);
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
          onResetComplete={() => setShouldReset(false)}
        />
      )
    }
  ];

  const saveLayers = () => {
    store.dispatch(setIsSavedLayer(true));
    store.dispatch(incrementTriggerUpdate());
  };

  const removeLayers =() => {
    store.dispatch(setIsSavedLayer(false));
    localStorage.removeItem("checkedLayers");
    setShouldReset(true);
  };

  const handleCustomFilterClose = () => {
    store.dispatch(setIsCustomFilterOpen(false));
  };

  return (
    <>
      {modalContent.map((content) => (
        <div key={content.content}>
          {content.content}
        </div>
      ))}
    <StyledButtonContainer>
    <StyledRemoveButton onClick={() => {
        removeLayers();
      }}>
        {strings.layerlist.customLayerInfo.removeLayers}
      </StyledRemoveButton>
      <StyledSaveButton
        disabled={!areLayersSelected}
        onClick={() => {
          if (areLayersSelected) {
            saveLayers();
            handleCustomFilterClose();
          }
        }}
      >
  {strings.layerlist.customLayerInfo.saveLayers}
</StyledSaveButton>
    </StyledButtonContainer>

        <StyledSearchAndFilter>
      </StyledSearchAndFilter>
          {modalContent.map((content, index) => (
            <div key={index}>
              <div>{content.layerlist}</div>
            </div>
          ))}
    </>
  );
};
