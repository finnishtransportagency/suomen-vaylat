import React, {useContext, useRef, useState} from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { setIsInfoOpen } from '../../state/slices/uiSlice';
import strings from '../../translations';
import {Swiper, SwiperSlide} from 'swiper/react/swiper-react';
import {motion} from 'framer-motion';
import { getAppBuildDate, getAppVersion } from '../../utils/appInfoUtil';
import {Overlay} from "react-bootstrap";
import {isMobile} from "../../theme/theme";
import ReactTooltip from "react-tooltip";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        // right: 'auto',
        // bottom: 'auto',
        width: '70%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '0',
        borderRadius: '4px',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
        border: 'none'
    },
    overlay: { zIndex: 20 }
};

const variants = {
    open: {
        pointerEvents: 'auto',
        x: 0,
        opacity: 1,
    },
    closed: {
        pointerEvents: 'none',
        x: '-100%',
        opacity: 0,
    },
};

const StyledContent = styled.div`
    // width: 800px;
    // width: 90%;
    // padding: 32px;
    // border-radius: 4px;
`;

const StyledHeader = styled.div`
    position: sticky;
    top: 0px;
    padding: 16px;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.mainColor1};
    height: 56px;
    display: flex;
    align-items: center;
    box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.20);
`;

const StyledModalTitle = styled.p`
    margin: 0;
    font-size: 20px;
    font-weight: bold;
`;

const StyledModalCloseIcon = styled.div`
    min-width: 28px;
    min-height: 28px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 20px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.mainColor2};
        }
    };
`;

const StyledMapLayersDialog = styled(motion.div)`
    grid-row-start: 1;
    grid-row-end: 3;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    background-color: #F2F2F2;
    border-radius: 4px;
    overflow: hidden;
    overflow-y: auto;
    user-select: none;

    /* @media ${props => props.theme.device.laptop} {
        z-index: 10;
    }; */
    // @media ${props => props.theme.device.mobileL} {
    //     z-index: 10;
    //     position: fixed;
    //     top: 0px;
    //     left: 0px;
    //     width: 100%;
    //     height: 100%;
    // };
`;

const StyledTabs = styled.div`
    z-index:2;
    position: relative;
    display: flex;
    align-items: center;
    height: 48px;
    background-color: #F2F2F2;
    //margin-top: 12px;
    &::before {
        position: absolute;
        content: '';
        width: calc(100% / 3);
        height: 100%;
        background-color: white;
        bottom: 0px;
        left: ${props => props.tabIndex * 50+'%'};
        border-radius: 4px;
        transform: translateX(
            ${props => {
    return props.tabIndex * -50+'%';
}}
        );
        transition: all 0.3s ease-out;
        box-shadow: 0px -1px 11px ${props => props.tabIndex === 0 ?
    'rgba(0, 99, 175, 0.3)' : props.tabIndex === 1 ?
        'rgba(32, 122, 66, 0.3)' :
        'rgba(229, 0, 130, 0.3)'};
    };
`;

const StyledTab = styled.div`
    user-select: none;
    width: calc(100% / 3);
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    color: ${props => props.isSelected ? props.theme.colors[props.color] : '#656565'};
    text-align: center;
    transform: scale(${props => {
    return props.isSelected ? '1.05' : '1';
}});
    transition: transform 0.2s ease-out;
    @media ${props => props.theme.device.mobileL} {
        font-size: 11px;
    };
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
    overflow: auto;
  };
  transition: box-shadow 0.3s ease-out;
  box-shadow: 0px -1px 11px ${props => props.tabIndex === 0 ?
    'rgba(0, 99, 175, 0.3)' : props.tabIndex === 1 ?
        'rgba(32, 122, 66, 0.3)' :
        'rgba(229, 0, 130, 0.3)'};
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
                )
            })}
        </ul>
    )
}

export const VersionInfo = ({listData, currentAppVersion, currentAppBuildDate}) => {
    return (
        <div>
            <StyledTitle><p>{strings.appInfo.versionInfo.appVersion + currentAppVersion}</p></StyledTitle>
            <StyledTitle><p>{strings.appInfo.versionInfo.appLastUpdate + currentAppBuildDate}</p></StyledTitle>
            <ListComponent listData={listData} />
        </div>
    )
}

export const ContactAndFeedback = () => {
    const [textCopiedTooltip, setTextCopiedTooltip] = useState(false);
    const target = useRef(null);
    const contactInfoFeedback = strings.appInfo.versionInfo.contactInfoFeedback


    const copyTextToClipboard = (text) => {
        console.log("copyTextToClipboard text", text)
        navigator.clipboard.writeText(text)
        setTextCopiedTooltip(true)
    }

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
    )
}



export const AppInfoModal = () => {
    const { store } = useContext(ReactReduxContext);
    const isInfoOpen = useAppSelector((state) => state.ui.isInfoOpen);
    const headingText = strings.appInfo.headingText.bold();
    const mainText = strings.appInfo.mainText;
    const content = <div dangerouslySetInnerHTML={{ __html: headingText + '<br><br>' + mainText }}></div>;
    const title = strings.appInfo.title;
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
            titleColor: 'secondaryColor2',
            content: <VersionInfo
                listData={versionInfoList}
                currentAppVersion={currentAppVersion}
                currentAppBuildDate={currentAppBuildDate}
            />
        },
        {
            id: 'swipeAbleTab_2',
            title: strings.appInfo.versionInfo.appContactAndFeedback,
            titleColor: 'secondaryColor8',
            titleContent: 'layerCounter',
            content: <ContactAndFeedback />
        }
    ];

    function closeModal() {
        store.dispatch(setIsInfoOpen(false));
    };

    return (
        <Modal
            isOpen={isInfoOpen}
            onRequestClose={() => closeModal()}
            style={customStyles}
        >
            <StyledHeader className='modal-header'>
                <StyledModalTitle>{title}</StyledModalTitle>
                <StyledModalCloseIcon
                    onClick={() => {
                        closeModal();
                    }} title={strings.general.close}>
                    <FontAwesomeIcon
                        icon={faTimes}
                    />
                </StyledModalCloseIcon>
            </StyledHeader>
            <StyledContent>
                <StyledMapLayersDialog
                    initial='open'
                    variants={variants}
                    transition={{
                        duration: 0.3,
                    }}
                >
                    <StyledTabs
                        tabIndex={tabIndex}
                    >
                        {
                            tabsContent.map((tab, index) => {
                                return (
                                    <StyledTab
                                        key={'tab_'+index}
                                        isSelected={index === tabIndex}
                                        color={tab.titleColor}
                                        onClick={() => {
                                            setTabIndex(index);
                                        }}
                                    >
                                        {tab.title}

                                    </StyledTab>
                                )
                            })
                        }
                    </StyledTabs>
                    <StyledSwiper
                        tabIndex={tabIndex}
                        className='map-layers-swiper'
                        id={'map-swiper'}
                        speed={300}
                        onSlideChange={e => {
                            setTabIndex(e.activeIndex);
                        }}
                        allowTouchMove={false} // Disable swiping
                    >
                        <SwiperSlide
                            id={'tab_content_' + tabIndex}
                            key={'tab_content_' + tabIndex}
                            className={'user-guide-tabs'}
                        >
                            {tabsContent[tabIndex].content}
                        </SwiperSlide>

                        <div className='swiper-pagination'></div>
                    </StyledSwiper>
                </StyledMapLayersDialog>
            </StyledContent>
        </Modal>
    );
};

export default AppInfoModal;
