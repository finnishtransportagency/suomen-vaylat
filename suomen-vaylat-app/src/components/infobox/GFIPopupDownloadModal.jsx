import { useState, useEffect, useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { updateLayers } from '../../utils/rpcUtil';
import styled from 'styled-components';
import ModalListItem from "../modals/ModalListItem";
import { motion, AnimatePresence} from 'framer-motion';
import strings from '../../translations';
import Moment from 'react-moment';
import { v4 as uuidv4 } from 'uuid';

import { isMobile } from '../../theme/theme';

import {
    setIsSaveViewOpen,
    setWarning
} from '../../state/slices/uiSlice';

import {faFileArchive, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CircleButton from '../circle-button/CircleButton';

const StyledViewsContainer = styled.div`
    padding: 24px;
    max-height: 500px;
    overflow: auto;
`;

const StyledSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    color: ${props => props.theme.colors.mainColor1};
    padding: 10px 0px 10px 5px;
    font-size: 15px;
`;

const StyledDownloadFormats = styled.div`
    display: flex;
    margin-left: auto;
    margin-right: auto;
    gap: 16px;
    justify-content: center;
`;


const StyledDownloadFormat = styled(motion.button)`
    width: 56px;
    height: 56px;
    display: flex;
    gap: 6px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.disabled ? "rgba(177, 177, 177, 0.5)" : props.theme.colors.mainColor1};
    box-shadow: 0px 2px 4px #0000004D;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    pointer-events: ${props => !props.disabled && "auto"};
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 22px;
    };
    p {
        margin: 0;
        font-weight: bold;
        font-size: 10px;
        color: ${props => props.theme.colors.mainWhite};
        margin-top: -4px;
    };
`;

const GFIPopupDownloadModal = (gfiLocations) => {
    const Ids = gfiLocations.gfiLocations.map((location) => {
        return {layerId: location.layerId, value: true}
    })
    const [checkedCheckboxes, setCheckedCheckboxes] = useState([Ids]);

    const {allLayers} = useAppSelector(state => state.rpc);
    const downloadFormats = [
        {
            id: "download-format-shape",
            title: "shape"
        },
        {
            id: "download-format-csv",
            title: "csv"
        },
        {
            id: "download-format-xls",
            title: "excel"
        },
        {
            id: "download-format-json",
            title: "json"
        }
    ];

    const setCheckedCheckboxesHandler = (eventId) => {
        let newIds = [];
        checkedCheckboxes[0].map((checkbox) => {
            if(eventId == checkbox.layerId) checkbox.value = !checkbox.value
            newIds.push(checkbox)
        })
        setCheckedCheckboxes([newIds])
    }

    return (
        <StyledViewsContainer>
            <StyledSubtitle>{strings.download.downloadModalString}:</StyledSubtitle>
            {gfiLocations.gfiLocations.length > 0 ? gfiLocations.gfiLocations.map((location, index) => {
                    return (
                        <ModalListItem
                            index={index}
                            layerId={location.layerId}
                            checkedValue={checkedCheckboxes[0].filter(checkbox => checkbox.layerId === location.layerId && checkbox.value == true).length > 0}
                            setCheckedCheckboxes={setCheckedCheckboxesHandler}
                            title={allLayers.filter(layer => layer.id === location.layerId).length > 0 ? allLayers.filter(layer => layer.id === location.layerId)[0].name : "Ei määritetty"}
                        />
                    )
                }) : []
            }
                <StyledSubtitle style={{display: 'flex', justifyContent: 'center'}}>
                    {strings.download.downloadModalSelectedLayers}
                </StyledSubtitle>
                <StyledDownloadFormats>
                    {
                        downloadFormats.map(format => {
                            return <StyledDownloadFormat
                                key={format.id}
                                whileHover={{
                                    scale: 1.1,
                                    transition: { duration: 0.2 },
                                }}
                                // disabled={!selectedDownloads.length > 0}
                                onClick={() => console.log("SADDSA")}
                            >
                                <FontAwesomeIcon
                                    icon={faFileArchive}
                                />
                                <p>{format.title.toUpperCase()}</p>
                            </StyledDownloadFormat>
                        })
                    }
                </StyledDownloadFormats>
        </StyledViewsContainer>
    )

};

export default GFIPopupDownloadModal;