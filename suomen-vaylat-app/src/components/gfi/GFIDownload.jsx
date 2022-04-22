import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion} from 'framer-motion';
import strings from '../../translations';
import Moment from 'react-moment';

import { useAppSelector } from '../../state/hooks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFile, faFileArchive } from '@fortawesome/free-solid-svg-icons';

import ModalListItem from "../modals/ModalListItem";
import CircleLoader from '../loader/CircleLoader';
import CheckBox from "../checkbox/CheckBox";


const StyledDownloadsContainer = styled.div`
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const StyledSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    color: ${props => props.theme.colors.mainColor1};
    padding: 10px 0px 10px 5px;
    font-size: 15px;
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

const GFIDownload = () => {


    let {
        channel,
        gfiLocations,
        allLayers,
        downloads
    } = useAppSelector((state) => state.rpc);

    const [selectedLayers, setSelectedLayers] = useState([]);

    const [downloadFormats, setDownloadFormats] = useState([
            {
                id: "download-format-shape",
                title: "shape",
                format: "shape-zip",
                selected: false,
                loading: false,
            },
            {
                id: "download-format-csv",
                title: "csv",
                format: "csv",
                selected: false,
                loading: false,
            },
/*             {
                id: "download-format-xls",
                title: "excel",
                format: "excel-zip",
                selected: false,
                loading: false,
            }, */
            {
                id: "download-format-json",
                title: "json",
                format: "application/json",
                selected: false,
                loading: false
            }
    ]);

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

    const handleGfiDownload = (format) => {
        console.log(format);
        console.log(selectedLayers);
        let newArr = [...downloadFormats];
        newArr[newArr.findIndex(item => item.id === format.id)].loading = true;
        setDownloadFormats(newArr);

        let layerIds = selectedLayers.map(layer => {
            return layer.id;
        });

        //console.log(layerIds);
/*         channel.downloadFeaturesByGeoJSON && channel.downloadFeaturesByGeoJSON([layerIds, geoJSON, 'shape-zip'], function (data) {
            channel.log('downloadFeaturesByGeoJSON OK', data);
        }, function(errors) { channel.log('downloadFeaturesByGeoJSON NOK', errors); } ); */


        setTimeout(() => {
            let newArr2 = [...downloadFormats];
            newArr2[newArr2.findIndex(item => item.id === format.id)].loading = false;
            setDownloadFormats(newArr2);
            console.log("DONE")
        },[5000]);
    };

    return (

        <StyledDownloadsContainer>
        <StyledSubtitle>Valmistellaan ladattavaksi:</StyledSubtitle>
            {
                downloads.map(download => {
                    return download.url === null && (
                    <ModalListItem
                        key={download.id}
                        id={download.id} 
                        icon={faFileArchive}
                        title={download.title}
                        subtitle={<Moment format="DD.MM.YYYY, HH:mm" tz="Europe/Helsinki">{download.date}</Moment>}
                        
                    >
                        <CircleLoader />
                    </ModalListItem>
                    )

/*                     return format.loading && <div key={'active-download-format'+format.id}>
                        <p>{format.title} -aineistoa valmistellaan, odota hetki</p>
                        
                    </div> */
                })
            }
        <StyledSubtitle>Valmis ladattavaksi:</StyledSubtitle>
        {
                downloads.map(download => {
                    return download.url !== null && (
                    <ModalListItem
                        key={download.id}
                        id={download.id} 
                        icon={faFileArchive}
                        title={<Moment format="DD.MM.YYYY HH:mm" tz="Europe/Helsinki">{download.date}</Moment>}
                        subtitle={download.title}
                        
                    >
                        <StyledDownloadButton
                            onClick={() => window.open(`${download.url}`,`_blank`)}
                        >
                            <FontAwesomeIcon
                                icon={faDownload}
                            />
                        </StyledDownloadButton>
                    </ModalListItem>
                    )

/*                     return format.loading && <div key={'active-download-format'+format.id}>
                        <p>{format.title} -aineistoa valmistellaan, odota hetki</p>
                        
                    </div> */
                })
            }
        </StyledDownloadsContainer>
    )

};

export default GFIDownload;