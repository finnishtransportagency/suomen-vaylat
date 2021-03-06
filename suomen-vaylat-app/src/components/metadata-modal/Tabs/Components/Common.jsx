import styled from 'styled-components';

export const StyledTitle = styled.h5`
    cursor: default;
`;

export const StyledTitleLittle = styled.h6`
    cursor: default;
`;

export const StyledUl = styled.ul`
    cursor: default;
`;

export const StyledLi = styled.li`
    cursor: default;
`;

export const StyledA = styled.a`
    cursor: pointer;
`;

export const StyledParagraph = styled.p`
    cursor: default;
`;

export const StyledImage = styled.img`
    max-height: 200px;
    cursor: zoom-in;
`;

export const StyledDiv = styled.div`
    cursor: default;
    margin-bottom: 1rem;
`;

export const StyledArticle = styled.article`
    display: ${props => props.visible ? 'block' : 'none'}
`;