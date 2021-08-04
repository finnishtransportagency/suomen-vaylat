import { useContext } from "react";
import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import { setIsSideMenuOpen } from '../../state/slices/uiSlice';
import styled from 'styled-components';
import { device } from '../../device';
import PublishedMap from '../published-map/PublishedMap.jsx';
import LayerListTEMP from '../menus/hierarchical-layerlist/LayerListTEMP';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';

import ZoomMenu from '../zoom-features/ZoomMenu';
import Search from '../search/Search';
import { ToastContainer } from 'react-toastify';

const StyledContent = styled.div`
    position: relative;
    height: calc(100% - 80px);
    @media ${device.desktop} {
        height: calc(100% - 60px);
    };
`;

const StyledSideMenu = styled.div`
    z-index: 3;
    position: absolute;
    transition: all 0.5s ease-out;
    top: 0px;
    left: 0px;
    max-width: 340px;
    width: calc(100% - 50px);
    height: 100%;
    transform: ${(props: { isSideMenuOpen: boolean; }) => props.isSideMenuOpen ? "translateX(0%)" : "translateX(-100%)"};
    background-color: #0064af;;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
`;

const StyledSideMenuButton = styled.div`
    margin-top: 10px;
    cursor: pointer;
    position: absolute;
    left: 100%;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0064af;
    svg {
        font-size: 22px;
        color: #fff;
    };
    border-radius: 0px 5px 5px 0px;
    @media ${device.mobileL} {
        width: 40px;
        height: 40px;
    };

`;

export const Content = () => {
    const { store } = useContext(ReactReduxContext);
    const isSideMenuOpen = useAppSelector((state) => state.ui.isSideMenuOpen);
    return (
        <StyledContent>
            <StyledSideMenu isSideMenuOpen={isSideMenuOpen}>
                <StyledSideMenuButton
                    onClick={() => store.dispatch(setIsSideMenuOpen(!isSideMenuOpen))}
                >
                    <FontAwesomeIcon
                        icon={faLayerGroup}
                    />
                </StyledSideMenuButton>
                <LayerListTEMP />
            </StyledSideMenu>
            <ZoomMenu />
            <PublishedMap />
            <Search />
            <ToastContainer></ToastContainer>
        </StyledContent>
    );
 }

 export default Content;