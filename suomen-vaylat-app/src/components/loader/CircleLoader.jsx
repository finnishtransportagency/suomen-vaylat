import React from 'react';
import { motion } from 'framer-motion';

import styled from 'styled-components';

const StyledContainer = styled.div`
    position: relative;
    width: 28px;
    height: 28px;
`;

const StyledCircle = styled(motion.span)`
    display: block;
    width: 28px;
    height: 28px;
    border: 5px solid #DDD;
    border-top: 5px solid ${props => props.theme.colors.mainColor1};
    border-radius: 50%;
    position: absolute;
    box-sizing: border-box;
    top: 0;
    left: 0;
`;

const CircleLoader = () => {
    return <StyledContainer>
        <StyledCircle
            animate={{
                rotate: 360
            }}
            transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "anticipate"
            }}
        />
    </StyledContainer>
};

export default CircleLoader;