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
import { isMobile } from '../../theme/theme';

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    width: 100%;
`;

const DropdownIcon = styled(FontAwesomeIcon)`
    margin-top: 15px;
    margin-left: 20px;
    transform: translateY(-10%);
    cursor: pointer;
    color: ${props => props.theme.colors.mainColor1};
    @media (max-width: 768px) {
        margin-top: 10px;
    }
`;

const StyledInput = styled.input`
    border: none;
    height: 40px;
    padding-left: 10px;
    &:focus {
        outline: none;
    };
    font-size: 16px;
    padding-top: 10px;
    border-radius: 24px;
    flex: 1;
    @media (max-width: 768px) {
        font-size: 14px;
        padding-left: 10px;
    }
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
            <DropdownIcon
                data-tip={isMobile ? '' : (isMoreSearchOpen ? strings.search.lessSearchOptions : strings.search.moreSearchOptions)}
                icon={isMoreSearchOpen ? faAngleUp : faAngleDown}
                onClick={handleIconClick}
            />
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
        </InputContainer>
    );
  };

export default AddressSearch;