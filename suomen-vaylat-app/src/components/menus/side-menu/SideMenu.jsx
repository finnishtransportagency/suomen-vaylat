import { useContext } from "react";
import { faLayerGroup, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import { setIsSideMenuOpen } from '../../../state/slices/uiSlice';
import strings from '../../../translations';
import LayerListTEMP from '../hierarchical-layerlist/LayerListTEMP';

const StyledSideMenu = styled.div`
    //z-index: 10;
    //position: absolute;
   // top: 0px;
    //left: 0px;
    width: 100%;
    max-width: 340px;
    //height: calc(var(--app-height) - 60px);
    display: flex;
    flex-direction: column;
    transform: ${props => props.isSideMenuOpen ? "translateX(0%)" : "translateX(-100%)"};
    overflow-y: auto;
    background-color: ${props => props.theme.colors.mainColor1};
    padding: 10px;
    box-shadow: rgba(0, 0, 0, 0.19) 5px 5px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
    transition: all 0.5s ease-in-out;
    &::-webkit-scrollbar {
        display: none;
    };
    @media ${props => props.theme.device.laptop} {
        z-index: 10;
    };
    @media ${props => props.theme.device.mobileL} {
        z-index: 10;
        max-width: 100%;
        width: 100%;
        //height: var(--app-height);
    };
`;

const StyledSideMenuHeader = styled.div`
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${props => props.theme.colors.mainWhite};
    margin: 10px;
    padding-left: 10px;
    svg  {
        font-size: 20px;
    }
`;

const StyledSideMenuLeftContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledSideMenuHeaderTitle = styled.p`
    margin: 0;
    padding-left: 10px;
    font-size: 18px;
    font-weight: 600;
`;

const StyledSideMenuCloseButton = styled.div`
    display: flex;
    cursor: pointer;
    padding-right: 15px;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 20px;
   };
`;


const SideMenu = () => {

    const { store } = useContext(ReactReduxContext);

    const {
        allGroups,
        allLayers,
        selectedLayers,
        allThemesWithLayers,
        allTags,
        suomenVaylatLayers,
    } = useAppSelector((state) => state.rpc);

    const { isSideMenuOpen } =  useAppSelector((state) => state.ui);

return (
<StyledSideMenu isSideMenuOpen={true}>
    <StyledSideMenuHeader>
        <StyledSideMenuLeftContent>
            <FontAwesomeIcon
                icon={faLayerGroup}
            />
            <StyledSideMenuHeaderTitle>{strings.layerlist.layerlistLabels.mapLayers}</StyledSideMenuHeaderTitle>
        </StyledSideMenuLeftContent>
        <StyledSideMenuCloseButton onClick={() => store.dispatch(setIsSideMenuOpen(!isSideMenuOpen))}>
            <FontAwesomeIcon
                icon={faTimes}
            />
        </StyledSideMenuCloseButton>
    </StyledSideMenuHeader>
    {/* <LayerListTEMP
        groups={allGroups}
        layers={allLayers}
        themes={allThemesWithLayers}
        tags={allTags}
        selectedLayers={selectedLayers}
        suomenVaylatLayers={suomenVaylatLayers}
    /> */}
</StyledSideMenu>
)};

export default SideMenu;