import { useState } from 'react';
import styled from 'styled-components';
import { motion} from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const StyledCheckboxContainer = styled.div`
    width: 28px;
    height: 28px;
    border: 3px solid rgba(0, 0, 0, 0.5);
    border: ${props => props.checked ? '3px solid '+props.theme.colors.mainColor1 : '3px solid rgba(0, 0, 0, 0.5)'};
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
        border: 3px solid ${props => props.theme.colors.mainColor1};
    };
    svg {
        font-size: 14px;
        color: ${props => props.theme.colors.mainColor1};
        &:hover {
            transform: scale(1.2);
            color: ${props => props.theme.colors.mainColor1};
        };
    };
`;

const StyledCheckboxIconContainer = styled(motion.div)`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CheckBox = ({
        checked, 
        selectAction
    }) => {

    return <StyledCheckboxContainer
                onClick={() => selectAction()}
                checked={checked}
            >
                {
                    <StyledCheckboxIconContainer
                        transition={{
                            duration: 0.2,
                            type: "tween"
                        }}
                        animate={{
                            opacity: checked ? 1 : 0,
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faCheck}
                        />
                        </StyledCheckboxIconContainer>
                }
    </StyledCheckboxContainer>
};
export default CheckBox;