import styled from 'styled-components';
import strings from '../../translations';

const StyledInput = styled.input`
    border: none;
    width: 100%;
    padding-left: 8px;
    &:focus {
        outline: none;
    };
    font-size: 14px;
`;

const RoadSearch = ({
    searchValue,
    setSearchValue,
    handleVKMSearch
}) => {
    return (
        <StyledInput
            type="number"
            value={searchValue.hasOwnProperty('tienumero') ? searchValue.tienumero : ''}
            placeholder={strings.search.vkm.tie + '...'}
            onChange={e => setSearchValue({tienumero: e.target.value})}
            onKeyPress={e => {
                if (e.key === 'Enter') {
                    handleVKMSearch({
                        vkmTienumero: e.target.value
                    });
                }
            }}
        />
    );
};

export default RoadSearch;