import { useContext } from "react";
import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import { setIsSideMenuOpen, setIsSearchOpen } from '../../state/slices/uiSlice';
import styled from 'styled-components';
import PublishedMap from '../published-map/PublishedMap.jsx';
import LayerListTEMP from '../menus/hierarchical-layerlist/LayerListTEMP';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';

import ZoomMenu from '../zoom-features/ZoomMenu';
import Search from '../search/Search';
import { ToastContainer } from 'react-toastify';

const StyledContent = styled.div`
    position: relative;
    height: var(--app-height);
    overflow: hidden;
    @media ${(props: { theme: { device: { desktop: any; }; }; }) => props.theme.device.desktop} {
        height: calc(var(--app-height) - 60px);
    };
`;

const StyledCloseSideMenuButton = styled.div`
    cursor: pointer;
    margin: 0px 10px 5px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 45px;
    height: 45px;
    background-color: transparent;
    border-radius: 50%;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    svg {
        color: ${(props: { theme: { colors: { mainWhite: any; }; }; }) => props.theme.colors.mainWhite};
        font-size: 25px;
    };
`;

const StyledSideMenu = styled.div`
    z-index: 10;
    position: absolute;
    transition: all 0.5s ease-in-out;
    top: 0px;
    left: 0px;
    max-width: 340px;
    width: calc(100% - 50px);
    height: calc(var(--app-height) - 60px);
    transform: ${(props: { isSideMenuOpen: boolean; }) => props.isSideMenuOpen ? "translateX(0%)" : "translateX(-100%)"};
    background-color: ${(props: { theme: { colors: { maincolor1: any; }; }; }) => props.theme.colors.maincolor1};
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    @media ${(props: { theme: { device: { laptop: any; }; }; }) => props.theme.device.laptop} {
        z-index: 10;
    };
    @media ${(props: { theme: { device: { mobileL: any; }; }; }) => props.theme.device.mobileL} {
        z-index: 10;
        max-width: 100%;
        width: 100%;
        height: 100%;
    };
`;

const StyledMenuBar = styled.div`
    transition: all 0.5s ease-in-out;
    position: absolute;
    top: 0px;
    left: 10px;
    //display: flex;
    //justify-content: space-around;
    //align-items: flex-start;
    width: 60px;
    height: 100%;
`;

const StyledMenuBarButton = styled.div`
    position: relative;
    cursor: pointer;
    width: 40px;
    height: 40px;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props: { theme: { colors: { maincolor1: any; }; }; }) => props.theme.colors.maincolor1};
    border-radius: 50%;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    svg {
        font-size: 18px;
        color: ${(props: { theme: { colors: { mainWhite: any; }; }; }) => props.theme.colors.mainWhite};
    };
    @media ${(props: { theme: { device: { mobileL: any; }; }; }) => props.theme.device.mobileL} {
        width: 40px;
        height: 40px;
    };
`;

const StyledLayerCount = styled.div`
    position: absolute;
    top: -6px;
    right: -3px;
    width: 25px;
    height: 18px;
    background-color: ${(props: { theme: { colors: { secondaryColor7: any; }; }; }) => props.theme.colors.secondaryColor7};
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props: { theme: { colors: { mainWhite: any; }; }; }) => props.theme.colors.mainWhite};
    font-size: 14px;
    font-weight: 600;
`;

export const Content = () => {
    const { store } = useContext(ReactReduxContext);
    const isSideMenuOpen = useAppSelector((state) => state.ui.isSideMenuOpen);
    const isSearchOpen = useAppSelector((state) => state.ui.isSearchOpen);
    const allGroups = useAppSelector((state) => state.rpc.allGroups);
    const allLayers = useAppSelector((state) => state.rpc.allLayers);
    const selectedLayers = useAppSelector((state) => state.rpc.selectedLayers);
    const allThemes = useAppSelector((state) => state.rpc.allThemesWithLayers);
    const allTags = useAppSelector((state) => state.rpc.allTags);
    const suomenVaylatLayers = useAppSelector((state) => state.rpc.suomenVaylatLayers);
    return (
        <StyledContent>
            <StyledSideMenu isSideMenuOpen={isSideMenuOpen}>
                <StyledCloseSideMenuButton onClick={() => store.dispatch(setIsSideMenuOpen(!isSideMenuOpen))}>
                    <FontAwesomeIcon
                        icon={faTimes}
                    />
                </StyledCloseSideMenuButton>
                <LayerListTEMP
                    groups={allGroups}
                    layers={allLayers}
                    themes={allThemes}
                    tags={allTags}
                    selectedLayers={selectedLayers}
                    suomenVaylatLayers={suomenVaylatLayers}
                />
            </StyledSideMenu>
            <ZoomMenu />
            <PublishedMap />
            {isSearchOpen && <Search />}
            <ToastContainer></ToastContainer>
            <StyledMenuBar>
                    <StyledMenuBarButton
                        onClick={() => store.dispatch(setIsSideMenuOpen(!isSideMenuOpen))}
                    >
                        <StyledLayerCount>
                            {selectedLayers.length}
                        </StyledLayerCount>
                        <FontAwesomeIcon
                            icon={faLayerGroup}
                        />
                    </StyledMenuBarButton>
                    <StyledMenuBarButton
                        onClick={() => store.dispatch(setIsSearchOpen(!isSearchOpen))}
                    >
                        <FontAwesomeIcon
                            icon={faSearch}
                        />
                    </StyledMenuBarButton>
            </StyledMenuBar>
        </StyledContent>
    );
 }

 export default Content;