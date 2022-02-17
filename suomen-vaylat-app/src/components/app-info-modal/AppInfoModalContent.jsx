import React, { useRef, useState, useEffect} from 'react';
import styled from 'styled-components';
import strings from '../../translations';
import { getAppBuildDate, getAppVersion } from '../../utils/appInfoUtil';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

const StyledContent = styled.div`
    max-width: 600px;
    background-color: #F2F2F2;
    overflow: hidden;
    display: flex;
    height: 100%;
    flex-direction: column;
`;

const StyledTabs = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    height: 48px;
    background-color: #F2F2F2;
    &::before {
        z-index: 2;
        position: absolute;
        content: '';
        width: calc(100% / 4);
        height: 100%;
        background-color: ${props => props.theme.colors.mainWhite};
        bottom: 0px;
        left: ${props => props.tabIndex * 33 +'%'};
        border-radius: 4px 4px 0px 0px;
        transform: translateX(
            ${props => {
            return props.tabIndex * -33+'%';
            }}
        );
        transition: all 0.3s ease-out;
    };
    &::after {
        position: absolute;
        content: '';
        width: calc(100% / 4);
        height: 100%;
        bottom: 0px;
        left: ${props => props.tabIndex * 33 + '%'};
        border-radius: 4px 4px 0px 0px;
        transform: translateX(
            ${props => {
            return props.tabIndex * -33+ '%';
            }}
        );
        transition: all 0.3s ease-out;
        box-shadow: 0px -1px 11px rgba(0, 99, 175, 0.3);
    };
`;

const StyledTab = styled.div`
    z-index: 2;
    user-select: none;
    width: calc(100% / 4);
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

const StyledLink = styled.a`
    cursor: pointer;
    color: ${props => props.theme.colors.mainColor1};
`;

const StyledTitle = styled.em`
    color: ${props => props.theme.colors.mainColor1};
`;

const StyledSwiper = styled(Swiper)`
    margin-left: 0;
    margin-right: 0;
    .swiper-slide {
        background-color: ${props => props.theme.colors.mainWhite};
        padding: 16px 16px 16px 16px;
        overflow-y: auto;
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

export const VersionInfo = ({currentAppVersion, currentAppBuildDate}) => {
    return (
        <div>
            <StyledTitle><p>{strings.appInfo.versionInfo.appVersion + currentAppVersion}</p></StyledTitle>
            <StyledTitle><p>{strings.appInfo.versionInfo.appLastUpdate + currentAppBuildDate}</p></StyledTitle>
        </div>
    );
};

export const ContactAndFeedback = () => {
    const contactInfoFeedback = strings.appInfo.contactInfoFeedback;

    return (
        <div>
            <p>{contactInfoFeedback[0]}</p>
            <p>{contactInfoFeedback[1]} <StyledLink href={'mailto:' + contactInfoFeedback[2] + '?subject='+contactInfoFeedback.emailSubject}>{contactInfoFeedback[2]}</StyledLink></p>
        </div>
    );
};

export const AppInfoLinks = () => {
    const appInfoLinks = strings.appInfo.appInfoLinks;

    return (
        <div>
            <ul>
                {Object.values(appInfoLinks).map((link, key) => {
                    return(
                        <li key={key}>{link.text} <StyledLink href={link.link} target={'_blank'}>{link.link}</StyledLink></li>
                    )
                })}
            </ul>
        </div>
    )
}

export const AppInfoModalContent = () => {

    const inputEl = useRef(null);

    const headingText = strings.appInfo.headingText.bold();
    const mainText = strings.appInfo.mainText;
    const content = <div dangerouslySetInnerHTML={{ __html: headingText + '<br><br>' + mainText }}></div>;

    // App build info
    const currentAppVersion = getAppVersion();
    const currentAppBuildDate = getAppBuildDate();

    const [tabIndex, setTabIndex] = useState(0);

    const tabsContent = [
        {
            id: 'swipeAbleTab_0',
            title: strings.appInfo.versionInfo.appInfoTitle,
            titleColor: 'mainColor1',
            content: content
        },
        {
            id: 'swipeAbleTab_1',
            title: strings.appInfo.versionInfo.appInfoLinksTitle,
            titleColor: 'mainColor1',
            content: <AppInfoLinks />
        },
        {
            id: 'swipeAbleTab_2',
            title: strings.appInfo.versionInfo.title,
            titleColor: 'mainColor1',
            content: <VersionInfo
                currentAppVersion={currentAppVersion}
                currentAppBuildDate={currentAppBuildDate}
            />
        },
        {
            id: 'swipeAbleTab_3',
            title: strings.appInfo.versionInfo.appContactAndFeedback,
            titleColor: 'mainColor1',
            content: <ContactAndFeedback />
        }
    ];

    useEffect(() => {
        inputEl.current.swiper.slideTo(tabIndex);
    },[tabIndex]);

    return (
        <>
            <StyledContent>
                    <StyledTabs
                        tabIndex={tabIndex}
                    >
                        {
                            tabsContent.map((tab, index) => {
                                return (
                                    <StyledTab
                                        key={"ai_tab_"+index}
                                        isSelected={index === tabIndex}
                                        color={tab.titleColor}
                                        onClick={() => {
                                            setTabIndex(index);
                                        }}
                                    >
                                        <p>{tab.title}</p>

                                    </StyledTab>
                                )
                            })
                        }
                    </StyledTabs>
                    <StyledSwiper
                        ref={inputEl}
                        id={"app-info-swiper"}
                        tabIndex={tabIndex}
                        onSlideChange={e => {
                            setTabIndex(e.activeIndex);
                        }}
                        allowTouchMove={false} // Disable swiping
                        speed={300}
                    >
                        {
                            tabsContent.map((tab, index) => {
                                return (
                                    <SwiperSlide
                                        id={"ai_tab_content_"+index}
                                        key={"ai_tab_content_"+index}
                                    >
                                        {tab.content}
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
