import styled from "styled-components";

const StyledSwitchContainer = styled.div`
  position: relative;
  min-width: 32px;
  height: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  background-color: ${(props) => (props.isSelected ? "#8DCB6D" : "#AAAAAA")};
  cursor: pointer;
  margin-right: 16px;
`;

const StyledSwitchButton = styled.div`
  position: absolute;
  left: ${(props) => (props.isSelected ? "15px" : "0px")};
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-left: 2px;
  margin-right: 2px;
  transition: all 0.3s ease-out;
  background-color: ${(props) => props.theme.colors.mainWhite};
`;

const LayerlistSwitch = ({ action, layer, isSelected }) => {

    const handleClick = (e) => {
        if (layer) {
            action(layer);
        } else {
            action(e)
        }
    }

    return (
        <StyledSwitchContainer
        isSelected={isSelected}
        onClick={(event) => handleClick(event)}
        >
        <StyledSwitchButton isSelected={isSelected} />
        </StyledSwitchContainer>
    );
};

export default LayerlistSwitch;