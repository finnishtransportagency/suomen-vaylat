import { useContext, useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import { ReactReduxContext, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { clearLayerMetadata } from '../../state/slices/rpcSlice';
import strings from '../../translations';
import './MetadataModal.scss';
import MetadataGraphic from './Tabs/Components/MetadataGraphic';
import Citation from './Tabs/Components/Citation';
import HeaderAndParagraph from './Tabs/Components/HeaderAndParagraph';
import OnlineResources from './Tabs/Components/OnlineResources';
import Languages from './Tabs/Components/Languages';
import TopicCategories from './Tabs/Components/TopicCategories';
import TemporalExtents from './Tabs/Components/TemporalExtents';
import LineageStatements from './Tabs/Components/LineageStatements';
import SpatialResolutions from './Tabs/Components/SpatialResolutions';
import ResponsibleParties from './Tabs/Components/ResponsibleParties';
import CitationDate from './Tabs/Components/CitationDate';
import DistributionFormats from './Tabs/Components/DistributionFormats';
import SpatialRepresentationTypes from './Tabs/Components/SpatialRepresentationTypes';
import ScopeCodes from './Tabs/Components/ScopeCodes';
import ResourceIdentifiers from './Tabs/Components/ResourceIdentifiers';
import OperatesOn from './Tabs/Components/OperatesOn';
import ServiceType from './Tabs/Components/ServiceType';
import DescriptiveKeywords from './Tabs/Components/DescriptiveKeywords';
import DataQualities from './Tabs/Components/DataQualities';
import AccessConstraints from './Tabs/Components/AccessConstraints';
import OtherConstraints from './Tabs/Components/OtherConstraints';
import Classifications from './Tabs/Components/Classifications';
import UseLimitations from './Tabs/Components/UseLimitations';
import QualityTabDataQualities from './Tabs/Components/QualityTabDataQualities';


const StyledContent = styled.div`
    padding: .5rem;
    height: calc(100% - 50px);
    @media (max-width: 460px) {
      height: calc(100% - 50px);
    };
`;
const StyledHeader = styled.div`
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.mainColor1};
    padding: .5rem;
    border-radius: 0;
`;

const StyledLayerCloseIcon = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 28px;
    min-height: 28px;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 18px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.mainColor2};
        }
    }
`;

export const MetadataModal = () => {

  useAppSelector((state) => state.language);

  const { store } = useContext(ReactReduxContext);

  const metadata = useSelector((state) => state.rpc.layerMetadata);

  const [uuid, setUuid] = useState(true);

  const layerName = metadata.layer ? metadata.layer.name : '';
  const identification = (metadata.data && metadata.data.identifications) ? metadata.data.identifications[0] : {};

  if (metadata.uuid !== uuid) {
    setUuid(metadata.uuid);
  }


  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    store.dispatch(clearLayerMetadata());
  }

  return (
    <div>
      <Modal
        isOpen={metadata.data !== null}
        onAfterOpen={afterOpenModal}
        onRequestClose={() => closeModal()}
        className={'metadata-modal'}
      >
        <StyledHeader className='modal-header'>
          <h5>{strings.formatString(strings.metadata.title, layerName)}</h5>
          <StyledLayerCloseIcon
            onClick={() => {
              closeModal();
            }}>
            <FontAwesomeIcon
              icon={faTimes}
            />
          </StyledLayerCloseIcon>
        </StyledHeader>
        {metadata.data !== null &&
          <StyledContent className='metadata-content'>
            <MetadataGraphic identification={identification}></MetadataGraphic>
            <Citation identification={identification}></Citation>
            <HeaderAndParagraph
              visible={identification.abstractText.length > 0}
              header={(identification.type === 'data' ? strings.metadata.heading.abstractTextData : strings.metadata.heading.abstractTextService)}
              text={identification.abstractText}
            ></HeaderAndParagraph>
            <HeaderAndParagraph
              visible={metadata.data.metadataDateStamp.length > 0}
              header={strings.metadata.heading.metadataDateStamp}
              text={metadata.data.metadataDateStamp}
              momentFormat={'DD.MM.YYYY hh:mm:ss'}
            ></HeaderAndParagraph>
            <OnlineResources onlineResources={metadata.data.onlineResources}></OnlineResources>
            <Languages identification={identification}></Languages>
            <TopicCategories identification={identification}></TopicCategories>
            <TemporalExtents identification={identification}></TemporalExtents>
            <LineageStatements lineageStatements={metadata.data.lineageStatements}></LineageStatements>
            <SpatialResolutions identification={identification}></SpatialResolutions>
            <ResponsibleParties
              visible={identification.responsibleParties && identification.responsibleParties.length > 0}
              header={strings.metadata.heading.responsibleParty}
              responsibleParties={identification.responsibleParties}></ResponsibleParties>
            <CitationDate identification={identification}></CitationDate>
            <ScopeCodes scopeCodes={metadata.data.scopeCodes}></ScopeCodes>
            <ResourceIdentifiers identification={identification}></ResourceIdentifiers>
            <OperatesOn identification={identification}></OperatesOn>
            <ServiceType identification={identification}></ServiceType>
            <DescriptiveKeywords identification={identification}></DescriptiveKeywords>
            <DataQualities dataQualities={metadata.data.dataQualities}></DataQualities>
            <AccessConstraints identification={identification}></AccessConstraints>
            <OtherConstraints identification={identification}></OtherConstraints>
            <Classifications identification={identification}></Classifications>
            <UseLimitations identification={identification}></UseLimitations>
            <DistributionFormats distributionFormats={metadata.data.distributionFormats}></DistributionFormats>
            <SpatialRepresentationTypes identification={identification}></SpatialRepresentationTypes>
            <HeaderAndParagraph
              visible={metadata.data.fileIdentifier && metadata.data.fileIdentifier.length > 0}
              header={strings.metadata.heading.fileIdentifier}
              text={metadata.data.fileIdentifier}
            >
            </HeaderAndParagraph>
            <HeaderAndParagraph
              visible={metadata.data.metadataStandardName && metadata.data.metadataStandardName.length > 0}
              header={strings.metadata.heading.metadataStandardName}
              text={metadata.data.metadataStandardName}
            >
            </HeaderAndParagraph>
            <HeaderAndParagraph
              visible={metadata.data.metadataStandardVersion && metadata.data.metadataStandardVersion.length > 0}
              header={strings.metadata.heading.metadataStandardVersion}
              text={metadata.data.metadataStandardVersion}
            >
            </HeaderAndParagraph>
            <HeaderAndParagraph
              visible={metadata.data.metadataLanguage && metadata.data.metadataLanguage.length > 0}
              header={strings.metadata.heading.metadataLanguage}
              text={strings.metadata.languages[metadata.data.metadataLanguage] || metadata.data.metadataLanguage}
            >
            </HeaderAndParagraph>
            <HeaderAndParagraph
              visible={metadata.data.metadataCharacterSet && metadata.data.metadataCharacterSet.length > 0}
              header={strings.metadata.heading.metadataCharacterSet}
              title={(strings.metadata.codeLists['gmd:MD_CharacterSetCode'][metadata.data.metadataCharacterSet] || { description: metadata.data.metadataCharacterSet }).description}
              text={(strings.metadata.codeLists['gmd:MD_CharacterSetCode'][metadata.data.metadataCharacterSet] || { label: metadata.data.metadataCharacterSet }).label}></HeaderAndParagraph>
            <ResponsibleParties
              visible={metadata.data.metadataResponsibleParties && metadata.data.metadataResponsibleParties.length > 0}
              header={strings.metadata.heading.metadataOrganisation}
              responsibleParties={metadata.data.metadataResponsibleParties}></ResponsibleParties>
            <QualityTabDataQualities dataQualities={metadata.data.dataQualities}></QualityTabDataQualities>

          </StyledContent>
        }
      </Modal>
    </div>
  );
}
export default MetadataModal;