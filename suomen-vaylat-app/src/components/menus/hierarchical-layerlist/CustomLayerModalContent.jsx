import { useAppSelector } from '../../../state/hooks';
import strings from "../../../translations";
import styled from "styled-components";
import LayerGroup from './LayerGroup';
import store from '../../../state/store';
import { setIsSavedLayer } from '../../../state/slices/uiSlice';

const StyledContent = styled.div`
  display: flex;
  justify-content: center;
  align-items:center;
  width: 100%;
  height: 100%;
  min-width: 600px;
  max-width: 600px;
  padding: 20px;
`;

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
  max-height: 450px;
  padding: 6px;
  margin: 15px;
  overflow: auto;
`;

const StyledLayerGroupWrapper = styled.div``;

export const CustomLayerList = ({
  groups,
  layers,
  recurse = false,
}) => {


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


export const CustomLayerModalContent = () => {
  useAppSelector((state) => state.language);

  const {
    allGroups,
    allLayers,
  } = useAppSelector((state) => state.rpc);

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
    store.dispatch(setIsSavedLayer(true));
  };

  const removeLayers =() => {
    store.dispatch(setIsSavedLayer(false));
    localStorage.removeItem("checkedLayers");
  }

  return (
    <>
    <StyledContent>
      {modalContent.map((content) => (
        <div key={content.content}>
          {content.content}
        </div>
      ))}
    </StyledContent>
    <StyledButtonContainer>
      <StyledSaveButton onClick={() => {
        saveLayers();
      }}>
        {strings.layerlist.customLayerInfo.saveLayers}
      </StyledSaveButton>
      <StyledRemoveButton onClick={() => {
        removeLayers();
      }}>
        {strings.layerlist.customLayerInfo.removeLayers}
      </StyledRemoveButton>
    </StyledButtonContainer>

        <StyledLayerList>
        <StyledSearchAndFilter>
      </StyledSearchAndFilter>
          {modalContent.map((content, index) => (
            <div key={index}>
              <div>{content.layerlist}</div>
            </div>
          ))}
        </StyledLayerList>
    </>
  );
};
/*
 */