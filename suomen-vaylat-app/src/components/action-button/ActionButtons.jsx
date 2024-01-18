import { useContext, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import {
    faMap,
    faMapMarkedAlt,
    faTimes,
    faExpand,
    faPencilRuler,
    faFilter
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import strings from '../../translations';
import { selectGroup } from '../../utils/rpcUtil';
import { ThemeGroupShareButton } from '../share-web-site/ShareLinkButtons';

import { setMinimizeGfi, setMinimizeFilterModal } from '../../state/slices/uiSlice';

const GFI_GEOMETRY_LAYER_ID = 'drawtools-geometry-layer';

const StyledContent = styled.div`
    position: absolute;
    top: 0px;
    left: 50vw;
    transform: translateX(-50%);
    width: 100%;
    max-width: 312px;
    display: grid;
    gap: 8px;
    margin-top: 16px;
    @media ${props => props.theme.device.mobileL} {
        top: unset;
        bottom: 0px;
        max-width: 212px;
        margin-top: unset;
        margin-bottom: 8px;
    };
`;

const StyledActionButton = styled(motion.div)`
    max-width: 312px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${props => props.type === "gfi" ? props.theme.colors.mainColor1 : props.theme.colors.secondaryColor2};
    box-shadow: 2px 2px 4px #0000004D;
    border-radius: 24px;
    color: ${props => props.theme.colors.mainWhite};
    pointer-events: auto;
    svg {
        color: ${props => props.theme.colors.mainWhite};
    };
    @media ${props => props.theme.device.mobileL} {
        top: initial;
        max-width: 212px;
        height: 40px;
    };
    z-index:100;
`;

const StyledFilterActionButton = styled(motion.div)`
    max-width: 312px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${props => props.theme.colors.secondaryColor8};
    box-shadow: 2px 2px 4px #0000004D;
    border-radius: 24px;
    color: ${props => props.theme.colors.mainWhite};
    pointer-events: auto;
    svg {
        color: ${props => props.theme.colors.mainWhite};
    };
    @media ${props => props.theme.device.mobileL} {
        top: initial;
        max-width: 212px;
        height: 40px;
    };
    z-index:100;
`;

const StyledFilterLeftContent = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    max-width: 70%;
    overflow: hidden;
`;

const StyledFilterRightContent = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    max-width: 40%;
`;

const StyledFilterText = styled.div`
    font-size: 14px;
    font-weight: 600;
    user-select: none;
    @media ${props => props.theme.device.mobileL} {
        font-size: 12px;
    };
`;

const StyledLeftContent = styled.div`
    height: 100%;
    display: flex;
    align-items: center;

`;

const StyledRightContent = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
`;

const StyledActionButtonIcon = styled.div`
    min-width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        font-size: 18px;
    };
    @media ${props => props.theme.device.mobileL} {
        min-width: 40px;
        height: 40px;
        svg {
            font-size: 16px;
        };
    };
`;

const StyledActionButtonText = styled.p`
    width: 100%;
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    user-select: none;
    @media ${props => props.theme.device.mobileL} {
        font-size: 12px;
    };
`;

const StyledExpandButton = styled.div`
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    svg {
        font-size: 20px;
    };
    @media ${props => props.theme.device.mobileL} {
        svg {
            font-size: 18px;
        };
    };
`;

const StyledGeometryButton = styled.div`
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    svg {
        font-size: 20px;
    };
    @media ${props => props.theme.device.mobileL} {
        svg {
            font-size: 18px;
        };
    };
`;

const StyledActionButtonClose = styled.div`
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    svg {
        font-size: 20px;
    };
    @media ${props => props.theme.device.mobileL} {
        svg {
            font-size: 18px;
        };
    };
`;

const addFeaturesToMapParams = 
    {
        layerId: GFI_GEOMETRY_LAYER_ID,
        featureStyle: {
            fill: {
                color: 'rgba(10, 140, 247, 0.1)',
            },
            stroke: {
                area: {
                    color: 'rgba(100, 255, 95, 0.7)',
                    width: 4,
                    lineJoin: 'round',
                },
            },
            image: {
                shape: 5,
                size: 3,
                fill: {
                    color: 'rgba(100, 255, 95, 0.7)',
                },
            },
        },
    };

const ActionButtons = ({
    closeAction,
    closeActionFilter
}) => {

    const { store } = useContext(ReactReduxContext);
    
    const [activeGeometries, setActiveGeometries] = useState(true);
    const lang = strings.getLanguage();

    const {
        channel,
        selectedTheme,
        lastSelectedTheme,
        selectedThemeId,
        gfiLocations,
        filteringInfo
    } = useAppSelector((state) => state.rpc);
    const {
        minimizeGfi,
        minimizeFilter        
    } = useAppSelector((state) => state.ui);

    const handleSelectGroup = (index, theme) => {
        selectGroup(store, channel, null, theme, lastSelectedTheme, selectedThemeId);
    };
    
    const handleShowGeometry = () => {
        if (!activeGeometries) {
            gfiLocations.forEach(gfiLocation => {
                //tiehaku
                gfiLocation.gfiCroppingArea &&
                channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
                    gfiLocation.gfiCroppingArea,
                    addFeaturesToMapParams
                ]);
            })
        } else {
            channel && channel.postRequest(
                'MapModulePlugin.RemoveFeaturesFromMapRequest',
                [null, null, GFI_GEOMETRY_LAYER_ID]
            );
        }
        setActiveGeometries(!activeGeometries);
    };

    // Get titles of filtered layers
    var filterInfoTitle = "";
    filteringInfo.forEach((fil, index) => {
        const title = fil.layer.title.length > 10 ? fil.layer.title.substring(0, 10) + '... ' : fil.layer.title;
        index === 0 ? filterInfoTitle += title : filterInfoTitle += ", " + title
    })

    return (
            <StyledContent>
                    <AnimatePresence initial={false}>
                        { minimizeGfi &&

                            <StyledActionButton
                                key="gfi_action_button"
                                type="gfi"
                                positionTransition
                                initial={{ y: 50, filter: "blur(10px)", opacity: 0 }}
                                animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                                exit={{ y: 50, filter: "blur(10px)", opacity: 0 }}
                                transition={{
                                    duration: 0.4,
                                    type: "tween"
                                }}
                            >
                                <StyledLeftContent>
                                    <StyledActionButtonIcon>
                                        <FontAwesomeIcon
                                            icon={faMapMarkedAlt}
                                        />
                                    </StyledActionButtonIcon>
                                    <StyledActionButtonText>{strings.gfi.title}</StyledActionButtonText>
                                </StyledLeftContent>
                                <StyledRightContent>
                                    <StyledGeometryButton
                                        onClick={handleShowGeometry}
                                    >
                                        <FontAwesomeIcon
                                            icon={faPencilRuler}
                                        />
                                    </StyledGeometryButton>
                                    <StyledExpandButton
                                        onClick={() => store.dispatch(setMinimizeGfi(false))}
                                    >
                                        <FontAwesomeIcon
                                            icon={faExpand}
                                        />
                                    </StyledExpandButton>
                                    <StyledActionButtonClose
                                        onClick={() => closeAction()}
                                    >
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                        />
                                    </StyledActionButtonClose>
                                </StyledRightContent>
                            </StyledActionButton>
                        }
                        { selectedTheme && selectedTheme !== '' &&

                            <StyledActionButton
                                key="theme_action_button"
                                positionTransition
                                initial={{ y: 50, filter: "blur(10px)", opacity: 0 }}
                                animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                                exit={{ y: 50, filter: "blur(10px)", opacity: 0 }}
                                transition={{
                                    duration: 0.4,
                                    type: "tween"
                                }}
                            >
                                <StyledLeftContent>
                                    <StyledActionButtonIcon>
                                        <FontAwesomeIcon
                                            icon={faMap}
                                        />
                                    </StyledActionButtonIcon>
                                    <StyledActionButtonText>{selectedTheme && selectedTheme.locale[lang].name}</StyledActionButtonText>
                                </StyledLeftContent>
                                <StyledRightContent>
                                    <ThemeGroupShareButton themeId={selectedTheme && selectedTheme.id}/>
                                        <StyledActionButtonClose
                                            onClick={() => handleSelectGroup(selectedThemeId, selectedTheme)}
                                        >
                                            <FontAwesomeIcon
                                                icon={faTimes}
                                            />
                                    </StyledActionButtonClose>
                                </StyledRightContent>

                            </StyledActionButton>
                        }
                        { minimizeFilter.minimized &&

                            <StyledFilterActionButton
                                key="filter_action_button"
                                positionTransition
                                initial={{ y: 50, filter: "blur(10px)", opacity: 0 }}
                                animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                                exit={{ y: 50, filter: "blur(10px)", opacity: 0 }}
                                transition={{
                                    duration: 0.4,
                                    type: "tween"
                                }}
                            >
                                <StyledFilterLeftContent>
                                    <StyledActionButtonIcon>
                                        <FontAwesomeIcon
                                            icon={faFilter}
                                        />
                                    </StyledActionButtonIcon>
                                    <StyledFilterText>
                                    {filterInfoTitle}
                                    </StyledFilterText>
                                </StyledFilterLeftContent>
                                <StyledFilterRightContent>
                                    <StyledExpandButton
                                        onClick={() => store.dispatch(setMinimizeFilterModal({minimized: false}))}
                                    >
                                        <FontAwesomeIcon
                                            icon={faExpand}
                                        />
                                    </StyledExpandButton>
                                    <StyledActionButtonClose
                                        onClick={() => closeActionFilter()}
                                    >
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                        />
                                    </StyledActionButtonClose>
                                </StyledFilterRightContent>

                            </StyledFilterActionButton>
                        }
                    </AnimatePresence>
    </StyledContent>

    )
};

export default ActionButtons;