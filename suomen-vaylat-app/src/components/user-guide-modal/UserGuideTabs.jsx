import {useState} from 'react';
import styled from 'styled-components';
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import '../../_colors.scss';
// Styles must use direct files imports
import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/navigation/navigation.scss'; // Navigation module
import 'swiper/modules/pagination/pagination.scss'; // Pagination module

// import './swiper.css'; //

// import Swiper core and required modules
import SwiperCore, {
    EffectCoverflow,
    Pagination
  } from 'swiper';


import strings from '../../translations';

// install Swiper modules
SwiperCore.use([
    EffectCoverflow,
    Pagination
]);

const variants = {
    open: {
        pointerEvents: "auto",
        x: 0,
        opacity: 1,
    },
    closed: {
        pointerEvents: "none",
        x: "-100%",
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
    @media ${props => props.theme.device.mobileL} {
        z-index: 10;
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
    };
`;

const StyledTabSubTitle = styled.div`
    margin:10px;  
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
        "rgba(0, 99, 175, 0.3)" : props.tabIndex === 1 ?
        "rgba(32, 122, 66, 0.3)" :
        "rgba(229, 0, 130, 0.3)"};
    };
`;

const StyledTab = styled.div`
    user-select: none;
    width: calc(100% / 3);
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    color: ${props => props.isSelected ? props.theme.colors[props.color] : "#656565"};
    text-align: center;
    transform: scale(${props => {
        return props.isSelected ? "1.05" : "1";
    }});
    transition: transform 0.2s ease-out;
`;

const StyledSwiper = styled(Swiper)`
  .swiper-slide {
    background-color: ${props => props.theme.colors.mainWhite};
    padding: 16px 16px 16px 16px;
    overflow: auto;
  };
  transition: box-shadow 0.3s ease-out;
  box-shadow: 0px -1px 11px ${props => props.tabIndex === 0 ?
        "rgba(0, 99, 175, 0.3)" : props.tabIndex === 1 ?
        "rgba(32, 122, 66, 0.3)" :
        "rgba(229, 0, 130, 0.3)"};
`;


const UserGuideTabs = () => {

    const [tabIndex, setTabIndex] = useState(0);

    const tabsContent = [
        {
            id: "swipeAbleTab_0",
            title: strings.layerlist.layerlistLabels.allLayers,
            titleColor: "mainColor1",
            content: <p>{strings.appGuide.modalContent.mapLevelMenu.tabsContent.materList}</p>
        },
        {
            id: "swipeAbleTab_1",
            titleColor: "secondaryColor2",
            title: strings.layerlist.layerlistLabels.themeLayers,
            content: <p>{strings.appGuide.modalContent.mapLevelMenu.tabsContent.themeLayerSelection}</p>
        },
        {
            id: "swipeAbleTab_2",
            title: strings.layerlist.layerlistLabels.selectedLayers,
            titleColor: "secondaryColor8",
            titleContent: "layerCounter",
            content: <p>{strings.appGuide.modalContent.mapLevelMenu.tabsContent.selectedLayers}</p>
        }
    ];

    return (
            <StyledMapLayersDialog
                    initial="open"
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
                                    key={"tab_"+index}
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
                    className="map-layers-swiper"
                    id={"map-swiper"}
                    speed={300}
                    onSlideChange={e => {
                        setTabIndex(e.activeIndex);
                    }}
                    allowTouchMove={false} // Disable swiping
                >
                    <SwiperSlide
                        id={"tab_content_" + tabIndex}
                        key={"tab_content_" + tabIndex}
                        className={'user-guide-tabs'}
                    >
                        {tabsContent[tabIndex].content}
                    </SwiperSlide>

                <div className="swiper-pagination"></div>
                </StyledSwiper>
            </StyledMapLayersDialog>
    );
 }

 export default UserGuideTabs;
