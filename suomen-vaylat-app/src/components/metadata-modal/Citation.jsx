import styled from 'styled-components';

const StyledCitationTitle = styled.h4`
`;

export const Citation = ({ identification }) => {
    return (
        <>
        {identification.citation.title.length > 0 &&
            <StyledCitationTitle>{identification.citation.title}</StyledCitationTitle>
        }
        </>
    );
};

export default Citation;