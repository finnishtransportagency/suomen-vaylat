import { useContext } from "react";
import { ReactReduxContext, useSelector } from 'react-redux';
import styled from 'styled-components';
import { setSearchParams } from '../../../state/slices/uiSlice';
import strings from '../../../translations';
import Layer from '../hierarchical-layerlist/Layer';


const StyledLayerSearchContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 10px;
`;

const StyledSearchInput = styled.input`
    height: 40px;
    padding-left: 10px;
    border-radius: 5px;
    &::-webkit-search-cancel-button {
        position: relative;
        right: 10px;  
        height: 40px;
        width: 40px;
        cursor: pointer;
    }
`;

const StyledListSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    color: ${props => props.theme.colors.maincolor1};
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
            <StyledSearchInput
                type="search"
                placeholder={strings.layerlist.layerlistLabels.searchForLayers}
                value={searchParams}
                onChange={e => store.dispatch(setSearchParams(e.target.value))}
            />
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