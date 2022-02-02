import { useState, useEffect, useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { mapMoveRequest } from '../../state/slices/rpcSlice';
import { updateLayers } from '../../utils/rpcUtil';
import styled from 'styled-components';
import { motion, AnimatePresence} from 'framer-motion';
import strings from '../../translations';
import Moment from 'react-moment';
import { v4 as uuidv4 } from 'uuid';

import { isMobile } from '../../theme/theme';

import { setIsSaveViewOpen } from '../../state/slices/uiSlice';

import { faPlus ,faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CircleButton from '../circle-button/CircleButton';

const StyledViewsContainer = styled.div`
    padding: 24px;
    max-height: 500px;
    overflow: auto;
`;

const StyledSavedViews = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const StyledNoSavedPresets = styled(motion.div)`
    font-size: 14px;
    text-align: center;
    padding: 16px;
`;

const StyledDeleteAllSavedPresets = styled.div`
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

const StyledSelectButton = styled.div`
    position: relative;
    width: 18px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    margin-right: 16px;
    border: 2px solid white;
    border-radius: 50%;
    &:before {
        position: absolute;
        content: '';
        width: 10px;
        height: 10px;
        background-color: ${props => props.isOpen ? props.theme.colors.mainWhite : 'transparent'};
        border-radius: 50%;
        transition: background-color 0.3s ease-out;
    }
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

const StyledPresteName = styled.input`
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

const Presets = () => {
    const { store } = useContext(ReactReduxContext);
    const [presets, setPresets] = useState([]);
    const [presetName, setPresetName] = useState("");

    const {
        selectedLayers,
        channel,
    } = useAppSelector(state => state.rpc);

    useEffect(() => {
        window.localStorage.getItem("presets") !== null && setPresets(JSON.parse(window.localStorage.getItem("presets")));
    },[]);

    const handleSavePreset = () => {
        channel.getMapPosition(function (center) {
            let newPreset = {
                id: uuidv4(),
                name: presetName,
                saveDate: Date.now(),
                data: {
                    zoom: center.zoom && center.zoom,
                    x: center.centerX && center.centerX,
                    y: center.centerY && center.centerY,
                    layers: selectedLayers,
                    language: strings.getLanguage()
                }
            };
    
            presets.push(newPreset);
            window.localStorage.setItem('presets', JSON.stringify(presets));
            setPresets(JSON.parse(window.localStorage.getItem("presets")));
            setPresetName("");
        });
    };

    const handleActivatePreset = (preset) => {
    
            // // set map center
            // store.dispatch(mapMoveRequest({
            //     x: preset.data.x,
            //     y: preset.data.y,
            //     zoom: preset.data.zoom
            // }));

            channel.getMapPosition(function () {
                var routeSteps = [
                    {
                        'lon': preset.data.x,
                        'lat': preset.data.y,
                        'duration': 3000,
                        'zoom': preset.data.zoom,
                        'animation': 'zoomPan'
                    }
                ];
                var stepDefaults = {
                    'lon': preset.data.x,
                    'lat': preset.data.y,
                    'zoom': preset.data.zoom,
                    'animation': 'zoomPan',
                    'duration': 3000,
                    'srsName': 'EPSG:3067'
                };
                channel.postRequest('MapTourRequest', [routeSteps, stepDefaults]);

            });

            selectedLayers.forEach((layer) => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, false]);
            });

            preset.data.layers.forEach((layer) => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, true]);
            });

            updateLayers(store, channel);

            isMobile && store.dispatch(setIsSaveViewOpen(false));

    };

    const handleRemovePreset = (preset) => {
        let updatedPresets = presets.filter(presetData => presetData.id !== preset.id);
        window.localStorage.setItem('presets', JSON.stringify(updatedPresets));
        setPresets(JSON.parse(window.localStorage.getItem("presets")));

    };

    const handleDeleteAllPresets = () => {
        window.localStorage.setItem('presets', JSON.stringify([]));
        setPresets(JSON.parse(window.localStorage.getItem("presets")));
    };

    return (
            <StyledViewsContainer>
                <StyledSubtitle>Tallennetut näkymät</StyledSubtitle>
                <StyledSavedViews>
                <AnimatePresence>
                {
                    presets.length > 0 ? presets.map(preset => {
                        return (
                        
                            <StyledSavedViewContainer
                                key={preset.id}
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
                                        handleActivatePreset(preset);
                                    }}
                                >
                                    <StyledLeftContent>
                                        <StyleSavedViewHeaderIcon>
                                            {

                                                    // <FontAwesomeIcon
                                                    //     icon={themeStyles[group.id].icon}
                                                    // />
                                                    <p>{preset.name.charAt(0).toUpperCase()}</p>
                                            }
                                        </StyleSavedViewHeaderIcon>
                                        <StyledSavedViewTitleContent>
                                            <StyledSavedViewName>
                                                {preset.name}
                                            </StyledSavedViewName>
                                            <StyledSavedViewDescription>
                                                {
                                                    <Moment format="DD.MM.YYYY" tz="Europe/Helsinki">{preset.saveDate}</Moment>
                                                    
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
                                    onClick={() => handleRemovePreset(preset)}
                                />
                            </StyledRemoveSavedView>
                            </StyledSavedViewContainer>
                    )
                    }) : <StyledNoSavedPresets
                            key="no-saved-presets"
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
                            Ei tallennettuja näkymiä
                        </StyledNoSavedPresets>
                }
                </AnimatePresence>
                <StyledDeleteAllSavedPresets
                    onClick={() => presets.length > 0 && handleDeleteAllPresets()}
                    disabled={presets.length === 0}
                >
                    <p>Poista kaikki tallennetut näkymät</p>
                </StyledDeleteAllSavedPresets>
                </StyledSavedViews>
                <StyledSaveNewViewContainer>
                    <StyledSubtitle>Tallenna uusi näkymä</StyledSubtitle>
                    <StyledSaveNewViewWrapper>
                        <StyledPresteName
                            id="preset-name"
                            type="text"
                            value={presetName}
                            onChange={e => setPresetName(e.target.value)}
                            placeholder="Näkymän nimi"
                        />
                    <CircleButton
                        icon={faPlus}
                        clickAction={() => {
                            presetName !== "" && handleSavePreset()
                        }}
                        disabled={presetName === ""}
                    />
                    </StyledSaveNewViewWrapper>
                </StyledSaveNewViewContainer>
            </StyledViewsContainer>
    )

};

export default Presets;