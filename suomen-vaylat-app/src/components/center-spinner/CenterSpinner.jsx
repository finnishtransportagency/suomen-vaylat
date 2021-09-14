import React, { useContext } from 'react'
import styled from 'styled-components';
import { ThemeContext } from 'styled-components';

const Spinner = require('react-spinkit');

const StyledSpinner = styled.div`
    position:absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index:5;
`;

export const CenterSpinner = () => {
    const themeContext = useContext(ThemeContext);

    return (
        <StyledSpinner>
            <Spinner
                className="loading"
                name="line-scale-pulse-out"
                color={themeContext.colors.maincolor1}
                fadeIn="quarter"
            />
        </StyledSpinner>
    );
 }

 export default CenterSpinner;