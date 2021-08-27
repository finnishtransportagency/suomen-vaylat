import React, { useContext } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import Modal from 'react-modal';
import { clearLayerMetadata } from '../../state/slices/rpcSlice';
import styled from 'styled-components';
import strings from '../../translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import AbstractTab from './AbstractTab';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '0',
    borderRadius: 0,
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
    border: 'none',
    height: '80%',
    width: '80%',
    maxWidth: '1000px',
    maxHeight: '800px',
    overflow: 'hidden'
  },
  overlay: {zIndex: 5}
};

const StyledContent = styled.div`
    padding: .5rem;
    height: 100%;
`;
const StyledHeader = styled.div`
    padding: .5rem;
    background-color: #0064af;
    color: #ffffff;
    border-radius: 0
`;


const StyledLayerCloseIcon = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 28px;
    min-height: 28px;
    svg {
        transition: all 0.1s ease-out;
        font-size: 18px;
        color: #ffffff;
    };
    &:hover {
        svg {
            color: #009ae1;
        }
    }
`;

const Tab = styled.button`
  font-size: 16px;
  padding: 10px 10px;
  cursor: pointer;
  opacity: 0.6;
  background: white;
  border: 0;
  outline: 0;
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
    overflow:auto;
`;


// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

export const MetadataModal = () => {
    const [active, setActive] = React.useState(true);
    const [uuid, setUuid] = React.useState(true);
    const { store } = useContext(ReactReduxContext);
    const metadata = useSelector((state) => state.rpc.layerMetadata);
    const layerName = metadata.layer ? metadata.layer.name : '';
    const identification = (metadata.data && metadata.data.identifications) ? metadata.data.identifications[0] : {};

    if (metadata.uuid !== uuid) {
        setActive('ABSTRACT');
        setUuid(metadata.uuid);
    }
    console.log(metadata);


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
                style={customStyles}
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
            key={'JHS158'}
            active={active === 'JHS158'}
            onClick={() => setActive('JHS158')}
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
        {metadata.data !== null && active === 'ABSTRACT' &&
          <AbstractTab identification={identification} datestamp={metadata.data.metadataDateStamp}></AbstractTab>
        }
      </StyledTabContent>
            </StyledContent>
        </Modal>
        </div>
    );
}
export default MetadataModal;