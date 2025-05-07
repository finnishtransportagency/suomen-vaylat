import styled from 'styled-components';

const StyledZoomLevelContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
`;

const StyledZoomLevelCircle = styled.div`
  pointer-events: auto;
  width: 16px;
  height: 16px;
  border: 4px solid ${props => props.theme.colors.mainColor1};
  border-radius: 50%;
  background-color: ${props =>
    props.isActive
      ? props.theme.colors.secondaryColorYellow
      : props.theme.colors.mainWhite};
  transform: ${props =>
    props.isActive ? "scale(1.2)" : "scale(1)"};
  margin: 2px;
  transition: all 0.3s ease-out;
  
  @media ${props => props.theme.device.lowResDesktop} {
    width: 12px;
    height: 12px;
    border: 3px solid ${props => props.theme.colors.mainColor1};
    margin: 2px;
  }

  @media ${props => props.theme.device.mobileL} {
    width: 12px;
    height: 12px;
    border: 3px solid ${props => props.theme.colors.mainColor1};
    margin: 2px;
  }

  @media ${props => props.theme.device.mobileS} {
    width: 8px;
    height: 8px;
    border: 2px solid ${props => props.theme.colors.mainColor1};
    margin: 1px;
  }
`;


const ZoomBarCircle = ({
    index,
    isExpanded,
    isActive
  }) => {
  
    return (
      <>
        <StyledZoomLevelContainer>
          <StyledZoomLevelCircle
            index={index}
            isExpanded={isExpanded}
            isActive={isActive}
          ></StyledZoomLevelCircle>
        </StyledZoomLevelContainer>
      </>
    );
  };
  

export default ZoomBarCircle;