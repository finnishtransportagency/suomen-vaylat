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
            type="text"
            value={searchValue.tienumero && searchValue.tienumero !== '' ? searchValue.tienumero : searchValue}
            placeholder={strings.search.vkm.title + '...'}
            onChange={e => setSearchValue(e.target.value)}
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