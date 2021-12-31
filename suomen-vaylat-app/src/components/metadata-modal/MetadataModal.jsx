import { useContext, useState } from 'react';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import strings from '../../translations';
import './MetadataModal.scss';
import MetadataGraphic from './Components/MetadataGraphic';
import Citation from './Components/Citation';
import HeaderAndParagraph from './Components/HeaderAndParagraph';
import OnlineResources from './Components/OnlineResources';
import Languages from './Components/Languages';
import TopicCategories from './Components/TopicCategories';
import TemporalExtents from './Components/TemporalExtents';
import LineageStatements from './Components/LineageStatements';
import SpatialResolutions from './Components/SpatialResolutions';
import ResponsibleParties from './Components/ResponsibleParties';
import CitationDate from './Components/CitationDate';
import DistributionFormats from './Components/DistributionFormats';
import SpatialRepresentationTypes from './Components/SpatialRepresentationTypes';
import ScopeCodes from './Components/ScopeCodes';
import ResourceIdentifiers from './Components/ResourceIdentifiers';
import OperatesOn from './Components/OperatesOn';
import ServiceType from './Components/ServiceType';
import DescriptiveKeywords from './Components/DescriptiveKeywords';
import DataQualities from './Components/DataQualities';
import AccessConstraints from './Components/AccessConstraints';
import OtherConstraints from './Components/OtherConstraints';
import Classifications from './Components/Classifications';
import UseLimitations from './Components/UseLimitations';
import QualityTabDataQualities from './Components/QualityTabDataQualities';


// const StyledContent = styled.div`
//     padding: 16px;
//     height: 100%;
//     width: 100%;
//     overflow: auto;
//     //overflow-y: auto;
//     //max-height: calc(100% - 50px);
//     @media (max-width: 460px) {
//      // max-height: calc(100% - 50px);
//     };
// `;

const StyledContent = styled.div`
    //min-width: 600px;
    //max-width: 600px;
    //width: 100%;
    //max-height: 1000px;
    height: 100%;
    padding: 16px;
    overflow: auto;
    @media ${props => props.theme.device.mobileL} {
       // min-width: initial;
    };
`;

export const MetadataModal = ({
  metadata
}) => {

  useAppSelector((state) => state.language);

  const [uuid, setUuid] = useState(true);

  const identification = (metadata.data && metadata.data.identifications) ? metadata.data.identifications[0] : {};

  if (metadata.uuid !== uuid) {
    setUuid(metadata.uuid);
  };

  return (
          <StyledContent>
            <MetadataGraphic identification={identification}></MetadataGraphic>
            <Citation identification={identification}></Citation>
            <HeaderAndParagraph
              visible={identification.abstractText.length > 0}
              header={(identification.type === 'data' ? strings.metadata.heading.abstractTextData : strings.metadata.heading.abstractTextService)}
              text={identification.abstractText}
            />
            <HeaderAndParagraph
              visible={metadata.data.metadataDateStamp.length > 0}
              header={strings.metadata.heading.metadataDateStamp}
              text={metadata.data.metadataDateStamp}
              momentFormat={'DD.MM.YYYY hh:mm:ss'}
            />
            <OnlineResources onlineResources={metadata.data.onlineResources}/>
            <Languages identification={identification}/>
            <TopicCategories identification={identification}/>
            <TemporalExtents identification={identification}/>
            <LineageStatements lineageStatements={metadata.data.lineageStatements}/>
            <SpatialResolutions identification={identification}/>
            <ResponsibleParties
              visible={identification.responsibleParties && identification.responsibleParties.length > 0}
              header={strings.metadata.heading.responsibleParty}
              responsibleParties={identification.responsibleParties}/>
            <CitationDate identification={identification}/>
            <ScopeCodes scopeCodes={metadata.data.scopeCodes}/>
            <ResourceIdentifiers identification={identification}/>
            <OperatesOn identification={identification}/>
            <ServiceType identification={identification}/>
            <DescriptiveKeywords identification={identification}/>
            <DataQualities dataQualities={metadata.data.dataQualities}/>
            <AccessConstraints identification={identification}/>
            <OtherConstraints identification={identification}/>
            <Classifications identification={identification}/>
            <UseLimitations identification={identification}/>
            <DistributionFormats distributionFormats={metadata.data.distributionFormats}/>
            <SpatialRepresentationTypes identification={identification}/>
            <HeaderAndParagraph
              visible={metadata.data.fileIdentifier && metadata.data.fileIdentifier.length > 0}
              header={strings.metadata.heading.fileIdentifier}
              text={metadata.data.fileIdentifier}
            />
            <HeaderAndParagraph
              visible={metadata.data.metadataStandardName && metadata.data.metadataStandardName.length > 0}
              header={strings.metadata.heading.metadataStandardName}
              text={metadata.data.metadataStandardName}
            />
            <HeaderAndParagraph
              visible={metadata.data.metadataStandardVersion && metadata.data.metadataStandardVersion.length > 0}
              header={strings.metadata.heading.metadataStandardVersion}
              text={metadata.data.metadataStandardVersion}
            />
            <HeaderAndParagraph
              visible={metadata.data.metadataLanguage && metadata.data.metadataLanguage.length > 0}
              header={strings.metadata.heading.metadataLanguage}
              text={strings.metadata.languages[metadata.data.metadataLanguage] || metadata.data.metadataLanguage}
            />
            <HeaderAndParagraph
              visible={metadata.data.metadataCharacterSet && metadata.data.metadataCharacterSet.length > 0}
              header={strings.metadata.heading.metadataCharacterSet}
              title={(strings.metadata.codeLists['gmd:MD_CharacterSetCode'][metadata.data.metadataCharacterSet] || { description: metadata.data.metadataCharacterSet }).description}
              text={(strings.metadata.codeLists['gmd:MD_CharacterSetCode'][metadata.data.metadataCharacterSet] || { label: metadata.data.metadataCharacterSet }).label}
            />
            <ResponsibleParties
              visible={metadata.data.metadataResponsibleParties && metadata.data.metadataResponsibleParties.length > 0}
              header={strings.metadata.heading.metadataOrganisation}
              responsibleParties={metadata.data.metadataResponsibleParties}/>
            <QualityTabDataQualities dataQualities={metadata.data.dataQualities}/>
          </StyledContent>
  );
}
export default MetadataModal;
