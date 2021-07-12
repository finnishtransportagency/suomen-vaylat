import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
  
const StyledTabListItem = styled.li`
display: inline-block;
list-style: none;
margin-bottom: -1px;
padding: 0.5rem 0.75rem;
background-color: ${props => props.active ? "white" : "blue"};
border: ${props => props.active ? "solid #ccc" : "none"};
border-width: ${props => props.active ? "1px 1px 0 1px" : "0"};
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