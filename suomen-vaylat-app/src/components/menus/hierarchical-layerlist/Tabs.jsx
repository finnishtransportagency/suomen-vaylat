import { Component } from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';
import styled from 'styled-components';

  
const StyledTabList = styled.div`
  padding: 0.25rem;
  background-color: #186ef0;
  border-radius: 30px;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: center;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
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
                return child;
            }
          })}
        </div>
      </div>
    );
  }
}

export default Tabs;