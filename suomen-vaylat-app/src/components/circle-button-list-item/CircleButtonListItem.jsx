import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledContent = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
`;

const StyledCircleButton = styled(motion.div)`
    border: none;
    pointer-events: auto;
    position: relative;
    cursor: pointer;
    min-width: ${props => props.size === 'md' ? '38px' : '44px' };
    min-height: ${props => props.size === 'md' ? '38px' : '44px' };
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.isActive ? props.activeColor ? props.activeColor : props.theme.colors.buttonActive : props.bgColor ? props.bgColor : props.theme.colors.mainColor1};
    box-shadow: 0px 2px 4px #0000004D;
    border-radius: 50%;
    svg {
        color: ${props => props.color ? props.color : props.theme.colors.mainWhite};
        font-size: 22px;
        max-width: 1.4rem;
        .cls-1 {
            fill: ${props => props.color ? props.color : props.theme.colors.mainWhite};
        }
    };
    p {
        margin: 0;
        font-weight: bold;
        font-size: 22px;
        color: ${props => props.color ? props.color : props.theme.colors.mainWhite};
        margin-top: -4px;
    }
`;

const StyledDescriptionContainer = styled(motion.div)`
  flex-grow: 1;
`;

const StyledDescriptionTitle = styled.p`
    margin: 0px;
    font-size: 16px;
    font-weight: bold;
    color: ${props => props.theme.colors.mainColor1};
`;

const StyledDescriptionSubtitle = styled.p`
    margin: 0px;
    font-size: 14px;
    color: ${props => props.theme.colors.mainColor1};
    margin-top: -4px;
`;


const CircleButtonListItem = ({
    id,
    item,
    icon,
    title,
    subtitle,
    selectedItem,
    handleSelectTool,
    size,
    bgColor,
    activeColor,
    color,
    children
}) => {

    const [isHovered, setHovered] = useState(false);

    return (
        <StyledContent
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => handleSelectTool(id, item)}
        >
            <StyledCircleButton
                isActive={selectedItem === id}
                animate={{
                    scale: selectedItem === id || isHovered ? 1.1 : 1,
                }}
                size={size}
                bgColor={bgColor}
                activeColor={activeColor}
                color={color}
            >
                {
                    children ? children : icon ?
                    <FontAwesomeIcon
                        icon={icon}
                    /> :
                    <p>{title.charAt(0).toUpperCase()}</p>
                }
            </StyledCircleButton>
            <StyledDescriptionContainer
                animate={{ x: selectedItem === id || isHovered ? 8 : 0 }}
            >
                {
                    title &&
                    <StyledDescriptionTitle>
                        {title}
                    </StyledDescriptionTitle>
                }
                {
                    subtitle &&
                        <StyledDescriptionSubtitle>
                            {subtitle}
                        </StyledDescriptionSubtitle>
                }

            </StyledDescriptionContainer>
        </StyledContent>
    )
};

export default CircleButtonListItem;