import { useState } from 'react';
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

const StyledContent = styled.div`
  height: 100%;
  padding: 16px;
  overflow: auto;
  @media ${props => props.theme.device.mobileL} {
  };
`;

// Helper function to get deeply nested values with a fallback
const getNestedValue = (obj, path, fallback = "") => {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : fallback), obj);
};

export const MetadataModal = ({ metadata }) => {
  const lang = useAppSelector((state) => state.language);
  const [uuid, setUuid] = useState(true);

  const identification = metadata.data.identifications ? metadata.data.identifications[0] : null;
  const layerDesc = getNestedValue(metadata, ['layer', 'config', 'PDPUpdateDate', lang.current], "");

  // Synchronize uuid state with metadata
  if (metadata.uuid !== uuid) {
    setUuid(metadata.uuid);
  }

  return (
    <StyledContent>
      {identification && <MetadataGraphic identification={identification} />}
      {identification && <Citation identification={identification} />}
      
      <HeaderAndParagraph
        visible={Boolean(layerDesc)}
        header={strings.metadata.heading.updateDate}
        text={layerDesc}
      />
      <HeaderAndParagraph
        visible={Boolean(identification?.abstractText)}
        header={
          identification?.type === 'data' 
            ? strings.metadata.heading.abstractTextData 
            : strings.metadata.heading.abstractTextService
        }
        text={identification?.abstractText}
      />
      <HeaderAndParagraph
        visible={Boolean(metadata.data.metadataDateStamp)}
        header={strings.metadata.heading.metadataDateStamp}
        text={metadata.data.metadataDateStamp || ""}
        momentFormat="DD.MM.YYYY hh:mm:ss"
      />

      {metadata.data.onlineResources && (
        <OnlineResources onlineResources={metadata.data.onlineResources} />
      )}
      {identification && <Languages identification={identification} />}
      {identification && <TopicCategories identification={identification} />}
      {identification && <TemporalExtents identification={identification} />}
      {metadata.data.lineageStatements && (
        <LineageStatements lineageStatements={metadata.data.lineageStatements} />
      )}
      {identification && <SpatialResolutions identification={identification} />}
      
      <ResponsibleParties
        visible={Boolean(identification?.responsibleParties?.length)}
        header={strings.metadata.heading.responsibleParty}
        responsibleParties={identification?.responsibleParties || []}
      />

      {identification && <CitationDate identification={identification} />}
      {metadata.data.scopeCodes && <ScopeCodes scopeCodes={metadata.data.scopeCodes} />}
      {identification && <ResourceIdentifiers identification={identification} />}
      {identification && <OperatesOn identification={identification} />}
      {identification && <ServiceType identification={identification} />}
      {identification && <DescriptiveKeywords identification={identification} />}
      {metadata.data.dataQualities && (
        <DataQualities dataQualities={metadata.data.dataQualities} />
      )}
      {identification && <AccessConstraints identification={identification} />}
      {identification && <OtherConstraints identification={identification} />}
      {identification && <Classifications identification={identification} />}
      {identification && <UseLimitations identification={identification} />}
      {metadata.data.distributionFormats && (
        <DistributionFormats distributionFormats={metadata.data.distributionFormats} />
      )}
      {identification && <SpatialRepresentationTypes identification={identification} />}

      <HeaderAndParagraph
        visible={Boolean(metadata.data.fileIdentifier)}
        header={strings.metadata.heading.fileIdentifier}
        text={metadata.data.fileIdentifier || ""}
      />
      <HeaderAndParagraph
        visible={Boolean(metadata.data.metadataStandardName)}
        header={strings.metadata.heading.metadataStandardName}
        text={metadata.data.metadataStandardName || ""}
      />
      <HeaderAndParagraph
        visible={Boolean(metadata.data.metadataStandardVersion)}
        header={strings.metadata.heading.metadataStandardVersion}
        text={metadata.data.metadataStandardVersion || ""}
      />
      <HeaderAndParagraph
        visible={Boolean(metadata.data.metadataLanguage)}
        header={strings.metadata.heading.metadataLanguage}
        text={
          getNestedValue(strings, ["metadata", "languages", metadata.data.metadataLanguage], metadata.data.metadataLanguage)
        }
      />
      <HeaderAndParagraph
        visible={Boolean(metadata.data.metadataCharacterSet)}
        header={strings.metadata.heading.metadataCharacterSet}
        title={
          getNestedValue(strings, ["metadata", "codeLists", "gmd:MD_CharacterSetCode", metadata.data.metadataCharacterSet, "description"], metadata.data.metadataCharacterSet)
        }
        text={
          getNestedValue(strings, ["metadata", "codeLists", "gmd:MD_CharacterSetCode", metadata.data.metadataCharacterSet, "label"], "")
        }
      />
      <ResponsibleParties
        visible={Boolean(metadata.data.metadataResponsibleParties?.length)}
        header={strings.metadata.heading.metadataOrganisation}
        responsibleParties={metadata.data.metadataResponsibleParties || []}
      />
      {metadata.data.dataQualities && (
        <QualityTabDataQualities dataQualities={metadata.data.dataQualities} />
      )}
    </StyledContent>
  );
}

export default MetadataModal;
