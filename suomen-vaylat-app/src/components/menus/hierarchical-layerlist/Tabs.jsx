import { Component } from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';
import Filter from './Filter';
import styled from 'styled-components';

const StyledTabs = styled.div`

`;

const StyledTopContent = styled.div`
  
  padding: 15px;
  border-radius: 2px;
`;

const StyledTabList = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 15px;
  border: 1px solid ${props => props.theme.colors.mainWhite};
  box-sizing: border-box;
`;

const StyledTabContent = styled.div`

`;

const StyledFilterList = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0px 10px 15px 10px;
`;

const StyledFilterListHeader = styled.div`
    display: flex;
    justify-content: flex-start;
    color: ${props => props.theme.colors.mainWhite};
    padding: 10px;
    font-size: 12px;
`;

const StyledFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
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
      <StyledTabs>
        <StyledTopContent>
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
          <StyledFilterList>
            <StyledFilterListHeader>
              TASOJEN SUODATTIMET
            </StyledFilterListHeader>
            <StyledFiltersContainer>
              {this.props.allTags.map((tag, index) => {
                return(
                    <Filter key={index} filter={tag} />
                );
              })}
            </StyledFiltersContainer>
          </StyledFilterList>
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