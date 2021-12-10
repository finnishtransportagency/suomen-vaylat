import React from 'react';
import strings from '../../../translations';
import { StyledParagraph, StyledTitle } from './Common';

export const LineageStatements = ({ lineageStatements }) => {
    return (
        <React.Fragment key={'metadata-modal-lineage-statements'}>
            {lineageStatements && lineageStatements.length > 0 &&
                <React.Fragment key={'metadata-modal-lineage-statements-content'}>
                    <StyledTitle>{strings.metadata.heading.lineageStatement}</StyledTitle>
                    {lineageStatements.map((lineage, index) => {
                        return (
                            <StyledParagraph key={'metadata-lineage-statements-p-' + index}>
                                {lineage}
                            </StyledParagraph>
                        )
                    })}
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default LineageStatements;