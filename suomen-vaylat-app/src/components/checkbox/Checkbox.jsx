import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';


const StyledCheckbox = styled.div`
    cursor: pointer;
    min-width: 20px;
    min-height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid ${props => props.theme.colors.maincolor1};
    box-sizing: border-box;
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 30%;
    margin-right: 5px;
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
                style={{
                    color: "#0064af",
                    fontSize: "12px",
                }}
        />
        }

    </StyledCheckbox>
};

export default Checkbox;