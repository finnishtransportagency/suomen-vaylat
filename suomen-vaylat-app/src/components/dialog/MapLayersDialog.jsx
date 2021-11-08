import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
//import SwipeableViews from 'react-swipeable-views';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';

// Styles must use direct files imports
import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/navigation/navigation.scss'; // Navigation module
import 'swiper/modules/pagination/pagination.scss'; // Pagination module

import './swiper.css'; //

// import Swiper core and required modules
import SwiperCore, {
    EffectCoverflow,
    Pagination
  } from 'swiper';

import { motion } from "framer-motion";

import {
    faLayerGroup
} from '@fortawesome/free-solid-svg-icons';

import DialogHeader from './DialogHeader';
import LayerListTEMP from '../menus/hierarchical-layerlist/LayerListTEMP';
import ThemeLayerList from '../menus/hierarchical-layerlist/ThemeLayerList';
import SelectedLayers from '../menus/selected-layers/SelectedLayers';

import strings from '../../translations';

// install Swiper modules
SwiperCore.use([
    EffectCoverflow,
    Pagination
]);

const variants = {
    open: {
        y: 0,
        opacity: 1,
    },
    closed: {
        y: "100%",
        opacity: 0,
    },
};

const StyledMapLayersDialog = styled(motion.div)`
    //position: relative;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 4px;
    overflow: hidden;
    overflow-y: auto;
    user-select: none;
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
        &::-webkit-scrollbar {
        display: none;
    };
`;

const StyledTabs = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    height: 50px;
    background-color: #F2F2F2;
    z-index: 2;
    &::before {
        position: absolute;
        z-index: -1;
        content: '';
        width: calc(100% / 3);
        height: 100%;
        background-color: white;
        bottom: 0px;
        left: ${props => props.tabIndex * 50+'%'};
        transform: translateX(
            ${props => {
            return props.tabIndex * -50+'%';
            }}
        );
            transition: all 0.2s ease-out;
    };
`;

const StyledTab = styled.div`
    user-select: none;
    width: calc(100% / 3);
    cursor: pointer;
    font-size: 14px;
    //font-size: ${props => props.isSelected ? '15px' : '14px'};
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
    padding: 0px 16px 16px 16px;
    overflow: auto;
    &::-webkit-scrollbar {
        display: none;
    };
  }
  
  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MapLayersDialog = () => {

    const {
        allGroups,
        allLayers,
        selectedLayers,
        allThemesWithLayers,
        allTags,
        suomenVaylatLayers,
    } = useAppSelector((state) => state.rpc);

    const {
        isSideMenuOpen,
        isSwipingDisabled
    } =  useAppSelector((state) => state.ui);

    const [tabIndex, setTabIndex] = useState(0);

    const inputEl = useRef(null);

    // useEffect(() => {
    //     var swiper = new Swiper('.swiper-container', {
    //         pagination: {
    //           el: '.swiper-pagination',
    //           clickable: true,
    //           renderBullet: function (index, className) {
    //             return '<span class="' + className + '">' + (index + 1) + '</span>';
    //           },
    //         },
    //     });
    // },[]);

    // useEffect(() => {
    //     inputEl.current.swiper.slideTo(tabIndex);
    // },[tabIndex]);


    const tabsContent = [
        {
            id: "swipeAbleTab_0",
            title: strings.layerlist.layerlistLabels.allLayers,
            titleColor: "mainColor1",
            content: <LayerListTEMP
                        groups={allGroups}
                        layers={allLayers}
                        themes={allThemesWithLayers}
                        tags={allTags}
                        selectedLayers={selectedLayers}
                        suomenVaylatLayers={suomenVaylatLayers}
                    />
        },
        {
            id: "swipeAbleTab_1",
            titleColor: "secondaryColor2",
            title: strings.layerlist.layerlistLabels.themeLayers,
            content: <ThemeLayerList
                        allLayers={allLayers}
                        allThemes={allThemesWithLayers}
                    />
        },
        {
            id: "swipeAbleTab_2",
            title: strings.layerlist.layerlistLabels.selectedLayers,
            titleColor: "secondaryColor8",
            content: <SelectedLayers
                        selectedLayers={selectedLayers}
                        suomenVaylatLayers={suomenVaylatLayers}
                    />
        }
    ];

    return (
            <StyledMapLayersDialog
                    initial="closed"
                    animate={isSideMenuOpen ? "open" : "closed"}
                    variants={variants}
                    transition={{
                        //type: "spring",
                        duration: 0.7,
                    }}
            >
                <DialogHeader
                    title={strings.layerlist.layerlistLabels.mapLayers}
                />
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
                                        inputEl.current.swiper.slideTo(index);
                                    }}
                                >
                                    {tab.title}
                                </StyledTab>
                            )
                        })
                    }
                </StyledTabs>
                <StyledSwiper
                    className="mySwiper"
                    //longSwipesRatio={1}
                    //shortSwipes={false} 
                    speed={400}
                    //effect={'coverflow'}
                    // coverflowEffect={{
                    //     "rotate": 20,
                    //     "stretch": 0,
                    //     "depth": 10,
                    //     "modifier": 1,
                    //     "slideShadows": false
                    // }}
                    pagination={{
                        el: '.swiper-pagination',
                        clickable: true,
                        type: "custom",
                        // "renderBullet": function (index, className) {
                        //     return '<span class="' + className + '">' + (index + 1) + '</span>';
                        // },
                        renderBullet: function (index, className) {
                            return '<span class="' + className + '">' + (index + 1) + '</span>';
                        }
                    }}
                    
                    onSlideChange={e => {
                        setTabIndex(e.activeIndex);
                        inputEl.current.swiper.slideTo(e.activeIndex);
                    }}
                    allowTouchMove={true} // Disable for desktop if swiping with mouse is usable
                    ref={inputEl}
                >
                {
                    tabsContent.map((tab, index) => {
                        return (
                            <SwiperSlide
                                id={"tab_content_"+index}
                                key={"tab_content_"+index}
                            >
                                {tab.content}
                            </SwiperSlide>
                        )
                    })
                }
                <div className="swiper-pagination"></div>
                </StyledSwiper>
            </StyledMapLayersDialog>
    );
 }

 export default MapLayersDialog;
