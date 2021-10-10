import React from 'react';
import strings from '../../../../translations';
import { StyledLi, StyledTitle, StyledUl } from './Common';

export const TemporalExtents = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-modal-temporal-extents'}>
            {identification.temporalExtents && identification.temporalExtents.length > 0 &&
                <React.Fragment key={'metadata-modal-temporal-extents-content'}>
                    <StyledTitle>{strings.metadata.heading.temporalExtent}</StyledTitle>
                    <StyledUl>
                        {identification.temporalExtents.map((temporalExtent, index) => {
                            return (
                                <StyledLi key={'metadata-temporal-extent-li-' + index}>
                                    {temporalExtent.begin} - {temporalExtent.end}
                                </StyledLi>
                            )
                        })}
                    </StyledUl>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default TemporalExtents;