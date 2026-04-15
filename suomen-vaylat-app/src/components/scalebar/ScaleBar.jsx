import styled from 'styled-components';
import { motion } from 'motion/react';
import { useAppSelector } from '../../state/hooks';

const StyledScaleBarContainer = styled(motion.div)`
  position: fixed;
  bottom: 50px;
  left: ${(props) => props.left}px; // Dynamic positioning
  display: flex;
  justify-content: center;
  border-left: 3px solid ${(props) => props.theme.colors.mainColor1};
  border-bottom: 3px solid ${(props) => props.theme.colors.mainColor1};
  border-right: 3px solid ${(props) => props.theme.colors.mainColor1};
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow: 1px 4px 6px #0000004d;
  background-color: rgba(255, 255, 255, 0.5);
  transition: left 0.3s ease; /* Smooth transition for position changes */
`;

const StyledScaleBarText = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  cursor: default;
  @media ${(props) => props.theme.device.tablet} {
    font-size: 12px;
  }
  @media ${(props) => props.theme.device.mobileS} {
    font-size: 10px;
  }
`;

const ScaleBar = () => {
  const { scaleBarState } = useAppSelector((state) => state.rpc);
  const leftPosition =
    scaleBarState && scaleBarState.width ? 16 + scaleBarState.width / 2 : 64;

  return scaleBarState && scaleBarState.width ? (
    <StyledScaleBarContainer
      left={leftPosition} // Set dynamic position
      animate={{
        width: scaleBarState && scaleBarState.width + 2,
        transform: 'translateX(-50%)'
      }}
    >
      <StyledScaleBarText>
        {scaleBarState && scaleBarState.scale && scaleBarState.scale}
        {scaleBarState && scaleBarState.unit && scaleBarState.unit}
      </StyledScaleBarText>
    </StyledScaleBarContainer>
  ) : null;
};

export default ScaleBar;