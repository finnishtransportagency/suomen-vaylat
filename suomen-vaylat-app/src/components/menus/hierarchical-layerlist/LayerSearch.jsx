import { useContext } from "react";
import styled from 'styled-components';
import strings from '../../../translations';
import { ReactReduxContext, useSelector } from 'react-redux';
import { setSearchParams } from '../../../state/slices/uiSlice';
import Layer from '../hierarchical-layerlist/Layer';

const StyledLayerSearchContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 10px;
`;

const StyledSearchInput = styled.input`
    text-align: middle;
    //border: 1px solid black;
    border-radius: 5px;

    height: 40px;
    padding-left: 10px;
    &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
       // color: #000;
    };
    &::-webkit-search-cancel-button {
        position:relative;
        right:10px;  
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
    margin: 0;
    text-align: center;
    color: ${props => props.theme.colors.secondaryColor7};
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