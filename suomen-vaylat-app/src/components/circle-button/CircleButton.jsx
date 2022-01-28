import { useState} from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledCircleButton = styled(motion.div)`
    pointer-events: auto;
    position: relative;
    cursor: pointer;
    width: ${props => props.type === "drawingTool" ? "44px" : "48px"};
    height: ${props => props.type === "drawingTool" ? "44px" : "48px"};
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.color === "secondaryColor7" ? props.theme.colors.secondaryColor7 : props.toggleState ? props.theme.colors.buttonActive : props.theme.colors.button};
    box-shadow: 0px 2px 4px #0000004D;
    border-radius: 50%;
    //margin-left: ${props => props.type === "drawingTool" && "auto"};
    //margin-right: ${props => props.type === "drawingTool" && "auto"};
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 22px;
    };
    @media ${props => props.theme.device.mobileL} {
        width: ${props => props.type === "drawingTool" ? "38px" : "40px"};
        height: ${props => props.type === "drawingTool" ? "38px" : "40px"};
        svg {
            font-size: 18px;
        };
    };
`;

const StyledIconContainer = styled.div`
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledCircleButtonTextContainer = styled(motion.div)`
    position: absolute;
    left: ${props => !props.direction && 0};
    right: ${props => props.direction === "left" && 0};
    background-color: ${props => props.color === "secondaryColor7" ? props.theme.colors.secondaryColor7 : props.toggleState ? props.theme.colors.buttonActive : props.theme.colors.button};
    height: 100%;
    z-index: -1;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    user-select: none;
    padding: 20px;
    padding-left: ${props => !props.direction && "calc(100% + 16px)"};
    padding-right: ${props => props.direction && "calc(100% + 16px)"};
    overflow: hidden;
    border-radius: 24px;
    color: ${props => props.theme.colors.mainWhite};
    font-size: 14px;
    font-weight: 600;
    pointer-events: none;
`;

const variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
};

const CircleButton = ({
    icon,
    text,
    toggleState,
    clickAction,
    tooltipDirection,
    type,
    color,
    children
}) => {
    const [isHovered, setHovered] = useState(false);
    return (
        <StyledCircleButton
            onClick={() => clickAction()}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            toggleState={toggleState}
            variants={variants}
            type={type}
            color={color}
        >
            {
                icon && <StyledIconContainer>
                        <FontAwesomeIcon
                            icon={icon}
                        />
                    </StyledIconContainer>
            }
             <AnimatePresence initial={false}>
                 {
                     !toggleState && isHovered && <StyledCircleButtonTextContainer
                        key={text +"_button"}
                        direction={tooltipDirection}
                        positionTransition
                        initial={{
                            width: 0,
                            filter: "blur(10px)",
                            opacity: 0,
                            boxShadow: "2px 2px 4px #0000004D"
                            
                        }}
                        animate={{
                            width: "auto",
                            filter: "blur(0px)",
                            opacity: 1,
                            boxShadow: "2px 2px 4px #0000004D"
                        }}
                        exit={{
                            width: 0,
                            filter: "blur(10px)",
                            opacity: 0,
                            boxShadow: "2px 2px 4px #0000004D"
                        }}
                        color={color}
                     >
                        {text}
                     </StyledCircleButtonTextContainer>
                 }
             </AnimatePresence>
            {
                children && children
            }
        </StyledCircleButton>
    )
};

export default CircleButton;
