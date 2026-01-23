import styled from 'styled-components';
import { AnimatePresence } from 'motion/react';
import { useAppSelector } from '../../state/hooks';
import FeatureDataBadge from '../feature-data-window/badge/FeatureDataBadge';
import ThemeBadge from '../layerlists/theme-layerlist/badge/ThemeBadge';
import LayerFilterBadge from '../layer-filter/badge/LayerFilterBadge';
import { useState, useEffect } from 'react';

const StyledContent = styled.div`
  position: absolute;
  top: 0px;
  left: 50vw;
  transform: translateX(-50%);
  width: 100%;
  max-width: 312px;
  display: grid;
  gap: 8px;
  margin-top: 0.5em;
  z-index: 12;

  @media ${(props) => props.theme.device.mobileL} {
    top: unset;
    max-width: 212px;
    margin-bottom: 8px;
    gap: 4px;
  }
  @media ${(props) => props.theme.device.lowResDesktop} {
    top: unset;
    max-width: 212px;
    margin-bottom: 8px;
    gap: 4px;
  }
`;

const badgeMap = {
  gfi: <FeatureDataBadge key="gfi" />,
  theme: <ThemeBadge key="theme" />,
  filter: <LayerFilterBadge key="filter" />
};

const Badges = () => {
  const { selectedTheme } = useAppSelector((state) => state.rpc);
  const { minimizeGfi, minimizeFilter } = useAppSelector((state) => state.ui);

  const [activeBadges, setActiveBadges] = useState([]);

  // Compute currently "on" badges
  const actuallyActive = [];
  if (minimizeGfi) actuallyActive.push('gfi');
  if (selectedTheme && selectedTheme !== '') actuallyActive.push('theme');
  if (minimizeFilter.minimized) actuallyActive.push('filter');

  useEffect(() => {
    setActiveBadges((prev) => {
      // Add newly turned-on badges to the end of the array
      const newBadges = actuallyActive.filter((b) => !prev.includes(b));
      // Remove badges that are no longer active
      const filtered = prev.filter((b) => actuallyActive.includes(b));
      return [...filtered, ...newBadges];
    });
    // Only trigger when actuallyActive changes (deep equal is safe here, since it's a tiny array)
    // You can use actuallyActive.join(',') as a dependency "hash":
  }, [actuallyActive.join(',')]);

  return (
    <StyledContent>
      <AnimatePresence initial={false}>
        {activeBadges
          .filter((badgeId) => actuallyActive.includes(badgeId))
          .map((badgeId) => badgeMap[badgeId])}
      </AnimatePresence>
    </StyledContent>
  );
};

export default Badges;
