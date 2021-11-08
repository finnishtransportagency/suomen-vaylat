import { useContext } from "react";
import { ReactReduxContext, useSelector } from 'react-redux';
import styled from 'styled-components';
import { setSearchParams } from '../../../state/slices/uiSlice';
import strings from '../../../translations';
import Layer from '../hierarchical-layerlist/Layer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
} from '@fortawesome/free-solid-svg-icons';


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
    padding-left: 10px;
    height: 100%;
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

const LayerSearch = ({ layers }) => {
    const { store } = useContext(ReactReduxContext);
    const searchParams = useSelector(state => state.ui.searchParams);
    const searchResults = layers.filter(layer => layer.name.toLowerCase().includes(searchParams.toLowerCase()));
    return (
        <StyledLayerSearchContainer>
            <StyledSearchInputContainer>
                <StyledSearchInputContainerIcon>
                    <FontAwesomeIcon
                            icon={faSearch}
                    />
                </StyledSearchInputContainerIcon>
                <StyledSearchInput
                    //type="search"
                    placeholder={strings.layerlist.layerlistLabels.searchForLayers+"..."}
                    value={searchParams}
                    onChange={e => store.dispatch(setSearchParams(e.target.value))}
                />
            </StyledSearchInputContainer>
            {
                searchParams !== "" && searchParams.length > 2 && 
                <>
                    <StyledListSubtitle>
                        {strings.layerlist.layerlistLabels.searchResults}
                    </StyledListSubtitle>
                    <StyledLayerList>
                        {searchResults.map(layer => {
                            return <Layer layer={layer}/>
                        })}
                    </StyledLayerList>
                </>
            }
            <StyledMessage>
                {
                    searchParams !== "" && searchParams.length > 2 && searchResults.length === 0 ? strings.layerlist.layerlistLabels.noSearchResults :
                    searchParams.length > 0 && searchParams.length < 3 && strings.layerlist.layerlistLabels.typeAtLeastThreeCharacters
                }
            </StyledMessage>
        </StyledLayerSearchContainer>
    )
};

export default LayerSearch;