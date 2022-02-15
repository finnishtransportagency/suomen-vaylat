import { useRef, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import { setIsSideMenuOpen, setSelectedMapLayersMenuTab } from '../../state/slices/uiSlice';
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';

import DialogHeader from './DialogHeader';
import LayerListTEMP from '../menus/hierarchical-layerlist/LayerListTEMP';
import ThemeLayerList from '../menus/hierarchical-layerlist/ThemeLayerList';
import SelectedLayers from '../menus/selected-layers/SelectedLayers';

import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';

import strings from '../../translations';

const variants = {
    open: {
        pointerEvents: "auto",
        x: 0,
        opacity: 1,
        filter: "blur(0px)"
    },
    closed: {
        pointerEvents: "none",
        x: "-100%",
        opacity: 0,
        filter: "blur(10px)"
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
    margin-left: 16px;
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
        margin-left: unset;
    };
`;

const StyledTabs = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    min-height: 40px;
    background-color: #F2F2F2;
    margin: 16px 8px 0px 8px;
    &::before {
        z-index: 2;
        position: absolute;
        content: '';
        width: calc(100% / 3);
        height: 100%;
        background-color: ${props => props.theme.colors.mainWhite};
        bottom: 0px;
        left: ${props => props.tabIndex * 50+'%'};
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
        left: ${props => props.tabIndex * 50+'%'};
        border-radius: 4px 4px 0px 0px;
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
    }
`;

const StyledTab = styled.div`
    z-index: 2;
    user-select: none;
    width: calc(100% / 3);
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
    color: ${props => props.isSelected ? props.theme.colors[props.color] : "#656565"};
    text-align: center;
    transition: color 0.2s ease-out;
`;

const StyledLayerCount = styled.div`
    position: absolute;
    top: -8px;
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
margin-left: 0;
margin-right: 0;
  .swiper-slide {
    background-color: ${props => props.theme.colors.mainWhite};
    //padding: 16px 8px 16px 16px;
    padding: 8px;
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
                        duration: 0.4,
                        type: "tween"
                    }}
            >
                <DialogHeader
                    title={strings.layerlist.layerlistLabels.mapLayers}
                    hideWarn={hideWarn}
                    icon={faLayerGroup}
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
                    ref={inputEl}
                    id={'map-layers-swiper'}
                     onSlideChange={e => {
                        store.dispatch(setSelectedMapLayersMenuTab(e.activeIndex));
                    }}
                    tabIndex={selectedMapLayersMenuTab}
                    allowTouchMove={false} // Disable swiping
                    speed={300}
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
                {/* <div className="swiper-pagination"></div> */}
                </StyledSwiper>
            </StyledMapLayersDialog>
    );
 }

 export default MapLayersDialog;
