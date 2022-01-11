import styled from 'styled-components';

export const StyledTitle = styled.h5`
    cursor: default;
    @media (max-width: 460px) {
        font-size: 18px;
    };
`;

export const StyledTitleLittle = styled.h6`
    cursor: default;
    @media (max-width: 460px) {
        font-size: 14px;
    };
`;

export const StyledUl = styled.ul`
    cursor: default;
    @media (max-width: 460px) {
        font-size: 14px;
        padding-inline-start: 20px;
    };
`;

export const StyledLi = styled.li`
    cursor: default;
`;

export const StyledA = styled.a`
    cursor: pointer;
    word-wrap: break-word;
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