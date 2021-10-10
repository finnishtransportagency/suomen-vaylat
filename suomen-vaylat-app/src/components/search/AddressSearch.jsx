import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { setAddressSearchEventHandlerReady, setFormData, setMarker, setSearching, setSearchResult, setSelectedIndex } from '../../state/slices/searchSlice';
import strings from '../../translations';
import { ShowWarning } from '../messages/Messages';
import { StyledContainer, StyledTextField, ToastMessage } from './CommonComponents';

const List = styled.ul`
  z-index: 100;
  position: absolute;
  width: 228px;
  max-height: 200px;
  list-style: none;
  overflow: auto;
  color: #777;
  background-color: ${props => props.theme.colors.mainWhite};
  margin-left: 1px;
  padding: 0px;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.16);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  font-size: 13px;
`;

const ListItem = styled.li`
  display: flex;
  flex-direction: column;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  color: ${props => props.selected ? props.theme.colors.maincolor1 : ''};
  padding: 2px 8px;
  font-weight: ${props => props.selected ? 'bold' : ''};
  :first-of-type {
    border-top: none;
  };
  :nth-child(even) {
      background-color: #eee;
  };
`;

const AddressSearch = ({
    visible,
    search,
    store,
    onEnterHandler
}) => {

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
                ShowWarning(<ToastMessage title={strings.search.address.error.title}
                    message={strings.search.address.error.text}/>);
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