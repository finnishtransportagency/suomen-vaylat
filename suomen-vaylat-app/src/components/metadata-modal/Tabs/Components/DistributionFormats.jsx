import React from 'react';
import strings from '../../../../translations';
import { StyledLi, StyledTitle, StyledUl } from './Common';

export const DistributionFormats = ({ distributionFormats }) => {
    return (
        <React.Fragment key={'metadata-modal-distribution-formats'}>
            {distributionFormats && distributionFormats.length > 0 &&
                <React.Fragment key={'metadata-modal-distribution-formats-content'}>
                    <StyledTitle>{strings.metadata.heading.distributionFormat}</StyledTitle>
                    <StyledUl>
                        {distributionFormats.map((data, index) => {
                            return (
                                <StyledLi key={'metadata-distribution-format-li-' + index}>
                                    {data.name} {data.version ? '(' + data.version + ')' : ''}
                                </StyledLi>
                            )
                        })}
                    </StyledUl>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default DistributionFormats;