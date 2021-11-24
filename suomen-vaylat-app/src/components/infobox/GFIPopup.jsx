import { useContext } from 'react';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import { ReactReduxContext } from "react-redux";
import styled from 'styled-components';
import { useAppSelector } from "../../state/hooks";
import { resetGFILocations } from "../../state/slices/rpcSlice";
import strings from "../../translations";
import './GFI.scss';
import { GeoJSONFormatter } from './GeoJSONFormatter';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Draggable from "react-draggable";
import 'react-tabs/style/react-tabs.css';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-25%',
        transform: 'translate(-50%, -50%)',
        padding: '0',
        borderRadius: '4px',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
        border: 'none'
    },
    overlay: {zIndex: 20}
};

const StyledContent = styled.div`
    padding: .3rem;
`;

const StyledGFIHeader = styled.div`
    display: flex;
    color: ${props => props.theme.colors.mainColor1};
`;

const StyledHeader = styled.div`
    padding: .5rem;
    border-radius: 0;
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

export const GFIPopup = ({gfiLocations}) => {
    console.log(gfiLocations);
    const geojsonFormatter = new GeoJSONFormatter();

    const { store } = useContext(ReactReduxContext);
    const isGFIOpen = useAppSelector((state) => state.ui.isGFIOpen);
    const allLayers = useAppSelector((state) => state.rpc.allLayers);
    let tabsIds = []
    let tabsContent = []
    let layerIds = null;
    let contentDiv = null;

    if (gfiLocations.length > 0) {
        gfiLocations.map(location => {
            layerIds = allLayers.filter(layer => layer.id === location.layerId)[0].id;
            tabsIds.push(layerIds);
            let content;
        
            if (location.type === 'text') {
                content = location.content
            }
            else if (location.type === 'geojson') {
                content = geojsonFormatter.format(location.content);
            }
        
            const popupContent = <div dangerouslySetInnerHTML={{__html: content}}></div> ;
            var contentWrapper = <div className="contentWrapper-infobox">{popupContent}</div> ;
            contentDiv = <div className="popupContent">{contentWrapper}</div> ;
            tabsContent.push(contentDiv);
    
        });
    };

    const title = strings.gfi.title

    function closeModal() {
        store.dispatch(resetGFILocations([]));
    };

    function closeTab(id) {
        var filteredLocations = gfiLocations.filter(gfi => gfi.layerId !== id);
        store.dispatch(resetGFILocations(filteredLocations));
    };

    return (
        <div>
            <Draggable>
            <Modal
                isOpen={isGFIOpen}
                onRequestClose={() => closeModal()}
                style={customStyles}
                className={'gfi-modal'}
            >
                <StyledHeader className="modal-header">
                    <h5>{title}</h5>
                    <StyledLayerCloseIcon
                        onClick={() => {
                            closeModal();
                        }} title='Sulje'>
                        <FontAwesomeIcon
                            icon={faTimes}
                        />
                    </StyledLayerCloseIcon>
                </StyledHeader>
                <Tabs>
                    <StyledContent>
                        <TabList>
                            {
                                tabsIds.map((id) => {
                                    return (
                                        <Tab key={id}>
                                            <StyledGFIHeader className="gfi-header">
                                                {allLayers.filter(layer => layer.id === id)[0].name}
                                                <StyledTabCloseIcon
                                                    onClick={() => {
                                                        closeTab(id);
                                                    }} title='Sulje'>
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
            </Modal>
            </Draggable>
        </div>
    );
};

export default GFIPopup;