import styled from 'styled-components';
import strings from '../../../translations';

const StyledLayerSearchContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const StyledSearchInput = styled.input`
    cursor: not-allowed;
    text-align: middle;
    border: 1px solid black;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    width: 100%;
    margin: 10px 15px 0px 15px;
    height: 40px;
    &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
        padding-left: 10px;
        //color: #000;
        color: rgba(0, 0, 0, 0.2);
    }
`;


const LayerSearch = () => {
    return (
        <StyledLayerSearchContainer>
                    <StyledSearchInput type="text" placeholder={strings.layerlist.layerlistLabels.searchForLayers} />
        </StyledLayerSearchContainer>
    )
};

export default LayerSearch;