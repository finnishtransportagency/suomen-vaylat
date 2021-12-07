import PropTypes from 'prop-types';
import { Component } from 'react';
import styled from 'styled-components';
import strings from '../../../translations';
import Tab from './Tab';


const StyledTabs = styled.div`
  margin: 10px;
`;

const StyledTopContent = styled.div`
  z-index: 1;
  padding: 10px;
`;

const StyledTabList = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  transition: all 0.1s ease-out;
  background-color: #e4e4e4;
  border-radius: 15px;
  box-sizing: border-box;
  &:hover {
    background-color: ${props => props.theme.colors.mainColor3};
  }
`;

const StyledTabContent = styled.div`

`;

const StyledListSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    color: ${props => props.theme.colors.mainColor1};
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
      activeTab: strings.layerlist.layerlistLabels.allLayers
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