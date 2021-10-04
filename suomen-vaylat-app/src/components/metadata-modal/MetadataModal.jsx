import React, { useState, useContext } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import Modal from 'react-modal';
import { clearLayerMetadata } from '../../state/slices/rpcSlice';
import styled from 'styled-components';
import strings from '../../translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import AbstractTab from './Tabs/AbstractTab';
import JhsTab from './Tabs/JhsTab';
import InspireTab from './Tabs/InspireTab';
import QualityTab from './Tabs/QualityTab';
import { useAppSelector } from '../../state/hooks';

import './MetadataModal.scss';

const StyledContent = styled.div`
    height: 100%;
    padding: .5rem;
`;
const StyledHeader = styled.div`
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.maincolor1};
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
            color: ${props => props.theme.colors.maincolor2};
        }
    }
`;

const Tab = styled.button`
  cursor: pointer;
  opacity: 0.6;
  background: white;
  outline: 0;
  padding: 4px 4px;
  border: 0;
  font-size: 16px;
  ${({ active }) =>
    active &&
    `
    border-bottom: 2px solid black;
    opacity: 1;
  `}
`;
const ButtonGroup = styled.div`
  display: flex;
`;

const StyledTabContent = styled.div`
    height: calc(100% - 110px);
    overflow: auto;
    @media (max-width: 460px) {
      height: calc(100% - 140px);
    };
`;

export const MetadataModal = () => {

  useAppSelector((state) => state.language);

  const { store } = useContext(ReactReduxContext);

  const metadata = useSelector((state) => state.rpc.layerMetadata);

  const [active, setActive] = useState(true);
  const [uuid, setUuid] = useState(true);

  const layerName = metadata.layer ? metadata.layer.name : '';
  const identification = (metadata.data && metadata.data.identifications) ? metadata.data.identifications[0] : {};

  if (metadata.uuid !== uuid) {
    setActive('ABSTRACT');
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
        <StyledHeader className="modal-header">
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
          <StyledContent>
            <ButtonGroup>
              <Tab
                key={'ABSTRACT'}
                active={active === 'ABSTRACT' || active === null}
                onClick={() => setActive('ABSTRACT')}
              >
                {strings.metadata.tabs.abstract}
              </Tab>
              <Tab
                key={'JHS'}
                active={active === 'JHS'}
                onClick={() => setActive('JHS')}
              >
                {strings.metadata.tabs.jhs}
              </Tab>
              <Tab
                key={'INSPIRE'}
                active={active === 'INSPIRE'}
                onClick={() => setActive('INSPIRE')}
              >
                {strings.metadata.tabs.inspire}
              </Tab>
              <Tab
                key={'QUALITY'}
                active={active === 'QUALITY'}
                onClick={() => setActive('QUALITY')}
              >
                {strings.metadata.tabs.quality}
              </Tab>

            </ButtonGroup>
            <p />
            <StyledTabContent>
              <AbstractTab
                visible={metadata.data !== null && active === 'ABSTRACT'}
                data={metadata.data}
                identification={identification}
              >
              </AbstractTab>
              <JhsTab
                visible={metadata.data !== null && active === 'JHS'}
                data={metadata.data}
                identification={identification}
              >
              </JhsTab>
              <InspireTab
                visible={metadata.data !== null && active === 'INSPIRE'}
                data={metadata.data}
                identification={identification}
              >
              </InspireTab>
              <QualityTab
                visible={metadata.data !== null && active === 'QUALITY'}
                data={metadata.data}
                identification={identification}
              >
              </QualityTab>
            </StyledTabContent>
          </StyledContent>
        }
      </Modal>
    </div>
  );
}
export default MetadataModal;