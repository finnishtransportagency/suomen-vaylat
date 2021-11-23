import styled from 'styled-components';
import { motion } from "framer-motion";

import DialogHeader from './DialogHeader';
import { useContext, useState } from "react";
import { ReactReduxContext, useSelector } from "react-redux";
import { updateLayers } from "../../utils/rpcUtil";
import strings from "../../translations";
import { Button } from "react-bootstrap";

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

const variants = {
    open: {
        pointerEvents: "auto",
        y: 0,
        opacity: 1,
    },
    closed: {
        pointerEvents: "none",
        y: "100%",
        opacity: 0,

    },
};

const StyledFooter = styled.div`
    justify-content: space-between;
`;

const StyledWarningDialog = styled(motion.div)`
    position: absolute;
    left: 50%;
    top: 35%;
    max-width: 300px;
    max-height: 500px;
    transform: translate(-50%, -50%);
    right: auto;
    bottom: auto;
    margin-right: '-50%';
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 4px;
    overflow: hidden;
    overflow-y: auto;
    user-select: none;
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
        &::-webkit-scrollbar {
        display: none;
    };
    p {
        padding: 20px;
    }
`;

const StyledButton = styled(Button)`
    border-radius: 30px;
    background-color: #0064af;
`;

const WarningDialog = ({ title='', message='', filteredLayers=[], indeterminate=false, hideWarn, dialogOpen, isChecked }) => {
    const [selected, setIsSelected] = useState(false);
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel);

    const closeModal = (cancel) => {
        if (cancel) {
            hideWarn();
            if (selected) {
                addToLocalStorageArray(OSKARI_LOCALSTORAGE, "multipleLayersWarning");
            }
        } else {
            filteredLayers.map(layer => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !isChecked]);
                return null;
            });
            // if (!indeterminate) {
            //     filteredLayers.map(layer => {
            //         channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
            //         return null;
            //     });
            // } else {
            //     filteredLayers.map(layer => {
            //         channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, false]);
            //         return null;
            //     });
            // }
            updateLayers(store, channel);
            hideWarn();
            if (selected) {
                addToLocalStorageArray(OSKARI_LOCALSTORAGE, "multipleLayersWarning");
            }
        }
    };

    return (
            <StyledWarningDialog
                    initial="closed"
                    animate={dialogOpen ? "open" : "closed"}
                    variants={variants}
            >
                <DialogHeader
                    type={"warning"}
                    title={title}
                    hideWarn={closeModal}
                />
                <p>{message}</p>
                <StyledFooter className="modal-footer">
                    <StyledButton onClick={() => closeModal()}>{strings.continue}</StyledButton>
                    <StyledButton onClick={() => closeModal(true)}>{strings.cancel}</StyledButton>
                </StyledFooter>
            </StyledWarningDialog>
    );
 }

 export default WarningDialog;
