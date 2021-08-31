import strings from '../../../../translations';
import {StyledTitle, StyledParagraph} from './Common';

export const OtherConstraints = ({ identification }) => {
    return (
        <>
        {identification.otherConstraints && identification.otherConstraints.length > 0 &&
            <>
                <StyledTitle>{strings.metadata.heading.otherConstraint}</StyledTitle>
                {identification.otherConstraints.map((data, index) => {
                    return (
                        <StyledParagraph key={'metadata-other-constraints-li-' + index}>
                            {data}
                        </StyledParagraph>
                    )
                })}
            </>
        }
        </>
    );
};
export default OtherConstraints;