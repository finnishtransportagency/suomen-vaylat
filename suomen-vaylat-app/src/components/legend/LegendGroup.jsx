import { useState } from 'react';
import { motion } from 'framer-motion';
import { faAngleDown, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import strings from '../../translations';
import { useAppSelector } from '../../state/hooks';
import { theme } from '../../theme/theme';

const StyledLegendGroup = styled.div`
  display: block;
`;

const StyledGroupHeader = styled.div`
  background: none;
  border: none;
  padding: 8px 16px;
  margin-bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const StyledGroupName = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.mainColor1};

  @media ${(props) => props.theme.device.mobileL} {
    font-size: 13px;
  }
`;

const StyledLeftContent = styled.div`
  display: flex;
  align-items: center;
`;

const StyledRightContent = styled.div`
  display: flex;
  align-items: center;
`;

const StyledSelectButton = styled.button`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;

  svg {
    color: ${(props) => props.theme.colors.mainColor1};
    font-size: 16px;
    transition: all 0.3s ease-out;
  }
`;

const StyledMotionIconWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledGroupContainer = styled(motion.div)`
  overflow: hidden;
  margin-bottom: 6px;
`;

const StyledLegend = styled.div`
  padding: 8px 8px 8px 18px;
  display: flex;
  overflow-x: auto;
`;

const StyledLegendImage = styled.img``;

const StyledFloatingSpan = styled.span`
  float: right;
  margin-left: 6px;
`;

const masterHeaderIconVariants = {
  open: { rotate: -180 },
  closed: { rotate: 0 },
};

export const LegendGroup = ({ legend }) => {
  const [isOpen, setIsOpen] = useState(true);
  const filters = useAppSelector((state) => state.rpc);

  return (
    <StyledLegendGroup key={'legend-' + legend.layerId}>
      <StyledGroupHeader
        onClick={() => setIsOpen((v) => !v)}
        key={'legend-header-' + legend.layerId}
      >
        <StyledLeftContent>
          <StyledGroupName>
            {legend.layerName}
            {filters &&
              filters.filters.length > 0 &&
              filters.filters.some((f) => f.layer === legend.layerId) && (
                <StyledFloatingSpan>
                  <FontAwesomeIcon
                    icon={faFilter}
                    style={{ color: theme.colors.secondaryColorPink }}
                  />
                </StyledFloatingSpan>
              )}
          </StyledGroupName>
        </StyledLeftContent>

        <StyledRightContent>
          <StyledSelectButton
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((v) => !v);
            }}
            aria-label={
              isOpen
                ? strings.accessibility.closeLegendsLayer + legend.layerName
                : strings.accessibility.openLegendsLayer + legend.layerName
            }
          >
            <StyledMotionIconWrapper
              initial="open"
              animate={isOpen ? 'open' : 'closed'}
              variants={masterHeaderIconVariants}
              transition={{ duration: 0.3, type: 'tween' }}
            >
              <FontAwesomeIcon icon={faAngleDown} />
            </StyledMotionIconWrapper>
          </StyledSelectButton>
        </StyledRightContent>
      </StyledGroupHeader>

      <StyledGroupContainer
        key={'legend-container-' + legend.layerId}
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, type: 'tween' }}
      >
        {legend.legend === null && (
          <StyledLegend>{strings.legend.nolegend}</StyledLegend>
        )}

        {legend.legend !== null && (
          <StyledLegend>
            <StyledLegendImage
              aria-label={strings.accessibility.legendImage}
              key={legend.legend}
              src={
                legend.legend.indexOf('action') > -1
                  ? process.env.REACT_APP_PUBLISHED_MAP_DOMAIN + legend.legend
                  : legend.legend
              }
            />
          </StyledLegend>
        )}
      </StyledGroupContainer>
    </StyledLegendGroup>
  );
};
