import React from 'react';
import strings from '../../../translations';
import { StyledLi, StyledTitle, StyledUl } from './Common';

export const AccessConstraints = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-modal-access-constraints'}>
            {identification.accessConstraints && identification.accessConstraints.length > 0 &&
                <React.Fragment key={'metadata-modal-access-constraints-content'}>
                    <StyledTitle>{strings.metadata.heading.accessConstraint}</StyledTitle>
                    <StyledUl>
                        {identification.accessConstraints.map((data, index) => {
                            return (
                                <StyledLi key={'metadata-access-contraints-li-' + index}
                                    title={(strings.metadata.codeLists['gmd:MD_RestrictionCode'][data] || { description: data }).description}
                                >
                                    {(strings.metadata.codeLists['gmd:MD_RestrictionCode'][data] || { label: data }).label}
                                </StyledLi>
                            )
                        })}
                    </StyledUl>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default AccessConstraints;