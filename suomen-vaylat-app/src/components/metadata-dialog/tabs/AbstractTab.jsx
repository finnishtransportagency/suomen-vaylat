import strings from '../../../translations';
import Citation from '../components/Citation';
import { StyledArticle } from '../components/Common';
import HeaderAndParagraph from '../components/HeaderAndParagraph';
import MetadataGraphic from '../components/MetadataGraphic';

export const AbstractTab = ({ identification, data, visible }) => {
    return (
        <StyledArticle visible={visible}>
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