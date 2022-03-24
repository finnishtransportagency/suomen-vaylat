import { useState } from 'react';
import styled from 'styled-components';
import strings from '../../translations';

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledDropdownContentItem = styled.div`
    user-select: none;
    cursor: pointer;
    padding-left: 8px;
    padding-bottom: 16px;
    border-radius: 5px;

    background-color: ${props => props.itemSelected ? props.theme.colors.mainColor3 : ''};
    p {
        margin: 0;
        padding: 0;
    }
`;

const StyledDropdownContentItemTitle = styled.p`
    text-align: ${props => props.type === 'noResults' && 'center'};
    font-weight: bold;
    font-size: 14px;
    color: #504d4d;
`;

const StyledDropdownContentItemSubtitle = styled.p`
    text-align: ${props => props.type === 'noResults' && 'center'};
    font-size: 14px;
    color: #504d4d;
`;

const StyledInput = styled.input`
    width: 100%;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    margin: 0;
    padding-left: 8px;
    border: none;
    font-size: 14px;
    &:disabled {
        opacity: 0.3;
    };
    -moz-appearance: textfield;
    ::-webkit-inner-spin-button{
        -webkit-appearance: none;
        margin: 0;
    };
    ::-webkit-outer-spin-button{
        -webkit-appearance: none;
        margin: 0;
    };
    &:focus {
        outline: none;
    };
`;

const StyledLabel = styled.label`
    font-size: 14px;
    font-weight: bold;
    margin: 0px;
    color: ${props => props.error && props.theme.colors.secondaryColor6};
`;

const VKMTrackSearch = ({
  searchValue,
  setSearchValue,
  handleVKMTrackSearch,
  vkmTrackError,
}) => {

    const [requiredRatanumero, setRequiredRatanumero] = useState(true);
    const [requiredRatakilometri, setRequiredRatakilometri] = useState(true);
    const [requiredRatametri, setRequiredRatametri] = useState(true);

    return (
        <StyledContainer>
            <>
            {
                vkmTrackError &&
                <StyledDropdownContentItem>
                    <StyledDropdownContentItemTitle type='noResults'>{vkmTrackError ? 'Tarkista tarvittavat kentät' : strings.search.vkm.trackError.text}</StyledDropdownContentItemTitle>
                    <StyledDropdownContentItemSubtitle type='noResults'>{vkmTrackError}</StyledDropdownContentItemSubtitle>
                </StyledDropdownContentItem>
                }
                <StyledDropdownContentItem>
                    <StyledLabel
                        htmlFor='vkm-track-number'
                        error={vkmTrackError && (searchValue.ratanumero === '' || !searchValue)}
                    >
                        {strings.search.vkm.ratanumero} *:
                    </StyledLabel>
                    <StyledInput
                        id='vkm-track-number'
                        placeholder={strings.search.vkm.ratanumero}
                        onInput={e => {
                            e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                        }}
                        onChange={e => {
                            setRequiredRatanumero(e.target.value === '');

                            setSearchValue({
                                ratanumero: e.target.value,
                                ratakilometri: searchValue.ratakilometri || searchValue.ratakilometri === 0 ? searchValue.ratakilometri : '',
                                ratametri: searchValue.ratametri || searchValue.ratametri === 0 ? searchValue.ratametri : ''
                            });
                        }}
                        value={searchValue.ratanumero || ''}
                        onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    handleVKMTrackSearch(searchValue);
                                }
                            }
                        }
                        required={requiredRatanumero}
                    />
                </StyledDropdownContentItem>
                <StyledDropdownContentItem>
                    <StyledLabel
                        htmlFor='vkm-track-kilometer'
                        error={vkmTrackError && (searchValue.ratakilometri === '' || !searchValue)}
                    >
                        {strings.search.vkm.ratakilometri} *:
                    </StyledLabel>
                    <StyledInput
                        id='vkm-track-kilometer'
                        placeholder={strings.search.vkm.ratakilometri}
                        onInput={e => {
                            e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                        }}
                        onChange={e => {
                            setRequiredRatakilometri(e.target.value === '');
                            setSearchValue({
                                ratanumero: searchValue.ratanumero,
                                ratakilometri: e.target.value,
                                ratametri: searchValue.ratametri
                            });
                        }}
                        value={searchValue.ratakilometri || ''}
                        min='1'
                        step='1'
                        type='number'
                        onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    handleVKMTrackSearch(searchValue);
                                }
                            }
                        }
                        required={requiredRatakilometri}
                    />
                </StyledDropdownContentItem>
                <StyledDropdownContentItem>
                    <StyledLabel
                        htmlFor='vkm-track-meter'
                        error={vkmTrackError && (searchValue.ratametri === '' || !searchValue)}
                    >
                        {strings.search.vkm.ratametri} *:
                    </StyledLabel>
                    <StyledInput
                        id='vkm-track-meter'
                        placeholder={strings.search.vkm.ratametri}
                        onInput={e => {
                            e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                        }}
                        onChange={e => {
                            setRequiredRatametri(e.target.value === '');
                            setSearchValue({
                                ratanumero: searchValue.ratanumero,
                                ratakilometri: searchValue.ratakilometri,
                                ratametri: e.target.value
                            });
                        }}
                        value={searchValue.ratametri || searchValue.ratametri === 0 ? searchValue.ratametri : ''}
                        min='0'
                        step='1'
                        type='number'
                        onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    handleVKMTrackSearch(searchValue);
                                }
                            }
                        }
                        required={requiredRatametri}
                    />
                </StyledDropdownContentItem>
            </>
        </StyledContainer>
    );
};

export default VKMTrackSearch;