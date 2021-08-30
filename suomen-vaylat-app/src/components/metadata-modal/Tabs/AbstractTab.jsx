import strings from '../../../translations';
import styled from 'styled-components';
import HeaderAndParagraph from './Components/HeaderAndParagraph';
import Citation from './Components/Citation';
import MetadataGraphic from './Components/MetadataGraphic';

const StyledArticle = styled.article`
`;

export const AbstractTab = ({ identification, data }) => {
    return (
        <StyledArticle>
            <MetadataGraphic identification={identification}></MetadataGraphic>
            <Citation identification={identification}></Citation>
            <HeaderAndParagraph
                visible={identification.abstractText.length > 0}
                header={(identification.type === 'data' ? strings.metadata.heading.abstractTextData : strings.metadata.heading.abstractTextService)}
                text={identification.abstractText}
            ></HeaderAndParagraph>
            <HeaderAndParagraph
                visible={data.metadataDateStamp.length > 0}
                header={strings.metadata.heading.metadataDateStamp}
                text={data.metadataDateStamp}
                momentFormat={'DD.MM.YYYY hh:mm:ss'}
            ></HeaderAndParagraph>
        </StyledArticle>
    );
};

export default AbstractTab;