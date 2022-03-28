import { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
const StyledCheckboxContainer = styled.div`
    width: 24px;
    height: 24px;
    border: 3px solid rgba(0, 0, 0, 0.5);
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    //color: ${props => props.theme.colors.mainColor1};
    svg {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        &:hover {
            color: ${props => props.theme.colors.mainColor1};
        }
    };
`;
const CheckBox = ({setCheckedCheckboxes, layerId, checked}) => {
    return <StyledCheckboxContainer
        onClick={() => {
            setCheckedCheckboxes(layerId);
        }}
    >
        {
            checked && <FontAwesomeIcon
                icon={faCheck}
            />
        }
    </StyledCheckboxContainer>
};
export default CheckBox;