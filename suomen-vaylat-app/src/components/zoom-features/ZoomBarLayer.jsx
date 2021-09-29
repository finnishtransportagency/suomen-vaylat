import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const fadeIn = keyframes`
  0% {
      opacity: 0;
   // transform: rotate(0deg);
  }

  100% {
        opacity: 1;
    //transform: rotate(360deg);
  }
`;

const StyledZoomBarLayer = styled.div`
    display: flex;
    align-items: center;
    font-family: 'Exo 2';
    font-weight: 300;
    font-size: 13px;
    color: ${props => props.theme.colors.mainWhite};
    width: 100%;
    height: 25px;
    opacity: 0;
    animation: ${fadeIn} 0.2s ease-in forwards;
    animation-delay: ${props => props.index * 0.01+'s'};
    svg {
        color: rgba(255, 255, 255, 0.7);
    }
`;

const StyledLayerInfo = styled.p`
    padding-left: 10px;
    margin: 0px;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
`;

const ZoomBarLayer = ({
                zoomLevelLayer,
                index,
                layer
            }) => {
            return <StyledZoomBarLayer
                index={index}
            >
                <FontAwesomeIcon
                    icon={layer && layer.visible ? faEye : faEyeSlash}
                />
                <StyledLayerInfo
                >
                   {zoomLevelLayer.name}
                </StyledLayerInfo>
            </StyledZoomBarLayer>
};

export default ZoomBarLayer;