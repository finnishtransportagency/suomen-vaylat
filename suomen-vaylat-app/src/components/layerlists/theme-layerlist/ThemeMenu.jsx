import styled from 'styled-components';
import { AnimatePresence, motion } from 'motion/react';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { sortObjectAlphabetically } from '../../../utils/rpcUtil';
import { useAppSelector } from '../../../state/hooks';
import ThemeLayerList from './ThemeLayerList';
import DialogHeader from '../../../utils/components/DialogHeader';
import strings from '../../../translations';
import store from '../../../state/store';
import { setIsThemeMenuOpen } from '../../../state/slices/uiSlice';

const StyledThemeMenuContainer = styled(motion.div)`
  position: absolute; /* was static / in-flow */
  left: 5em;
  top: 80px;
  width: min-content;
  height: 80vh;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  background-color: #f2f2f2;
  border-radius: 4px;
  overflow: hidden;
  overflow-y: auto;
  user-select: none;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  z-index: 900;

  &::-webkit-scrollbar {
    display: none;
  }

  @media ${(props) => props.theme.device.mobileL} {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin-left: 0;
    z-index: 2000;
  }
`;

const ThemeMenu = () => {
  const { isThemeMenuOpen } = useAppSelector(
    (state) => state.ui
  );
  const { allLayers, allThemesWithLayers } = useAppSelector(
    (state) => state.rpc
  );

  const variants = {
    open: {
      pointerEvents: 'auto',
      x: 0,
      opacity: 1,
      filter: 'blur(0px)'
    },
    closed: {
      pointerEvents: 'none',
      x: '-100%',
      opacity: 0,
      filter: 'blur(10px)'
    }
  };

  let sortedLayers = [...allLayers];
  sortedLayers.sort((a, b) => sortObjectAlphabetically(a.name, b.name));

  return (
    <AnimatePresence>
      <StyledThemeMenuContainer
        id='theme-menu-container'
        initial='closed'
        animate={isThemeMenuOpen ? 'open' : 'closed'}
        transition={{
          duration: 0.4
        }}
        exit={{
          pointerEvents: 'none',
          x: '-100%',
          opacity: 0,
          filter: 'blur(10px)'
        }}
        variants={variants}
      >
        <DialogHeader
          icon={faMap}
          title={strings.layerlist.layerlistLabels.themeLayers}
          handleClose={() => store.dispatch(setIsThemeMenuOpen(false))}
        />
        <ThemeLayerList
          allLayers={sortedLayers}
          allThemes={[...allThemesWithLayers]}
        />
      </StyledThemeMenuContainer>
    </AnimatePresence>
  );
};

export default ThemeMenu;
