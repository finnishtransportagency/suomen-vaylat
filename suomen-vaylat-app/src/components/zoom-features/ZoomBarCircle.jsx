import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

const StyledZoomLevelContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
`;

const StyledZoomLevelCircle = styled.div`
    pointer-events: auto;
    width: 22px;
    height: 22px;
    border: 4px solid ${props => props.theme.colors.mainColor1};
    border-radius: 50%;
    background-color: ${props => props.index === props.zoomLevel || props.isActive ? props.theme.colors.secondaryColor4 : props.theme.colors.mainWhite};
    transform: ${props => props.index === props.zoomLevel ? "scale(1.1)" : "scale(1)"};
    margin: 4px;
    transition: all 0.4s ease-out;
    z-index: 3;
    transform: ${props => props.isActive && "scale(1.3)"};
    @media ${props => props.theme.device.mobileL} {
        width: 20px;
        height: 20px;
        border: 4px solid ${props => props.theme.colors.mainColor1};
        margin: 2px;
        transform: ${props => props.isActive && "scale(1.4)"};
    };
    @media ${props => props.theme.device.mobileS} {
        width: 16px;
        height: 16px;
        border: 3px solid ${props => props.theme.colors.mainColor1};
        margin: 1px;
        transform: ${props => props.isActive && "scale(1.4)"};
    };
`;

const StyledTooltip = styled(ReactTooltip)`
  position: relative;
  z-index: 1;
  background-color: ${(props) => props.theme.colors.mainColor1} !important;
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  
  &:after {
    background-color: ${(props) => props.theme.colors.mainColor1} !important;
  }
`;

const ZoomBarCircle = ({
    index,
    zoomLevel,
    hoveringIndex,
    isExpanded,
    isActive
  }) => {
  
    return (
      <>
        <StyledZoomLevelContainer>
          <StyledZoomLevelCircle
            index={index}
            zoomLevel={zoomLevel}
            hoveringIndex={hoveringIndex}
            isExpanded={isExpanded}
            isActive={isActive}
            data-tip
            data-for={`zoomLevel-${index}`}
          ></StyledZoomLevelCircle>
        </StyledZoomLevelContainer>
        <StyledTooltip
            id={`zoomLevel-${index}`}
            place="left"
            effect="solid"
          >
            {index}
          </StyledTooltip>
      </>
    );
  };
  

export default ZoomBarCircle;