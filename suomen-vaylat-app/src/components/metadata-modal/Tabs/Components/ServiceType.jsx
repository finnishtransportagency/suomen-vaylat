import strings from '../../../../translations';
import {StyledTitle, StyledParagraph} from './Common';

export const ServiceType = ({ identification }) => {
    return (
        <>
        {identification.serviceType && identification.serviceType.length > 0 &&
            <>
                <StyledTitle>{strings.metadata.heading.serviceType}</StyledTitle>
                <StyledParagraph>{identification.serviceType} {identification.serviceTypeVersion ? '(' + identification.serviceTypeVersion +  ')': ''}</StyledParagraph>
            </>
        }
        </>
    );
};
export default ServiceType;