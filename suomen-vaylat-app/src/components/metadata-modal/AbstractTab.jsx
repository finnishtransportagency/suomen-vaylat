import styled from 'styled-components';
import AbstractText from './AbstractText';
import Citation from './Citation';
import MetadataDateStamp from './MetadataDateStamp';
import MetadataGraphic from './MetadataGraphic';

const StyledArticle = styled.article`
`;

export const AbstractTab = ({ identification, datestamp }) => {
    return (
        <StyledArticle>
            <MetadataGraphic identification={identification}></MetadataGraphic>
            <Citation identification={identification}></Citation>
            <AbstractText identification={identification}></AbstractText>
            <MetadataDateStamp datestamp={datestamp}></MetadataDateStamp>
        </StyledArticle>
    );
};

export default AbstractTab;