import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../../state/hooks';

import FeatureDataBadge from '../feature-data-window/badge/FeatureDataBadge';

import ThemeBadge from '../layerlists/theme-layerlist/badge/ThemeBadge';

import LayerFilterBadge from '../layer-filter/badge/LayerFilterBadge';

const StyledContent = styled.div`
  position: absolute;
  top: 0px;
  left: 50vw;
  transform: translateX(-50%);
  width: 100%;
  max-width: 312px;
  height: 3em;
  display: grid;
  gap: 8px;
  margin-top: 16px;
  @media ${(props) => props.theme.device.mobileL} {
    top: unset;
    max-width: 212px;
    margin-top: unset;
    margin-bottom: 8px;
    gap: 4px;
  }

  @media ${(props) => props.theme.device.lowresDesktop} {
    top: unset;
    max-width: 212px;
    margin-top: unset;
    margin-bottom: 8px;
    gap: 4px;
  }
`;

const Badges = ({}) => {
  const { selectedTheme } = useAppSelector((state) => state.rpc);
  const { minimizeGfi, minimizeFilter } = useAppSelector((state) => state.ui);

  return (
    <StyledContent>
      <AnimatePresence initial={false}>
        {minimizeGfi && <FeatureDataBadge />}
        {selectedTheme && selectedTheme !== '' && <ThemeBadge />}
        {minimizeFilter.minimized && <LayerFilterBadge />}
      </AnimatePresence>
    </StyledContent>
  );
};

export default Badges;
