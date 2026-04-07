import styled from 'styled-components';
import { useAppSelector } from '../../../../state/hooks';
import { setIsSideMenuOpen } from '../../../../state/slices/uiSlice';
import { AnimatePresence, motion } from 'motion/react';
import store from '../../../../state/store';

import DialogHeader from '../../../../utils/components/DialogHeader';
import LayerListContainer from '../LayerListContainer';

import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';

import strings from '../../../../translations';

const StyledMapLayersDialog = styled(motion.div)`
  position: absolute;
  left: 5em;
  top: 80px;
  width: min-content;
  height: 80vh;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  background-color: ${(props) => props.theme.colors.mainWhite};
  border-radius: 4px;
  user-select: none;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  z-index: 10;

  &::-webkit-scrollbar {
    display: none;
  }

  @media ${(props) => props.theme.device.mobileL} {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    z-index: 2000;
  }
`;

const HierarchicalLayerlistDialog = () => {
  const { isSideMenuOpen } = useAppSelector(
    (state) => state.ui
  );
  const { allGroups, allLayers, allTags } = useAppSelector(
    (state) => state.rpc
  );

  const closeSideMenu = () => {
    store.dispatch(setIsSideMenuOpen(!isSideMenuOpen));
  };

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

  return (
    <AnimatePresence>
      <StyledMapLayersDialog
        id='hierarchical-layerlist-dialog'
        initial='closed'
        animate={isSideMenuOpen ? 'open' : 'closed'}
        transition={{ duration: 0.4 }}
        exit={{
          pointerEvents: 'none',
          x: '-100%',
          opacity: 0,
          filter: 'blur(10px)'
        }}
        variants={variants}
      >
        <DialogHeader
          title={strings.layerlist.title}
          handleClose={closeSideMenu}
          icon={faLayerGroup}
        />

        <LayerListContainer
          groups={allGroups}
          layers={allLayers}
          tags={allTags}
        />
      </StyledMapLayersDialog>
    </AnimatePresence>
  );
};

export default HierarchicalLayerlistDialog;
