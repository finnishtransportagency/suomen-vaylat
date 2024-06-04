import { useContext, useState, useEffect } from 'react';
import { faMap, faExternalLinkAlt, faLink, faAngleDown, faRoad, faShip, faTrain } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import strings from '../../../translations';
import { setZoomTo } from '../../../state/slices/rpcSlice';
import { setWarning } from '../../../state/slices/uiSlice';
import { selectGroup } from '../../../utils/rpcUtil';
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
    padding: 0px 0px 0px 16px;
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
    max-width: 70%;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

const StyledRightContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledSubthemeRightContent = styled.div`
    max-width: 30%;
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
    padding-inline-start: 0px;
    margin: 0;
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
    hankekartta: hankekartta,
    päällysteidenkuntokartta: intersection,
    siltarajoituskartta: siltarajoituskartta,
    tienumerokartta: tienumerokartta,
    kuntokartta: kuntokartta

};

const mainThemeImages = {
    vesiväylät: {
        icon: faShip
    },
    rataverkko: {
        icon: faTrain
    },
    tieverkko: {
        icon: faRoad
    }
};

const getLinks = (text, startTag, endTag) => {
    let links = [];
    let index = -1;
    while (true)
    {
        let i = text.indexOf(startTag, index);

        if (i == -1) break;

        if (index == -1) {
            index = i;
        } else {
            let j = text.indexOf(endTag, index);
            links.push(text.substring(index + startTag.length, j));
            index = j + endTag.length;
        }
    }
    return links;
}

export const ThemeLayerList = ({
    allLayers,
    allThemes
}) => {

    const { store } = useContext(ReactReduxContext);
    const lang = strings.getLanguage();

    const {
        selectedTheme,
        currentZoomLevel
    } = useAppSelector((state) => state.rpc);

    const [isOpen, setIsOpen] = useState(null);

    useEffect(() => {
        selectedTheme != null && allThemes.forEach((themeGroup, index) => {
            themeGroup.hasOwnProperty("groups") 
            && themeGroup.groups?.find(g => g === selectedTheme) 
            && setIsOpen(index)
        })
    }, []);

    useEffect(() => {
        if (currentZoomLevel < selectedTheme?.minZoomLevel) store.dispatch(setZoomTo(selectedTheme.minZoomLevel));
    }, [selectedTheme]);

    var linksArray = [];

    for(var i in strings.themeLinks) {
        linksArray.push(strings.themeLinks[i]);
    }

    return (
        <>
            { allThemes.map((themeGroup, themeGroupIndex) => {
                return (
                    <>
                        <StyledThemeGroup
                            onClick={() => isOpen === themeGroupIndex ? setIsOpen(null) : setIsOpen(themeGroupIndex)}
                        >
                            <StyledMasterThemeHeader>
                                    <StyledMasterGroupHeaderIconLetter>
                                        {
                                            mainThemeImages.hasOwnProperty(themeGroup.locale["fi"].name.toLowerCase()) ?
                                            <FontAwesomeIcon
                                                icon={mainThemeImages[themeGroup.locale["fi"].name.toLowerCase()].icon}
                                            /> : <p>{ themeGroup.locale[lang].name.charAt(0).toUpperCase() }</p>
                                        }
                                    </StyledMasterGroupHeaderIconLetter>
                                    <StyledMasterGroupName>
                                        { themeGroup.locale[lang].name }
                                    </StyledMasterGroupName>
                                <StyledInfoHeaderIconContainer
                                    animate={{
                                        transform: isOpen === themeGroupIndex
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
                            animate={isOpen === themeGroupIndex ? 'visible' : 'hidden'}
                            variants={listVariants}
                            transition={{
                                duration: 0.3,
                                type: "tween"
                            }}
                        >
                            { themeGroup?.groups?.map((theme, index) => {
                                return <Themes
                                    lang={lang}
                                    key={index}
                                    theme={theme}
                                    allLayers={allLayers}
                                    index={index}
                                />
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
    lang,
    allLayers,
    theme,
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
        selectGroup(store, channel, allLayers, theme, lastSelectedTheme, selectedThemeId);
    };

    // Check if desc had url links so those can be displayed as links instead of group themes
    const txt = theme.locale[lang].desc && theme.locale[lang].desc.length > 0 && theme.locale[lang].desc;
    const link = txt && getLinks(txt.replace(/\s/g, ''), "<url>", "</url>")[0] || [];
    
    return (
        <>
            { link.length > 0 ?
                <ThemeLinkList index={index} link={link} theme={theme} lang={lang}/>
            :
                <ThemeGroup
                    key={index}
                    lang={lang}
                    theme={theme}
                    layers={allLayers}
                    index={index}
                    selectedTheme={selectedTheme}
                    selectGroup={handleSelectGroup}
                    selectedThemeId={selectedThemeId}
                    isSubtheme={false}
                />
            }
        </>
    )
};

export const ThemeGroup = ({
    lang,
    theme,
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
                visibleLayersCount += layers.filter(l => theme.layers?.includes(l.id) && l.visible === true).length;
                layersCount = layersCount + theme.layers.length;
            };
            setTotalGroupLayersCount(layersCount);
            setTotalVisibleGroupLayersCount(visibleLayersCount);
            
        };
        layersCounter(theme);
    },[theme, layers]);

    var filteredLayers = layers.filter(layer => theme.layers?.includes(layer.id));

    const isOpen = isSubtheme ? subthemeIsOpen : theme.id === selectedThemeId || (theme.hasOwnProperty("groups") && theme.groups.find(t => t.id === selectedThemeId));
    
    // check if group desc has img tags in order to display linked image instead of possible default
    const txt = theme.locale[lang].desc && theme.locale[lang].desc.length > 0 && theme.locale[lang].desc;
    const images = txt && getLinks(txt.replace(/\s/g, ''), "<img>", "</img>") || [];

    const themeNameFi = theme.locale["fi"].name.toLowerCase().replace(/\s/g, '');

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
                        <StyledMasterGroupName>{theme.locale[lang].name}</StyledMasterGroupName>
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
                        <StyledSubthemeName>{theme.locale[lang].name}</StyledSubthemeName>
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
                        !isOpen && theme.locale[lang].hasOwnProperty("desc") && theme.locale[lang].desc.length > 0 &&
                            <ThemeDesc
                                theme={theme}
                                lang={lang}
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
                    { images.length > 0 ?
                        (
                            images.map((img) => {
                                return(
                                    <StyledLayerGroupImage src={img} alt=''/>
                                )
                            })
                        )
                    :
                        (
                            themeImages[themeNameFi] && <StyledLayerGroupImage src={themeImages[themeNameFi]} alt=''/>
                        )
                    }

                    {
                        isOpen && theme.locale[lang].hasOwnProperty("desc") && theme.locale[lang].desc.length > 0 &&
                            <ThemeDesc
                                theme={theme}
                                lang={lang}
                            />
                    }
                </div>
                <StyledLayerGroup>
                    <Layers layers={filteredLayers} isOpen={isOpen} themeName={theme.locale[lang].name}/>
                </StyledLayerGroup>

                {theme.groups && theme.groups.map((subtheme, index) => {
                        return (
                            <ThemeGroup
                                key={index}
                                lang={lang}
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

  // Handle theme links
export const ThemeLinkList = ({
    theme,
    link,
    lang,
    index
}) => {
    
    const { store } = useContext(ReactReduxContext);

    const handleLinkClick = (event, link) => {
        event.preventDefault();
        const savedState = localStorage.getItem("dontShowExitLinkWarn");
        if (!savedState) {
            store.dispatch(setWarning({
            title: strings.exitConfirmation,
            subtitle: null,
            confirm: {
                text: strings.general.continue,
                action: () => {
                    window.open(link, "_blank");
                    store.dispatch(setWarning(null));
                }
            },
            cancel: {
                text: strings.general.cancel,
                action: () => {
                store.dispatch(setWarning(null))
                }
            },
            dontShowAgain: {
            id: "dontShowExitLinkWarn"
            }
            }))
        } else {
            window.open(link, "_blank");
        }
    };

    return (
        <>
            <StyledLayerGroups index={index}>
                <StyledMasterGroupHeader
                    key={'theme_link_'+theme.locale[lang].name}
                    onClick={(e) => handleLinkClick(e,link)}
                >
                    <StyledLeftContent>
                        <StyledMasterGroupHeaderIcon>
                            <FontAwesomeIcon
                                icon={faLink}
                            />
                        </StyledMasterGroupHeaderIcon>
                        <StyledLinkName>{theme.locale[lang].name}</StyledLinkName>
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
    lang
}) => {
    const [isExcerptOpen, setIsExcerptOpen] = useState(false);

    const truncatedString = (string, characterAmount, text) => {
        return (
            string.length > characterAmount + 20 ? <>{string.substring(0, characterAmount) + '...'} <StyledReadMoreButton
                onClick={() => setIsExcerptOpen(!isExcerptOpen)}>{text}</StyledReadMoreButton></> : string
        )
    }

    // Get content from desc (surrounded by HTMl tags)
    const txt = theme.locale[lang].desc && theme.locale[lang].desc.length > 0 && theme.locale[lang].desc;

    const links = getLinks(txt.replace(/\s/g, ''),"<a>", "</a>")
    const desc = getLinks(txt, "<p>", "</p>")
    
    const { store } = useContext(ReactReduxContext);

    const handleLinkClick = (event, link) => {
        event.preventDefault();
        const savedState = localStorage.getItem("dontShowExitLinkWarn");
        if (!savedState) {
            store.dispatch(setWarning({
            title: strings.exitConfirmation,
            subtitle: null,
            confirm: {
                text: strings.general.continue,
                action: () => {
                    window.open(link, "_blank");
                    store.dispatch(setWarning(null));
                }
            },
            cancel: {
                text: strings.general.cancel,
                action: () => {
                store.dispatch(setWarning(null))
                }
            },
            dontShowAgain: {
            id: "dontShowExitLinkWarn"
            }
            }))
        } else {
            window.open(link, "_blank");
        }
    };

    return (
        <StyledThemeContent>
            {
                isExcerptOpen ?
                <div>
                    <StyledSubText>
                        {desc.toString()} 
                    </StyledSubText>
                    {
                        links && links.length > 0 &&
                        <>
                            <StyledMoreInfo>{strings.themelayerlist.moreInfo}</StyledMoreInfo>
                            <ul>
                                {links.map((link, i) => {
                                    return(
                                        <li>
                                            <StyledLinkText rel="noreferrer" target="_blank" onClick={(e) => handleLinkClick(e,link)} key={i}>{link}</StyledLinkText>
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
                    {truncatedString(desc.toString(), 70, strings.themelayerlist.readMore)}
                </StyledSubText>
            }
        </StyledThemeContent>
    );
};



  export default ThemeLayerList;