import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const StyledCheckbox = styled.div`
    cursor: pointer;
    min-width: 20px;
    min-height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.colors.mainWhite};
    border: 2px solid ${props => props.theme.colors.maincolor1};
    border-radius: 30%;
    box-sizing: border-box;
    svg {
        color: #0064af;
        font-size: 12px;
    };
`;

const Checkbox = ({
    isChecked,
    handleClick,
    size
}) => {
    return <StyledCheckbox
        checked={isChecked}
        onClick={event => handleClick(event)}
        size={size}
    >
        {
            isChecked && <FontAwesomeIcon 
                icon={faCheck}
            />
        }

    </StyledCheckbox>
};

export default Checkbox;