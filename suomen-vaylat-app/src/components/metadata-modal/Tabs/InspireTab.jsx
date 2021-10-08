import strings from '../../../translations';
import AccessConstraints from './Components/AccessConstraints';
import Citation from './Components/Citation';
import CitationDate from './Components/CitationDate';
import Classifications from './Components/Classifications';
import { StyledArticle } from './Components/Common';
import DataQualities from './Components/DataQualities';
import DescriptiveKeywords from './Components/DescriptiveKeywords';
import HeaderAndParagraph from './Components/HeaderAndParagraph';
import Languages from './Components/Languages';
import LineageStatements from './Components/LineageStatements';
import MetadataGraphic from './Components/MetadataGraphic';
import OnlineResources from './Components/OnlineResources';
import OperatesOn from './Components/OperatesOn';
import OtherConstraints from './Components/OtherConstraints';
import ResourceIdentifiers from './Components/ResourceIdentifiers';
import ResponsibleParties from './Components/ResponsibleParties';
import ScopeCodes from './Components/ScopeCodes';
import ServiceType from './Components/ServiceType';
import SpatialResolutions from './Components/SpatialResolutions';
import TemporalExtents from './Components/TemporalExtents';
import TopicCategories from './Components/TopicCategories';
import UseLimitations from './Components/UseLimitations';

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