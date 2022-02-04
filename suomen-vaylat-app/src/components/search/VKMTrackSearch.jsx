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

    background-color: ${props => props.itemSelected ? props.theme.colors.mainColor3 : ""};
    p {
        margin: 0;
        padding: 0;
    }
`;

const StyledDropdownContentItemTitle = styled.p`
    text-align: ${props => props.type === "noResults" && "center"};
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
`;

const VKMTrackSearch = ({
  setIsSearching,
}) => {
    const [error, setError] = useState(null);
    const [ratanumero, setRatanumero] = useState('');
    const [ratakilometri, setRatakilometri] = useState(1);
    const [ratametri, setRatametri] = useState(0);

    const rpc = useAppSelector((state) => state.rpc);

    const handleResponse = (data) => {
        const vectorLayerId = 'SEARCH_VECTORLAYER';

        setIsSearching(false);

        let featureStyle = VKMGeoJsonStyles['track'];
        let hover = VKMGeoJsonHoverStyles['track'];

        rpc.channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [vectorLayerId + '_vkm_track']);

        data.hasOwnProperty('geom') && rpc.channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest',
        [data.geom, {
            centerTo: true,
            hover: hover,
            featureStyle: featureStyle,
            layerId: vectorLayerId + '_vkm_track',
            maxZoomLevel: 10
        }]);
    };

    const handleVKMSearch = (params) => {
        setIsSearching(true);
        rpc.channel.searchVKMTrack([
            params.hasOwnProperty('vkmRatanumero') && params.vkmRatanumero,
            params.hasOwnProperty('vkmRatakilometri') && parseInt(params.vkmRatakilometri),
            params.hasOwnProperty('vkmRatametri') && parseInt(params.vkmRatametri)
        ], handleResponse, (err) => {
            setIsSearching(false);
            if(err){
                setError(err);
            }
        });
    };

    return (
        <StyledContainer>
            <>
            {
                error &&
                        <StyledDropdownContentItem>
                            <StyledDropdownContentItemTitle type='noResults'>{strings.search.vkm.trackError.title}</StyledDropdownContentItemTitle>
                            <StyledDropdownContentItemTitle>{error}</StyledDropdownContentItemTitle>
                        </StyledDropdownContentItem>
                }
                <StyledDropdownContentItem>
                    <StyledLabel htmlFor='vkm-track-number'>{strings.search.vkm.ratanumero}:</StyledLabel>
                    <StyledInput
                        id='vkm-track-number'
                        placeholder={strings.search.vkm.ratanumero}
                        onChange={e => {
                            setRatanumero(e.target.value);
                        }}
                        value={ratanumero || ''}
                        onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    handleVKMSearch({vkmRatanumero: e.target.value, vkmRatakilometri: ratakilometri, vkmRatametri: ratametri});
                                }
                            }
                        }
                    />
                </StyledDropdownContentItem>
                <StyledDropdownContentItem>
                    <StyledLabel htmlFor='vkm-track-kilometer'>{strings.search.vkm.ratakilometri}:</StyledLabel>
                    <StyledInput
                        id='vkm-track-kilometer'
                        placeholder={strings.search.vkm.ratakilometri}
                        onChange={e => {
                            setRatakilometri(e.target.value);
                        }}
                        value={ratakilometri || 1}
                        min='1'
                        step='1'
                        type='number'
                        onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    handleVKMSearch({vkmRatanumero: ratanumero, vkmRatakilometri: e.target.value, vkmRatametri: ratametri});
                                }
                            }
                        }
                    />
                </StyledDropdownContentItem>
                <StyledDropdownContentItem>
                    <StyledLabel htmlFor='vkm-track-meter'>{strings.search.vkm.ratametri}:</StyledLabel>
                    <StyledInput
                        id='vkm-track-meter'
                        placeholder={strings.search.vkm.ratametri}
                        onChange={e => {
                            setRatametri(e.target.value);
                        }}
                        value={ratametri || 0}
                        min='0'
                        step='1'
                        type='number'
                        onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    handleVKMSearch({vkmRatanumero: ratanumero, vkmRatakilometri: ratakilometri, vkmRatametri: e.target.value});
                                }
                            }
                        }
                    />
                </StyledDropdownContentItem>
            </>
        </StyledContainer>
    );
};

export default VKMTrackSearch;