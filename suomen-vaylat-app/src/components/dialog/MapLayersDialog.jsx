import { useRef, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import { setIsSideMenuOpen, setSelectedMapLayersMenuTab } from '../../state/slices/uiSlice';
import { motion } from "framer-motion";
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

const StyledTabs = styled.div`
    z-index:2;
    position: relative;
    display: flex;
    align-items: center;
    height: 48px;
    background-color: #F2F2F2;
    //margin-top: 12px;
    margin: 16px 8px 0px 8px;
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

const StyledLayerCount = styled.div`
    position: absolute;
    top: -14px;
    right: -4px;
    width: 25px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.secondaryColor7};
    font-size: 11px;
    font-weight: 600;
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


const MapLayersDialog = () => {

    const { store } = useContext(ReactReduxContext);

    const {
        allGroups,
        allLayers,
        selectedLayers,
        allThemesWithLayers,
        allTags,
        suomenVaylatLayers,
        zoomLevelsLayers,
        currentZoomLevel
    } = useAppSelector((state) => state.rpc);

    const { selectedMapLayersMenuTab } = useAppSelector((state) => state.ui);

    const { isSideMenuOpen } =  useAppSelector((state) => state.ui);

    const inputEl = useRef(null);

    const hideWarn = () => {
        store.dispatch(setIsSideMenuOpen(!isSideMenuOpen));
    };

    useEffect(() => {
        inputEl.current.swiper.slideTo(selectedMapLayersMenuTab);
    },[selectedMapLayersMenuTab]);

    const tabsContent = [
        {
            id: "swipeAbleTab_0",
            title: strings.layerlist.layerlistLabels.allLayers,
            titleColor: "mainColor1",
            content: <LayerListTEMP
                        groups={allGroups}
                        layers={allLayers}
                        tags={allTags}
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
            titleContent: "layerCounter",
            content: <SelectedLayers
                        selectedLayers={selectedLayers}
                        currentZoomLevel={currentZoomLevel}
                    />
        }
    ];

    return (
            <StyledMapLayersDialog
                    initial="closed"
                    animate={isSideMenuOpen ? "open" : "closed"}
                    variants={variants}
                    transition={{
                        duration: 0.3,
                    }}
            >
                <DialogHeader
                    title={strings.layerlist.layerlistLabels.mapLayers}
                    hideWarn={hideWarn}
                />
                <StyledTabs
                    tabIndex={selectedMapLayersMenuTab}
                >
                    {
                        tabsContent.map((tab, index) => {
                            return (
                                <StyledTab
                                    key={"tab_"+index}
                                    isSelected={index === selectedMapLayersMenuTab}
                                    color={tab.titleColor}
                                    onClick={() => {
                                        store.dispatch(setSelectedMapLayersMenuTab(index));
                                        //setTabIndex(index);
                                       // inputEl.current.swiper.slideTo(index);
                                    }}
                                >
                                    {tab.title}
                                    {
                                        tab.titleContent &&
                                        tab.titleContent === "layerCounter" &&
                                        <StyledLayerCount>{selectedLayers.length}</StyledLayerCount>
                                    }
                                </StyledTab>
                            )
                        })
                    }
                </StyledTabs>
                <StyledSwiper
                    tabIndex={selectedMapLayersMenuTab}
                    className="map-layers-swiper"
                    id={"map-swiper"}
                    //longSwipesRatio={1}
                    //shortSwipes={false}
                    speed={300}
                    //effect={'coverflow'}
                    // coverflowEffect={{
                    //     "rotate": 20,
                    //     "stretch": 0,
                    //     "depth": 10,
                    //     "modifier": 1,
                    //     "slideShadows": false
                    // }}
                    onSlideChange={e => {
                        store.dispatch(setSelectedMapLayersMenuTab(e.activeIndex));
                        //setTabIndex(e.activeIndex);
                        //inputEl.current.swiper.slideTo(e.activeIndex);
                    }}
                    allowTouchMove={false} // Disable swiping
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
