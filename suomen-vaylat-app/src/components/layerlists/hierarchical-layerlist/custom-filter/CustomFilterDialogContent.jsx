import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../state/hooks';
import strings from '../../../../translations';
import styled from 'styled-components';
import FilterLayerGroup from './FilterLayerGroup';
import store from '../../../../state/store';
import {
  incrementTriggerUpdate,
  setIsCustomFilterOpen,
  setCheckedLayer,
  setShowSavedLayers,
  setSelectedCustomFilterLayers
} from '../../../../state/slices/uiSlice';
import PillButton from '../../../../utils/components/PillButton';

const StyledDialogContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding: 1em;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 1em 0;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  gap: 12px;
`;

const StyledLayerList = styled.div`
  margin: 0 5px 10px 5px;
  overflow: auto;
  flex: 1;
  max-height: 80%;

  @media (max-width: 1024px) {
    // For devices larger than 480px but not desktop
    padding: 5px 10px 5px 10px;
  }

  @media (max-width: 350px) {
    padding: 5px 10px 55px 10px;
  }
`;

const StyledDialogContent = styled.div``;

const StyledLayerGroupWrapper = styled.div``;

export const CustomLayerList = ({ groups, layers }) => {
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
      <StyledLayerList id="custom-filter-dialog-layerlist">
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
            <StyledLayerGroupWrapper
              id="custom-filter-dialog-layer-group-wrapper"
              key={'group-sl-' + group.id}
            >
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
  const { selectedCustomFilterLayers } = useAppSelector((state) => state.ui);
  const [updateCustomLayer, setUpdateCustomLayers] = useState(false);

  const checkedLayersLocalStorage = localStorage.getItem('checkedLayers');
  const checkedLayersLSJson =
    checkedLayersLocalStorage !== null
      ? JSON.parse(checkedLayersLocalStorage)
      : [];

  useEffect(() => {
    if (
      checkedLayersLSJson !== null &&
      checkedLayersLSJson.length > 0 &&
      selectedCustomFilterLayers.length === 0
    ) {
      checkedLayersLocalStorage &&
        store.dispatch(setSelectedCustomFilterLayers(checkedLayersLSJson));
    }
  }, []);

  useEffect(() => {
    const selectedIds =
      selectedCustomFilterLayers.map((layer) => layer.id).sort() || [];
    const checkedIds =
      checkedLayersLSJson.map((layer) => layer.id).sort() || [];
    const matchingArrays =
      selectedIds.length === checkedIds.length &&
      selectedIds.every((id, index) => id === checkedIds[index]);

    if (checkedLayersLSJson !== null && !matchingArrays) {
      setUpdateCustomLayers(true);
    } else if (
      checkedLayersLSJson === null &&
      selectedCustomFilterLayers.length > 0
    ) {
      setUpdateCustomLayers(true);
    } else {
      setUpdateCustomLayers(false);
    }
  }, [selectedCustomFilterLayers, checkedLayersLSJson]);

  const saveLayers = () => {
    if (!updateCustomLayer) return;
    store.dispatch(incrementTriggerUpdate());
    store.dispatch(setIsCustomFilterOpen(false));
    if (selectedCustomFilterLayers.length > 0) {
      localStorage.setItem(
        'checkedLayers',
        JSON.stringify(selectedCustomFilterLayers)
      );
      store.dispatch(setShowSavedLayers(true));
    } else {
      localStorage.removeItem('checkedLayers');
      store.dispatch(setShowSavedLayers(false));
    }
  };

  const removeLayers = () => {
    localStorage.removeItem('checkedLayers');
    store.dispatch(setCheckedLayer([]));
    store.dispatch(setSelectedCustomFilterLayers([]));
  };

  return (
    <StyledDialogContainer id="custom-filter-dialog-container">
      <StyledDialogContent>
        {' '}
        {strings.layerlist.customFilterInfo.infoContent}
      </StyledDialogContent>

      <StyledButtonContainer>
        <PillButton
          id={'custom-filter-dialog-remove-layers-button'}
          onClick={removeLayers}
          disabled={selectedCustomFilterLayers.length === 0}
          variant="inverse"
        >
          {strings.layerlist.customFilterInfo.removeLayers}
        </PillButton>
        <PillButton
          id={'custom-filter-dialog-save-layers-button'}
          onClick={saveLayers}
          disabled={!updateCustomLayer}
        >
          {strings.layerlist.customFilterInfo.saveLayers}
        </PillButton>
      </StyledButtonContainer>

      <CustomLayerList groups={allGroups} layers={allLayers} recurse={false} />
    </StyledDialogContainer>
  );
};

export default CustomLayerDialogContent;
