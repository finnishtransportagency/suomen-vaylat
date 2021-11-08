import styled from 'styled-components';

const StyledSwitchContainer = styled.div`
    position: relative;
    width: 32px;
    height: 16px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    background-color: ${props => props.isSelected ? "#8DCB6D" : "#AAAAAA"};
    cursor: pointer;
`;

const StyledSwitchButton = styled.div`
    position: absolute;
    left: ${props => props.isSelected ? "13px" : "0px"};
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-left: 2px;
    margin-right: 2px;
    transition: all 0.3s ease-out;
    background-color: ${props => props.theme.colors.mainWhite};
`;

const Switch = ({ action, layer, isSelected }) => {
    return (
        <StyledSwitchContainer
            isSelected={isSelected}
            onClick={() => {
                action(layer && layer);
            }}
        >
            <StyledSwitchButton isSelected={isSelected}/>
        </StyledSwitchContainer>
    );
};

export default Switch;