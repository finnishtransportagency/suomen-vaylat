import strings from '../../../translations';
import AccessConstraints from '../components/AccessConstraints';
import Citation from '../components/Citation';
import CitationDate from '../components/CitationDate';
import Classifications from '../components/Classifications';
import { StyledArticle } from '../components/Common';
import DataQualities from '../components/DataQualities';
import DescriptiveKeywords from '../components/DescriptiveKeywords';
import HeaderAndParagraph from '../components/HeaderAndParagraph';
import Languages from '../components/Languages';
import LineageStatements from '../components/LineageStatements';
import MetadataGraphic from '../components/MetadataGraphic';
import OnlineResources from '../components/OnlineResources';
import OperatesOn from '../components/OperatesOn';
import OtherConstraints from '../components/OtherConstraints';
import ResourceIdentifiers from '../components/ResourceIdentifiers';
import ResponsibleParties from '../components/ResponsibleParties';
import ScopeCodes from '../components/ScopeCodes';
import ServiceType from '../components/ServiceType';
import SpatialResolutions from '../components/SpatialResolutions';
import TemporalExtents from '../components/TemporalExtents';
import TopicCategories from '../components/TopicCategories';
import UseLimitations from '../components/UseLimitations';

export const InspireTab = ({ identification, data, visible }) => {
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
            <OnlineResources onlineResources={data.onlineResources}></OnlineResources>
            <Languages identification={identification}></Languages>
            <TopicCategories identification={identification}></TopicCategories>
            <TemporalExtents identification={identification}></TemporalExtents>
            <LineageStatements lineageStatements={data.lineageStatements}></LineageStatements>
            <SpatialResolutions identification={identification}></SpatialResolutions>
            <ResponsibleParties
                visible={identification.responsibleParties && identification.responsibleParties.length > 0}
                header={strings.metadata.heading.responsibleParty}
                responsibleParties={identification.responsibleParties}></ResponsibleParties>
            <CitationDate identification={identification}></CitationDate>
            <ScopeCodes scopeCodes={data.scopeCodes}></ScopeCodes>
            <ResourceIdentifiers identification={identification}></ResourceIdentifiers>
            <OperatesOn identification={identification}></OperatesOn>
            <ServiceType identification={identification}></ServiceType>
            <DescriptiveKeywords identification={identification}></DescriptiveKeywords>
            <DataQualities dataQualities={data.dataQualities}></DataQualities>
            <AccessConstraints identification={identification}></AccessConstraints>
            <OtherConstraints identification={identification}></OtherConstraints>
            <Classifications identification={identification}></Classifications>
            <UseLimitations identification={identification}></UseLimitations>
        </StyledArticle>
    );
};
export default InspireTab;