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
}) => {
    const [error, setError] = useState(null);
    const [tienumero, setTienumero] = useState('');
    const [tieosa, setTieosa] = useState('default');
    const [tieosat, setTieosat] = useState([]);
    const [ajorata, setAjorata] = useState('default');
    const [ajoradat, setAjoradat] = useState([])
    const [etaisyys, setEtaisyys] = useState('');

    const rpc = useAppSelector((state) => state.rpc);

    const handleResponse = (data) => {

        const vectorLayerId = 'SEARCH_VECTORLAYER';

        setIsSearching(false);
        data.hasOwnProperty('tieosat') && setTieosat(data.tieosat);
        data.hasOwnProperty('ajoradat') && setAjoradat(data.ajoradat);

        let style = 'tie';
        if (( data.hasOwnProperty('osa') || data.hasOwnProperty('ajorata')) && !data.hasOwnProperty('etaisyys')) {
            style = 'osa';
        } else if (data.hasOwnProperty('etaisyys')) {
            style = 'etaisyys';
        }
        let featureStyle = VKMGeoJsonStyles.road[style];
        let hover = VKMGeoJsonHoverStyles.road[style];

        if (style === 'tie') {
            rpc.channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [vectorLayerId + '_vkm_osa']);
        };

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
        rpc.channel.searchVKMRoad([
            params.hasOwnProperty('vkmTienumero') && parseInt(params.vkmTienumero),
            params.hasOwnProperty('vkmTieosa') && parseInt(params.vkmTieosa),
            params.hasOwnProperty('vkmAjorata') && parseInt(params.vkmAjorata),
            params.hasOwnProperty('vkmEtaisyys') && parseInt(params.vkmEtaisyys),
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
                            <StyledDropdownContentItemTitle>{error}</StyledDropdownContentItemTitle>
                        </StyledDropdownContentItem>
                }
                <StyledDropdownContentItem>
                    <StyledLabel htmlFor='vkm-road'>{strings.search.vkm.tie}:</StyledLabel>
                    <StyledInput
                        id='vkm-road'
                        placeholder={strings.search.vkm.tie}
                        onChange={e => {
                            setTienumero(e.target.value);
                        }}
                        min='1'
                        type='number'
                        value={tienumero || ''}
                        onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    setTieosa('default');
                                    setTieosat([]);
                                    setAjorata('default');
                                    setAjoradat([]);
                                    setEtaisyys('');
                                    setTienumero(e.target.value);
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
                            setAjorata('default');
                            setAjoradat([]);
                            setEtaisyys('');
                            setTieosa(e.target.value);
                            handleVKMSearch({vkmTienumero: tienumero, vkmTieosa: e.target.value});
                        }}
                        disabled={!tieosat.length > 0}
                        value={tieosa}
                    >
                        <StyledOption value='default' disabled readOnly={true}>{strings.search.vkm.osa}</StyledOption>
                        {
                            tieosat !== null && tieosat.map(tieosa => {
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
                            setAjorata(e.target.value);
                            setEtaisyys('');
                            handleVKMSearch({vkmTienumero: tienumero, vkmTieosa: tieosa, vkmAjorata: e.target.value});
                        }}
                        disabled={!ajoradat.length > 0}
                        value={ajorata}
                    >
                        <StyledOption value='default' disabled readOnly={true}>{strings.search.vkm.ajorata}</StyledOption>
                        {
                            ajoradat !== null && ajoradat.map(item => {
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
                        onChange={e => {
                            setEtaisyys(e.target.value)
                        }}
                        min='1'
                        type='number'
                        value={etaisyys || ''}
                        disabled={!ajoradat.length > 0}
                        onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    handleVKMSearch({vkmTienumero: tienumero, vkmTieosa: tieosa, vkmAjorata: ajorata, vkmEtaisyys: e.target.value});
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