import styled from 'styled-components';
import AbstractText from './Components/AbstractText';
import Citation from './Components/Citation';
import MetadataDateStamp from './Components/MetadataDateStamp';
import MetadataGraphic from './Components/MetadataGraphic';

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