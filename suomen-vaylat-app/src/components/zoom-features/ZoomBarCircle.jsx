import {  useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { setZoomTo } from '../../state/slices/rpcSlice';



const StyledZoomLevelContainer = styled.div`
    position: relative;
`;

const StyledZoomLevelCircle = styled.div`
    pointer-events: auto;
    width: 22px;
    height: 22px;
    border: 4px solid ${props => props.theme.colors.mainColor1};
    border-radius: 50%;
    background-color: ${props => props.index === props.zoomLevel ? props.theme.colors.secondaryColor4 : props.theme.colors.mainWhite};
    transform: ${props => props.index === props.zoomLevel ? "scale(1.1)" : "scale(1)"};
    margin: 4px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    transition: all 0.3s ease-in-out;
    &:hover {
        background-color: #ffc300;
        transform: scale(1.1);
    };
    @media ${props => props.theme.device.mobileL} {
        width: 16px;
        height: 16px;
        border: 2px solid ${props => props.theme.colors.mainColor1};
    };
`;

const ZoomBarCircle = ({
    index,
    zoomLevel,
    setHoveringIndex,
    isExpanded
    }) => {

    const { store } = useContext(ReactReduxContext);

    return (
        <StyledZoomLevelContainer>
            <StyledZoomLevelCircle
                index={index}
                zoomLevel={zoomLevel}
                onClick={() => store.dispatch(setZoomTo(index))}
                isExpanded={isExpanded}
                //onMouseEnter={() => setHoveringIndex(index)}
                //onMouseLeave={() => setHoveringIndex(null)}
            >
            </StyledZoomLevelCircle>
        </StyledZoomLevelContainer>

    )
};

export default ZoomBarCircle;