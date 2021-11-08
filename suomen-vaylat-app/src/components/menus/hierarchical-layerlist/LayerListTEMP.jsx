import { useContext, useState } from 'react';
import { faTrash, faFilter, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import strings from '../../../translations';
import { setTagLayers, setTags } from '../../../state/slices/rpcSlice';
import Filter from './Filter';
import LayerList from './LayerList';
import LayerSearch from './LayerSearch';

//VÄLIAIKAINEN PALIKKA VÄLITTÄMÄÄN TESTIDATAA HIERARKISELLE TASOVALIKOLLE

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const StyledFilterList = styled.div`
    opacity: 0;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    animation-duration: 0.5s;
    animation-name: ${fadeIn};
    transition: all .3s ease-in-out;
    height: ${props => props.isOpen ? "100%" : 0};
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: ${props => props.theme.colors.mainColor1};
    background-color: ${props => props.theme.colors.mainWhite};
`;

const StyledListSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: ${props => props.theme.colors.mainColor1};
    padding: 10px 0px 10px 5px;
    font-size: 15px;
    svg {
      margin-left: 8px;
      font-size: 20px;
      transition: all 0.3s ease-out;
    }
`;

const StyledFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledDeleteAllSelectedFilters = styled.div`
    cursor: pointer;
    width: 250px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.mainColor1};
    margin: 10px auto 20px auto;
    border-radius: 15px;
    svg {
        font-size: 16px;
    };
    p {
        padding-left: 10px;
        margin: 0;
        font-size: 15px;
    };
`;

const StyledSelectButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    border: none;
    background-color: transparent;
    svg {
        font-size: 1rem;
        transition: all 0.5s ease-out;
        color: ${props => props.theme.colors.black};
    };
`;

const StyledSearchAndFilter = styled.div`
    display: flex;
    align-items: center;
`;

const LayerListTEMP = ({
  groups,
  layers,
  tags
}) => {

    const { store } = useContext(ReactReduxContext);

    useAppSelector((state) => state.language);

    const [isOpen, setIsOpen] = useState(false);
  
    const emptyFilters = () => {
      store.dispatch(setTagLayers([]));
      store.dispatch(setTags([]));
    };

    return (
      <>
        <StyledSearchAndFilter>
          {/* <StyledSelectButton
            onClick={() => setIsOpen(!isOpen)}
          >
              <FontAwesomeIcon
                  icon={faFilter}
              />
          </StyledSelectButton> */}
          <LayerSearch layers={layers}/>
        </StyledSearchAndFilter>
        <StyledListSubtitle
              style={{
                cursor: "pointer"
              }}
              onClick={() => setIsOpen(!isOpen)}
            >
              {strings.layerlist.layerlistLabels.filterByType}
                <FontAwesomeIcon
                  icon={faAngleDown}
                  style={{
                    transform: isOpen && "rotate(180deg)"
                   }}
                />
            </StyledListSubtitle>
        { isOpen &&
          <StyledFilterList isOpen={isOpen}>
            <StyledFiltersContainer>
              {tags.map((tag, index) => {
                return(
                    <Filter isOpen={isOpen} key={index} index={index} filter={tag} />
                );
              })}
            </StyledFiltersContainer>
            <StyledDeleteAllSelectedFilters
              onClick={() => emptyFilters()}
            >
              <FontAwesomeIcon
                icon={faTrash}
              />
              <p>{strings.layerlist.layerlistLabels.clearFilters}</p>
            </StyledDeleteAllSelectedFilters>
          </StyledFilterList>
        }
        <LayerList
          label={strings.layerlist.layerlistLabels.allLayers}
          groups={groups}
          layers={layers}
          recurse={false}
        />
      </>
    );
};


export default LayerListTEMP;