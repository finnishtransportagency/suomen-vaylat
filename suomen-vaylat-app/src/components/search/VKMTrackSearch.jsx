import { useState } from 'react';
import styled from 'styled-components';
import strings from '../../translations';

import { useAppSelector } from '../../state/hooks';

import { VKMGeoJsonHoverStyles, VKMGeoJsonStyles } from './VKMSearchStyles';

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
    /*border-left: ${props => props.required ? '2px solid #c73f00' : 'none'};*/
`;

const StyledLabel = styled.label`
    font-size: 14px;
    font-weight: bold;
    margin: 0px;
`;

const VKMTrackSearch = ({
  setIsSearching,
  searchValue,
  setSearchValue,
  setLastSearchValue,
  vectorLayerId,
  removeMarkersAndFeatures,
  setSearchResults
}) => {
    const [error, setError] = useState(null);


    const [requiredRatanumero, setRequiredRatanumero] = useState(true);
    const [requiredRatakilometri, setRequiredRatakilometri] = useState(true);
    const [requiredRatametri, setRequiredRatametri] = useState(true);

    const rpc = useAppSelector((state) => state.rpc);

    const handleResponse = (data) => {
        setIsSearching(false);

        let featureStyle = VKMGeoJsonStyles['track'];
        let hover = VKMGeoJsonHoverStyles['track'];

        rpc.channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, vectorLayerId + '_vkm_track']);

        const value = {
            ratanumero: data.hasOwnProperty('ratanumero') ? data.ratanumero : searchValue.ratanumero || '',
            ratakilometri: data.hasOwnProperty('ratakilometri') ? parseInt(data.ratakilometri) : searchValue.ratakilometri || 1,
            ratametri: data.hasOwnProperty('ratametri') ? parseInt(data.ratametri) : searchValue.ratakilometri || 0
        };

        setSearchValue(value);
        setLastSearchValue(value);
        setSearchResults(data);

        data.hasOwnProperty('geom') && rpc.channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest',
        [data.geom, {
            centerTo: true,
            hover: hover,
            featureStyle: featureStyle,
            layerId: vectorLayerId + '_vkm_track',
            maxZoomLevel: 10
        }]);
    };

    if (searchValue === '' && error !== null) {
        setError(null);
    }

    const handleVKMSearch = (params) => {
        removeMarkersAndFeatures();
        setIsSearching(true);
        setError(null);

        if (params.hasOwnProperty('vkmRatanumero') && params.hasOwnProperty('vkmRatakilometri') && params.hasOwnProperty('vkmRatametri')
            && params.vkmRatanumero !== '' && params.vkmRatakilometri !== '' && params.vkmRatametri !== ''
        ) {
            rpc.channel.searchVKMTrack && rpc.channel.searchVKMTrack([
                params.hasOwnProperty('vkmRatanumero') ? params.vkmRatanumero : searchValue.ratanumero || '',
                params.hasOwnProperty('vkmRatakilometri') ? parseInt(params.vkmRatakilometri) : searchValue.ratakilometri || 1,
                params.hasOwnProperty('vkmRatametri') ? parseInt(params.vkmRatametri) : searchValue.ratametri || 0
            ], handleResponse, (err) => {
                setIsSearching(false);
                if(err){
                    setError(err);
                }
            });
        } else {
            setIsSearching(false);
            setError('required_fields_missing');
        }
    };

    return (
        <StyledContainer>
            <>
            {
                error &&
                <StyledDropdownContentItem>
                <StyledDropdownContentItemTitle type='noResults'>{error === 'required_fields_missing' ? 'Tarkista tarvittavat kentät' : strings.search.vkm.trackError.text}</StyledDropdownContentItemTitle>
            </StyledDropdownContentItem>
                }
                <StyledDropdownContentItem>
                    <StyledLabel htmlFor='vkm-track-number'>{strings.search.vkm.ratanumero} *:</StyledLabel>
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
                                    handleVKMSearch({vkmRatanumero: e.target.value, vkmRatakilometri: searchValue.ratakilometri, vkmRatametri: searchValue.ratametri});
                                }
                            }
                        }
                        required={requiredRatanumero}
                    />
                </StyledDropdownContentItem>
                <StyledDropdownContentItem>
                    <StyledLabel htmlFor='vkm-track-kilometer'>{strings.search.vkm.ratakilometri} *:</StyledLabel>
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
                                    handleVKMSearch({vkmRatanumero: searchValue.ratanumero, vkmRatakilometri: e.target.value, vkmRatametri: searchValue.ratametri});
                                }
                            }
                        }
                        required={requiredRatakilometri}
                    />
                </StyledDropdownContentItem>
                <StyledDropdownContentItem>
                    <StyledLabel htmlFor='vkm-track-meter'>{strings.search.vkm.ratametri} *:</StyledLabel>
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
                                    handleVKMSearch({vkmRatanumero: searchValue.ratanumero, vkmRatakilometri: searchValue.ratakilometri, vkmRatametri: e.target.value});
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