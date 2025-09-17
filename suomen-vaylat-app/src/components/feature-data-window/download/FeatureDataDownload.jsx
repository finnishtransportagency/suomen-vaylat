import styled from 'styled-components';
import strings from '../../../translations';
import Moment from 'react-moment';
import { useContext, useState, useEffect } from 'react';
import { theme } from '../../../theme/theme';
import { setDownloadRemove } from '../../../state/slices/rpcSlice';
import { ReactReduxContext } from 'react-redux';

import { setIsGfiDownloadOpen, setIsGfiToolsOpen } from '../../../state/slices/uiSlice';

import { useAppSelector } from '../../../state/hooks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileArchive, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import DialogListItem from '../../dialog/DialogListItem';
import SvLoader from '../../../utils/components/SvLoader';

const StyledDownloadsContainer = styled.div`
    width:100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: auto;
`;

const StyledSubtitle = styled.p`
    display: flex;
    justify-content: flex-start;
    color: ${props => props.theme.colors.mainColor1};
    padding: 16px 0px 8px 0px;
    font-size: 16px;
    font-weight: bold;
    margin: 0;
`;

const StyledDescription = styled.p`
    display: flex;
    justify-content: flex-start;
    color: ${props => props.theme.colors.mainColor1};
    font-size: 14px;
    font-weight: 400;
    margin: 0;
`;

const StyledListItemTitleWrapper = styled.ul`
    margin: 0;
    li {
        font-size: 14px;
        font-weight: 300;
        span {
            font-size: 12px;
            font-weight: bold;
        }
    }

    p {
        margin: 0;
    }

    ul {
        li {
            font-size: 12px;
            font-weight: bold;
        }
    }
`;

const StyledDownloadButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    svg {
        font-size: 22px;
        color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        &:hover {
            color: ${(props) => props.theme.colors.mainColor1};
        }
    }
`;

const StyledLoaderWrapper = styled.div`
    z-index: 999;
    height: 100%;
    max-width: 40px;
    svg {
        width: 100%;
        height: 100%;
        fill: none;
    }
`;

const StyledDowloadButton = styled.button`
  height: 3em;
  color: ${(props) => props.theme.colors.mainWhite};
  border-radius: 20px;
  box-shadow: 0px 1px 3px #0000001f;
  border: none;
  margin: 0.5em 0 0.5em 0;
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.darkGrey
      : props.theme.colors.mainColor1};
`;

const DownloadItem = ({
    download,
    closeAction,
    color,
    children
}) => {
    return (
        <DialogListItem
            key={download.id}
            id={download.id}
            icon={faFileArchive}
            title={
                <StyledListItemTitleWrapper key={'download-wrapper-list-item-' + download.id}>
                    <li key={'download-wrapper-format-' + download.id}>{strings.downloads.format}: <span>{download.format && download.format}</span></li>
                    <li key={'download-wrapper-date-' + download.id}>{strings.downloads.date}: <span><Moment format='DD.MM.YYYY HH:mm' tz='Europe/Helsinki'>{download.date}</Moment></span></li>
                    <li key={'download-wrapper-file-size-' + download.id}>{strings.downloads.fileSize}: <span>{download.fileSize ? download.fileSize : "-"}</span></li>
                    <li key={'download-wrapper-layers-' + download.id}>{strings.downloads.layers}: </li>
                        <ul key={'download-ul-' + download.id}>
                            {
                                download.layers.map(layer => {
                                    if (!download.errorLayers.includes(layer.id)) {
                                        return <li key={'li-'+layer.id}>{layer.name}</li>
                                    }
                                    return null;
                                })
                            }
                        </ul>
                    {download.errorLayers && download.errorLayers.length > 0 &&
                        <>
                        <li key={'download-wrapper-layers-' + download.id}>{strings.downloads.errorLayers}: </li>
                            <ul key={'download-ul-error-' + download.id}>
                                {
                                    download.layers.map(layer => {
                                        if (download.errorLayers.includes(layer.id)) {
                                            return <li key={'li-'+layer.id}>{layer.name}</li>
                                        }
                                        return null;
                                    })
                                }
                            </ul>
                        </>
                    }
                </StyledListItemTitleWrapper>
            }
            closeAction={closeAction}
            color={color}
        >
            {children && children}
        </DialogListItem>
    )
};



const FeatureDataDownload = () => {
    let { downloads, gfiLocations, selectedLayersByType } = useAppSelector((state) => state.rpc);
    const { store } = useContext(ReactReduxContext);
    const [noDownloadableLayers, setNoDownloadableLayers] = useState(false);

    const handleGfiLocationsOpen = () => {
        store.dispatch(setIsGfiToolsOpen(true));
        store.dispatch(setIsGfiDownloadOpen(false));
    }

    useEffect(() => {
        const onlyUserLayers = selectedLayersByType.mapLayers?.length > 0 && selectedLayersByType.mapLayers.filter(l => typeof l.id === 'string' && l.id.startsWith('userlayer_')).length === selectedLayersByType.mapLayers.length;
        setNoDownloadableLayers(onlyUserLayers);
      }, [gfiLocations]);

    return (
        <>
    
        <StyledDownloadsContainer>
        <StyledDescription>{strings.downloads.downloadsInfo}</StyledDescription>
        <StyledDescription>{strings.downloads.downloadsInfo2}</StyledDescription>

        {noDownloadableLayers && (
            <StyledDescription style={{ color: "#d32f2f", marginBottom: 4 }}>
                {strings.downloads.noValidMaplayers}
            </StyledDescription>
        )}

        <StyledDowloadButton
            disabled={noDownloadableLayers}
            onClick={handleGfiLocationsOpen}
        >
            {strings.downloads.newDownload}
        </StyledDowloadButton>
        


            <StyledSubtitle>{strings.downloads.processing}:</StyledSubtitle>
            {
                downloads.filter(download => download.loading === true).length > 0 ?
                downloads.filter(download => download.loading === true).map(download => {
                    return <DownloadItem
                        download={download}
                        key={'download-item-processing-' + download.id}
                    >
                        <StyledLoaderWrapper>
                            <SvLoader />
                        </StyledLoaderWrapper>
                    </DownloadItem>
                })
                    : <StyledDescription>- {strings.downloads.noProcessingDownloads}</StyledDescription>
            }
            <StyledSubtitle>{strings.downloads.readyForDownload}:</StyledSubtitle>
            {
                downloads.filter(download => download.loading === false).length > 0 ?
                downloads.filter(download => download.loading === false && download.errorLayers.length === 0).map(download => {
                    return <DownloadItem
                        download={download}
                        closeAction={() => {
                            store.dispatch(setDownloadRemove(download.id));
                        }}
                        color={theme.colors.secondaryColorGreen}
                        key={'download-item-ready-for-download-' + download.id}
                    >
                        <StyledDownloadButton
                            onClick={() => window.open(`${download.url}`,`_blank`)}
                        >
                            <FontAwesomeIcon
                                icon={faDownload}
                            />
                        </StyledDownloadButton>
                    </DownloadItem>
                })
            : <StyledDescription>- {strings.downloads.noDownloads}</StyledDescription>
            }
            {
                downloads.filter(download => download.loading === false && download.errorLayers.length > 0).length > 0 && (
                    <>
                        <StyledSubtitle>{strings.downloads.failedDownloads}:</StyledSubtitle>
                        <StyledDescription>- {strings.downloads.errorOccuredDuringDownloadProcessing}:</StyledDescription>
                        {
                            downloads.filter(download => download.loading === false && download.errorLayers.length > 0).map(download => {
                                return <DownloadItem
                                    download={download}
                                    closeAction={() => {
                                        store.dispatch(setDownloadRemove(download.id));
                                    }}
                                    color={theme.colors.secondaryColorDarkOrange}
                                    key={'download-item-error-' + download.id}
                                >
                                        <FontAwesomeIcon
                                            style={{
                                                color: '#dc3545',
                                                fontSize: '24px'
                                            }}
                                            icon={faExclamationTriangle}
                                        />
                                </DownloadItem>
                            })
                        }
                    </>
                )
            }
        </StyledDownloadsContainer>
        </>
    );
};

export default FeatureDataDownload;
