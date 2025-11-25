import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { sortObjectAlphabetically } from '../../../utils/rpcUtil';
import { useAppSelector } from '../../../state/hooks';
import ThemeLayerList from './ThemeLayerList';
import DialogHeader from '../../../utils/components/DialogHeader';
import strings from '../../../translations';
import store from '../../../state/store';
import { setIsThemeMenuOpen } from '../../../state/slices/uiSlice';
import { useEffect, useState } from 'react';

const StyledThemeMenuContainer = styled(motion.div)`
  width: 350px;
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
  }
`;

function ThemeMenu() {
  const { isThemeMenuOpen, isSideMenuOpen } = useAppSelector(
    (state) => state.ui
  );

  const { allLayers, allThemesWithLayers } = useAppSelector(
    (state) => state.rpc
  );

  const [ combinedThemes, setCombinedThemes] = useState([]);

  const lang = strings.getLanguage();

  useEffect(() => {
    if (allThemesWithLayers.themes.length === 0) return;

    let sortedThemes = [...allThemesWithLayers.themes];
    let sortedRestrictedThemes = [...allThemesWithLayers.restrictedThemes];

    sortedThemes.sort((a, b) =>
        sortObjectAlphabetically(a.locale[lang].name, b.locale[lang].name)
    );

    sortedRestrictedThemes.sort(
        (a, b) => sortObjectAlphabetically(a.locale[lang].name, b.locale[lang].name)
    );

    setCombinedThemes([...sortedRestrictedThemes, ...sortedThemes]);
  }, [allThemesWithLayers]);

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
      {!isSideMenuOpen && isThemeMenuOpen && (
        <StyledThemeMenuContainer
          initial="closed"
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
            allThemes={[...combinedThemes]}
          />
        </StyledThemeMenuContainer>
      )}
    </AnimatePresence>
  );
}

export default ThemeMenu;
