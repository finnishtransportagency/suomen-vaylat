import { useRef, useState, useEffect} from 'react';
import styled from 'styled-components';
import strings from '../../translations';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { getAppBuildDate, getAppVersion } from '../../utils/appInfoUtil';
import { Overlay } from "react-bootstrap";
import { isMobile } from "../../theme/theme";
import ReactTooltip from "react-tooltip";

const StyledContent = styled.div`
    max-width: 600px;
    background-color: #F2F2F2;
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
        width: calc(100% / 3);
        height: 100%;
        background-color: ${props => props.theme.colors.mainWhite};
        bottom: 0px;
        left: ${props => props.tabIndex * 50 +'%'};
        border-radius: 4px 4px 0px 0px;
        transform: translateX(
            ${props => {
            return props.tabIndex * -50+'%';
            }}
        );
        transition: all 0.3s ease-out;
    };
    &::after {
        position: absolute;
        content: '';
        width: calc(100% / 3);
        height: 100%;
        bottom: 0px;
        left: ${props => props.tabIndex * 50 + '%'};
        border-radius: 4px 4px 0px 0px;
        transform: translateX(
            ${props => {
            return props.tabIndex * -50+ '%';
            }}
        );
        transition: all 0.3s ease-out;¨
        box-shadow: 0px -1px 11px rgba(0, 99, 175, 0.3);
    };
`;

const StyledTab = styled.div`
    z-index: 2;
    user-select: none;
    width: calc(100% / 3);
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

const StyledButton = styled.button`
    border: none;
    background-color: #ffffff;
    color: ${props => props.theme.colors.mainColor1};
`;

const StyledTitle = styled.em`
    color: ${props => props.theme.colors.mainColor1};
`;

const StyledSwiper = styled(Swiper)`
  .swiper-slide {
    background-color: ${props => props.theme.colors.mainWhite};
    padding: 16px 16px 16px 16px;
  };
  transition: box-shadow 0.3s ease-out;
`;

export const ListComponent = ({listData}) => {
    return (
        <ul>
            {Object.values(listData).map((item, index) => {
                return (
                    <div>
                        <li>{item.title || item}
                            {item.list &&
                                <ul>
                                    {Object.values(item.list).map((listItem) => {
                                        return (
                                            <li>{listItem.content}
                                                {listItem.subContent &&
                                                    <ul>
                                                        {Object.values(listItem.subContent).map((subItem) => {
                                                            return (
                                                                <li>{subItem}</li>
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

export const VersionInfo = ({listData, currentAppVersion, currentAppBuildDate}) => {
    return (
        <div>
            <StyledTitle><p>{strings.appInfo.versionInfo.appVersion + currentAppVersion}</p></StyledTitle>
            <StyledTitle><p>{strings.appInfo.versionInfo.appLastUpdate + currentAppBuildDate}</p></StyledTitle>
            <ListComponent listData={listData} />
        </div>
    );
};

export const ContactAndFeedback = () => {
    const [textCopiedTooltip, setTextCopiedTooltip] = useState(false);
    const target = useRef(null);
    const contactInfoFeedback = strings.appInfo.versionInfo.contactInfoFeedback

    const copyTextToClipboard = (text) => {
        console.log("copyTextToClipboard text", text)
        navigator.clipboard.writeText(text)
        setTextCopiedTooltip(true)
    };

    return (
        <div>
            <Overlay target={target.current} show={textCopiedTooltip} placement={'top'} >
                <ReactTooltip disable={isMobile} place="top" type="dark" effect="float">
                    <span>{strings.gfi.gfiLocation}</span>
                </ReactTooltip>
            </Overlay>
            <p>{contactInfoFeedback[0]}</p>
            <p>{contactInfoFeedback[1]} <StyledButton ref={target} onClick={() => copyTextToClipboard(contactInfoFeedback[2])}>{contactInfoFeedback[2]}</StyledButton></p>
        </div>
    );
};

export const AppInfoModalContent = () => {

    const inputEl = useRef(null);

    const headingText = strings.appInfo.headingText.bold();
    const mainText = strings.appInfo.mainText;
    const content = <div dangerouslySetInnerHTML={{ __html: headingText + '<br><br>' + mainText }}></div>;
    const versionInfoList = strings.appInfo.versionInfo.versionInfoList;

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
            title: strings.appInfo.versionInfo.title,
            titleColor: 'mainColor1',
            content: <VersionInfo
                listData={versionInfoList}
                currentAppVersion={currentAppVersion}
                currentAppBuildDate={currentAppBuildDate}
            />
        },
        {
            id: 'swipeAbleTab_2',
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
                                        key={'ai_tab_'+index}
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
                        tabIndex={tabIndex}
                        className='app-info-swiper'
                        id={'ai-swiper'}
                        speed={300}
                        onSlideChange={e => {
                            setTabIndex(e.activeIndex);
                        }}
                        allowTouchMove={false} // Disable swiping
                        ref={inputEl}
                    >
                        {
                            tabsContent.map((tab, index) => {
                                return (
                                    <SwiperSlide
                                        key={'ai_tab_content_' + index}
                                        className={'app-info-tabs'}
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
