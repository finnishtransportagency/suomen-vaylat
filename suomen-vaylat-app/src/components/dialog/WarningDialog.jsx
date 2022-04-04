import styled from 'styled-components';
import { useContext, useState } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import { updateLayers } from '../../utils/rpcUtil';
import strings from '../../translations';
import { Button } from 'react-bootstrap';

const OSKARI_LOCALSTORAGE = 'oskari';

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
};


const StyledFooter = styled.div`
    padding: 24px;
    display: flex;
    justify-content: space-between;
`;

const StyledContent = styled.div`
    max-width: 600px;
    padding: 24px;
`;

const StyledButton = styled(Button)`
    border-radius: 30px;
    background-color: #0064af;
`;

const StyledErrorList = styled.ul`
    padding-inline-start: 16px;
`;

const StyledErrorMessage = styled.li`
    font-size: 14px;
`;

const WarningDialog = ({
    message,
    errors,
    filteredLayers,
    hideWarn,
    isChecked,
    warningType
}) => {

    const [selected] = useState(false);
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel);

    const closeModal = (cancel) => {
        if (cancel) {
            hideWarn();
            if (selected) {
                addToLocalStorageArray(OSKARI_LOCALSTORAGE, 'multipleLayersWarning');
            }
        } else {
            filteredLayers.map(layer => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !isChecked]);
                return null;
            });
            updateLayers(store, channel);
            hideWarn();
            if (selected) {
                addToLocalStorageArray(OSKARI_LOCALSTORAGE, 'multipleLayersWarning');
            }
        }
    };

    return (
        <>
           <StyledContent>
                {message}
                {
                    errors && <StyledErrorList>
                        {
                            errors.map(error => <StyledErrorMessage>{error}</StyledErrorMessage>)
                        }
                    </StyledErrorList>
                }
            </StyledContent>
            {warningType === 'multipleLayersWarning' &&
                <StyledFooter>
                    <StyledButton onClick={() => closeModal()}>{strings.general.continue}</StyledButton>
                    <StyledButton onClick={() => closeModal(true)}>{strings.general.cancel}</StyledButton>
                </StyledFooter>
            }
        </>
    );
 }

 export default WarningDialog;
