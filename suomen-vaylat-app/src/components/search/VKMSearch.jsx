import React from 'react';
import { useEffect } from 'react';

import { debounce } from 'tlence';

import { addFeaturesToMap, searchVKMRoad, removeFeaturesFromMap } from '../../state/slices/rpcSlice';
import { setFormData, setSearchResult, setSearching, emptySearchResult } from '../../state/slices/searchSlice';
import { StyledContainer, StyledTextField, StyledSelectInput } from './CommonComponents';
import { VKMGeoJsonStyles, VKMGeoJsonHoverStyles } from './VKMSearchStyles';

let debounceSearchVKM = null;

const VKMSearch = ({visible, search, store, vectorLayerId}) => {

    if (search.selected === 'vkm' && search.searchResult.geom !== null && search.searching === false) {
        let style = 'tie';
        if (search.formData.vkm.tieosa !== null || search.formData.vkm.ajorata !== null) {
            style = 'osa';
        } else if (search.formData.vkm.etaisyys !== null) {
            style = 'etaisyys';
        }
        let featureStyle = VKMGeoJsonStyles[style];
        let hover = VKMGeoJsonHoverStyles[style];

        if (style === 'tie') {
            store.dispatch(removeFeaturesFromMap(vectorLayerId + '_vkm_osa'));
        }

        store.dispatch(addFeaturesToMap({
            geojson: search.searchResult.geom,
            layerId: vectorLayerId + '_vkm_' + style,
            featureStyle: featureStyle,
            hover: hover,
            maxZoomLevel: 10
        }));
    }

    const onChange = (name, value) => {
        let formData = {
            tie: (name === 'tie') ? value : search.formData.vkm.tie,
            tieosa: (name === 'tieosa') ? value : search.formData.vkm.tieosa,
            ajorata: (name === 'ajorata') ? value : search.formData.vkm.ajorata,
            etaisyys: (name === 'etaisyys') ? value : search.formData.vkm.etaisyys
        };
        let data = [];

        if (name === 'tie') {
            if (value === null) {
                return;
            }
            data.push(value);
            store.dispatch(emptySearchResult());
            formData.tieosa = null;
            formData.ajorata = null;
            formData.etaisyys = null;
        } else {
            data.push(formData.tie);
        }
        if (name === 'tieosa') {
            data.push(value);
            formData.ajorata = null;
            formData.etaisyys = null;
        } else {
            data.push(formData.tieosa);
        }
        if (name === 'ajorata') {
            data.push(value);
            formData.etaisyys = null;
        } else {
            data.push(formData.ajorata);
        }
        if (name === 'etaisyys') {
            data.push(value);
        } else {
            data.push(formData.etaisyys);
        }

        store.dispatch(setFormData(formData));

        if (name !== 'etaisyys') {
            debounceSearchVKM(data);
        }
    };

    useEffect(() => {
        const vkmSearchHandler = (data) => {
            store.dispatch(setSearchResult(data));
        };
        const searchVKM = (data) => {
            store.dispatch(setSearching(true));
            store.dispatch(searchVKMRoad({
                search: data,
                handler: vkmSearchHandler
            }));
        };
        debounceSearchVKM = debounce(searchVKM, 1000);
    }, [store]);



    return (
            <StyledContainer visible={visible} className="search-inputs">
                <StyledTextField placeholder="Tie"
                    onChange={(event) => {
                        onChange('tie', parseFloat(event.target.value));
                    }}
                    value={search.formData.vkm.tie ? search.formData.vkm.tie : ''}
                    disabled={search.searching}
                    min="1"
                    type="number"
                >
                </StyledTextField>

                <StyledSelectInput
                    options={search.searchResult.tieosat.map((value, index) => {
                        return { value: value, label: value }
                    })}
                    value={search.formData.vkm.tieosa}
                    disabled={search.searchResult.tieosat.length <= 0 || search.searching}
                    placeholder="Tieosa"
                    onChange={(event) => {
                        onChange('tieosa', parseFloat(event.target.value));
                    }}
                    className="margin-top"
                >
                </StyledSelectInput>

                <StyledSelectInput
                    options={search.searchResult.ajoradat.map((value, index) => {
                        return { value: value, label: value }
                    })}
                    value={search.formData.vkm.ajorata}
                    disabled={search.searchResult.ajoradat.length <= 0 || search.searching}
                    placeholder="Ajorata"
                    onChange={(event) => {
                        onChange('ajorata', parseFloat(event.target.value));
                    }}
                    className="margin-top"
                >
                </StyledSelectInput>

                <StyledTextField placeholder="Etäisyys"
                    onChange={(event) => {
                        onChange('etaisyys', parseFloat(event.target.value));
                    }}
                    value={search.formData.vkm.etaisyys !== null ? search.formData.vkm.etaisyys : ''}
                    disabled={search.formData.vkm.tie === null || search.formData.vkm.tieosa === null || search.formData.vkm.ajorata === null || search.searching}
                    min="0"
                    type="number"
                    className="margin-top"
                >
                </StyledTextField>
            </StyledContainer>
    );
};

export default VKMSearch;