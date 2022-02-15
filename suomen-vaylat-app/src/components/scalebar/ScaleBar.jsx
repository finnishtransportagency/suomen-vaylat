import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../state/hooks';

const StyledScaleBarContainer = styled(motion.div)`
    position: fixed;
    bottom: 10px;
    left: 50%;
    display: flex;
    justify-content: center;
    //border-style: inset;
    border-left: 3px solid ${props => props.theme.colors.mainColor1};
    border-bottom: 3px solid ${props => props.theme.colors.mainColor1};
    border-right: 3px solid ${props => props.theme.colors.mainColor1};
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    box-shadow: 1px 4px 6px #0000004D;
    background-color: rgba(255, 255, 255, 0.5);
`;

const StyledScaleBarText = styled.p`
    margin: 0;
    font-size: 14px;
    font-weight: 600;
`;

const ScaleBar = () => {
    const { scaleBarState } = useAppSelector((state) => state.rpc);
    return (
        scaleBarState && scaleBarState.width ?
        <StyledScaleBarContainer
            animate={{
                width: scaleBarState && scaleBarState.width + 2,
                transform: "translateX(-50%)"
            }}
        >
           <StyledScaleBarText>
               {scaleBarState && scaleBarState.scale && scaleBarState.scale}
               {scaleBarState && scaleBarState.unit && scaleBarState.unit}
            </StyledScaleBarText>
        </StyledScaleBarContainer>
        : null
    )

};

export default ScaleBar;