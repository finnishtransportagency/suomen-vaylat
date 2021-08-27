import strings from '../../../../translations';
import {StyledTitle, StyledParagraph} from './Common';

export const AbstractText = ({ identification }) => {
    const abstractTextHeader = identification.type === "data" ? strings.metadata.heading.abstractTextData : strings.metadata.heading.abstractTextService;
    return (
        <>
        {identification.abstractText.length > 0 &&
            <>
                <StyledTitle>{abstractTextHeader}</StyledTitle>
                <StyledParagraph>{identification.abstractText}</StyledParagraph>
            </>
        }
        </>
    );
};

export default AbstractText;