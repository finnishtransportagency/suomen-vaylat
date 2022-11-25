import styled from 'styled-components';
import { motion } from 'framer-motion';

import { useAppSelector } from '../../../state/hooks';

import ThemeLayerList from '../hierarchical-layerlist/ThemeLayerList';
import DialogHeader from '../../dialog/DialogHeader';
import strings from '../../../translations';
import store from '../../../state/store';
import { setIsThemeMenuOpen } from '../../../state/slices/uiSlice';

const StyledMapLayersDialog = styled(motion.div)`
    grid-row-start: 1;
    grid-row-end: 3;
    width: 100%;
    height: auto;
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


function ThemeMenu() {

    const { isThemeMenuOpen, isSideMenuOpen } = useAppSelector((state) => state.ui);

    const { allLayers, allThemesWithLayers } = useAppSelector((state) => state.rpc);

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

    return (
        <>
            <StyledMapLayersDialog 
                initial='closed'
                animate={isThemeMenuOpen && !isSideMenuOpen ? 'open' : 'closed'}
                variants={variants}
                transition={{
                    duration: 0.4,
                    type: 'tween',
                }}
                >
                    <DialogHeader title={strings.layerlist.layerlistLabels.themeLayers} handleClose={() => store.dispatch(setIsThemeMenuOpen(false))}/>
                    <ThemeLayerList
                        allLayers={allLayers}
                        allThemes={allThemesWithLayers}
                    />             
            </StyledMapLayersDialog>
        </>
    )
}

export default ThemeMenu;