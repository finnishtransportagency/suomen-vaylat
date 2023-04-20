import { useContext, useState, useEffect } from 'react';
import { faMap, faExternalLinkAlt, faLink, faAngleDown, faRoad, faShip, faTrain } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import strings from '../../../translations';
import { setZoomTo } from '../../../state/slices/rpcSlice';
import { selectGroup, reArrangeArray } from '../../../utils/rpcUtil';
import Layers from './Layers';

import hankekartta from './hankekartta.JPG';
import intersection from './Intersection.jpg';
import siltarajoituskartta from './siltarajoituskartta.jpg';
import tienumerokartta from './tienumerokartta.jpg';
import kuntokartta from './kuntokartta.jpg';

const listVariants = {
    visible: {
        height: 'auto',
        opacity: 1
    },
    hidden: {
        height: 0,
        opacity: 0
    },
};

const StyledLayerGroups = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 8px 0px 8px 0px;
    padding: 0px 16px;
    &:last-child {
        ${props => props.parentId === -1 ? '1px solid '+props.theme.colors.mainColor2 : 'none'};
    };
`;

const StyledMasterGroupName = styled.p`
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 230px;
    color: ${props => props.theme.colors.mainWhite};
    margin: 0;
    padding: 0px;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.1s ease-in;
`;


const StyledLinkName = styled.p`
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    color: ${props => props.theme.colors.mainWhite};
    margin: 0;
    padding: 0px;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.1s ease-in;
`;

const StyledThemeGroup = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 8px 0px 8px 0px;
    border-radius: 4px;

    &:last-child {
        ${props => props.parentId === -1 ? '1px solid '+props.theme.colors.mainColor2 : "none"};
    };
`;

const StyledMasterThemeHeader = styled.div`
    position: sticky;
    padding: 0 16px 0 16px;
    margin: 0px 8px 0px 8px;
    top: -8px;
    z-index: 1;
    min-height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: #1a5e34;
    border-radius: 4px;
    padding-top: 8px;
    padding-bottom: 8px;
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
    @-moz-document url-prefix() {
        position: initial;
    };
`;

const StyledSubthemeName = styled.p`
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 230px;
    color: ${props => props.theme.colors.mainWhite};
    margin: 0;
    padding: 0px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.1s ease-in;
`;

const StyledMasterGroupHeader = styled.div`
    z-index: 1;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: ${props => props.theme.colors.secondaryColor2};
    border-radius: ${props => props.isOpen ? "4px 4px 0px 0px": "4px"};
    box-shadow: 0px 3px 6px 0px rgb(0 0 0 / 16%);
    @-moz-document url-prefix() {
        position: initial;
    };
`;

const StyledSubGroupLayersCount = styled.p`
    margin: 0;
    padding: 0px;
    font-size: 13px;
    font-weight: 500;
    color: ${props => props.theme.colors.mainWhite};
`;

const StyledSubthemeHeader = styled.div`
    z-index: 1;
    height: 33px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: ${props => props.theme.colors.secondaryColor3};
    border-radius: ${props => props.isOpen ? "4px 4px 0px 0px": "4px"};
    @-moz-document url-prefix() {
        position: initial;
    };
`;

const StyledLeftContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledSubthemeLeftContent = styled.div`
    max-width: 200px;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

const StyledRightContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledSubthemeRightContent = styled.div`
    display: flex;
    align-items: center;
    margin-right: 10px;
`;

const StyledMasterGroupHeaderIcon = styled.div`
    width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        font-size: 20px;
        color: ${props => props.theme.colors.mainWhite};
    };
`;

const StyledMasterGroupLinkIcon = styled.div`
    width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        font-size: 18px;
        color: ${props => props.theme.colors.mainWhite};
    };
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

const StyledReadMoreButton = styled.button`
    color: ${props => props.theme.colors.mainColor1};
    font-size: 14px;
    font-weight: 400;
    background: none;
    border: none;
    padding: 0px;
    margin-left: 1px;
`;

const StyledLayerGroupContainer = styled(motion.div)`
    overflow: auto;
`;

const StyledInfoHeaderIconContainer = styled(motion.div)`
    color: ${props => props.theme.colors.mainWhite};
`;

const StyledLayerGroupImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
`;

const StyledLayerGroup = styled.ul`
    list-style-type: none;
    padding-inline-start: 10px;
    margin: 0;
`;

const StyledSubHeader = styled.h6`
    height: 30px;
    display: flex;
    align-items: center;
    color: ${props => props.theme.colors.secondaryColor2};
    margin: 0px;
    margin-top: 8px;
    padding-left: 8px;
    font-size: 15px;
    font-weight: bold;
`;

const StyledThemeContent = styled.div`
    margin: 0px;
    padding: 8px 8px 8px 8px;
    font-size: 14px;
    font-weight: 400;
`;

const StyledSubText = styled.p`
    color: ${props => props.theme.colors.black};

`;

const StyledLinkText = styled.a`

`;

const StyledMoreInfo = styled.span`
    display: block;
    margin: 10px 0px;
`;

const StyledMasterGroupHeaderIconLetter = styled.div`
    width: 25px;
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

const themeImages = {
    0: hankekartta,
    1: intersection,
    2: siltarajoituskartta,
    3: tienumerokartta,
    4: kuntokartta

};

const mainThemeImages = {
    3: {
        icon: faShip
    },
    2: {
        icon: faTrain
    },
    1: {
        icon: faRoad
    }
};

export const ThemeLayerList = ({
    allLayers,
    allThemes
}) => {

    const { store } = useContext(ReactReduxContext);

    const {
        selectedTheme,
        currentZoomLevel
    } = useAppSelector((state) => state.rpc);

    const [isOpen, setIsOpen] = useState(null);

    var themeGroups = Object.values(strings.themelayerlist.themeGroups)

    useEffect(() => {
        selectedTheme != null && themeGroups.map(themeGroup => {
            themeGroup.themes?.hasOwnProperty(selectedTheme.id) && setIsOpen(themeGroup.id)
        })
    }, []);

    useEffect(() => {
        if (currentZoomLevel < selectedTheme?.minZoomLevel) store.dispatch(setZoomTo(selectedTheme.minZoomLevel));
    }, [selectedTheme]);

    var linksArray = [];

    for(var i in strings.themeLinks) {
        linksArray.push(strings.themeLinks [i]);
    }


    return (
        <>
            { themeGroups.map((themeGroup, themeGroupIndex) => {
                return (
                    <>
                        <StyledThemeGroup
                            onClick={() => isOpen == themeGroupIndex ? setIsOpen(null) : setIsOpen(themeGroupIndex)}
                        >
                            <StyledMasterThemeHeader>
                                    <StyledMasterGroupHeaderIconLetter>
                                        {
                                            mainThemeImages.hasOwnProperty(themeGroup.id) ?
                                            <FontAwesomeIcon
                                                icon={mainThemeImages[themeGroup.id].icon}
                                            /> : <p>{ themeGroup.title.charAt(0).toUpperCase() }</p>
                                        }
                                    </StyledMasterGroupHeaderIconLetter>
                                    <StyledMasterGroupName>
                                        { themeGroup.title }
                                    </StyledMasterGroupName>
                                <StyledInfoHeaderIconContainer
                                    animate={{
                                        transform: isOpen == themeGroupIndex
                                            ? 'rotate(180deg)'
                                            : 'rotate(0deg)',
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faAngleDown}
                                    />
                                </StyledInfoHeaderIconContainer>
                            </StyledMasterThemeHeader>
                        </StyledThemeGroup>
                        <StyledLayerGroupContainer
                            key={'slg_' + themeGroupIndex}
                            initial='hidden'
                            animate={isOpen == themeGroupIndex ? 'visible' : 'hidden'}
                            variants={listVariants}
                            transition={{
                                duration: 0.3,
                                type: "tween"
                            }}
                        >
                            { themeGroup.themes && Object.values(themeGroup.themes).map((theme, index) => {
                                return <Themes
                                    themeGroupIndex={themeGroupIndex}
                                    key={index}
                                    themeLocale={theme}
                                    allLayers={allLayers}
                                    allThemes={allThemes}
                                    index={index}
                                />
                            })}
                            { themeGroup.themeLinks && Object.values(themeGroup.themeLinks).map((themeLink, index) => {
                                return <ThemeLinkList index={index} link={themeLink}/>
                            })}

                        </StyledLayerGroupContainer>
                    </>
                )
                })
            }
        </>
    );
  };

  export const Themes = ({
    themeGroupIndex,
    allLayers,
    allThemes,
    themeLocale,
    index
}) => {
    const { store } = useContext(ReactReduxContext);
    const {
        channel,
        selectedTheme,
        lastSelectedTheme,
        selectedThemeId,
    } = useAppSelector((state) => state.rpc);
    
    const handleSelectGroup = (theme) => {
        selectGroup(store, channel, theme, lastSelectedTheme, selectedThemeId);
    };

    return (
        <>
            { allThemes.filter(theme => theme.id == themeLocale.id).map((theme) => {
                return <ThemeGroup
                    key={index}
                    themeGroupIndex={themeGroupIndex}
                    theme={theme}
                    layers={allLayers}
                    index={index}
                    selectedTheme={selectedTheme}
                    selectGroup={handleSelectGroup}
                    selectedThemeId={selectedThemeId}
                    isSubtheme={false}
                />
            })
            }
        </>
    )
};

export const ThemeLinkList = ({
    link,
    index
}) => {

    return (
        <>
            <StyledLayerGroups index={index}>
                <StyledMasterGroupHeader
                    key={'theme_link_'+link.title}
                    onClick={() => {
                        window.open(link.url, '_blank');;
                    }}
                >
                    <StyledLeftContent>
                        <StyledMasterGroupHeaderIcon>
                            <FontAwesomeIcon
                                icon={faLink}
                            />
                        </StyledMasterGroupHeaderIcon>
                        <StyledLinkName>{link.title}</StyledLinkName>
                    </StyledLeftContent>
                    <StyledRightContent>
                        <StyledMasterGroupLinkIcon>
                            <FontAwesomeIcon
                                icon={faExternalLinkAlt}
                            />
                        </StyledMasterGroupLinkIcon>
                    </StyledRightContent>
                </StyledMasterGroupHeader>
            </StyledLayerGroups>
        </>
    );
};

export const ThemeDesc = ({
    theme,
    themeGroupIndex
}) => {
    const [isExcerptOpen, setIsExcerptOpen] = useState(false);

    const truncatedString = (string, characterAmount, text) => {
        return (
            string.length > characterAmount + 20 ? <>{string.substring(0, characterAmount) + '...'} <StyledReadMoreButton
                onClick={() => setIsExcerptOpen(!isExcerptOpen)}>{text}</StyledReadMoreButton></> : string
        )
    }

    return (
        <StyledThemeContent>
            {
                isExcerptOpen ?
                <div>
                    <StyledSubText>
                        {strings.themelayerlist.themeGroups[themeGroupIndex].themes[theme.id].description} 
                    </StyledSubText>
                    {
                        strings.themelayerlist.themeGroups[themeGroupIndex].themes[theme.id].links &&
                        <>
                            <StyledMoreInfo>{strings.themelayerlist.moreInfo}</StyledMoreInfo>
                            <ul>
                                {Object.values(strings.themelayerlist.themeGroups[themeGroupIndex].themes[theme.id].links).map((link, i) => {
                                    return(
                                        <li>
                                            <StyledLinkText rel="noreferrer" target="_blank" href={link} key={i}>{link}</StyledLinkText>
                                        </li> 
                                    )
                                })}
                            </ul>
                        </>
                    }
                    {
                        <StyledReadMoreButton onClick={() => setIsExcerptOpen(!isExcerptOpen)}> {strings.themelayerlist.readLess} </StyledReadMoreButton>
                    }
                </div> 
                :
                <StyledSubText>
                    {truncatedString(strings.themelayerlist.themeGroups[themeGroupIndex].themes[theme.id].description, 135, strings.themelayerlist.readMore)}
                </StyledSubText>
            }
        </StyledThemeContent>
    );
};

export const ThemeGroup = ({
    theme,
    themeGroupIndex,
    layers,
    index,
    selectedThemeId,
    selectGroup,
    isSubtheme
}) => {
    const [subthemeIsOpen, setSubthemeIsOpen] = useState(false);
    const [totalGroupLayersCount, setTotalGroupLayersCount] = useState(0);
    const [totalVisibleGroupLayersCount, setTotalVisibleGroupLayersCount] = useState(0);

    useEffect(() => {      
        var layersCount = 0;
        var visibleLayersCount = 0;
        const layersCounter = (theme) => {
            if (theme.hasOwnProperty("layers") && theme.layers.length > 0) {
                visibleLayersCount += layers.filter(l => theme.layers.includes(l.id) && l.visible === true).length;
                layersCount = layersCount + theme.layers.length;
            };
            setTotalGroupLayersCount(layersCount);
            setTotalVisibleGroupLayersCount(visibleLayersCount);
            
        };
        layersCounter(theme);
    },[theme, layers]);

    var filteredLayers = layers.filter(layer => theme.layers.includes(layer.id));
    const isOpen = isSubtheme ? subthemeIsOpen : selectedThemeId === theme.id;

    return (
        <StyledLayerGroups index={index}>
            {!isSubtheme ?
                <StyledMasterGroupHeader
                    key={'smgh_' + theme.id}
                    onClick={() => {
                        selectGroup(theme);
                    }}
                    isOpen={isOpen}
                >
                    <StyledLeftContent>
                        <StyledMasterGroupHeaderIcon>
                            <FontAwesomeIcon
                                icon={faMap}
                            />
                        </StyledMasterGroupHeaderIcon>
                        <StyledMasterGroupName>{theme.name}</StyledMasterGroupName>
                    </StyledLeftContent>
                    <StyledRightContent>
                        <StyledSelectButton
                            isOpen={isOpen}
                        >
                        </StyledSelectButton>
                    </StyledRightContent>
                </StyledMasterGroupHeader>
            :
                <StyledSubthemeHeader
                    key={'smgh_' + theme.id}
                    onClick={() => {
                        setSubthemeIsOpen(!subthemeIsOpen);
                    }}
                    isOpen={isOpen}
                >
                    <StyledSubthemeLeftContent>
                        <StyledSubthemeName>{theme.name}</StyledSubthemeName>
                    </StyledSubthemeLeftContent>
                    <StyledSubthemeRightContent>
                        <StyledSubGroupLayersCount>
                            {
                                totalVisibleGroupLayersCount +" / "+ totalGroupLayersCount
                            }
                        </StyledSubGroupLayersCount>
                        <StyledInfoHeaderIconContainer
                                    animate={{
                                        transform: isOpen
                                            ? 'rotate(180deg)'
                                            : 'rotate(0deg)',
                                    }}
                                    style={{marginLeft: '10px'}}
                                >
                                    <FontAwesomeIcon
                                        icon={faAngleDown}
                                    />
                                </StyledInfoHeaderIconContainer>
                    </StyledSubthemeRightContent>
                </StyledSubthemeHeader>
            }
                    {
                        !isOpen && themeGroupIndex != undefined && strings.themelayerlist.themeGroups[themeGroupIndex].themes.hasOwnProperty(theme.id) && strings.themelayerlist.themeGroups[themeGroupIndex].themes[theme.id].description !== null && strings.themelayerlist.themeGroups[themeGroupIndex].themes[theme.id].description.length > 0 && 
                            <ThemeDesc
                                theme={theme}
                                themeGroupIndex={themeGroupIndex}
                            />
                    }


            <StyledLayerGroupContainer
                key={'slg_' + index}
                initial='hidden'
                animate={isOpen ? 'visible' : 'hidden'}
                variants={listVariants}
                transition={{
                    duration: 0.3,
                    type: "tween"
                }}
            >
                <div>
                    {themeImages[theme.id] && <StyledLayerGroupImage src={themeImages[theme.id]} alt=''/>}

                    {
                        themeGroupIndex != undefined && strings.themelayerlist.themeGroups[themeGroupIndex].themes.hasOwnProperty(theme.id) && strings.themelayerlist.themeGroups[themeGroupIndex].themes[theme.id].description !== null &&
                            <ThemeDesc
                                theme={theme}
                                themeGroupIndex={themeGroupIndex}
                            />
                    }
                </div>
                <StyledLayerGroup>
                    <Layers layers={filteredLayers} isOpen={isOpen} theme={theme.name}/>
                </StyledLayerGroup>

                {theme.subthemes && theme.subthemes.map((subtheme, index) => {
                        return (
                            <ThemeGroup
                                key={index}
                                theme={subtheme}
                                layers={layers}
                                index={index}
                                selectGroup={selectGroup}
                                selectedThemeId={selectedThemeId}
                                isSubtheme={true}
                            />
                        );
                    })
                }
            </StyledLayerGroupContainer>
        </StyledLayerGroups>
    );
  };

  export default ThemeLayerList;