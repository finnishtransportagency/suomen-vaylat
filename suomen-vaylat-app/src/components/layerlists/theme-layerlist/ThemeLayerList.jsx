import { useContext, useState, useEffect, Fragment } from 'react';
import {
  faExternalLinkAlt,
  faLink,
  faAngleDown,
  faRoad,
  faShip,
  faTrain,
  faLock,
  faKey
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import strings from '../../../translations';
import { setZoomTo } from '../../../state/slices/rpcSlice';
import { setWarning } from '../../../state/slices/uiSlice';
import {
  closeTheme,
  selectTheme,
  sortObjectAlphabetically
} from '../../../utils/rpcUtil';
import Layers from '../../layer/Layers';

import hankekartta from './resources/images/hankekartta.JPG';
import intersection from './resources/images/Intersection.jpg';
import siltarajoituskartta from './resources/images/siltarajoituskartta.jpg';
import tienumerokartta from './resources/images/tienumerokartta.jpg';
import kuntokartta from './resources/images/kuntokartta.jpg';
import { theme } from '../../../theme/theme';
import { IS_EXTRANET } from '../../../utils/appInfoUtil';

const listVariants = {
  visible: {
    height: 'auto',
    opacity: 1
  },
  hidden: {
    height: 0,
    opacity: 0
  }
};

const StyledLayerGroups = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 8px 0px 8px 0px;
  padding-left: ${(props) => (props.isFirstSubtheme ? '0px' : '16px')};
  &:last-child {
    ${(props) =>
      props.parentId === -1
        ? '1px solid ' + props.theme.colors.mainColor2
        : 'none'};
  }

  /* ensure header expansion isn't clipped by this container */
  overflow: visible;
`;

const StyledMasterGroupName = styled.p`
  user-select: none;

  /* When expanded we remove truncation so full name displays on multiple lines */
  white-space: ${(props) => (props.$expanded ? 'normal' : 'nowrap')};
  overflow: ${(props) => (props.$expanded ? 'visible' : 'hidden')};
  text-overflow: ellipsis;
  max-width: ${(props) => (props.$expanded ? 'none' : '230px')};
  color: ${(props) => props.theme.colors.mainWhite};
  margin: 0;
  padding: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.1s ease-in;
  cursor: pointer;
`;

const StyledLinkName = styled.p`
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  color: ${(props) => props.theme.colors.mainWhite};
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
    ${(props) =>
      props.parentId === -1
        ? '1px solid ' + props.theme.colors.mainColor2
        : 'none'};
  }
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
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  @-moz-document url-prefix() {
    position: initial;
  }

  /* allow children to expand without being clipped */
  overflow: visible;
`;

const StyledSubthemeName = styled.p`
  user-select: none;

  /* When expanded we remove truncation so full name displays on multiple lines */
  white-space: ${(props) => (props.$expanded ? 'normal' : 'nowrap')};
  overflow: ${(props) => (props.$expanded ? 'visible' : 'hidden')};
  text-overflow: ellipsis;
  max-width: ${(props) => (props.$expanded ? 'none' : '230px')};
  color: ${(props) => props.theme.colors.mainWhite};
  margin: 0;
  padding: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.1s ease-in;
  cursor: pointer;
`;

const StyledMasterGroupHeader = styled.div`
  z-index: 1;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.secondaryColorGreen};
  border-radius: ${(props) => (props.isOpen ? '4px 4px 0px 0px' : '4px')};
  box-shadow: 0px 3px 6px 0px rgb(0 0 0 / 16%);
  @-moz-document url-prefix() {
    position: initial;
  }

  /* ensure name can expand */
  overflow: visible;
`;

const StyledSubGroupLayersCount = styled.p`
  margin: 0;
  padding: 0px;
  font-size: 13px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.mainWhite};
`;

const StyledSubthemeHeader = styled.div`
  z-index: 1;
  height: ${(props) => (props.$expanded ? 'auto' : '33px')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.secondaryColorLightGreen};
  border-radius: ${(props) => (props.isOpen ? '4px 4px 0px 0px' : '4px')};
  @-moz-document url-prefix() {
    position: initial;
  }

  /* ensure name can expand */
  overflow: visible;
`;

const StyledLeftContent = styled.div`
  display: flex;
  align-items: center;
`;

const StyledSubthemeLeftContent = styled.div`
  max-width: 60%;
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
  margin: 1em 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    font-size: 20px;
    color: ${(props) => props.theme.colors.mainWhite};
  }
`;

const StyledMasterGroupLinkIcon = styled.div`
  width: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    font-size: 18px;
    color: ${(props) => props.theme.colors.mainWhite};
  }
`;

const StyledSelectButton = styled.div`
  position: relative;
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  margin: 1em;
  border: 2px solid white;
  border-radius: 50%;
  &:before {
    position: absolute;
    content: '';
    width: 10px;
    height: 10px;
    background-color: ${(props) =>
      props.isActive ? props.theme.colors.mainWhite : 'transparent'};
    border-radius: 50%;
    transition: background-color 0.3s ease-out;
  }
`;

const StyledReadMoreButton = styled.button`
  color: ${(props) => props.theme.colors.mainColor1};
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
  color: ${(props) => props.theme.colors.mainWhite};
`;

const StyledThemeArrow = styled(motion.div)`
  margin: 1em;
  color: ${(props) => props.theme.colors.mainWhite};
`;

const StyledLayerGroupImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const StyledLayerGroup = styled.div`
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
  color: ${(props) => props.theme.colors.black};
`;

const StyledLinkText = styled.a``;

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
    color: ${(props) => props.theme.colors.mainWhite};
  }
  p {
    margin: 0;
    font-weight: bold;
    font-size: 22px;
    color: ${(props) => props.theme.colors.mainWhite};
  }
`;

const StyledSubthemes = styled.div`
  padding: 0px 16px;
`;

const StyledRestrictedThemesTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.secondaryColorGreen};
`;

const StyledOpenThemesTitle = styled.div`
  font-weight: 600;
  color: ${(props) => props.theme.colors.secondaryColorGreen};
`;

const HorizontalLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: #d7d9db;
  margin: 0.5em 0;
`;

const StyledThemesContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 6px;
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

const getDescTagContent = (text, startTag, endTag) => {
  let links = [];
  let index = 0;

  while (index < text.length) {
    let startPos = text.indexOf(startTag, index);
    if (startPos === -1) break;

    let endPos = text.indexOf(endTag, startPos + startTag.length);
    if (endPos === -1) break; // Added this to handle cases where the end tag is not found

    let link = text.substring(startPos + startTag.length, endPos);
    links.push(link);

    index = endPos + endTag.length;
  }
  return links;
};

export const ThemeLayerList = ({ allLayers, allThemes }) => {
  const { store } = useContext(ReactReduxContext);
  const lang = strings.getLanguage();

  const { selectedTheme, currentZoomLevel } = useAppSelector(
    (state) => state.rpc
  );

  const [isOpen, setIsOpen] = useState(null);

  useEffect(() => {
    selectedTheme != null &&
      allThemes.forEach((themeGroup, index) => {
        themeGroup.hasOwnProperty('groups') &&
          themeGroup.groups?.find((g) => g === selectedTheme) &&
          setIsOpen(index);
      });
  }, []);

  useEffect(() => {
    if (currentZoomLevel < selectedTheme?.minZoomLevel)
      store.dispatch(setZoomTo(selectedTheme.minZoomLevel));
  }, [selectedTheme]);

  var linksArray = [];

  for (var i in strings.themeLinks) {
    linksArray.push(strings.themeLinks[i]);
  }

  return (
    <>
      {allThemes.map((themeGroup, themeGroupIndex) => {
        return (
          <Fragment key={`themeGroup-div-${themeGroupIndex}`}>
            <StyledThemeGroup
              key={`stg-${themeGroupIndex}`}
              onClick={() =>
                isOpen === themeGroupIndex
                  ? setIsOpen(null)
                  : setIsOpen(themeGroupIndex)
              }
            >
              <StyledMasterThemeHeader>
                <StyledMasterGroupHeaderIconLetter>
                  {mainThemeImages.hasOwnProperty(
                    themeGroup.locale['fi'].name.toLowerCase()
                  ) ? (
                    <FontAwesomeIcon
                      icon={
                        mainThemeImages[
                          themeGroup.locale['fi'].name.toLowerCase()
                        ].icon
                      }
                    />
                  ) : (
                    <p>
                      {themeGroup.locale[lang].name.charAt(0).toUpperCase()}
                    </p>
                  )}
                </StyledMasterGroupHeaderIconLetter>

                <StyledMasterGroupName
                  $expanded={isOpen === themeGroupIndex}
                  title={themeGroup.locale[lang].name}
                >
                  {themeGroup.locale[lang].name}
                </StyledMasterGroupName>

                <StyledInfoHeaderIconContainer
                  animate={{
                    transform:
                      isOpen === themeGroupIndex
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)'
                  }}
                >
                  <FontAwesomeIcon icon={faAngleDown} />
                </StyledInfoHeaderIconContainer>
              </StyledMasterThemeHeader>
            </StyledThemeGroup>
            <StyledLayerGroupContainer
              key={`slg-${themeGroupIndex}`}
              initial="hidden"
              animate={isOpen === themeGroupIndex ? 'visible' : 'hidden'}
              variants={listVariants}
              transition={{
                duration: 0.3,
                type: 'tween'
              }}
            >
              <Themes
                groups={
                  Array.isArray(themeGroup?.groups)
                    ? [...themeGroup.groups]
                    : []
                }
                allLayers={allLayers}
              />
            </StyledLayerGroupContainer>
          </Fragment>
        );
      })}
    </>
  );
};

export const Themes = ({ groups, allLayers }) => {
  const { store } = useContext(ReactReduxContext);
  const lang = strings.getLanguage();

  const { channel, selectedTheme } = useAppSelector((state) => state.rpc);
  const handleSelectTheme = (theme) => {
    if (selectedTheme && theme.id === selectedTheme.id) {
      closeTheme(store, channel, selectedTheme);
    } else {
      selectTheme(store, channel, allLayers, theme, selectedTheme);
    }
  };

  const [restrictedOpen, setRestrictedOpen] = useState(true);
  const [normalOpen, setNormalOpen] = useState(true);

  let links = [];
  let openThemes = [];
  let restrictedThemes = [];

  groups
    .sort((a, b) =>
      sortObjectAlphabetically(a.locale[lang].name, b.locale[lang].name)
    )
    .forEach((group, index) => {
      // Check if desc had url links so those can be displayed as links instead of group themes
      const txt =
        (group.locale[lang].desc &&
          group.locale[lang].desc.length > 0 &&
          group.locale[lang].desc) ||
        false;
      const link =
        (txt &&
          getDescTagContent(txt.replace(/\s/g, ''), '<url>', '</url>')[0]) ||
        [];
      if (link.length > 0) {
        links.push({ group, link, index });
      } else {
        if (group.locale?.fi?.name?.includes('(sisäinen)')) {
          restrictedThemes.push({ group, index });
        } else {
          openThemes.push({ group, index });
        }
      }
    });

  return (
    <StyledSubthemes>
      {IS_EXTRANET ? (
        <>
          {/* Restricted section header */}
          <StyledThemesContainer
            role="button"
            tabIndex={0}
            aria-expanded={restrictedOpen}
            onClick={() => setRestrictedOpen((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setRestrictedOpen((v) => !v);
            }}
          >
            <FontAwesomeIcon
              style={{ color: theme.colors.secondaryColorGreen, margin: '8px' }}
              icon={faLock}
            />
            <StyledRestrictedThemesTitle style={{ marginLeft: 4 }}>
              {strings.themelayerlist.restrictedThemes}
            </StyledRestrictedThemesTitle>
            <motion.div
              style={{ marginLeft: 'auto', marginRight: 8 }}
              animate={{ rotate: restrictedOpen ? 180 : 0 }}
            >
              <FontAwesomeIcon
                color={theme.colors.secondaryColorGreen}
                icon={faAngleDown}
              />
            </motion.div>
          </StyledThemesContainer>

          {/* Restricted list (animated) */}
          <motion.div
            initial={false}
            animate={restrictedOpen ? 'visible' : 'hidden'}
            variants={listVariants}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            {restrictedThemes.length > 0 &&
              restrictedThemes.map((theme) => {
                return (
                  <ThemeGroup
                    key={`restricted-theme-${theme.index}`}
                    lang={lang}
                    theme={theme.group}
                    layers={allLayers}
                    index={theme.index}
                    selectedTheme={selectedTheme}
                    selectTheme={handleSelectTheme}
                    isSubtheme={false}
                    isFirstSubtheme={true}
                  />
                );
              })}
          </motion.div>

          <HorizontalLine />

          {/* open section header */}
          <StyledThemesContainer
            role="button"
            tabIndex={0}
            aria-expanded={normalOpen}
            onClick={() => setNormalOpen((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setNormalOpen((v) => !v);
            }}
          >
            <FontAwesomeIcon
              style={{ color: theme.colors.secondaryColorGreen, margin: '8px' }}
              icon={faKey}
            />
            <StyledOpenThemesTitle style={{ marginLeft: 4 }}>
              {strings.themelayerlist.openThemes}
            </StyledOpenThemesTitle>
            <motion.div
              style={{ marginLeft: 'auto', marginRight: 8 }}
              animate={{ rotate: normalOpen ? 180 : 0 }}
            >
              <FontAwesomeIcon
                color={theme.colors.secondaryColorGreen}
                icon={faAngleDown}
              />
            </motion.div>
          </StyledThemesContainer>

          {/* Normal list (animated) */}
          <motion.div
            initial={false}
            animate={normalOpen ? 'visible' : 'hidden'}
            variants={listVariants}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            {openThemes.length > 0 &&
              openThemes.map((theme) => {
                return (
                  <ThemeGroup
                    key={`theme-${theme.index}`}
                    lang={lang}
                    theme={theme.group}
                    layers={allLayers}
                    index={theme.index}
                    selectedTheme={selectedTheme}
                    selectTheme={handleSelectTheme}
                    isSubtheme={false}
                    isFirstSubtheme={true}
                  />
                );
              })}
          </motion.div>
        </>
      ) : (
        <>
          {openThemes.length > 0 &&
            openThemes.map((theme) => {
              return (
                <ThemeGroup
                  key={`theme-${theme.index}`}
                  lang={lang}
                  theme={theme.group}
                  layers={allLayers}
                  index={theme.index}
                  selectedTheme={selectedTheme}
                  selectTheme={handleSelectTheme}
                  isSubtheme={false}
                  isFirstSubtheme={true}
                />
              );
            })}
        </>
      )}

      {/* Links */}
      {links.length > 0 &&
        links.map((link, index) => {
          return (
            <ThemeLinkList
              key={`link-${index}`}
              isFirstSubtheme={true}
              index={link.index}
              link={link.link}
              theme={link.group}
              lang={lang}
            />
          );
        })}
    </StyledSubthemes>
  );
};

export const ThemeGroup = ({
  lang,
  theme,
  layers,
  index,
  selectedTheme,
  selectTheme,
  isSubtheme,
  isFirstSubtheme
}) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [totalGroupLayersCount, setTotalGroupLayersCount] = useState(0);
  const [totalVisibleGroupLayersCount, setTotalVisibleGroupLayersCount] =
    useState(0);

  useEffect(() => {
    let layersCount = 0;
    let visibleLayersCount = 0;
    const layersCounter = (theme) => {
      if (theme.hasOwnProperty('layers') && theme.layers.length > 0) {
        visibleLayersCount += layers.filter(
          (l) => theme.layers?.includes(l.id) && l.visible === true
        ).length;
        layersCount += theme.layers.length;
      }
      setTotalGroupLayersCount(layersCount);
      setTotalVisibleGroupLayersCount(visibleLayersCount);
    };
    layersCounter(theme);
  }, [theme, layers]);

  const filteredLayers = layers.filter((layer) =>
    theme.layers?.includes(layer.id)
  );

  const txt =
    (theme.locale[lang].desc &&
      theme.locale[lang].desc.length > 0 &&
      theme.locale[lang].desc) ||
    false;

  const isActive = selectedTheme?.id === theme.id;

  const images =
    (txt && getDescTagContent(txt.replace(/\s/g, ''), '<img>', '</img>')) || [];

  const themeNameFi = theme.locale['fi'].name.toLowerCase().replace(/\s/g, '');
  let groups = [];
  if (theme.groups) {
    groups = [...theme.groups];
    groups.sort((a, b) =>
      sortObjectAlphabetically(a.locale[lang].name, b.locale[lang].name)
    );
  }

  return (
    <StyledLayerGroups
      id={`layer-group-${theme.id}-${index}`}
      isFirstSubtheme={isFirstSubtheme}
      isSubtheme={isSubtheme}
      index={index}
      tabIndex="0"
      role="region"
      aria-labelledby={`theme-group-heading-${index}`}
    >
      {!isSubtheme ? (
        <StyledMasterGroupHeader
          key={`master-group-${theme.id}`}
          $expanded={isThemeOpen}
          isOpen={isThemeOpen}
        >
          <StyledThemeArrow
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsThemeOpen(!isThemeOpen);
            }}
            role="button"
            aria-expanded={isThemeOpen}
            aria-label={`Toggle ${theme.locale[lang].name} visibility`}
            tabIndex="0"
            animate={{
              transform: isThemeOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          >
            <FontAwesomeIcon icon={faAngleDown} />
          </StyledThemeArrow>

          <StyledMasterGroupName
            $expanded={isThemeOpen}
            title={theme.locale[lang].name}
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsThemeOpen(!isThemeOpen);
            }}
            role="button"
            aria-label={`Toggle ${theme.locale[lang].name} visibility`}
            tabIndex="0"
          >
            {theme.locale[lang].name}
          </StyledMasterGroupName>

          <StyledRightContent
            onClick={(e) => {
              !isThemeOpen &&
                selectedTheme?.id !== theme.id &&
                setIsThemeOpen(true);
              selectTheme(theme);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                !isThemeOpen &&
                  selectedTheme?.id !== theme.id &&
                  setIsThemeOpen(true);
                selectTheme(theme);
              }
            }}
            role="button"
            aria-label={`Select ${theme.locale[lang].name}`}
            tabIndex="0"
          >
            <StyledSelectButton isActive={isActive} />
          </StyledRightContent>
        </StyledMasterGroupHeader>
      ) : (
        <StyledSubthemeHeader
          $expanded={isThemeOpen}
          key={`subtheme-${theme.id}`}
          onClick={() => setIsThemeOpen(!isThemeOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setIsThemeOpen(!isThemeOpen);
          }}
          role="button"
          aria-expanded={isThemeOpen}
          aria-label={`Toggle ${theme.locale[lang].name} subtheme visibility`}
          tabIndex="0"
          isOpen={isThemeOpen}
        >
          <StyledSubthemeLeftContent>
            <StyledSubthemeName $expanded={isThemeOpen}>
              {theme.locale[lang].name}
            </StyledSubthemeName>
          </StyledSubthemeLeftContent>
          <StyledSubthemeRightContent>
            <StyledSubGroupLayersCount>
              {totalVisibleGroupLayersCount + ' / ' + totalGroupLayersCount}
            </StyledSubGroupLayersCount>
            <StyledInfoHeaderIconContainer
              animate={{
                transform: isThemeOpen ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
              style={{ marginLeft: '10px' }}
              aria-label={`Expand ${theme.locale[lang].name}`}
            >
              <FontAwesomeIcon icon={faAngleDown} />
            </StyledInfoHeaderIconContainer>
          </StyledSubthemeRightContent>
        </StyledSubthemeHeader>
      )}
      {isThemeOpen && (
        <StyledLayerGroupContainer
          id={`layer-group-container-${theme.id}-${index}`}
          key={`layer-group-${index}`}
          initial="hidden"
          animate={isThemeOpen ? 'visible' : 'hidden'}
          variants={listVariants}
          transition={{
            duration: 0.3,
            type: 'tween'
          }}
          role="region"
          aria-hidden={!isThemeOpen}
        >
          <div>
            {images.length > 0
              ? images.map((img, index) => (
                  <StyledLayerGroupImage
                    src={img}
                    key={`img-${index}`}
                    alt=""
                  />
                ))
              : themeImages[themeNameFi] && (
                  <StyledLayerGroupImage
                    src={themeImages[themeNameFi]}
                    key={`theme-img-${themeNameFi}`}
                    alt=""
                  />
                )}
            {isThemeOpen &&
              theme.locale[lang].hasOwnProperty('desc') &&
              theme.locale[lang].desc.length > 0 && (
                <ThemeDesc theme={theme} lang={lang} />
              )}
          </div>
          <StyledLayerGroup>
            <Layers
              layers={filteredLayers}
              isOpen={isThemeOpen}
              themeName={theme.locale[lang].name}
            />
          </StyledLayerGroup>
          {groups.map((subtheme, subIndex) => (
            <ThemeGroup
              key={`subtheme-group-${subtheme.id || subIndex}`}
              lang={lang}
              theme={subtheme}
              layers={layers}
              index={subIndex}
              selectTheme={selectTheme}
              isSubtheme={true}
              isFirstSubtheme={!isSubtheme}
            />
          ))}
        </StyledLayerGroupContainer>
      )}
    </StyledLayerGroups>
  );
};

// Handle theme links
export const ThemeLinkList = ({
  theme,
  link,
  lang,
  index,
  isFirstSubtheme
}) => {
  const { store } = useContext(ReactReduxContext);

  const handleLinkClick = (event, link) => {
    event.preventDefault();
    const savedState = localStorage.getItem('dontShowExitLinkWarn');
    if (!savedState) {
      store.dispatch(
        setWarning({
          title: strings.exitConfirmation,
          subtitle: strings.layerlist.linkAddress + link,
          confirm: {
            text: strings.general.continue,
            action: () => {
              window.open(link, '_blank');
              store.dispatch(setWarning(null));
            }
          },
          cancel: {
            text: strings.general.cancel,
            action: () => {
              store.dispatch(setWarning(null));
            }
          },
          dontShowAgain: {
            id: 'dontShowExitLinkWarn'
          }
        })
      );
    } else {
      window.open(link, '_blank');
    }
  };

  return (
    <>
      <StyledLayerGroups
        key={`link-container-${index}`}
        id={`link-layer-group-${index}`}
        isFirstSubtheme={isFirstSubtheme}
        isSubtheme={false}
        index={index}
      >
        <StyledMasterGroupHeader
          key={`theme-link-${index}`}
          id={`theme-link-header-${index}`}
          onClick={(e) => handleLinkClick(e, link)}
        >
          <StyledLeftContent>
            <StyledMasterGroupHeaderIcon>
              <FontAwesomeIcon icon={faLink} />
            </StyledMasterGroupHeaderIcon>
          </StyledLeftContent>

          <StyledMasterGroupName
            title={theme.locale[lang].name}
            aria-label={`Open ${theme.locale[lang].name} link`}
            tabIndex="0"
          >
            {theme.locale[lang].name}
          </StyledMasterGroupName>

          <StyledRightContent>
            <StyledMasterGroupLinkIcon>
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </StyledMasterGroupLinkIcon>
          </StyledRightContent>
        </StyledMasterGroupHeader>
      </StyledLayerGroups>
    </>
  );
};

export const ThemeDesc = ({ theme, lang }) => {
  const [isExcerptOpen, setIsExcerptOpen] = useState(false);

  const truncatedString = (string, characterAmount, text) => {
    return string.length > characterAmount + 20 ? (
      <>
        {string.substring(0, characterAmount) + '...'}{' '}
        <StyledReadMoreButton onClick={() => setIsExcerptOpen(!isExcerptOpen)}>
          {text}
        </StyledReadMoreButton>
      </>
    ) : (
      string
    );
  };

  // Get content from desc (surrounded by HTMl tags)

  const txt =
    (theme.locale[lang].desc &&
      theme.locale[lang].desc.length > 0 &&
      theme.locale[lang].desc) ||
    false;
  const links =
    (txt && getDescTagContent(txt.replace(/\s/g, ''), '<a>', '</a>')) || [];
  const desc = (txt && getDescTagContent(txt, '<p>', '</p>')) || [];

  const { store } = useContext(ReactReduxContext);

  const handleLinkClick = (event, link) => {
    event.preventDefault();
    const savedState = localStorage.getItem('dontShowExitLinkWarn');
    if (!savedState) {
      store.dispatch(
        setWarning({
          title: strings.exitConfirmation,
          subtitle: null,
          confirm: {
            text: strings.general.continue,
            action: () => {
              window.open(link, '_blank');
              store.dispatch(setWarning(null));
            }
          },
          cancel: {
            text: strings.general.cancel,
            action: () => {
              store.dispatch(setWarning(null));
            }
          },
          dontShowAgain: {
            id: 'dontShowExitLinkWarn'
          }
        })
      );
    } else {
      window.open(link, '_blank');
    }
  };

  return (
    <StyledThemeContent>
      {isExcerptOpen ? (
        <div>
          <StyledSubText>{desc.toString()}</StyledSubText>
          {links && links.length > 0 && (
            <>
              <StyledMoreInfo>{strings.themelayerlist.moreInfo}</StyledMoreInfo>
              <ul>
                {links.map((link, i) => {
                  return (
                    <li key={`link-item-${i}`}>
                      <StyledLinkText
                        rel="noreferrer"
                        target="_blank"
                        id={`link-text-${i}`}
                        onClick={(e) => handleLinkClick(e, link)}
                        key={`link-text-${i}`}
                      >
                        {link}
                      </StyledLinkText>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          {
            <StyledReadMoreButton
              onClick={() => setIsExcerptOpen(!isExcerptOpen)}
            >
              {' '}
              {strings.themelayerlist.readLess}{' '}
            </StyledReadMoreButton>
          }
        </div>
      ) : (
        <StyledSubText>
          {truncatedString(
            desc.toString(),
            70,
            strings.themelayerlist.readMore
          )}
        </StyledSubText>
      )}
    </StyledThemeContent>
  );
};

export default ThemeLayerList;
