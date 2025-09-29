import styled from 'styled-components';

const StyledCrosshairWrapper = styled.div`
  pointer-events: none;
  right: 50%;
  bottom: 50%;
  width: 0;
  height: 0;
  position: absolute;
  display: block;
  z-index: 5;
`;

const StyledCrosshairVertical = styled.div`
  left: 0;
  top: -10px;
  height: 21px;
  border-left: 2px solid #000;
  position: absolute;
  display: block;
`;

const StyledCrosshairHorizontal = styled.div`
  left: -10px;
  top: 0;
  width: 21px;
  border-top: 2px solid #000;
  position: absolute;
  display: block;
`;

const Crosshair = () => {
  return (
    <StyledCrosshairWrapper>
      <StyledCrosshairVertical />
      <StyledCrosshairHorizontal />
    </StyledCrosshairWrapper>
  );
};

export default Crosshair;
