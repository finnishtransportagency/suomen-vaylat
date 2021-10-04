import PropTypes from 'prop-types';
import { Component } from 'react';
import styled from 'styled-components';

const StyledTabListItem = styled.div`
  width: 50%;
  height: 30px;
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.active ? props.theme.colors.mainWhite : props.theme.colors.black};
  background-color: ${props => props.active ? props.theme.colors.maincolor1 : "none"};
  border-radius: 15px;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.4s ease-out;
`;

const StyledTabName = styled.p`
  user-select: none;
  margin: 0px;
`;

class Tab extends Component {
  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  onClick = () => {
    const { label, onClick } = this.props;
    onClick(label);
  }

  render() {
    const {
      onClick,
      props: {
        activeTab,
        label,
      },
    } = this;

    let active = false

    if (activeTab === label) {
      active = true;
    }

    return (
      <StyledTabListItem
        active={active}
        onClick={onClick}
      >
        <StyledTabName>
          {label}
        </StyledTabName>
      </StyledTabListItem>
    );
  }
}

export default Tab;