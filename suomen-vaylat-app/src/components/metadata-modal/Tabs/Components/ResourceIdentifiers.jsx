import React from 'react';
import strings from '../../../../translations';
import { StyledLi, StyledTitle, StyledUl } from './Common';

export const ResourceIdentifiers = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-modal-resource-identifiers'}>
            {identification.citation && identification.citation.resourceIdentifiers && identification.citation.resourceIdentifiers.length > 0 &&
                <React.Fragment key={'metadata-modal-resource-identifiers-content'}>
                    <StyledTitle>{strings.metadata.heading.resourceIdentifier}</StyledTitle>
                    <StyledUl>
                        {identification.citation.resourceIdentifiers.map((data, index) => {
                            return (
                                <StyledLi key={'metadata-citation-resource-identifier-li-' + index}>
                                    {data.codeSpace}.{data.code}
                                </StyledLi>
                            )
                        })}
                    </StyledUl>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default ResourceIdentifiers;