import styled from 'styled-components';
import { useAppSelector } from '../../../../state/hooks';
import { setIsSideMenuOpen } from '../../../../state/slices/uiSlice';
import { motion } from 'framer-motion';
import store from '../../../../state/store';

import DialogHeader from '../../../../utils/components/DialogHeader';
import LayerListContainer from '../LayerListContainer';

import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';

import strings from '../../../../translations';

const StyledMapLayersDialog = styled(motion.div)`
  width: 350px;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  background-color: ${(props) => props.theme.colors.mainWhite};
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
  }
`;

const HierarchicalLayerlistDialog = () => {
  const { isSideMenuOpen, isThemeMenuOpen } =
    useAppSelector((state) => state.ui);
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
    !isThemeMenuOpen && (
      <StyledMapLayersDialog
        initial="closed"
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
    )
  );
};

export default HierarchicalLayerlistDialog;
