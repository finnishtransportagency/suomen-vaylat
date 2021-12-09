import { useContext, useState } from 'react';
import { faTimes, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { resetGFILocations } from '../../state/slices/rpcSlice';
import strings from '../../translations';
import './GFI.scss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Draggable from 'react-draggable';
import 'react-tabs/style/react-tabs.css';
import { FormattedGFI } from './FormattedGFI';
import ReactTooltip from "react-tooltip";
import { isMobile } from '../../theme/theme';

const StyledMyLocationButton = styled.div`
    min-width: 28px;
    min-height: 28px;
    cursor: pointer;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    svg {
        color: ${props => props.locationActive ? props.theme.colors.mainColor2 : props.theme.colors.mainWhite};
        font-size: 18px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.mainColor2};
        }
    };
`;

const StyledHeaderButtons = styled.div`
    display: flex;
`;

const customStyles = {
    overlay: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        marginLeft: '40%',
        width: '60%'
    }
};

const StyledContent = styled.div`
    padding: .3rem 0 0 0.3rem;
`;

const StyledGFIHeader = styled.div`
    display: flex;
    color: ${props => props.theme.colors.mainColor1};
    font-weight: bold;
`;

const StyledHeader = styled.div`
    padding: .5rem;
    border-radius: 4px 4px 0 0;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.mainColor1};
`;

const StyledLayerCloseIcon = styled.div`
    min-width: 28px;
    min-height: 28px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 18px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.mainColor2};
        }
    };
`;

const StyledTabCloseIcon = styled.div`
    min-width: 28px;
    min-height: 28px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        color: ${props => props.theme.colors.mainColor1};
        font-size: 18px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.mainColor2};
        }
    };
`;

const SyledModalContent = styled.div`
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    background: rgb(255, 255, 255);
`;

export const GFIPopup = ({gfiLocations}) => {
    const { store } = useContext(ReactReduxContext);
    const { channel, allLayers, gfiPoint, currentZoomLevel } = useAppSelector((state) => state.rpc);
    const [locationActive, activateLocation] = useState(false);
    let tabsIds = []
    let tabsContent = []
    let layerIds = null;
    let contentDiv = null;

    if (gfiLocations.length > 0) {
        gfiLocations.forEach((location, index) => {
            layerIds = allLayers.filter(layer => layer.id === location.layerId)[0].id;
            tabsIds.push(layerIds);
            let content;

            if (location.type === 'text') {
                content = location.content
                const popupContent = <div dangerouslySetInnerHTML={{__html: content}}></div> ;
                var contentWrapper = <div className='contentWrapper-infobox'>{popupContent}</div> ;
                contentDiv = <div className='popupContent'>{contentWrapper}</div> ;
                tabsContent.push(contentDiv);
            }
            else if (location.type === 'geojson') {
                content =  <FormattedGFI key={index} data={location.content} />;
                tabsContent.push(content);
            }

        });
    };

    const title = strings.gfi.title

    const closeModal = () => {
        store.dispatch(resetGFILocations([]));
        channel.postRequest('MapModulePlugin.RemoveMarkersRequest', ['gfi_location']);
    };

    const closeTab = (id) => {
        var filteredLocations = gfiLocations.filter(gfi => gfi.layerId !== id);
        store.dispatch(resetGFILocations(filteredLocations));
    };

    const locationOnClick = (locationActive) => {
        if (!locationActive) {
            var markerLocation = {
                x: gfiPoint.lon,
                y: gfiPoint.lat,
                msg: '',
                shape: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#0064af"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/><circle cx="12" cy="9" r="2.5"/></svg>',
                offsetX: 0, // center point x position from left to right
                offsetY: 0, // center point y position from bottom to up
                size: 6
            };
            channel.postRequest('MapModulePlugin.AddMarkerRequest', [markerLocation, 'gfi_location']);
            channel.postRequest('MapMoveRequest', [gfiPoint.lon, gfiPoint.lat, currentZoomLevel]);
        } else {
            channel.postRequest('MapModulePlugin.RemoveMarkersRequest', ['gfi_location']);
        }
        activateLocation(!locationActive);
    }

    return (
        <div>
            <Modal
                isOpen={true}
                onRequestClose={() => closeModal()}
                style={customStyles}
                className={'gfi-modal'}
            >
                <ReactTooltip disable={isMobile} id='gfiLoc' place="top" type="dark" effect="float">
                    <span>{strings.gfi.gfiLocation}</span>
                </ReactTooltip>
                <Draggable handle='.modal-header' bounds='body'>
                    <SyledModalContent className='handle'>
                        <StyledHeader className='modal-header'>
                            <h5>{title}</h5>
                            <StyledHeaderButtons>
                                <StyledMyLocationButton
                                    data-tip data-for='gfiLoc'
                                    onClick={() => locationOnClick(locationActive)}
                                    locationActive={locationActive}
                                >
                                    <FontAwesomeIcon
                                        icon={faMapMarkerAlt}
                                    />
                                </StyledMyLocationButton>
                                <StyledLayerCloseIcon
                                    onClick={() => {
                                        closeModal();
                                    }} title={strings.gfi.close}>
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                    />
                                </StyledLayerCloseIcon>
                            </StyledHeaderButtons>
                        </StyledHeader>
                        <Tabs>
                            <StyledContent>
                                <TabList>
                                    {
                                        tabsIds.map((id) => {
                                            return (
                                                <Tab key={id}>
                                                    <StyledGFIHeader className='gfi-header'>
                                                        {allLayers.filter(layer => layer.id === id)[0].name}
                                                        <StyledTabCloseIcon
                                                            onClick={() => {
                                                                closeTab(id);
                                                            }} title={strings.general.close}>
                                                            <FontAwesomeIcon
                                                                icon={faTimes}
                                                            />
                                                        </StyledTabCloseIcon>
                                                    </StyledGFIHeader>
                                                </Tab>
                                            )
                                        })
                                    }
                                </TabList>
                                {
                                    tabsContent.map((content, index) => {
                                            return (
                                                <TabPanel key={index}>
                                                    {content}
                                                </TabPanel>
                                            )
                                        })
                                }
                            </StyledContent>
                        </Tabs>
                    </SyledModalContent>
                </Draggable>
            </Modal>
        </div>
    );
};

export default GFIPopup;