import { useState, useContext } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import strings from '../../../translations';
import { ReactReduxContext, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { updateLayers } from '../../../utils/rpcUtil';

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
      border: 'none'
    },
    overlay: {zIndex: 9999}
  };

const OSKARI_LOCALSTORAGE = "oskari";

const addToLocalStorageArray = (name, value) => {
    // Get the existing data
    var existing = localStorage.getItem(name);

    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    existing = existing ? existing.split(',') : [];

    // Add new data to localStorage Array
    existing.push(value);

    // Save back to localStorage
    localStorage.setItem(name, existing.toString());
}

const StyledCheckbox = styled.input`
    margin-right: 7px;
`;

const StyledContent = styled.div`
    padding: .5rem;
`;

const StyledHeader = styled.div`
    padding: .5rem;
    background-color: ${props => props.theme.colors.maincolor1};
    color: ${props => props.theme.colors.mainWhite};
    border-radius: 0;
`;

const StyledFooter = styled.div`
    justify-content: space-between;
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
        color: ${props => props.theme.colors.mainWhite};
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.maincolor2};
        }
    }
`;

export const ConfirmPopup = ({ filteredLayers, indeterminate }) => {
    console.log("DDDD");
    const [modalIsOpen, setIsOpen] = useState(true);
    const [selected, setIsSelected] = useState(false);
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel);
    console.log("DDDD");

    const afterOpenModal = () => {
        if (!indeterminate) {
                filteredLayers.map(layer => {
                    channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
                    return null;
                });
        } else {
                filteredLayers.map(layer => {
                    channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, false]);
                    return null;
                });
        }
        updateLayers(store, channel);
        // references are now sync'd and can be accessed.
    }

    const closeModal = () => {
        setIsOpen(false);
        if (selected) {
            addToLocalStorageArray(OSKARI_LOCALSTORAGE, "multipleLayersWarning");
        }
    }

    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={() => closeModal()}
                style={customStyles}
            >
            <StyledHeader className="modal-header">
                <h5>{strings.warning}</h5>
                <StyledLayerCloseIcon
                    onClick={() => {
                        closeModal();
                        }} title='Sulje'>
                        <FontAwesomeIcon
                            icon={faTimes}
                        />
                    </StyledLayerCloseIcon>
            </StyledHeader>
            <StyledContent>
                <p>
                    {strings.multipleLayersWarning}
                </p>
            </StyledContent>
            <StyledFooter className="modal-footer">
                <label>
                    <StyledCheckbox
                        name="announcementSelected"
                        type="checkbox"
                        onClick={() => setIsSelected(!selected)}
                    />
                    {strings.dontShowAgain}
                </label>
                <button onClick={() => closeModal()}>{strings.continue}</button>
                <button onClick={() => closeModal()}>{strings.cancel}</button>
            </StyledFooter>
        </Modal>
        </div>
    );
}
export default ConfirmPopup;