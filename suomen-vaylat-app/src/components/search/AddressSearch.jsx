import { useAppSelector } from '../../state/hooks';
import { StyledContainer, StyledTextField } from './CommonComponents';
import {
    setFormData,
    setSearching,
    setSearchResult,
    setAddressSearchEventHandlerReady
} from '../../state/slices/searchSlice';
import strings from '../../translations';
import {setSelectError} from "../../state/slices/rpcSlice";

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
                store.dispatch(setSelectError({show: true, message: strings.search.address.error.text, type: 'searchWarning', filteredLayers: [], indeterminate: false}));
            }
        });
        store.dispatch(setAddressSearchEventHandlerReady(true));
    }

    return (
        <StyledContainer visible={visible} className="search-inputs">
            <StyledTextField
                placeholder={strings.search.types.address + '...'}
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
        </StyledContainer>);
};

export default AddressSearch;
