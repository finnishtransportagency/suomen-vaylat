import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../../state/hooks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faFile,
    faFileArchive,
} from '@fortawesome/free-solid-svg-icons';

import ModalListItem from '../modals/ModalListItem';
import CheckBox from '../checkbox/CheckBox';

import SVLoader from '../loader/SvLoader';
import strings from '../../translations';

const StyledGfiDownloadsContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 24px;
    overflow: auto;
    @media ${(props) => props.theme.device.mobileL} {
        padding: 16px;
    }
    background-color: white;
`;

const StyledListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;
`;

const StyledLoadingOverlay = styled(motion.div)`
    z-index: 2;
    position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(4px);
`;

const StyledSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    color: ${(props) => props.theme.colors.mainColor1};
    padding: 0px 0px 10px 5px;
    font-size: 16px;
    font-weight: bold;
`;

const StyledCloseButton = styled.div`
    z-index: 1;
    position: sticky;
    top: 0px;
    right: 0px;
    display: flex;
    justify-content: flex-end;
    svg {
        font-size: 24px;
        color: ${(props) => props.theme.colors.mainColor1};
        cursor: pointer;
    }
`;

const StyledDownloadFormats = styled.div`
    display: flex;
    gap: 16px;
    justify-content: center;
    padding: 16px;
`;

const StyledDownloadFormat = styled(motion.button)`
    position: relative;
    width: 56px;
    height: 56px;
    display: flex;
    gap: 6px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 2px 4px #0000004d;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    pointer-events: auto;
    svg {
        color: ${(props) => props.theme.colors.mainWhite};
        font-size: 22px;
    }
    p {
        margin: 0;
        font-weight: bold;
        font-size: 10px;
        color: ${(props) => props.theme.colors.mainWhite};
        margin-top: -4px;
    }
`;

const StyledLoaderWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 999;
    height: 100%;
    max-width: 200px;
    max-height: 200px;
    transform: translate(-50%, -50%);
    svg {
        width: 100%;
        height: 100%;
        fill: none;
    }
`;

const GfiDownloadMenu = ({ handleGfiDownloadsMenu, handleGfiDownload, closeButton = true }) => {
    const [loading] = useState(false);

    let { gfiLocations, allLayers, gfiCroppingArea, selectedLayersByType } = useAppSelector(
        (state) => state.rpc
    );

    const [selectedLayers, setSelectedLayers] = useState([]);

    const [downloadFormats] = useState([
        {
            id: 'download-format-gpkg',
            title: '.GPKG',
            format: 'gpkg',
            selected: false,
            loading: false,
        },
        {
            id: 'download-format-shape',
            title: '.SHP',
            format: 'shape-zip',
            selected: false,
            loading: false,
        },
        {
            id: 'download-format-csv',
            title: '.CSV',
            format: 'csv',
            selected: false,
            loading: false,
        },
        {
            id: 'download-format-xls',
            title: '.XLS',
            format: 'excel2007',
            selected: false,
            loading: false,
        },
        {
            id: 'download-format-json',
            title: '.JSON',
            format: 'application/json',
            selected: false,
            loading: false,
        }
    ]);

    const handleSelectLayer = (layer) => {
        if (
            selectedLayers?.find(
                (selectedLayer) => selectedLayer.id === layer.id
            )
        ) {
            setSelectedLayers(
                selectedLayers?.filter(
                    (selectedLayer) => selectedLayer.id !== layer.id
                )
            );
        } else {
            setSelectedLayers([...selectedLayers, layer]);
        }
    };

    useEffect(() => {
        const layers =
            gfiLocations &&
            gfiLocations.length > 0 &&
            gfiLocations.map((location, index) => {
                const layer = allLayers.find(
                    (layer) => layer.id === location.layerId
                );
                return layer;
            });
        setSelectedLayers(layers);
    }, [allLayers, gfiLocations]);

    return (
        <StyledGfiDownloadsContainer>
            { closeButton &&
                <StyledCloseButton onClick={() => handleGfiDownloadsMenu()}>
                    <FontAwesomeIcon icon={faTimes} />
                </StyledCloseButton>
            }
            <AnimatePresence>
                {loading && (
                    <StyledLoadingOverlay
                        transition={{
                            duration: 0.2,
                            type: 'tween',
                        }}
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                    >
                        <StyledLoaderWrapper>
                            <SVLoader />
                        </StyledLoaderWrapper>
                    </StyledLoadingOverlay>
                )}
            </AnimatePresence>
            <StyledSubtitle>{strings.downloads.layers}:</StyledSubtitle>
            <StyledListContainer>
                {gfiLocations &&
                    gfiLocations.length > 0 &&
                    gfiLocations.map((location, index) => {
                        const isBackgroundMap = selectedLayersByType.backgroundMaps.filter(l => 
                            l.id !== location.layerId
                        ).length > 0;
                        if (isBackgroundMap) {
                            return null;
                        }
                        const layer = allLayers.find(
                            (layer) => layer.id === location.layerId
                        );

                        return (
                            <ModalListItem
                                key={'gfi_download_' + location.layerId}
                                index={index}
                                id={location.layerId}
                                icon={faFile}
                                title={layer.name && layer.name}
                            >
                                <CheckBox
                                    checked={selectedLayers.length > 0 && selectedLayers?.find(
                                        (selectedLayer) =>
                                            selectedLayer.id ===
                                            location.layerId
                                    )}
                                    selectAction={() => {
                                        handleSelectLayer(layer);
                                    }}
                                />
                            </ModalListItem>
                        );
                    })}
            </StyledListContainer>
            <StyledSubtitle
                style={{ display: 'flex', justifyContent: 'center' }}
            >
                {strings.downloads.format}:
            </StyledSubtitle>
            <StyledDownloadFormats>
                {downloadFormats.map((format) => {
                    return (
                        <StyledDownloadFormat
                            key={format.id}
                            transition={{
                                duration: 0.2,
                                type: 'tween',
                            }}
                            whileHover={{
                                backgroundColor: !format.loading
                                    ? '#3c85bd'
                                    : '#DDD',
                                transition: { duration: 0.2 },
                            }}
                            disabled={
                                selectedLayers.length === 0 || format.loading
                            }
                            animate={{
                                backgroundColor:
                                    selectedLayers.length === 0 ||
                                    format.loading
                                        ? '#DDD'
                                        : '#0064af',
                            }}
                            onClick={() =>
                                handleGfiDownload(
                                    format,
                                    selectedLayers,
                                    gfiCroppingArea
                                )
                            }
                        >
                            <FontAwesomeIcon icon={faFileArchive} />
                            <p>{format.title.toUpperCase()}</p>
                        </StyledDownloadFormat>
                    );
                })}
            </StyledDownloadFormats>
        </StyledGfiDownloadsContainer>
    );
};

export default GfiDownloadMenu;
