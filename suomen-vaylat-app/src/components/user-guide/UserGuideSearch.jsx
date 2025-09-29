import { useState } from 'react';
import styled from 'styled-components';
import strings from '../../translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


const SearchBarContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  border-radius: 30px;
  height: 40px;
  padding: 0 16px 0 40px; /* left padding gives room for icon */
  border: 1px solid #AAAAAA;
  outline: none;
  font-size: 16px;
  box-sizing: border-box;
  /* Optional: keep border consistent on focus */
  &:focus {
    outline-width: 0;
  }
`;

const StyledSearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #AAAAAA;
  font-size: 18px;
  pointer-events: none; /* Allows clicks to pass through to the input */
`;

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    if (onSearch) {
      onSearch(event.target.value);
    }
  };

  return (
    <SearchBarContainer>
      <StyledSearchIcon icon={faSearch} />
      <StyledInput
        type="text"
        placeholder={strings.appGuide.searchGuides}
        value={searchTerm}
        onChange={handleChange}
      />
    </SearchBarContainer>
  );
}

export default SearchBar;