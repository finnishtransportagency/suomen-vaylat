import { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledTabListItem = styled.div`
  transition: all 0.4s ease-out;
  border-radius: 2px;
  font-size: 15px;
  background-color: ${props => props.active ? props.theme.colors.maincolor1 : "none"};
  width: 50%;
  height: 30px;
  border-radius: 15px;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.active ? props.theme.colors.mainWhite : props.theme.colors.black};
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledTabName = styled.p`
  margin: 0px;
  user-select: none;
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