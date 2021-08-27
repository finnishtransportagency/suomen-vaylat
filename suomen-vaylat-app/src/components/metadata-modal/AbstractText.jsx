import styled from 'styled-components';
import strings from '../../translations';

const StyledAbstractTitle = styled.h5`
`;

const StyledParagraph = styled.p`
`;

export const AbstractText = ({ identification }) => {
    const abstractTextHeader = identification.type === "data" ? strings.metadata.heading.abstractTextData : strings.metadata.heading.abstractTextService;
    return (
        <>
        {identification.abstractText.length > 0 &&
            <>
                <StyledAbstractTitle>{abstractTextHeader}</StyledAbstractTitle>
                <StyledParagraph>{identification.abstractText}</StyledParagraph>
            </>
        }
        </>
    );
};

export default AbstractText;