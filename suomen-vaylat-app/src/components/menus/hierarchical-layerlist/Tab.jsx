import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
  
const StyledTabListItem = styled.div`
  width: 32%;
  padding: 0.1rem;
  background-color: ${props => props.active ? "#49c2f1" : "none"};
  border-radius: 20px;
    font-size: 15px;
    font-family: 'Exo 2';
    margin: 0;
    font-weight: 600;
    color: ${props => props.active ? "#000" : "#fff"};
    text-align: center;
    text-shadow: ${props => props.active ? "none" : "rgba(0, 0, 0, 0.16) 0px 2px 4px, rgba(0, 0, 0, 0.23) 0px 2px 4px"};
    cursor: pointer;
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