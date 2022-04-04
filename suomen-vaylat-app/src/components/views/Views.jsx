import { useState, useEffect, useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { updateLayers } from '../../utils/rpcUtil';
import styled from 'styled-components';
import { motion, AnimatePresence} from 'framer-motion';
import strings from '../../translations';
import Moment from 'react-moment';
import { v4 as uuidv4 } from 'uuid';

import { isMobile } from '../../theme/theme';

import {
    setIsSaveViewOpen,
    setWarning
} from '../../state/slices/uiSlice';

import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CircleButton from '../circle-button/CircleButton';

const StyledViewsContainer = styled.div`
    padding: 24px;
    max-height: 500px;
    overflow: auto;
`;

const StyledInfoTextContainer = styled.ul`
    li {
        font-size: 14px;
        color: ${props => props.theme.colors.mainColor1};
    }
`;

const StyledSavedViews = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const StyledNoSavedViews = styled(motion.div)`
    font-size: 14px;
    text-align: center;
    padding: 16px;
`;

const StyledDeleteAllSavedViews = styled.div`
    width: 250px;
    height: 30px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.disabled ? "rgba(177, 177, 177, 0.5)" : props.theme.colors.secondaryColor7};
    margin: 20px auto 20px auto;
    border-radius: 15px;
    p {
        margin: 0;
        font-size: 12px;
        font-weight: 600;
    };
`;

const StyledSaveNewViewContainer = styled.div`

`;

const StyledSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    color: ${props => props.theme.colors.mainColor1};
    padding: 10px 0px 10px 5px;
    font-size: 15px;
`;

const StyledSavedViewContainer = styled(motion.div)`
    display: flex;
`;

const StyledSavedView = styled.div`
    width: 100%;
    z-index: 1;
    min-height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: ${props => props.theme.colors.mainColor1};
    border-radius: 4px;
    padding: 8px 0px 8px 0px;
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
    @-moz-document url-prefix() {
        position: initial;
    };
`;

const StyledRemoveSavedView = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    svg {
        color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        &:hover {
            color: ${props => props.theme.colors.mainColor1};
        }
    };
`;

const StyledSavedViewName = styled.p`
    user-select: none;
    max-width: 240px;
    color: ${props => props.theme.colors.mainWhite};
    margin: 0;
    padding: 0px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.1s ease-in;
`;

const StyledSavedViewDescription = styled.p`
    margin: 0;
    padding: 0px;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
`;

const StyledLeftContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledRightContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyleSavedViewHeaderIcon = styled.div`
    width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        font-size: 20px;
        color: ${props => props.theme.colors.mainWhite};
    };
    p {
        margin: 0;
        font-weight: bold;
        font-size: 22px;
        color: ${props => props.theme.colors.mainWhite};
    }
`;

const StyledSavedViewTitleContent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const StyledSaveNewViewWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 48px;
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 24px;
    box-shadow: 0px 2px 4px #0000004D;
    overflow: hidden;
    @media ${props => props.theme.device.mobileL} {
        height: 40px;
    };
`;

const StyledViewName = styled.input`
    width: 100%;
    height: 100%;
    border: none;
    padding-left: 24px;
    &:focus {
            outline: 0;
            outline-color: transparent;
            outline-style: none;
    };
`;

const Views = () => {
    const { store } = useContext(ReactReduxContext);
    const [views, setViews] = useState([]);
    const [viewName, setViewName] = useState("");

    const {
        selectedLayers,
        channel,
    } = useAppSelector(state => state.rpc);

    useEffect(() => {
        window.localStorage.getItem("views") !== null && setViews(JSON.parse(window.localStorage.getItem("views")));
    },[]);

    const handleSaveView = () => {
        channel.getMapPosition(function (center) {
            let newView = {
                id: uuidv4(),
                name: viewName,
                saveDate: Date.now(),
                data: {
                    zoom: center.zoom && center.zoom,
                    x: center.centerX && center.centerX,
                    y: center.centerY && center.centerY,
                    layers: selectedLayers,
                    language: strings.getLanguage()
                }
            };

            views.push(newView);
            window.localStorage.setItem('views', JSON.stringify(views));
            setViews(JSON.parse(window.localStorage.getItem("views")));
            setViewName("");
        });
    };

    const handleActivateView = (view) => {

            channel.getMapPosition(function () {
                var routeSteps = [
                    {
                        'lon': view.data.x,
                        'lat': view.data.y,
                        'duration': 3000,
                        'zoom': view.data.zoom,
                        'animation': 'zoomPan'
                    }
                ];
                var stepDefaults = {
                    'lon': view.data.x,
                    'lat': view.data.y,
                    'zoom': view.data.zoom,
                    'animation': 'zoomPan',
                    'duration': 3000,
                    'srsName': 'EPSG:3067'
                };
                channel.postRequest('MapTourRequest', [routeSteps, stepDefaults]);

            });

            selectedLayers.forEach((layer) => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, false]);
            });

            view.data.layers.forEach((layer) => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, true]);
            });

            updateLayers(store, channel);

            isMobile && store.dispatch(setIsSaveViewOpen(false));

    };

    const handleRemoveView = (view) => {
        let updatedViews = views.filter(viewData => viewData.id !== view.id);
        window.localStorage.setItem('views', JSON.stringify(updatedViews));
        setViews(JSON.parse(window.localStorage.getItem("views")));

    };

    const handleDeleteAllViews = () => {
        window.localStorage.setItem('views', JSON.stringify([]));
        setViews(JSON.parse(window.localStorage.getItem("views")));
        store.dispatch(setWarning(null));
    };

    return (
            <StyledViewsContainer>
                <StyledSubtitle>{strings.saveView.savingView}:</StyledSubtitle>
                <StyledInfoTextContainer>
                    <li>{strings.saveView.saveViewDescription1}</li>
                    <li>{strings.saveView.saveViewDescription2}</li>
                </StyledInfoTextContainer>
                <StyledSubtitle>{strings.saveView.savedViews}</StyledSubtitle>
                <StyledSavedViews>
                <AnimatePresence>
                {
                    views.length > 0 ? views.map(view => {
                        return (

                            <StyledSavedViewContainer
                                key={view.id}
                                transition={{
                                    duration: 0.2,
                                    type: "tween"
                                }}
                                initial={{
                                    opacity: 0,
                                    height: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    height: "auto",
                                }}
                                exit={{
                                    opacity: 0,
                                    height: 0,
                                }}
                            >
                                <StyledSavedView
                                    onClick={e => {
                                        e.preventDefault();
                                        handleActivateView(view);
                                    }}
                                >
                                    <StyledLeftContent>
                                        <StyleSavedViewHeaderIcon>
                                            {

                                                    // <FontAwesomeIcon
                                                    //     icon={themeStyles[group.id].icon}
                                                    // />
                                                    <p>{view.name.charAt(0).toUpperCase()}</p>
                                            }
                                        </StyleSavedViewHeaderIcon>
                                        <StyledSavedViewTitleContent>
                                            <StyledSavedViewName>
                                                {view.name}
                                            </StyledSavedViewName>
                                            <StyledSavedViewDescription>
                                                {
                                                    <Moment format="DD.MM.YYYY" tz="Europe/Helsinki">{view.saveDate}</Moment>

                                                }
                                            </StyledSavedViewDescription>
                                        </StyledSavedViewTitleContent>

                                    </StyledLeftContent>
                                    <StyledRightContent>
                                        {/* <StyledSelectButton
                                            //isOpen={isOpen}
                                        >
                                        </StyledSelectButton> */}
                                    </StyledRightContent>
                                </StyledSavedView>
                            <StyledRemoveSavedView>
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    onClick={() => handleRemoveView(view)}
                                />
                            </StyledRemoveSavedView>
                            </StyledSavedViewContainer>
                    )
                    }) : <StyledNoSavedViews
                            key="no-saved-views"
                            transition={{
                                duration: 0.3,
                                type: "tween"
                            }}
                            initial={{
                                opacity: 0,
                                height: 0,
                            }}
                            animate={{
                                opacity: 1,
                                height: "auto",
                            }}
                            exit={{
                                opacity: 0,
                                height: 0,
                            }}
                        >
                            {strings.saveView.noSavedViews}
                        </StyledNoSavedViews>
                }
                </AnimatePresence>
                <StyledDeleteAllSavedViews
                    onClick={() => views.length > 0 &&
                        store.dispatch(setWarning({
                            title: "Haluatko varmasti poistaa kaikki tallennetut näkymät?",
                            subtitle: null,
                            cancel: {
                                text: strings.general.cancel,
                                action: () => store.dispatch(setWarning(null))
                            },
                            confirm: {
                                text: strings.general.continue,
                                action: () => {
                                    handleDeleteAllViews();
                                    store.dispatch(setWarning(null));
                                }
                            },
                        }))
                    }
                    disabled={views.length === 0}
                >
                    <p>{strings.saveView.deleteAllSavedViews}</p>
                </StyledDeleteAllSavedViews>
                </StyledSavedViews>
                <StyledSaveNewViewContainer>
                    <StyledSubtitle>{strings.saveView.saveNewView}</StyledSubtitle>
                    <StyledSaveNewViewWrapper>
                        <StyledViewName
                            id="view-name"
                            type="text"
                            value={viewName}
                            onChange={e => setViewName(e.target.value)}
                            placeholder={strings.saveView.viewName}
                        />
                    <CircleButton
                        icon={faPlus}
                        clickAction={() => {
                            viewName !== "" && handleSaveView()
                        }}
                        disabled={viewName === ""}
                    />
                    </StyledSaveNewViewWrapper>
                </StyledSaveNewViewContainer>
            </StyledViewsContainer>
    )

};

export default Views;