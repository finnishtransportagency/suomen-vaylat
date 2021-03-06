import styled from 'styled-components';
import strings from '../../translations';
import Moment from 'react-moment';

import { useAppSelector } from '../../state/hooks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileArchive, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import ModalListItem from '../modals/ModalListItem';
import SvLoader from '../loader/SvLoader';
import store from '../../state/store';
import { setDownloadRemove } from '../../state/slices/rpcSlice';

const StyledDownloadsContainer = styled.div`
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
    font-weight: 300;
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

const DownloadItem = ({
    download,
    closeAction,
    color,
    children
}) => {
    return (
        <ModalListItem
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
                                    return <li key={'li-'+layer.id}>{layer.name}</li>
                                })
                            }
                        </ul>
                </StyledListItemTitleWrapper>
            }
            closeAction={closeAction}
            color={color}
        >
            {children && children}
        </ModalListItem>
    )
};

const GFIDownload = () => {
    let { downloads } = useAppSelector((state) => state.rpc);

    return (
        <StyledDownloadsContainer>
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
                downloads.filter(download => download.loading === false && !download.error).map(download => {
                    return <DownloadItem
                        download={download}
                        closeAction={() => {
                            store.dispatch(setDownloadRemove(download.id));
                        }}
                        color={'#28a745'}
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
                downloads.filter(download => download.loading === false && download.error).length > 0 && (
                    <>
                        <StyledSubtitle>{strings.downloads.failedDownloads}:</StyledSubtitle>
                        <StyledDescription>- {strings.downloads.errorOccuredDuringDownloadProcessing}:</StyledDescription>
                        {
                            downloads.filter(download => download.loading === false && download.error).map(download => {
                                return <DownloadItem
                                    download={download}
                                    closeAction={() => {
                                        store.dispatch(setDownloadRemove(download.id));
                                    }}
                                    color={'#dc3545'}
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
    );
};

export default GFIDownload;
