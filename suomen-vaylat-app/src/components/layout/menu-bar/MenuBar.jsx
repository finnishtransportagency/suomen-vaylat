import { useState } from 'react';
import strings from '../../../translations';
import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';

import CircleButton from '../../../utils/components/CircleButton';

import HierarchicalLayerlistDialogButton from '../../layerlists/hierarchical-layerlist/dialog/dialog-buttons/HierarchicalLayerlistDialogButton';
import ThemeLayerlistDialogButton from '../../layerlists/theme-layerlist/dialog/dialog-buttons/ThemeLayerlistDialogButton';
import FeatureDataWindowDialogButton from '../../feature-data-window/dialog/dialog-buttons/FeatureDataWindowDialogButton';
import FeatureDataDownloadDialogButton from '../../feature-data-window/dialog/dialog-buttons/FeatureDataDownloadDialogButton';
import DrawingToolsDialogButton from '../../measurement-tools/dialog/dialog-buttons/DrawingToolsDialogButton';
import SavedContentDialogButton from '../../saved-content/dialog/dialog-buttons/SavedContentDialogButton';
import { isMobile } from '../../../theme/theme';

const StyledMenuBar = styled.div`
  z-index: 1;
  pointer-events: none;
  height: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  transition: all 0.5s ease-in-out;
  gap: 8px;

  @media ${(props) => props.theme.device.mobileL} {
    gap: 6px;
  }

  @media ${(props) => props.theme.device.lowresDesktop} {
    gap: 6px;
  }
`;

const MenuBar = () => {
  const { isFullScreen } = useAppSelector((state) => state.ui);

  const [animationUnfinished, setAnimationUnfinished] = useState(false);
  const handleFullScreen = () => {
    var elem = document.documentElement;
    /* View in fullscreen */

    function openFullscreen() {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      }
    }

    /* Close fullscreen */
    function closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
      }
    }

    if (isFullScreen) {
      closeFullscreen();
    } else {
      openFullscreen();
    }
  };

  const waitForAnimationFinish = () => {
    setAnimationUnfinished(true);
    setTimeout(() => {
      setAnimationUnfinished(false);
    }, 400);
  };

  return (
    <>
      <StyledMenuBar id="menu_bar">
        <ThemeLayerlistDialogButton
          animationUnfinished={animationUnfinished}
          waitForAnimationFinish={waitForAnimationFinish}
        />
        <HierarchicalLayerlistDialogButton
          animationUnfinished={animationUnfinished}
          waitForAnimationFinish={waitForAnimationFinish}
        />
        <FeatureDataWindowDialogButton />
        <FeatureDataDownloadDialogButton />
        <DrawingToolsDialogButton />
        <SavedContentDialogButton />
        { !isMobile &&
          <CircleButton
            icon={isFullScreen ? faCompress : faExpand}
            text={strings.tooltips.fullscreenButton}
            toggleState={isFullScreen}
            tooltipDirection={'right'}
            clickAction={handleFullScreen}
          />
        }
      </StyledMenuBar>
    </>
  );
};

export default MenuBar;
