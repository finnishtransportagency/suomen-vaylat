import { Component } from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';
import styled from 'styled-components';
import strings from '../../../translations';

const StyledTabs = styled.div`
  margin: 10px;
`;

const StyledTopContent = styled.div`
  z-index: 1;
  padding: 10px;
`;

const StyledTabList = styled.div`
  transition: all 0.1s ease-out;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 15px;
  box-sizing: border-box;
  background-color: #e4e4e4;
  &:hover {
    background-color: ${props => props.theme.colors.maincolor3};
  }
`;

const StyledTabContent = styled.div`

`;

const StyledListSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    color: ${props => props.theme.colors.maincolor1};
    padding: 10px 0px 10px 5px;
    font-size: 15px;
`;


class Tabs extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeTab: (props.comeInMapLink === false) ? this.props.children[0].props.label : this.props.children[1].props.label,
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
      <StyledTabs>
        <StyledTopContent>
          <StyledListSubtitle>
                {strings.layerlist.layerlistLabels.show}
          </StyledListSubtitle>
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
        </StyledTopContent>
        <StyledTabContent>
          {children.map((child) => {
            if (child.props.label !== activeTab) {
                return undefined;
            } else {
                return child;
            }
          })}
        </StyledTabContent>
      </StyledTabs>
    );
  }
}

export default Tabs;