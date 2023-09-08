import {useEffect} from 'react';
import {
    faAngleUp,
    faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import strings from '../../translations';
import store from '../../state/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip';
import { useAppSelector } from '../../state/hooks';
import { setIsMoreSearchOpen } from '../../state/slices/uiSlice';

const InputContainer = styled.div`
    position: relative;
    width: 100%;
`;

const StyledInput = styled.input`
    border: none;
    width: 100%;
    height: 40px;
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
    toggleSearchModal
}) => {
    const {isSearchOpen, isMoreSearchOpen} = useAppSelector((state) => state.ui);

    useEffect(() => {
        ReactTooltip.rebuild();
    }, [isMoreSearchOpen, isSearchOpen]);

    const handleIconClick = () => {
        store.dispatch(setIsMoreSearchOpen(!isMoreSearchOpen));
        toggleSearchModal();
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
                    data-tip={isMoreSearchOpen ? strings.search.lessSearchOptions : strings.search.moreSearchOptions}
                    icon={isMoreSearchOpen ? faAngleUp : faAngleDown}
                    onClick={handleIconClick} // Call the toggleSearchModal function when the dropdown icon is clicked
                />
        </InputContainer>
    );
};

export default AddressSearch;