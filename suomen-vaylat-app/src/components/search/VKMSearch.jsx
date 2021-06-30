import React from 'react';

import Select from 'react-styled-select'

import { addFeaturesToMap, searchVKMRoad, removeFeaturesFromMap } from '../../state/slices/rpcSlice';
import { setFormData, setSearchResult, setSearching, emptySearchResult } from '../../state/slices/searchSlice';
import { StyledContainer, StyledTextField } from './CommonComponents';

const geoJSONstyles = {
    tie: {
        stroke: {
            color: '#910aa3',
            width: 12
        }
    },
    osa: {
        stroke: {
            color: '#ffc300',
            width: 8
        }
    },
    etaisyys: {
        image: {
            radius: 14,
            fill: {
                color: '#c73f00'
            }
        }
    }
};

const geoJSONHoverStyles = {
    tie: {
        inherit: true,
        effect: 'darken',
        content: [
            { key: 'Tie', valueProperty: 'tie' },
            { key: 'Tieosa', valueProperty: 'osa' },
            { key: 'Ajorata', valueProperty: 'ajorata' }
        ]
    },
    osa: {
        inherit: true,
        effect: 'darken',
        content: [
            { key: 'Tie', valueProperty: 'tie' },
            { key: 'Tieosa', valueProperty: 'osa' },
            { key: 'Ajorata', valueProperty: 'ajorata' }
        ]
    },
    etaisyys: {
        inherit: true,
        effect: 'darken',
        content: [
            { key: 'Tie', valueProperty: 'tie' },
            { key: 'Tieosa', valueProperty: 'osa' },
            { key: 'Ajorata', valueProperty: 'ajorata' },
            { key: 'Etäisyys', valueProperty: 'etaisyys' }
        ]
    }
};

const VKMSearch = ({visible, search, store, vectorLayerId}) => {
    const vkmSearchHandler = (data) => {
        store.dispatch(setSearchResult(data));
    };

    if (search.selected === 'vkm' && search.searchResult.geom !== null && search.searching === false) {
        let style = 'tie';
        if (search.searchResult.osa && search.searchResult.ajoradat) {
            style = 'osa';
        }
        let featureStyle = geoJSONstyles[style];
        let hover = geoJSONHoverStyles[style];

        store.dispatch(addFeaturesToMap({
            geojson: search.searchResult.geom,
            layerId: vectorLayerId + '_' + search.selected + '_' + style,
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
            data.push(parseFloat(value));
            store.dispatch(removeFeaturesFromMap(vectorLayerId + '_' + search.selected + '_tie'));
            store.dispatch(removeFeaturesFromMap(vectorLayerId + '_' + search.selected + '_osa'));
            store.dispatch(emptySearchResult());
            formData.tieosa = null;
            formData.ajorata = null;
            formData.etaisyys = null;
        } else {
            data.push(formData.tie);
        }
        if (name === 'tieosa') {
            data.push(parseFloat(value));
            store.dispatch(removeFeaturesFromMap(vectorLayerId + '_' + search.selected + '_osa'));
            formData.ajorata = null;
            formData.etaisyys = null;
        } else {
            data.push(formData.tieosa);
        }
        if (name === 'ajorata') {
            data.push(parseFloat(value));
            store.dispatch(removeFeaturesFromMap(vectorLayerId + '_' + search.selected + '_osa'));
            formData.etaisyys = null;
        } else {
            data.push(formData.ajorata);
        }
        if (name === 'etaisyys') {
            data.push(parseFloat(value));
        } else {
            data.push(formData.etaisyys);
        }

        store.dispatch(setFormData(formData));
        store.dispatch(setSearching(true));

        store.dispatch(searchVKMRoad({
            search: data,
            handler: vkmSearchHandler
        }));
    };


    return (
            <StyledContainer visible={visible} className="search-inputs">
                <StyledTextField placeholder="Tie"
                    onChange={(event) => {
                        onChange('tie', parseFloat(event.target.value));
                    }}
                    value={search.formData.vkm.tie ? search.formData.vkm.tie : ''}
                    disabled={search.searching}
                    min="1"
                >
                </StyledTextField>

                <Select
                        options={search.searchResult.tieosat.map((value, index) => {
                            return { value: value, label: value }
                        })}
                        value={search.formData.vkm.tieosa}
                        disabled={search.searchResult.tieosat.length <= 0 || search.searching}
                        placeholder="Tieosa"
                        onChange={(name) => {
                            onChange('tieosa', name);
                        }}
                        className="margin-top"
                    />
                <Select
                        options={search.searchResult.ajoradat.map((value, index) => {
                            return { value: value, label: value }
                        })}
                        value={search.formData.vkm.ajorata}
                        disabled={search.searchResult.ajoradat.length <= 0 || search.searching}
                        placeholder="Ajorata"
                        onChange={(name) => {
                            onChange('ajorata', name);
                        }}
                        className="margin-top"
                    />
                <StyledTextField placeholder="Etäisyys"
                    onChange={(event) => {
                        //onChange('etaisyys', parseFloat(event.target.value));
                    }}
                    value={search.formData.vkm.etaisyys ? search.formData.vkm.etaisyys : ''}
                    disabled={search.formData.vkm.tie === null || search.formData.vkm.tieosa === null || search.formData.vkm.ajorata === null || search.searching}
                    min="0"
                >
                </StyledTextField>
            </StyledContainer>
    );
};

export default VKMSearch;