import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
  
const StyledTabListItem = styled.li`
  padding: 0.5rem 0.75rem;
  background-color: ${props => props.active ? "blue" : "green"};
  border-radius: 20px;
    font-size: 15px;
    font-family: 'Exo 2';
    margin: 0;
    font-weight: 600;
    color: #fff;
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

    let className = 'tab-list-item';
    let active = false

    if (activeTab === label) {
      active = true;
    }

    return (
      <StyledTabListItem
        active={active}
        onClick={onClick}
      >
        {label}
      </StyledTabListItem>
    );
  }
}

export default Tab;