import React from 'react';
import strings from '../../../../translations';
import { StyledParagraph, StyledTitle } from './Common';

export const OtherConstraints = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-modal-other-contraints'}>
            {identification.otherConstraints && identification.otherConstraints.length > 0 &&
                <React.Fragment key={'metadata-modal-other-contraints-content'}>
                    <StyledTitle>{strings.metadata.heading.otherConstraint}</StyledTitle>
                    {identification.otherConstraints.map((data, index) => {
                        return (
                            <StyledParagraph key={'metadata-other-constraints-li-' + index}>
                                {data}
                            </StyledParagraph>
                        )
                    })}
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default OtherConstraints;