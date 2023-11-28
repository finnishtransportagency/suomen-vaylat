import { useState } from 'react';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import FilterLayerGroup from './FilterLayerGroup';

import strings from '../../../../translations';


const StyledLayerList = styled.div`

`;

const StyledLayerGroupWrapper = styled.div``;

const FilterLayerList = ({
    groups,
    layers,
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
                    {sortedGroups.map((group, index) => {
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
                                { isVisible ? (
                                    <FilterLayerGroup
                                        key={'layer-group-' + group.id}
                                        group={group}
                                        layers={layers}
                                        hasChildren={hasChildren}
                                    />) : null}
                            </StyledLayerGroupWrapper>
                        );
                    })
                    }
                </StyledLayerList>
        </>
    );
  };
  export default FilterLayerList;