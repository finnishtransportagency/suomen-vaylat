import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';
import styled from 'styled-components';

  
const StyledTabList = styled.ol`
border-bottom: 1px solid #ccc;
padding-left: 0;
`;


class Tabs extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      activeTab: this.props.children[0].props.label,
    };
  }

  onClickTabItem = (tab) => {
    this.setState({ activeTab: tab });
  }

  render() {
    const {
      onClickTabItem,
      props: {
        children,
      },
      state: {
        activeTab,
      }
    } = this;

    return (
      <div className="tabs">
        <StyledTabList>
          {children.map((child) => {
            const { label } = child.props;

            return (
              <Tab
                activeTab={activeTab}
                key={label}
                label={label}
                onClick={onClickTabItem}
              />
            );
          })}
        </StyledTabList>
        <div className="tab-content">
          {children.map((child) => {
            if (child.props.label !== activeTab) {
                return undefined;
            } else {
                console.log(child);
                return child;
            }
          })}
        </div>
      </div>
    );
  }
}

export default Tabs;