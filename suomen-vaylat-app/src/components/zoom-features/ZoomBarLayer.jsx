import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const fadeIn = keyframes`
  0% {
      opacity: 0;
  }

  100% {
        opacity: 1;
  }
`;

const StyledZoomBarLayer = styled.div`
    width: 100%;
    height: 25px;
    display: flex;
    align-items: center;
    opacity: 0;
    animation: ${fadeIn} 0.2s ease-in forwards;
    animation-delay: ${props => props.index * 0.01+'s'};
    color: ${props => props.theme.colors.mainWhite};
    font-weight: 300;
    font-size: 13px;
    svg {
        color: rgba(255, 255, 255, 0.7);
    }
`;

const StyledLayerInfo = styled.p`
    margin: 0px;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    padding-left: 10px;
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