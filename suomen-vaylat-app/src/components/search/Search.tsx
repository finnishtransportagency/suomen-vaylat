import React, { useContext } from 'react';
import { Button, Dropdown, DropdownButton, Form, FormControl, InputGroup } from 'react-bootstrap';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { setSearchSelected } from '../../state/slices/searchSlice';
import './Search.scss';

export const Search = () => {
    const search = useAppSelector((state) => state.search);
    console.log(search);

    //const map = useAppSelector((state) => state.map);

    const { store } = useContext(ReactReduxContext)

    const defaultSearchField = <FormControl aria-describedby="basic-addon1" placeholder="Hae.."/>;

    const searchTypes = [
        {
            type: 'address',
            handler: function (search: string) {
                console.log(search);
            },
            ui: <FormControl aria-describedby="basic-addon1" placeholder="Hae.."/>,
            isDefault: true,
            text: 'Osoitehaku'
        },
        {
            type: 'vkm',
            handler: function (tie: number, osa: number, ajorata: number, etaisyys: number) {
                console.log(tie,osa,ajorata,etaisyys);
            },
            isDefault: false,
            text: 'VKM tiehaku'
        }
    ];

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

    const onSelect = (name: any) => {
        store.dispatch(setSearchSelected(name));
    };

    return (
        <div id="search">
            <div className="search-group">
                <InputGroup className="mb-3">
                    <DropdownButton
                        as={InputGroup.Prepend}
                        variant="outline-secondary"
                        title={searchTypeText}
                        id="input-group-dropdown-1"
                        onSelect={onSelect}
                    >
                    {searchTypes.map((value, index) => {
                        return <Dropdown.Item key={index} eventKey={value.type} href="#">{value.text}</Dropdown.Item>
                    })}
                </DropdownButton>
                {form}
                <Button variant="outline-secondary" className="search-button">Hae</Button>
            </InputGroup>
            </div>
        </div>
        );

 }

 export default Search;