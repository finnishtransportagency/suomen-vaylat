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

const CommonSearch = ({
    searchValue,
    setSearchValue,
    handleCommonSearch
}) => {

    return (
        <StyledInput
            type="text"
            value={searchValue}
            placeholder={strings.search.address.title + '...'}
            onChange={e => setSearchValue(e.target.value)}
            onKeyPress={e => {
                if (e.key === 'Enter') {
                    handleCommonSearch(e.target.value);
                }
            }}
        />
    );
};

export default CommonSearch;