import { useState} from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const StyledCircleButton = styled(motion.button)`
    border: none;
    pointer-events: auto;
    position: relative;
    cursor: ${props => props.disabled ? "unset" : "pointer"};
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 2px 4px #0000004D;
    color: ${props => props.theme.colors.mainWhite};
    border-radius: 22px;
    height: 44px;
    @media ${props => props.theme.device.mobileL} {
        height: 38px;
    };
`;

const StyledTextContainer = styled.p`
    margin: 0;
    padding-left: 8px;
    padding-right: 8px;
    font-size: 14px;
    font-weight: 600;
`;

const variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
};

const TextButton = ({
    text,
    clickAction,
    type,
    color,
    disabled,
}) => {
    const [isHovered, setHovered] = useState(false);
    return (
        <StyledCircleButton
            onClick={() => clickAction()}
            onHoverStart={() => {
                !disabled && setHovered(true);
            }}
            onHoverEnd={() => {
                !disabled && setHovered(false)
            }}
            variants={variants}
            type={type}
            color={color}
            disabled={disabled}
            animate={{
                x: isHovered ? -4 : 0,
                backgroundColor: disabled ? "#ddd" : isHovered ? "#ffffff" : "#0064af",
                color: isHovered ? "#0064af": "#ffffff",
            }}
            transition={{
                duration: 0.3,
                type: "tween"
            }}
        >
            {
                text && <StyledTextContainer>
                        {text}
                    </StyledTextContainer>
            }
        </StyledCircleButton>
    )
};

export default TextButton;
