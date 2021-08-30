import strings from '../../../../translations';
import {StyledTitle, StyledParagraph} from './Common';

export const LineageStatements = ({ lineageStatements }) => {
    return (
        <>
        {lineageStatements && lineageStatements.length > 0 &&
            <>
                <StyledTitle>{strings.metadata.heading.lineageStatement}</StyledTitle>
                {lineageStatements.map((lineage, index) => {
                        return(
                            <StyledParagraph key={'metadata-lineage-statements-p-' + index}>
                                {lineage}
                            </StyledParagraph>
                        )
                })}
            </>
        }
        </>
    );
};
export default LineageStatements;