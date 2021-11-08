import {  useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { setZoomTo } from '../../state/slices/rpcSlice';



const StyledZoomLevelContainer = styled.div`
    position: relative;
`;

const StyledZoomLevelCircle = styled.div`
    pointer-events: auto;
    transform: ${props => props.index === props.zoomLevel && "scale(1.2)"};
    width: ${props => props.isExpanded ? "23px" : "0px"};
    height: ${props => props.isExpanded ? "23px" : "0px"};
    opacity: ${props => props.isExpanded ? "1" : "0"};
    border: ${props => `${props.isExpanded ? "3px" : "1px"} solid ${props.theme.colors.mainColor1}`};
    border-radius: 50%;
    background-color: ${props => props.index === props.zoomLevel ? props.theme.colors.secondaryColor4 : props.theme.colors.mainWhite};
    margin: ${props => props.isExpanded ? "3px" : "0px"};
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    transition: all 0.5s ease-in-out;
    &:hover {
        background-color: #ffc300;
        transform: scale(1.1);
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
                onMouseEnter={() => setHoveringIndex(index)}
                onMouseLeave={() => setHoveringIndex(null)}
            >
            </StyledZoomLevelCircle>
        </StyledZoomLevelContainer>

    )
};

export default ZoomBarCircle;