import { useContext } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { setSearchParams } from '../../../state/slices/uiSlice';
import strings from '../../../translations';
import Layer from '../hierarchical-layerlist/Layer';
import { findGroupForLayer } from '../hierarchical-layerlist/Layer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faTimesCircle
} from '@fortawesome/free-solid-svg-icons';


const listVariants = {
  visible: {
      height: 'auto',
      opacity: 1
  },
  hidden: {
      height: 0,
      opacity: 0
  },
};

const StyledLayerSearchContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
`;

const StyledSearchInputContainer = styled.div`
    display: flex;
    //justify-content: space-between;
    align-items: center;
    height: 40px;
    border: 1px solid #AAAAAA;
    overflow: hidden;
    border-radius: 20px;
`;

const StyledSearchResults = styled.div``

const StyledSearchInputContainerIcon = styled.div`
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    //background-color: ${props => props.theme.colors.mainColor1};
    svg {
        //color: ${props => props.theme.colors.mainWhite};
        color: #AAAAAA;
        font-size: 16px;
    }
`;

const StyledSearchInput = styled.input`
    font-size: 16px;
    height: 260px;
   // border-radius: 5px;
    border: none;
    &::-webkit-search-cancel-button {
        //position: relative;
        //right: 10px;
        //height: 40px;
        //width: 40px;
        //cursor: pointer;
    };
    &:focus {
        outline-width: 0;
    }
`;

const StyledListSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    color: ${props => props.theme.colors.mainColor1};
    padding: 10px 0px 10px 5px;
    font-size: 15px;
`;

const StyledLayerList = styled.div`

`;

const StyledMessage = styled.p`
    text-align: center;
    color: ${props => props.theme.colors.secondaryColor7};
    margin: 0;
    font-size: 14px;
    font-weight: 600;
`;

const LayerSearch = ({ layers, groups }) => {
    const { store } = useContext(ReactReduxContext);
    const searchParams = useSelector(state => state.ui.searchParams);
    const currentLang = strings.getLanguage();

    const searchResults = searchParams.length > 2 
    ? layers.filter(layer => layer.name.toLowerCase().includes(searchParams.toLowerCase())) 
    : [];
    return (
        <StyledLayerSearchContainer>
            <StyledSearchInputContainer>
                <StyledSearchInputContainerIcon
                    {...(searchParams !== '' && { onClick: () => store.dispatch(setSearchParams(''))})}
                >
                    <FontAwesomeIcon
                        icon={searchParams !== '' ? faTimesCircle : faSearch}
                    />
                </StyledSearchInputContainerIcon>
                <StyledSearchInput
                    //type='search'
                    placeholder={strings.layerlist.layerlistLabels.searchForLayers+'...'}
                    value={searchParams}
                    onChange={e => store.dispatch(setSearchParams(e.target.value))}
                />
            </StyledSearchInputContainer>
            <StyledSearchResults>
                    <motion.div
                        animate={searchParams !== '' && searchParams.length > 2 ? 'visible' : 'hidden'}
                        variants={listVariants}
                        transition={{
                            duration: 0.3,
                            type: "tween"
                        }}
                        >
                        <StyledListSubtitle>
                            {strings.layerlist.layerlistLabels.searchResults}
                        </StyledListSubtitle>
                        <StyledLayerList>
                        {searchResults.length > 0 && searchParams !== '' && searchResults.map(layer => {
                            const groupObj = findGroupForLayer(groups, layer.id);
                            const matchingGroup = groupObj ? groupObj.locale[currentLang].name : 'Unknown';
                            return <Layer key={'search_resutlt_'+layer.id} layer={layer} groupName={matchingGroup}/>
                        })}
                        </StyledLayerList>
                    </motion.div>
                <StyledMessage>
                    {
                        searchParams !== '' && searchParams.length > 2 && searchResults.length === 0 ? strings.layerlist.layerlistLabels.noSearchResults :
                        searchParams.length > 0 && searchParams.length < 3 && strings.layerlist.layerlistLabels.typeAtLeastThreeCharacters
                    }
                </StyledMessage>
            </StyledSearchResults>
        </StyledLayerSearchContainer>
    )
};

export default LayerSearch;