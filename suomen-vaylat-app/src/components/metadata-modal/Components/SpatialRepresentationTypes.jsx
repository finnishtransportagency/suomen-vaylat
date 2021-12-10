import React from 'react';
import strings from '../../../translations';
import { StyledLi, StyledTitle, StyledUl } from './Common';

export const SpatialRepresentationTypes = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-modal-spatial-representation-types'}>
            {identification.spatialRepresentationTypes && identification.spatialRepresentationTypes.length > 0 &&
                <React.Fragment key={'metadata-modal-representation-types-content'}>
                    <StyledTitle>{strings.metadata.heading.spatialRepresentationType}</StyledTitle>
                    <StyledUl>
                        {identification.spatialRepresentationTypes.map((data, index) => {
                            return (
                                <StyledLi key={'metadata-spatial-representation-types-li-' + index} title={(strings.metadata.codeLists['gmd:MD_SpatialRepresentationTypeCode'][data] || { description: data }).description}>
                                    {(strings.metadata.codeLists['gmd:MD_SpatialRepresentationTypeCode'][data] || { label: data }).label}
                                </StyledLi>
                            )
                        })}
                    </StyledUl>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default SpatialRepresentationTypes;