import { useState} from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { theme, isMobile } from '../../theme/theme';

const StyledCircleButton = styled(motion.button)`
    border: none;
    pointer-events: auto;
    position: relative;
    cursor: pointer;
    width: ${props => props.type === "drawingTool" ? "44px" : "48px"};
    height: ${props => props.type === "drawingTool" ? "44px" : "48px"};
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${ props =>
        props.disabled ? "#ddd" :
        props.isActive ? props.activeColor : // Use activeColor when button is active
        props.color? props.color : 
        props.toggleState ?
        props.theme.colors.buttonActive : props.theme.colors.button
    };
    box-shadow: 0px 2px 4px #0000004D;
    border-radius: 50%;
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
    left: ${props => props.direction === "right" && 0};
    right: ${props => props.direction === "left" && 0};
    background-color: ${props => props.theme.colors.mainWhite};
    height: 100%;
    z-index: -1;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    user-select: none;
    padding: 20px;
    padding-left: ${props => props.direction === "right" && "calc(100% + 16px)"};
    padding-right: ${props => props.direction === "left" && "calc(100% + 16px)"};
    overflow: hidden;
    border-radius: 24px;
    color: ${props => props.theme.colors.mainColor1};
    font-size: 14px;
    font-weight: 600;
    pointer-events: none;
`;

const variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
};

const CircleButton = ({
    icon,              // Default icon when inactive
    activeIcon,        // Icon to show when active (optional)
    text,
    toggleState,
    clickAction,
    tooltipDirection,
    tooltipBackgroundColor = theme.colors.mainColor1,
    tooltipColor = theme.colors.mainWhite,
    type,
    color,
    activeColor,        // Use this color when active (optional)
    disabled,
    effect = "float",
    children,
}) => {
    const [isActive, setActive] = useState(false);
    const [isHovered, setHovered] = useState(false);
    const useReactTooltip = tooltipDirection !== "left" && tooltipDirection !== "right" && text;

    const handleButtonClick = () => {
        // Toggle active state
        setActive(!isActive);
        // Execute the passed click action
        if (clickAction) clickAction();
    };

    return (
        <>
        {useReactTooltip &&
            <ReactTooltip backgroundColor={tooltipBackgroundColor} textColor={tooltipColor} disable={isMobile} id={text + "_id"} place={tooltipDirection} type='dark' effect={effect}>
                <span>{text}</span>
            </ReactTooltip>
        }

        <StyledCircleButton
            aria-label={text}
            onClick={handleButtonClick}
            onHoverStart={() => { 
                text && !useReactTooltip && setHovered(true);
            }}
            onHoverEnd={() => { 
               text && !useReactTooltip && setHovered(false)
            }}
            toggleState={toggleState}
            variants={variants}
            type={type}
            color={color}
            activeColor={activeColor} // Pass activeColor dynamically
            isActive={isActive} // Pass active status to styles
            disabled={disabled}
            data-tip
            data-for={text + "_id"}
        >
            {
                <StyledIconContainer>
                    {/* Conditionally render active icon or default icon */}
                    {isActive && activeIcon ? (
                        typeof activeIcon === 'object' && activeIcon.props ? (
                            activeIcon // For Material UI
                        ) : (
                            <FontAwesomeIcon icon={activeIcon} /> // For FontAwesome
                        )
                    ) : (
                        typeof icon === 'object' && icon.props ? (
                            icon // For Material UI
                        ) : (
                            <FontAwesomeIcon icon={icon} /> // For FontAwesome
                        )
                    )}
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
        </>
    )
};

export default CircleButton;
