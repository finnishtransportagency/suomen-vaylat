import React, { useContext } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import '../../resources/css/custom.scss';
import styled from 'styled-components';
import strings from '../../translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faList } from '@fortawesome/free-solid-svg-icons';
import { LegendGroup } from './LegendGroup';
import { theme, isMobile } from '../../theme/theme';
import ReactTooltip from 'react-tooltip';
import { setIsLegendOpen } from '../../state/slices/uiSlice';

const StyledLegendContainer = styled(motion.div)`
  position: absolute;
  right: 100%;
  border-radius: 4px;
  margin-right: 8px;
  height: 400px;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.colors.mainWhite};
  opacity: 0;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;

  @media ${(props) => props.theme.device.mobileS} {
    font-size: 13px;
    max-width: 270px;
    bottom: 5px;
  }

  @media ${(props) => props.theme.device.mobileL} {
    font-size: 13px;
    max-width: 270px;
    bottom: 5px;
  }
`;

const StyledHeaderContent = styled.div`
  height: 56px;
  z-index: 1;
  display: flex;
  border-radius: 4px 4px 0px 0px;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.colors.mainColor1};
  padding: 16px;
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.2);

  p {
    margin: 0px;
    font-size: 18px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.mainWhite};
  }

  svg {
    color: ${(props) => props.theme.colors.mainWhite};
  }
`;

const StyledTitleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    font-size: 20px;
    color: ${(props) => props.theme.colors.mainWhite};
  }

  p {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.mainWhite};
  }
`;

const StyledCloseIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 20px;
`;

const StyledGroupsContainer = styled.div`
  overflow-y: auto;
  padding: 8px 4px 8px 8px;
`;

export const Legend = () => {
  const legends = [];
  const noLegends = [];
  const { store } = useContext(ReactReduxContext);
  const allLegends = useSelector((state) => state.rpc.legends);
  const { currentZoomLevel, selectedLayers } = useSelector((state) => state.rpc);
  const { isSearchResultPanelVisible, isLegendOpen } = useSelector((state) => state.ui);

  const listVariants = {
    visible: {
      y: 0,
      opacity: 1,
      pointerEvents: 'auto',
      filter: 'blur(0px)',
      x: isSearchResultPanelVisible ? '-420px' : '0'
    },
    hidden: {
      y: '100%',
      opacity: 0,
      pointerEvents: 'none',
      filter: 'blur(10px)',
      x: isSearchResultPanelVisible ? '-420px' : '0'
    }
  };

  if (selectedLayers) {
    selectedLayers.forEach((layer) => {
      if (layer.opacity !== 0) {
        const legend = allLegends.filter((l) => l.layerId === layer.id);
        const hasVisible =
          !isNaN(layer.maxZoomLevel) && !isNaN(layer.minZoomLevel)
            ? layer.maxZoomLevel >= currentZoomLevel &&
              layer.minZoomLevel <= currentZoomLevel
            : true;
        if (legend[0] && legend[0].legend && hasVisible) {
          legends.push(legend[0]);
        } else if (legend[0] && hasVisible) {
          noLegends.push(legend[0]);
        }
      }
    });
  }
  legends.push.apply(legends, noLegends);

  return (
    <StyledLegendContainer
      key={'legend-container'}
      animate={isLegendOpen ? 'visible' : 'hidden'}
      variants={listVariants}
      transition={{ duration: 0.7, type: 'tween' }}
    >
      <ReactTooltip
        backgroundColor={theme.colors.mainColor1}
        disable={isMobile}
        id="legendHeader"
        place="top"
        type="dark"
        effect="float"
      >
        <span>{strings.tooltips.legendHeader}</span>
      </ReactTooltip>

      <StyledHeaderContent>
        <StyledTitleContent>
          <FontAwesomeIcon icon={faList} />
          <p data-tip data-for="legendHeader">
            {strings.legend.title}
          </p>
        </StyledTitleContent>

        <StyledCloseIcon
          aria-label={strings.accessibility.closeLegends}
          icon={faTimes}
          onClick={() => store.dispatch(setIsLegendOpen(false))}
        />
      </StyledHeaderContent>

      <StyledGroupsContainer id="legend-main-container">
        {legends.map((legend) => (
          <LegendGroup key={'legend-group-' + legend.layerId} legend={legend} />
        ))}
      </StyledGroupsContainer>
    </StyledLegendContainer>
  );
};
