import {  useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { setZoomTo } from '../../state/slices/rpcSlice';

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
    /* box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px; */
    transition: all 0.4s ease-out;
    transform: ${props => props.isActive && "scale(1.3)"};
    /* &:hover {
        background-color: #ffc300;
        transform: scale(1.1);
    }; */
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

const ZoomBarCircle = ({
    index,
    zoomLevel,
    hoveringIndex,
    setHoveringIndex,
    isExpanded,
    isActive
    }) => {
    const { store } = useContext(ReactReduxContext);

    return (
        <StyledZoomLevelContainer>
            <StyledZoomLevelCircle
                index={index}
                zoomLevel={zoomLevel}
                hoveringIndex={hoveringIndex}
                //onClick={() => store.dispatch(setZoomTo(index))}
                isExpanded={isExpanded}
                isActive={isActive}
            >
            </StyledZoomLevelCircle>
        </StyledZoomLevelContainer>

    )
};

export default ZoomBarCircle;