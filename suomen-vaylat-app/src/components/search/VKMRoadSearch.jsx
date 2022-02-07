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
`;

const StyledLabel = styled.label`
    font-size: 14px;
    font-weight: bold;
    margin: 0px;
`;

const StyledSelect = styled.select`
    width: 100%;
    min-width: 95px;
    min-height: 48px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    padding: 8px;
    border: 1px solid #e3e3e3;
    border-radius: 8px;
    &:disabled {
        opacity: 0.3;
    };
    &:focus {
        outline: none;
    };

`;

const StyledOption = styled.option`

`;

const VKMRoadSearch = ({
  setIsSearching,
  searchValue,
  setSearchValue
}) => {
    const [error, setError] = useState(null);
    const vectorLayerId = 'SEARCH_VECTORLAYER';

    const rpc = useAppSelector((state) => state.rpc);

    const handleResponse = (data) => {
        setIsSearching(false);

        let style = 'tie';
        if ((data.hasOwnProperty('osa') || data.hasOwnProperty('ajorata')) && !data.hasOwnProperty('etaisyys')) {
            style = 'osa';
        } else if (data.hasOwnProperty('etaisyys')) {
            style = 'etaisyys';
        }
        let featureStyle = VKMGeoJsonStyles.road[style];
        let hover = VKMGeoJsonHoverStyles.road[style];

        if (style === 'tie') {
            rpc.channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [vectorLayerId + '_vkm_osa']);
        };

        setSearchValue({
            tienumero: data.hasOwnProperty('tie') ? parseInt(data.tie) : searchValue.tienumero || null,
            tieosa: data.hasOwnProperty('osa') ? parseInt(data.osa) : searchValue.tieosa || 'default',
            ajorata: data.hasOwnProperty('ajorata') ? parseInt(data.ajorata) : searchValue.ajorata || 'default',
            etaisyys: data.hasOwnProperty('etaisyys') ? parseInt(data.etaisyys) : searchValue.etaisyys || '',
            tieosat: data.hasOwnProperty('tieosat') ? data.tieosat: searchValue.tieosat || [],
            ajoradat: data.hasOwnProperty('ajoradat') ? data.ajoradat: searchValue.ajoradat || []
        });

        data.hasOwnProperty('geom') && rpc.channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest',
        [data.geom, {
            centerTo: true,
            hover: hover,
            featureStyle: featureStyle,
            layerId: vectorLayerId + '_vkm_' + style,
            maxZoomLevel: 10
        }]);
    };

    const handleVKMSearch = (params) => {
        setIsSearching(true);
        setError(null);

        rpc.channel.searchVKMRoad && rpc.channel.searchVKMRoad([
            params.hasOwnProperty('vkmTienumero') && parseInt(params.vkmTienumero),
            params.hasOwnProperty('vkmTieosa') && parseInt(params.vkmTieosa),
            params.hasOwnProperty('vkmAjorata') && parseInt(params.vkmAjorata),
            params.hasOwnProperty('vkmEtaisyys') && parseInt(params.vkmEtaisyys)
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
                            <StyledDropdownContentItemTitle type='noResults'>{strings.search.vkm.error.title}</StyledDropdownContentItemTitle>
                        </StyledDropdownContentItem>
                }
                <StyledDropdownContentItem>
                    <StyledLabel htmlFor='vkm-road'>{strings.search.vkm.tie}:</StyledLabel>
                    <StyledInput
                        id='vkm-road'
                        placeholder={strings.search.vkm.tie}
                        onClick={() => {
                            setError(null);
                        }}
                        min='1'
                        type='number'
                        value={searchValue.tienumero || ''}
                        onChange={e => {
                            setSearchValue({
                                tienumero: e.target.value
                            });
                        }}
                        onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    handleVKMSearch({vkmTienumero: e.target.value});
                                }
                            }
                        }
                    />
                </StyledDropdownContentItem>
                <StyledDropdownContentItem>
                    <StyledLabel htmlFor='vkm-tieosa'>{strings.search.vkm.osa}:</StyledLabel>
                    <StyledSelect
                        id='vkm-tieosa'
                        onChange={e => {
                            handleVKMSearch({vkmTienumero: searchValue.tienumero, vkmTieosa: e.target.value});
                        }}
                        disabled={!searchValue.tieosat || (searchValue.tieosat && !searchValue.tieosat.length > 0)}
                        value={searchValue.tieosa || 'default'}
                    >
                        <StyledOption value='default' disabled readOnly={true}>{strings.search.vkm.osa}</StyledOption>
                        {
                            searchValue.tieosat && searchValue.tieosat.map(tieosa => {
                                return <StyledOption key={'vkm_tieosa_'+tieosa} value={tieosa}>{tieosa}</StyledOption>
                            })
                        }
                    </StyledSelect>
                </StyledDropdownContentItem>
                <StyledDropdownContentItem>
                    <StyledLabel htmlFor='vkm-ajorata'>{strings.search.vkm.ajorata}:</StyledLabel>
                    <StyledSelect
                        id='vkm-ajorata'
                        onChange={e => {
                            handleVKMSearch({vkmTienumero: searchValue.tienumero, vkmTieosa: searchValue.tieosa, vkmAjorata: e.target.value});
                        }}
                        disabled={!searchValue.ajoradat || (searchValue.ajoradat && !searchValue.ajoradat.length > 0)}
                        value={searchValue.ajorata || 'default'}
                    >
                        <StyledOption value='default' disabled readOnly={true}>{strings.search.vkm.ajorata}</StyledOption>
                        {
                            searchValue.ajoradat && searchValue.ajoradat.map(item => {
                                return <StyledOption key={'vkm_ajorata_'+item} value={item}>{item}</StyledOption>
                            })
                        }
                    </StyledSelect>
                </StyledDropdownContentItem>
                <StyledDropdownContentItem>
                    <StyledLabel htmlFor='vkm-etaisyys'>{strings.search.vkm.etaisyys}:</StyledLabel>
                    <StyledInput
                        id='vkm-etaisyys'
                        placeholder={strings.search.vkm.etaisyys}
                        min='1'
                        type='number'
                        defaultValue={searchValue.etaisyys || ''}
                        disabled={!searchValue.ajoradat || (searchValue.ajoradat && !searchValue.ajoradat.length > 0)}
                        onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    handleVKMSearch({vkmTienumero: searchValue.tienumero, vkmTieosa: searchValue.tieosa, vkmAjorata: searchValue.ajorata, vkmEtaisyys: e.target.value});
                                }
                            }
                        }
                    />
                </StyledDropdownContentItem>
            </>
        </StyledContainer>
    );
};

export default VKMRoadSearch;