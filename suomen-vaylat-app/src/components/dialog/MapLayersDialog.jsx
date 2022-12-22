import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import {
    setIsSideMenuOpen,
    setSelectedMapLayersMenuTab,
} from '../../state/slices/uiSlice';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import store from '../../state/store';

// Import Swiper styles
import 'swiper/css';

import DialogHeader from './DialogHeader';
import LayerListTEMP from '../menus/hierarchical-layerlist/LayerListTEMP';
import SelectedLayers from '../menus/selected-layers/SelectedLayers';

import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';

import strings from '../../translations';

const StyledMapLayersDialog = styled(motion.div)`
    width: 350px;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    background-color: #f2f2f2;
    border-radius: 4px;
    overflow: hidden;
    overflow-y: auto;
    user-select: none;
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    margin-left: 16px;
    &::-webkit-scrollbar {
        display: none;
    }
    @media ${(props) => props.theme.device.mobileL} {
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
        width: calc(100% / 3);
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
    font-size: 13px;
    font-weight: bold;
    color: ${(props) => props.isSelected ? props.theme.colors.mainWhite : '#656565'};
    text-align: center;
    transition: color 0.2s ease-out;
    margin-top: 4px;
`;

const StyledLayerCount = styled.div`
    position: absolute;
    top: -6px;
    right: 15px;
    width: 25px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    color: ${(props) => props.theme.colors.mainWhite};
    background-color: ${(props) => props.theme.colors.secondaryColor7};
    font-size: 11px;
    font-weight: 600;
`;

const StyledSwiper = styled(Swiper)`
    margin-left: 0;
    margin-right: 0;
    height: 100%;
    .swiper-slide {
        background-color: ${(props) => props.theme.colors.mainWhite};
        padding: 8px;
        overflow: auto;
    }
    transition: box-shadow 0.3s ease-out;
    border-top: 3px solid ${(props) => (props.tabIndex === 0 ? 'rgba(0, 99, 175, 1)' : 'rgba(229, 0, 130, 1)')};
`;

const MapLayersDialog = () => {
    const { isSideMenuOpen, selectedMapLayersMenuTab, isThemeMenuOpen } = useAppSelector((state) => state.ui);
    const {
        allGroups,
        allLayers,
        selectedLayers,
        allTags,
        currentZoomLevel,
    } = useAppSelector((state) => state.rpc);

    const inputEl = useRef(null);
    
    useEffect(() => {
        inputEl?.current?.swiper?.slideTo(selectedMapLayersMenuTab);
    }, [selectedMapLayersMenuTab, isSideMenuOpen]);

    const closeSideMenu = () => {
        store.dispatch(setIsSideMenuOpen(!isSideMenuOpen));
    };

    const variants = {
        open: {
            pointerEvents: 'auto',
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
        },
        closed: {
            pointerEvents: 'none',
            x: '-100%',
            opacity: 0,
            filter: 'blur(10px)',
        },
    };

    const tabsContent = [
        {
            id: 'swipeAbleTab_0',
            title: strings.layerlist.layerlistLabels.allLayers,
            titleColor: 'mainColor1',
            content: (
                <LayerListTEMP
                    groups={allGroups}
                    layers={allLayers}
                    tags={allTags}
                />
            ),
        },
        {
            id: 'swipeAbleTab_2',
            title: strings.layerlist.layerlistLabels.selectedLayers,
            titleColor: 'secondaryColor8',
            titleContent: 'layerCounter',
            content: (
                <SelectedLayers
                    selectedLayers={selectedLayers}
                    currentZoomLevel={currentZoomLevel}
                />
            ),
        },
    ];

      return  ( !isThemeMenuOpen && 
        <StyledMapLayersDialog
            initial='closed'
            animate={isSideMenuOpen ? 'open' : 'closed'}
            transition={{duration: 0.4}}
            exit={{pointerEvents: 'none',
            x: '-100%',
            opacity: 0,
            filter: 'blur(10px)'}}
            variants={variants}
        >
            <DialogHeader
                title={strings.layerlist.layerlistLabels.mapLayers}
                handleClose={closeSideMenu}
                icon={faLayerGroup}
            />
            <StyledTabs tabIndex={selectedMapLayersMenuTab}>
                {tabsContent.map((tab, index) => {
                    return (
                        <StyledTab
                            key={'ml_tab_' + index}
                            isSelected={index === selectedMapLayersMenuTab}
                            color={tab.titleColor}
                            onClick={() => {
                                store.dispatch(
                                    setSelectedMapLayersMenuTab(index)
                                );
                            }}
                        >
                            {tab.title}
                            {tab.titleContent &&
                                tab.titleContent === 'layerCounter' && (
                                    <StyledLayerCount>
                                        {selectedLayers.length}
                                    </StyledLayerCount>
                                )}
                        </StyledTab>
                    );
                })}
            </StyledTabs>
            <StyledSwiper
                ref={inputEl}
                id={'map-layers-swiper'}
                onSlideChange={(e) => {
                    store.dispatch(setSelectedMapLayersMenuTab(e.activeIndex));
                }}
                tabIndex={selectedMapLayersMenuTab}
                allowTouchMove={false} // Disable swiping
                speed={300}
            >
                {tabsContent.map((tab, index) => {
                    return (
                        <SwiperSlide
                            id={'ml_tab_content_' + index}
                            key={'ml_tab_content_' + index}
                        >
                            {tab.content}
                        </SwiperSlide>
                    );
                })}
            </StyledSwiper>
        </StyledMapLayersDialog>
    );
};

export default MapLayersDialog;
