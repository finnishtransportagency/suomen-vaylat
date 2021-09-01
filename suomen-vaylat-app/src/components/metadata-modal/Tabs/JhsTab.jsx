import strings from '../../../translations';
import Citation from './Components/Citation';
import CitationDate from './Components/CitationDate';
import { StyledArticle } from './Components/Common';
import DistributionFormats from './Components/DistributionFormats';
import Languages from './Components/Languages';
import LineageStatements from './Components/LineageStatements';
import MetadataGraphic from './Components/MetadataGraphic';
import OnlineResources from './Components/OnlineResources';
import ResponsibleParties from './Components/ResponsibleParties';
import SpatialRepresentationTypes from './Components/SpatialRepresentationTypes';
import SpatialResolutions from './Components/SpatialResolutions';
import TemporalExtents from './Components/TemporalExtents';
import HeaderAndParagraph from './Components/HeaderAndParagraph';
import TopicCategories from './Components/TopicCategories';

export const JhsTab = ({ identification, data, visible }) => {
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
            <DistributionFormats distributionFormats={data.distributionFormats}></DistributionFormats>
            <SpatialRepresentationTypes identification={identification}></SpatialRepresentationTypes>
            <HeaderAndParagraph
                visible={data.fileIdentifier && data.fileIdentifier.length > 0}
                header={strings.metadata.heading.fileIdentifier}
                text={data.fileIdentifier}
            >
            </HeaderAndParagraph>
            <HeaderAndParagraph
                visible={data.metadataStandardName && data.metadataStandardName.length > 0}
                header={strings.metadata.heading.metadataStandardName}
                text={data.metadataStandardName}
            >
            </HeaderAndParagraph>
            <HeaderAndParagraph
                visible={data.metadataStandardVersion && data.metadataStandardVersion.length > 0}
                header={strings.metadata.heading.metadataStandardVersion}
                text={data.metadataStandardVersion}
            >
            </HeaderAndParagraph>
            <HeaderAndParagraph
                visible={data.metadataLanguage && data.metadataLanguage.length > 0}
                header={strings.metadata.heading.metadataLanguage}
                text={data.metadataLanguage}
            >
            </HeaderAndParagraph>
            <HeaderAndParagraph
                visible={data.metadataCharacterSet && data.metadataCharacterSet.length > 0}
                header={strings.metadata.heading.metadataCharacterSet}
                title={(strings.metadata.codeLists['gmd:MD_CharacterSetCode'][data.metadataCharacterSet] || { description: data.metadataCharacterSet }).description}
                text={(strings.metadata.codeLists['gmd:MD_CharacterSetCode'][data.metadataCharacterSet] || { label: data.metadataCharacterSet }).label}></HeaderAndParagraph>
            <ResponsibleParties
                visible={data.metadataResponsibleParties && data.metadataResponsibleParties.length > 0}
                header={strings.metadata.heading.metadataOrganisation}
                responsibleParties={data.metadataResponsibleParties}></ResponsibleParties>

        </StyledArticle>
    );
};
export default JhsTab;