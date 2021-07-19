import { useContext, useState } from 'react';
import { useAppSelector } from '../../../state/hooks';
import styled from 'styled-components';
import { ReactReduxContext, useSelector } from 'react-redux';
import { setTagLayers } from '../../../state/slices/rpcSlice';

const StyledFilterButton = styled.button`
    border-radius: 20px;
    border: none ;
    padding: 5px;
    margin: 2px;
    font-size: 13px;
`;

export const Filter = ({ filter }) => {
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel)
    const [isSelected, setIsSelected] = useState(false);

    const selectFilter = (filter) => {
        channel.getTagLayers([filter], function (data) {
            store.dispatch(setTagLayers(data));
        });
    }

    return (
        <>
            <StyledFilterButton
                onClick={() => selectFilter(filter)}
                isSelected={isSelected}
            >
                {
                    filter
                }
            </StyledFilterButton>
        </>
    );
};

export default Filter;
