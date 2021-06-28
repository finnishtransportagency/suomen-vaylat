import React, { useContext } from 'react';
import { Button, Dropdown, DropdownButton, Form, FormControl, InputGroup } from 'react-bootstrap';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { addFeaturesToMap, searchVKMRoad, removeFeaturesFromMap } from '../../state/slices/rpcSlice';
import { setSearchSelected, setFormData, setSearchResult, setSearching, emptySearchResult } from '../../state/slices/searchSlice';
import strings from '../../translations';
import CenterSpinner from '../center-spinner/CenterSpinner';
import './Search.scss';

export const Search = () => {
    const search = useAppSelector((state) => state.search);
    console.log(search);

    const vectorLayerId = 'SEARCH_VECTORLAYER';
    const geoJSONstyles: {[key: string]: any} = {
        vkm: {
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
        }
    };
    const geoJSONHoverStyles: {[key: string]: any} = {
        vkm: {
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
        }
    };

    const { store } = useContext(ReactReduxContext)

    const defaultSearchField = <FormControl aria-describedby="basic-addon1" name="searchText" placeholder="Hae.."/>;
    const searchButtonText =  search && search.selected ? strings.getString('search.' + search.selected) : strings.getString('search.default');

    const formRef = React.createRef<HTMLFormElement>();

    // handlers
    const searchButtonHandler = (e:any) => {
        e.preventDefault()
          const formData = new FormData(e.target),
                formDataObj = Object.fromEntries(formData.entries())
          console.log(formDataObj)
    }

    const vkmSearchHandler = (data: any) => {
        store.dispatch(setSearchResult(data));
    };

    if (search.searchResult.geom !== null) {
        let style = 'tie';
        if (search.searchResult.osa && search.searchResult.ajoradat) {
            style = 'osa';
        }
        let featureStyle = geoJSONstyles.vkm[style];
        let hover = geoJSONHoverStyles.vkm[style];

        store.dispatch(addFeaturesToMap({
            geojson: search.searchResult.geom,
            layerId: vectorLayerId + '_' + search.selected,
            featureStyle: featureStyle,
            hover: hover,
            maxZoomLevel: 10
        }));
    }

    const handleSearchInputsChange = (name: string, value: string) => {
        const selected = search.selected;

        if (selected === 'vkm') {
            let formData = {
                tie: (name === 'tie') ? parseFloat(value) : search.formData[selected].tie,
                tieosa: (name === 'tieosa') ? parseFloat(value) : search.formData[selected].tieosa,
                ajorata: (name === 'ajorata') ? parseFloat(value) : search.formData[selected].ajorata,
                etaisyys: (name === 'etaisyys') ? parseFloat(value) : search.formData[selected].etaisyys
            };
            let data: any[] = [];

            if (name === 'tie') {
                data.push(parseFloat(value));
                store.dispatch(removeFeaturesFromMap(vectorLayerId + '_' + search.selected));
                store.dispatch(emptySearchResult());
                formData.tieosa = null;
                formData.ajorata = null;
                formData.etaisyys = null;
            } else {
                data.push(formData.tie);
            }
            if (name === 'tieosa') {
                data.push(parseFloat(value));
            } else {
                data.push(formData.tieosa);
            }
            if (name === 'ajorata') {
                data.push(parseFloat(value));
            } else {
                data.push(formData.ajorata);
            }
            if (name === 'etaisyys') {
                data.push(parseFloat(value));
            } else {
                data.push(formData.etaisyys);
            }
            store.dispatch(setSearching(true));
            store.dispatch(setFormData(formData));
            store.dispatch(searchVKMRoad({
                search: data,
                handler: vkmSearchHandler
            }));
        }
    };

    const searchTypeOnChange = (name: any) => {
        store.dispatch(setSearchSelected(name));
        store.dispatch(emptySearchResult());
        store.dispatch(removeFeaturesFromMap(vectorLayerId + '_' + search.selected));
    };

    const searchTypes = [
        {
            type: 'address',
            isDefault: true,
            text: 'Osoitehaku'
        },
        {
            type: 'vkm',
            isDefault: false,
            text: 'VKM tiehaku',
            ui: <div>
                <FormControl id="input-search-vkm-tie"
                    aria-describedby="basic-addon1"
                    type="number"
                    placeholder="Tie"
                    required
                    name="tie"
                    min="0"
                    className="mb-1"
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                        handleSearchInputsChange(((e.currentTarget as any).name as string), ((e.currentTarget as any).value as string))
                        }
                    }/>
                <DropdownButton
                        as={InputGroup.Prepend}
                        variant="outline-secondary"
                        id="input-search-vkm-osa"
                        name="tieosa"
                        className="mb-1"
                        disabled={search.searchResult.tieosat.length === 0}
                        onSelect={(eventKey: any) => {
                            handleSearchInputsChange('tieosa', eventKey)}
                        }
                        title={search.formData.vkm.tieosa || 'Osa'}
                    >
                        {search.searchResult.tieosat.map((value, index) => {
                            return <Dropdown.Item key={index} eventKey={value} href="#">{value}</Dropdown.Item>
                         })}

                    </DropdownButton>
                <DropdownButton
                    as={InputGroup.Prepend}
                    variant="outline-secondary"
                    title="Ajorata"
                    id="input-search-vkm-ajorata"
                    name="ajorata"
                    className="mb-1"
                    disabled
                ></DropdownButton>
                <FormControl aria-describedby="basic-addon1"
                    id="input-search-vkm-etaisyys"
                    placeholder="Etäisyys"
                    name="etaisyys"
                    className="mb-1"/>

            </div>
        }
    ];

    const hasAllVKMdata = search.formData.vkm.tie !== null &&
        search.formData.vkm.tieosa !== null && search.formData.vkm.ajorata !== null &&
        search.formData.vkm.etaisyys !== null;

    const searchButtonDisabled = !(search.selected !== 'vkm') || (search.selected === 'vkm' && !hasAllVKMdata);

    const defaultSearch = searchTypes.filter((item) => {
        return item.isDefault === true;
    })[0];

    let form = (defaultSearch.ui) ? defaultSearch.ui : defaultSearchField;
    let searchTypeText = defaultSearch.text;

    if (!search.selected) {
        store.dispatch(setSearchSelected(defaultSearch.type));
    } else {
        const searchType = searchTypes.filter((item) => {
            return item.type === search.selected;
        })[0];
        if (searchType.ui) {
            form = searchType.ui;
        } else {
            form = defaultSearchField;
        }
        searchTypeText = searchType.text;
    }




    return (
        <div id="search">
            {search.searching ? (
                <CenterSpinner/>
            ) : null}
            <div className="search-group">
                <Form onSubmit={searchButtonHandler} ref={formRef}>
                <InputGroup>
                    <DropdownButton
                        as={InputGroup.Prepend}
                        variant="outline-secondary"
                        title={searchTypeText}
                        id="input-group-dropdown-1"
                        onSelect={searchTypeOnChange}
                    >
                    {searchTypes.map((value, index) => {
                        return <Dropdown.Item key={index} eventKey={value.type} href="#">{value.text}</Dropdown.Item>
                    })}
                </DropdownButton>
                {form}
                <Button variant="outline-secondary"
                    className="search-button"
                    type="submit"
                    disabled={searchButtonDisabled}>{searchButtonText}</Button>
                </InputGroup>
                </Form>
            </div>
        </div>
        );

 }

 export default Search;