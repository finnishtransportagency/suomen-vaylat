import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { StyledContainer, StyledTextField, ToastMessage } from './CommonComponents';
import {
    setFormData,
    setSearching,
    setSearchResult,
    setSelectedIndex,
    setMarker,
    setAddressSearchEventHandlerReady,
    setSearchError
} from '../../state/slices/searchSlice';
import strings from '../../translations';

const List = styled.ul`
  list-style: none;
  padding: 0px;
  background-color: ${props => props.theme.colors.mainWhite};
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.16);
  max-height: 200px;
  overflow: auto;
  position:absolute;
  z-index: 100;
  color: #777;
  font-size: 13px;
  margin-left:1px;
  width:228px;
`;

const ListItem = styled.li`
  display: flex;
  flex-direction: column;
  padding: 2px 8px;
  :first-of-type {
    border-top: none;
  }
  :nth-child(even) {
      background-color: #eee;
  }

  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  color: ${props => props.selected ? props.theme.colors.maincolor1 : ''};
  font-weight: ${props => props.selected ? 'bold' : ''};
`;

const AddressSearch = ({visible, search, store, onEnterHandler}) => {

    const rpc = useAppSelector((state) => state.rpc);

    const onChange = (value) => {
        store.dispatch(setFormData(value.length !== 0 ? value : null));
    };

    // Register to listen SearchResultEvent
    if (search.searching === false && rpc.channel !== null && search.addressSearchEventHandlerReady === false) {
        rpc.channel.handleEvent('SearchResultEvent', function(data) {
            store.dispatch(setSearching(false));
            store.dispatch(setSearchResult({ address: data.result.locations }));
            if (data.result.locations.length === 0) {
                store.dispatch(setSearchError({errorState: true, data: [''], errorType: 'warning'}));
            }
        });
        store.dispatch(setAddressSearchEventHandlerReady(true));
    }

    const onClick = (name, lon, lat, id) => {
        store.dispatch(setSelectedIndex(id));
        store.dispatch(setMarker({
            x: lon,
            y: lat,
            msg: name
        }));
    };

    return (
        <StyledContainer visible={visible} className="search-inputs">
            <StyledTextField
                placeholder={strings.search.address.address}
                onChange={(event) => {
                    onChange(event.target.value);
                }}
                onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                        onEnterHandler();
                    }
                }}
                value={search.formData.address ? search.formData.address : ''}
                min="1"
                type="text"
            >
            </StyledTextField>
            {search.searching === false && search.searchResult.address.length > 0 &&
                <List>
                {search.searchResult.address.map(({ name, lon, lat, id }, index) => (
                    <ListItem key={name + '_' + index} onClick={() => {
                        onClick(name, lon, lat, id);
                    }} selected={search.selectedIndex === id}>
                        <span title={name}>{name.substring(0, 30) + '...'}</span>
                    </ListItem>
                ))}
                </List>
            }
        </StyledContainer>);
};

export default AddressSearch;