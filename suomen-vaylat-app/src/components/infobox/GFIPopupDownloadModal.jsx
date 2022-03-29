import { useState, useEffect, useContext } from 'react';
import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';
import ModalListItem from "../modals/ModalListItem";
import { motion} from 'framer-motion';
import strings from '../../translations';

import {faFileArchive} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


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

const StyledDownloadButton = styled.div`
    width: 250px;
    height: 30px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.disabled ? "rgba(177, 177, 177, 0.5)" : props.theme.colors.mainColor1};
    margin: 20px auto 20px auto;
    border-radius: 15px;
    p {
        margin: 0;
        font-size: 12px;
        font-weight: 600;
    };
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
    pointer-events: auto;
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
    const defaultDownloadFormats = [
        {
            id: "download-format-shape",
            title: "shape",
            selected: false
        },
        {
            id: "download-format-csv",
            title: "csv",
            selected: false
        },
        {
            id: "download-format-xls",
            title: "excel",
            selected: false
        },
        {
            id: "download-format-json",
            title: "json",
            selected: false
        }
    ];
    const [checkedCheckboxes, setCheckedCheckboxes] = useState([Ids]);
    const [downloadFormats, setDownloadFormats] = useState(defaultDownloadFormats);

    const {allLayers} = useAppSelector(state => state.rpc);


    const setCheckedCheckboxesHandler = (eventId) => {
        let newIds = [];
        checkedCheckboxes[0].map((checkbox) => {
            if(eventId == checkbox.layerId) checkbox.value = !checkbox.value
            newIds.push(checkbox)
        })
        setCheckedCheckboxes([newIds])
    }

    const setDownloadFormat = (formatId) => {
        let newSelectedFormats = [];
        downloadFormats.map((format) => {
            if(format.id == formatId) format.selected = !format.selected
            newSelectedFormats.push(format)
        })
        setDownloadFormats(newSelectedFormats)
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
                            title={allLayers.filter(layer => layer.id === location.layerId).length > 0 ? allLayers.filter(layer => layer.id === location.layerId)[0].name : strings.download.downloadLayerTitleNotDefined}
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
                            return (
                                <div onClick={() => setDownloadFormat(format.id)}>
                                    <StyledDownloadFormat
                                        key={format.id}
                                        whileHover={{
                                            scale: 1.1,
                                            transition: { duration: 0.2 },
                                        }}
                                        disabled={format.selected === false}
                                    >
                                        <FontAwesomeIcon
                                            icon={faFileArchive}
                                        />
                                        <p>{format.title.toUpperCase()}</p>
                                    </StyledDownloadFormat>
                                </div>
                            )
                        })
                    }
                </StyledDownloadFormats>
                <StyledDownloadButton
                    disabled={!downloadFormats.filter(format => format.selected === true).length > 0}
                >
                    <p>{strings.download.downloadButton}</p>
                </StyledDownloadButton>
        </StyledViewsContainer>
    )

};

export default GFIPopupDownloadModal;