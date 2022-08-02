import React, { useRef, useState, useEffect} from 'react';
import styled from 'styled-components';
import strings from '../../translations';
import { getAppBuildDate, getAppVersion } from '../../utils/appInfoUtil';
import { isMobile, theme } from '../../theme/theme';
import { motion, AnimatePresence } from 'framer-motion';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const StyledContent = styled.div`
    max-width: 660px;
    overflow: hidden;
    flex-direction: column;
    display: flex;
    height: 100%;
`;

const StyledTabs = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    max-height: 100px;
    background-color: #F2F2F2;
    &::before {
        z-index: 2;
        position: absolute;
        content: '';
        width: ${props => 'calc(100% /' + props.tabsCount + ')'};
        height: 100%;
        background-color: ${props => props.theme.colors.mainWhite};
        bottom: 0px;
        left: ${props => props.tabIndex * (100 / (props.tabsCount - 1)) +'%'};
        border-radius: 4px 4px 0px 0px;
        transform: translateX(
            ${props => {
                return props.tabIndex * -(100 / (props.tabsCount - 1)) + '%';
            }}
        );
        transition: all 0.3s ease-out;
    };
    &::after {
        position: absolute;
        content: '';
        width: ${props => 'calc(100% /' + props.tabsCount + ')'};
        height: 100%;
        bottom: 0px;
        left: ${props => props.tabIndex * (100 / (props.tabsCount - 1)) + '%'};
        border-radius: 4px 4px 0px 0px;
        transform: translateX(
            ${props => {
                return props.tabIndex * -(100 / (props.tabsCount - 1)) + '%';
            }}
        );
        transition: all 0.3s ease-out;
        box-shadow: 0px -1px 11px rgba(0, 99, 175, 0.3);
    };
`;

const StyledTab = styled(motion.div)`
    z-index: 2;
    user-select: none;
    width: ${props => 'calc(100% /' + props.tabsCount + ')'};
    cursor: pointer;
    color: ${props => props.isSelected ? props.theme.colors[props.color] : "#656565"};
    text-align: center;
    transition: color 0.2s ease-out;
    display: flex;
    justify-content: center;

    p {
        font-size: 13px;
        font-weight: bold;
        margin: 0;
        padding: 8px;
    }
`;

const StyledMobileContainer = styled(motion.div)`
    padding: 0px 16px;
`;

const StyledCloseMenuButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px;
    cursor: pointer;
`;

const StyledCloseMenuIcon = styled(FontAwesomeIcon)`
    font-size: 18px;
`;

const StyledMenuContainer = styled(motion.div)`
    padding: 16px 12px;
    display: flex;
    justify-content: flex-start;
    color: ${props => props.theme.colors.mainColor1};
`;

const StyledMobileTabs = styled(motion.div)`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
`;

const StyledMobileTab = styled.button`
    display. flex;
    text-align: left;
    border: none;
    background: none;
    color: ${props => props.theme.colors.mainColor1};
    text-decoration: ${props => props.isSelected && 'underline'};
    font-weight: bold;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px;
    margin: 5px 0px;
`;

const StyledLink = styled.a`
    cursor: pointer;
    color: ${props => props.theme.colors.mainColor1};
    word-wrap:break-word;
`;

const StyledTitle = styled.em`
    color: ${props => props.theme.colors.mainColor1};
`;

const StyledHeading = styled.h5`
    color: ${props => props.theme.colors.mainColor1};
    margin 10px 0px 25px 0px;
`;

const StyledSwiper = styled(Swiper)`
    margin-left: 0;
    margin-right: 0;

    .swiper-slide {
        background-color: ${props => props.theme.colors.mainWhite};
        padding: 16px 16px 16px 16px;
        overflow-y: auto;
        height:100%;
    };
  transition: box-shadow 0.3s ease-out;
`;

export const ListComponent = ({listData}) => {
    return (
        <ul>
            {Object.values(listData).map((item) => {
                return (
                    <div key={'app-info-list-content-' + item.title || item}>
                        <li key={'app-info-lc-li-' + item.title || item}>{item.title || item}
                            {item.list &&
                                <ul key={'app-info-lc-ul-' + item.title || item}>
                                    {Object.values(item.list).map((listItem) => {
                                        return (
                                            <li key={'app-info-lc-ul-li-' + listItem.content}>{listItem.content}
                                                {listItem.subContent &&
                                                    <ul key={'app-info-lc-ul-li-ul-' + listItem.content}>
                                                        {Object.values(listItem.subContent).map((subItem) => {
                                                            return (
                                                                <li key={'app-info-lc-ul-li-ul-li' + subItem}>{subItem}</li>
                                                            )
                                                        })}
                                                    </ul>
                                                }
                                            </li>
                                        )
                                    })}
                                </ul>
                            }
                        </li>
                    </div>
                );
            })}
        </ul>
    );
};

export const AppInfo = () => {

    return(
        <>
            <StyledHeading>{strings.appInfo.versionInfo.appInfoTitle}</StyledHeading>
            <b>{strings.appInfo.headingText}</b>
            <p>{strings.appInfo.mainText}</p>
        </>
        
    )
}

export const VersionInfo = ({currentAppVersion, currentAppBuildDate}) => {
    return (
        <div>
            <StyledHeading>{strings.appInfo.versionInfo.title}</StyledHeading>
            <StyledTitle><p>{strings.appInfo.versionInfo.appVersion + currentAppVersion}</p></StyledTitle>
            <StyledTitle><p>{strings.appInfo.versionInfo.appLastUpdate + currentAppBuildDate}</p></StyledTitle>
        </div>
    );
};

export const ContactAndFeedback = () => {
    const contactInfoFeedback = strings.appInfo.contactInfoFeedback;

    return (
        <div>
            <StyledHeading>{strings.appInfo.versionInfo.appContactAndFeedback}</StyledHeading>
            <p>{contactInfoFeedback[0]}</p>
            <p>{contactInfoFeedback[1]} <StyledLink href={'mailto:' + contactInfoFeedback[2] + '?subject='+contactInfoFeedback.emailSubject}>{contactInfoFeedback[2]}</StyledLink></p>
        </div>
    );
};

export const AppInfoLinks = () => {
    const appInfoLinks = strings.appInfo.appInfoLinks;

    return (
        <div>
            <StyledHeading>{strings.appInfo.versionInfo.appInfoLinksTitle}</StyledHeading>
            <ul>
                {Object.values(appInfoLinks).map((link, key) => {
                    return(
                        <li key={key}>{link.text} <StyledLink href={link.link} target={'_blank'}>{link.link}</StyledLink></li>
                    )
                })}
            </ul>
        </div>
    )
};

export const SourcesAndTermsOfUse = () => {
    return(
        <div>
            <div>
                <StyledHeading> {strings.appInfo.dataSources.title}</StyledHeading>
                <p>{strings.appInfo.dataSources.municipalityImage} <StyledLink href={strings.appInfo.dataSources.municipalityLink}>{strings.appInfo.dataSources.municipalityLink}</StyledLink> </p>
                <p>{strings.appInfo.dataSources.landSurvey}</p>
            </div>
            <div>
                <StyledHeading>{strings.appInfo.termsOfUse.title}</StyledHeading>
                <p>{strings.appInfo.termsOfUse.description}</p>
                <div>
                    <p>{strings.appInfo.termsOfUse.moreInfo} <StyledLink href={strings.appInfo.termsOfUse.link}>{strings.appInfo.termsOfUse.link}</StyledLink></p>
                </div>
            </div>
        </div>
    )
};

export const AppInfoModalContent = () => {

    const inputEl = useRef(null);
    const [isNavOpen, setIsNavOpen] = useState(true);

    // App build info
    const currentAppVersion = getAppVersion();
    const currentAppBuildDate = getAppBuildDate();

    const [tabIndex, setTabIndex] = useState(0);

    const tabsContent = [
        {
            title: strings.appInfo.versionInfo.appInfoTitle,
            titleColor: 'mainColor1',
            content: <AppInfo />
        },
        {
            title: strings.appInfo.versionInfo.appInfoLinksTitle,
            titleColor: 'mainColor1',
            content: <AppInfoLinks />
        },
        {
            title: strings.appInfo.versionInfo.title,
            titleColor: 'mainColor1',
            content: <VersionInfo
                currentAppVersion={currentAppVersion}
                currentAppBuildDate={currentAppBuildDate}
            />
        },
        {
            title: strings.appInfo.versionInfo.appContactAndFeedback,
            titleColor: 'mainColor1',
            content: <ContactAndFeedback />
        },
        {
            title: strings.appInfo.dataSourcesAndTermsOfUse.tabTitle,
            titleColor: 'mainColor1',
            content: <SourcesAndTermsOfUse />
        }
    ];

    useEffect(() => {
        inputEl.current.swiper.slideTo(tabIndex);
    },[tabIndex]);

    const variants = {
        initial : {opacity: 0}, hidden:{opacity: isNavOpen && 0, transition: {delay: 0.1}}, visible: {opacity : 1, transition: { delay: 0.4}} , exit: { transition:{transition: 0.4}}
    }


    return (
        <>
            <StyledContent>
                {isMobile && 
                <AnimatePresence>
                    <StyledMenuContainer animate={{}} key="menuContainer">
                        <StyledCloseMenuButton>
                            <StyledCloseMenuIcon onClick={() => setIsNavOpen(!isNavOpen)} icon={isNavOpen? faArrowLeft : faBars} />
                        </StyledCloseMenuButton>
                    </StyledMenuContainer>
                    <StyledMobileContainer
                    key="mobileContainer"
                    animate={{ height: isNavOpen ? "auto" : "0px"}}
                    transition={{duration: 0.4, type: "tween"}}
                    >
                        <AnimatePresence>
                            {isNavOpen &&
                            <StyledMobileTabs
                                initial={{opacity: 0}}
                                animate={{opacity: isNavOpen && 1, x: 0}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.4}}
                                tabIndex={tabIndex}
                                tabsCount={tabsContent.length}
                            >
                                <AnimatePresence>
                                {
                                    tabsContent.map((tab, index) => {
                                        return (
                                            <StyledMobileTab
                                                key={'ai_tab_' + tab.title}
                                                isSelected={index === tabIndex}
                                                color={tab.titleColor}
                                                onClick={() => {
                                                    setTabIndex(index);
                                                    setIsNavOpen(false);
                                                }}
                                                tabsCount={tabsContent.length}
                                                >
                                                <p>{tab.title}</p>
                                                </StyledMobileTab>
                                            )
                                        })
                                    }
                                </AnimatePresence>
                            </StyledMobileTabs>
                        }
                        </AnimatePresence>
                    </StyledMobileContainer>
                </AnimatePresence>
                }

                {!isMobile &&
                    <StyledTabs
                    tabIndex={tabIndex}
                    tabsCount={tabsContent.length}
                    >
                {
                    tabsContent.map((tab, index) => {
                        return (
                            <StyledTab
                                key={'ai_tab_' + tab.title}
                                isSelected={index === tabIndex}
                                color={tab.titleColor}
                                onClick={() => {
                                    setTabIndex(index);
                                }}
                                tabsCount={tabsContent.length}
                                >
                                <p>{tab.title}</p>
                                </StyledTab>
                            )
                        })
                    }
                </StyledTabs>
                }
                <StyledSwiper
                    ref={inputEl}
                    id={'app-info-swiper'}
                    tabIndex={tabIndex}
                    onSlideChange={e => {
                        setTabIndex(e.activeIndex);
                        inputEl.current.scrollTo(0, 0)
                    }}
                    allowTouchMove={false} // Disable swiping
                    speed={isMobile? 0 : 300}
                >
                    {
                        tabsContent.map((tab, index) => {
                            return (
                                <SwiperSlide
                                    id={'ai_tab_content_' + index}
                                    key={'ai_tab_content_' + index}
                                >
                                    <motion.div variants={variants} initial="initial" animate={isNavOpen ? "hidden" : "visible"} exit="exit">
                                        {tab.content}
                                    </motion.div>
                                </SwiperSlide>
                            )
                        })
                    }
                </StyledSwiper>
            </StyledContent>
        </>
    );
};

export default AppInfoModalContent;
