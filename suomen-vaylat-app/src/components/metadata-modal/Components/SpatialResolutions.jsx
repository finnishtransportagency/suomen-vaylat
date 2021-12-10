import React from 'react';
import strings from '../../../translations';
import { StyledLi, StyledTitle, StyledUl } from './Common';

export const SpatialResolutions = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-modal-spatial-resolutions'}>
            {identification.spatialResolutions && identification.spatialResolutions.length > 0 &&
                <React.Fragment key={'metadata-modal-spatial-resolutions-content'}>
                    <StyledTitle>{strings.metadata.heading.spatialResolution}</StyledTitle>
                    <StyledUl>
                        {identification.spatialResolutions.map((data, index) => {
                            return (
                                <StyledLi key={'metadata-spatial-resolution-li-' + index}>
                                    1: {data}
                                </StyledLi>
                            )
                        })}
                    </StyledUl>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default SpatialResolutions;