import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';


const StyledCheckbox = styled.div`
    cursor: pointer;
    min-width: ${props => props.size ? props.size+"px" : "18px"};
    min-height: ${props => props.size ? props.size+"px" : "18px"};
    display: flex;
    justify-content: center;
    align-items: center;
    //border: 1px solid ${props => props.theme.colors.maincolor2};
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 4px;
    margin-right: 5px;
    //margin-left: ${props => props.marginLeft ? props.marginLeft+"px" : "none"};
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