import { useState } from 'react';
import styled from 'styled-components';

const StyledLayerSearchContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const StyledSearchInput = styled.input`
    text-align: middle;
    border: 1px solid black;
    border-radius: 5px;
    width: 100%;
    margin: 10px 15px 0px 15px;
    height: 40px;
    &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
        padding-left: 10px;
        color: #000;
    }
`;


const LayerSearch = () => {
    return (
        <StyledLayerSearchContainer>
                    <StyledSearchInput type="text" placeholder="Hae karttatasoja..." />
        </StyledLayerSearchContainer>
    )
};

export default LayerSearch;