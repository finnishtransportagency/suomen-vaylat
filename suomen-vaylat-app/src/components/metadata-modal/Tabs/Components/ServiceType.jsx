import React from 'react';
import strings from '../../../../translations';
import { StyledParagraph, StyledTitle } from './Common';

export const ServiceType = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-modal-service-type'}>
            {identification.serviceType && identification.serviceType.length > 0 &&
                <React.Fragment key={'metadata-modal-service-type-content'}>
                    <StyledTitle>{strings.metadata.heading.serviceType}</StyledTitle>
                    <StyledParagraph>{identification.serviceType} {identification.serviceTypeVersion ? '(' + identification.serviceTypeVersion + ')' : ''}</StyledParagraph>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default ServiceType;