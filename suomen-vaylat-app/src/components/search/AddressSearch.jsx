import {useState} from 'react';
import {
    faAngleUp,
    faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import strings from '../../translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const InputContainer = styled.div`
    position: relative;
    width: 100%;
`;

const StyledInput = styled.input`
    border: none;
    width: 100%;
    height: 40px; /* Adjust the height as needed */
    padding-left: 40px;
    &:focus {
        outline: none;
    };
    font-size: 16px;
    padding-top: 10px;
    border-radius: 24px;
`;

const DropdownIcon = styled(FontAwesomeIcon)`
    position: absolute;
    right: 295px;
    top: 50%;
    transform: translateY(-10%);
    cursor: pointer;
    color: ${props => props.theme.colors.mainColor1};
`;

const AddressSearch = ({
    searchValue,
    setSearchValue,
    handleAddressSearch,
    toggleSearchModal // Prop to toggle the SearchModal
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleIconClick = () => {
        setIsOpen(!isOpen);
        toggleSearchModal(); // Call the toggleSearchModal function when the dropdown icon is clicked
      };

      return (
        <InputContainer>
            <StyledInput
                type="text"
                value={searchValue}
                placeholder={strings.search.address.title}
                onChange={e => setSearchValue(e.target.value)}
                onKeyPress={e => {
                    if (e.key === 'Enter') {
                        handleAddressSearch(e.target.value);
                    }
                }}
            />
                <DropdownIcon
                    icon={isOpen ? faAngleUp : faAngleDown}
                    onClick={handleIconClick} // Call the toggleSearchModal function when the dropdown icon is clicked
                />
        </InputContainer>
    );
};

export default AddressSearch;