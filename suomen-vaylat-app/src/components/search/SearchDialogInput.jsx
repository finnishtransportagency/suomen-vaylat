import styled from 'styled-components';
import strings from '../../translations';



const StyledInput = styled.input`
    width: 100%;
    padding: 5px;
    border-radius: 5px;
    border-color: #A0A0A0;
    margin-top: 3px;
    margin-bottom: 3px;
    
`;
const StyledInputHalf = styled.input`
    width: 49%;
    font-size: 16px;
    border-radius: 5px;
    border-color: #A0A0A0;
    margin-top: 3px;
    margin-bottom: 3px;
    padding: 5px;
    :first-of-type {
        margin-right: 2%;
    }
`;

/*TODO fix this, could maybe make search input mapping more clear, 
currently there is problem with calling functions and passing so many params 

example call:

   <SearchModelInput
                    type="full"
                    searchValue = {searchValue}
                    searchType = {searchType}
                    setSearchValue={setSearchValue}
                    onChangeAction={updateRoadSearchValue}
                    onChangeParams={[searchValue, searchType, setSearchValue, 0]}
                    title={strings.search.vkm.tie}
                    handleSeach={handleSeach}
                    valueFunction={getSearchValuePart}
                    valueFunctionParam={[searchValue, searchType, 0]} />

   <SearchModelInput
                    type="half"
                    searchValue = {searchValue}
                    searchType = {searchType}
                    setSearchValue={setSearchValue}
                    onChangeAction={updateRoadSearchValue}
                    onChangeParams={[searchValue, searchType, setSearchValue, 1]}
                    title={strings.search.vkm.osa}
                    handleSeach={handleSeach}
                    valueFunction={getSearchValuePart}
                    valueFunctionParam={[searchValue, searchType, 1]} />

*/
const SearchModelInput = ({
    type,
    searchValue,
    searchType,
    setSearchValue,
    onChangeAction,
    onChangeParams,
    title, 
    handleSeach, 
    valueFunction, 
    valueFunctionParams,
}) => {

    return (
        type === 'half' ? (<StyledInputHalf
        type="text"
        placeholder={ title}
        onChange={(e) => onChangeAction(onChangeParams)  }
        value={(e) => {  valueFunctionParams.push(e.target.value);
                            valueFunction(valueFunctionParams) } }
        onKeyPress={e => {
            if (e.key === 'Enter') {
                handleSeach(searchValue);
            }
        }}
        />
        )
        : (<StyledInput
        type="text"
        placeholder={ strings.search.vkm.tie }
        onChange={(e) => onChangeAction(searchValue, searchType, setSearchValue, e.target.value, 1)  }
        value={valueFunction(searchValue, searchType, 1)}
        onKeyPress={e => {
            if (e.key === 'Enter') {
                handleSeach(searchValue);
            }
        }}
        />
        )
    );
};

export default SearchModelInput;