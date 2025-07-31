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
        props.disabled ? props.theme.colors.disabledBg :
        props.color? props.color : 
        props.toggleState ?
        props.theme.colors.buttonSelected : props.theme.colors.button
    };
    box-shadow: 0px 2px 4px #0000004D;
    border-radius: 50%;
    svg {
        color: ${(props) =>
        props.disabled ? props.theme.colors.disabledColor : props.theme.colors.mainWhite};
        font-size: 22px;
    };

    @media ${props => props.theme.device.mobileL} {
        width: ${props => props.type === "drawingTool" ? "32px" : "36px"};
        height: ${props => props.type === "drawingTool" ? "32px" : "36px"};
        svg {
            font-size: 16px;
        };
    };

    @media ${props => props.theme.device.lowResDesktop} {
        width: ${props => props.type === "drawingTool" ? "36px" : "40px"};
        height: ${props => props.type === "drawingTool" ? "36px" : "40px"};
        svg {
            font-size: 18px;
        };
    };

    @media ${props => props.theme.device.mobileS} {
        width: ${props => props.type === "drawingTool" ? "30px" : "34px"};
        height: ${props => props.type === "drawingTool" ? "30px" : "34px"};
        svg {
            font-size: 14px;
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

const CircleButton = ({
    icon,
    text,
    toggleState,
    clickAction,
    tooltipDirection,
    tooltipBackgroundColor = theme.colors.mainColor1,
    tooltipColor = theme.colors.mainWhite,
    type,
    color,
    disabled,
    effect = "float",
    children,
}) => {
    const [isHovered, setHovered] = useState(false);
    const useReactTooltip = tooltipDirection !== "left" && tooltipDirection !== "right" && text;

    return (
        <>
        {useReactTooltip &&
            <ReactTooltip backgroundColor={tooltipBackgroundColor} textColor={tooltipColor} disable={isMobile} id={text + "_id"} place={tooltipDirection} type='dark' effect={effect}>
                <span>{text}</span>
            </ReactTooltip>
        }

        <StyledCircleButton
            aria-label={text}
            onClick={() => clickAction()}
            onHoverStart={() => { 
                text && !useReactTooltip && setHovered(true);
            }}
            onHoverEnd={() => { 
               text && !useReactTooltip && setHovered(false)
            }}
            toggleState={toggleState}
            type={type}
            color={color}
            disabled={disabled}
            data-tip
            data-for={text + "_id"}
        >
            {   icon && 
                <StyledIconContainer>
                    {/* Check if the icon is a Material UI React component or FontAwesome icon */}
                    {typeof icon === 'object' && icon.props ? (
	                    /* If the icon is a Material UI component (React component) */
                        icon
                    ) : (
                        /* If the icon is a Font Awesome icon */
                        <FontAwesomeIcon icon={icon} />
                    )}
                </StyledIconContainer>
            }
             <AnimatePresence initial={false}>
                 {
                      !toggleState && isHovered && !disabled && <StyledCircleButtonTextContainer
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
