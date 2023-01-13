import { useRef, useState, useEffect} from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import strings from '../../translations';

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
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
        &::-webkit-scrollbar {
        display: none;
    };
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

const StyledTabSubTitle = styled.div`
    margin:10px;
`;

const StyledTabs = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 40px;
    background-color: #f2f2f2;
    margin: 16px 8px 0px 8px;
    &::before {
        z-index: 2;
        position: absolute;
        content: '';
        width: calc(100% / 2);
        height: 100%;
        background-color: ${(props) => (props.tabIndex === 0 ? 'rgba(0, 99, 175, 1)' : 'rgba(229, 0, 130, 1)')};
        bottom: 0px;
        left: ${(props) => props.tabIndex * 75 + '%'};
        border-radius: 8px 8px 0px 0px;
        transform: translateX(
            ${(props) => {
                return props.tabIndex * -50 + '%';
            }}
        );
        transition: all 0.3s ease-out;
        border-top: 3px solid ${(props) => (props.tabIndex === 0 ? 'rgba(0, 99, 175, 1)' :'rgba(229, 0, 130, 1)')};
        border-left: 3px solid ${(props) => (props.tabIndex === 0 ? 'rgba(0, 99, 175, 1)' : 'rgba(229, 0, 130, 1)')};
        border-right: 3px solid ${(props) => (props.tabIndex === 0 ? 'rgba(0, 99, 175, 1)' : 'rgba(229, 0, 130, 1)')};
            
box-shadow: 0px -1px 11px ${(props) => (props.tabIndex === 0 ? 'rgba(0, 99, 175, 0.3)' : 'rgba(229, 0, 130, 0.3)')};

    }
    &::after {
        position: absolute;
        content: '';
        width: calc(100% / 2);
        height: 100%;
        bottom: 0px;
        left: ${(props) => props.tabIndex * 50 + '%'};
        border-radius: 6px 6px 0px 0px;
        transform: translateX(
            ${(props) => {
                return props.tabIndex * -50 + '%';
            }}
        );
        transition: all 0.3s ease-out;
    }
`;

const StyledTab = styled.div`
    z-index: 2;
    user-select: none;
    width: calc(100% / 2);
    cursor: pointer;
    color: ${props => props.isSelected ? props.theme.colors.mainWhite : "#656565"};
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

const StyledSwiper = styled(Swiper)`
    margin-left: 0;
    margin-right: 0;
    background-color: ${props => props.theme.colors.mainWhite};
  .swiper-slide {
    background-color: ${props => props.theme.colors.mainWhite};
    padding: 16px 16px 16px 16px;
    overflow: auto;
  };
  transition: box-shadow 0.3s ease-out;
  box-shadow: 0px -1px 11px ${props => props.tabIndex === 0 ?
        'rgba(0, 99, 175, 0.3)' : 'rgba(229, 0, 130, 0.3)'};
`;


const UserGuideTabs = () => {

    const inputEl = useRef(null);

    const [tabIndex, setTabIndex] = useState(0);

    const tabsContent = [
        {
            id: 'swipeAbleTab_0',
            title: strings.layerlist.layerlistLabels.allLayers,
            titleColor: 'mainColor1',
            content: <p>{strings.appGuide.modalContent.mapLevelMenu.tabsContent.materList}</p>
        },
        {
            id: 'swipeAbleTab_2',
            title: strings.layerlist.layerlistLabels.selectedLayers,
            titleColor: 'secondaryColor8',
            titleContent: 'layerCounter',
            content: <p>{strings.appGuide.modalContent.mapLevelMenu.tabsContent.selectedLayers}</p>
        }
    ];
    
    useEffect(() => {
        inputEl.current.swiper.slideTo(tabIndex);
    },[tabIndex]);

    return (
            <StyledMapLayersDialog
                    initial='open'
                    variants={variants}
                    transition={{
                        duration: 0.3,
                    }}
            >
                <StyledTabSubTitle>
                    {strings.appGuide.modalContent.mapLevelMenu.subTitle}
                </StyledTabSubTitle>
                <StyledTabs
                    tabIndex={tabIndex}
                >
                    {
                        tabsContent.map((tab, index) => {
                            return (
                                <StyledTab
                                    key={"ug_tab_"+index}
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
                    id={'user-guide-swiper'}
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
                                    className={'user-guide-tabs'}
                                    id={"ug_tab_content_"+index}
                                    key={"ug_tab_content_"+index}
                                >
                                    {tab.content}
                                </SwiperSlide>
                            )
                        })
                    }
                </StyledSwiper>
            </StyledMapLayersDialog>
    );
 }

 export default UserGuideTabs;
