import { useState, useEffect } from 'react';
import styled from 'styled-components';
import strings from '../../translations';
import Moment from 'react-moment';

import { useAppSelector } from '../../state/hooks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileArchive } from '@fortawesome/free-solid-svg-icons';

import ModalListItem from "../modals/ModalListItem";
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

const StyledSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    color: ${props => props.theme.colors.mainColor1};
    padding: 10px 0px 10px 5px;
    font-size: 16px;
    font-weight: bold;
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
    };

    p {
        margin: 0
    };

    ul {
        li {
            font-size: 12px;
            font-weight: bold;
        };
    };
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
            color: ${props => props.theme.colors.mainColor1};
        }
    };
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

const GFIDownload = () => {

    let {
        channel,
        gfiLocations,
        allLayers,
        downloads
    } = useAppSelector((state) => state.rpc);

    const [selectedLayers, setSelectedLayers] = useState([]);

    const handleSelectLayer = (layer) => {
        if(selectedLayers.find(selectedLayer => selectedLayer.id === layer.id)){
            setSelectedLayers(selectedLayers.filter(selectedLayer => selectedLayer.id !== layer.id));
        } else {
            setSelectedLayers([
                ...selectedLayers, layer
            ]);
        }
    };

    useEffect(() => {
        const layers = gfiLocations && gfiLocations.length > 0 && gfiLocations.map((location, index) => {
            const layer = allLayers.find(layer => layer.id === location.layerId);
            return layer;
        });
        setSelectedLayers(layers);
    },[allLayers, gfiLocations]);

    return (
        <StyledDownloadsContainer>
            <StyledSubtitle>{strings.downloads.processing}:</StyledSubtitle>
                {
                    downloads.filter(download => download.url === null).length > 0 ? 
                    downloads.filter(download => download.url === null).map(download => {
                            return <ModalListItem
                                key={download.id}
                                id={download.id}
                                icon={faFileArchive}
                                title={
                                    <StyledListItemTitleWrapper>
                                        <li>{strings.downloads.format}: <span>{download.format && download.format}</span></li>
                                        <li>{strings.downloads.date}: <span><Moment format="DD.MM.YYYY HH:mm" tz="Europe/Helsinki">{download.date}</Moment></span></li> 
                                        <li>{strings.downloads.fileSize}: <span>{download.fileSize ? download.fileSize : "-"}</span></li>
                                        <li>{strings.downloads.layers}: </li>
                                            <ul>
                                                {
                                                    download.layers.map(layer => {
                                                        return <li key={'li_'+layer.id}>{layer.name}</li>
                                                    })
                                                }
                                            </ul>
                                    </StyledListItemTitleWrapper>
                                }
                                //subtitle={<Moment format="DD.MM.YYYY, HH:mm" tz="Europe/Helsinki">{download.date}</Moment>}
                            >
                                <StyledLoaderWrapper>
                                    <SvLoader />
                                </StyledLoaderWrapper>

                        </ModalListItem>
                        })
                     : <p>{strings.downloads.noProcessingDownloads}</p>
                }
            <StyledSubtitle><p>{strings.downloads.readyForDownload}</p>:</StyledSubtitle>
            {
                downloads.filter(download => download.url !== null).length > 0 ?
                downloads.filter(download => download.url !== null).map(download => {
                    return <ModalListItem
                        key={download.id}
                        id={download.id} 
                        icon={faFileArchive}
                        title={
                            <StyledListItemTitleWrapper>
                                <li>{strings.downloads.format}: <span>{download.format && download.format}</span></li>
                                <li>{strings.downloads.date}: <span><Moment format="DD.MM.YYYY HH:mm" tz="Europe/Helsinki">{download.date}</Moment></span></li> 
                                <li>{strings.downloads.fileSize}: <span>{download.fileSize ? download.fileSize : "-"}</span></li>
                                <li>{strings.downloads.layers}: </li>
                                    <ul>
                                        {
                                            download.layers.map(layer => {
                                                return <li key={'li_'+layer.id}>{layer.name}</li>
                                            })
                                        }
                                    </ul>
                                </StyledListItemTitleWrapper>
                            }
                        //subtitle={download.title}
                        closeAction={() => {
                            store.dispatch(setDownloadRemove(download.id));
                        }}
                    >
                        <StyledDownloadButton
                            onClick={() => window.open(`${download.url}`,`_blank`)}
                        >
                            <FontAwesomeIcon
                                icon={faDownload}
                            />
                        </StyledDownloadButton>
                    </ModalListItem>
                })
            : <p>{strings.downloads.noDownloads}</p>
            }
        </StyledDownloadsContainer>
    )

};

export default GFIDownload;