import { useContext, useState } from 'react';
import styled from 'styled-components';
import { ReactReduxContext, useSelector } from 'react-redux';
import { setTagLayers } from '../../../state/slices/rpcSlice';

const StyledFilterButton = styled.button`
    border-radius: 20px;
    border: solid;
    border-width: 2px;
    border-color: #49c2f1;
    padding: 0.25rem 0.4rem 0.25rem 0.4rem;
    margin: 2px;
    font-size: 13px;
    background-color: ${props => props.isSelected ? "#49c2f1" : "white"};
`;

export const Filter = ({ filter }) => {
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel)
    const tagLayers = useSelector(state => state.rpc.tagLayers)
    const [isSelected, setIsSelected] = useState(false);

    const selectFilter = (filter) => {
        var newTags = [...tagLayers];
        channel.getTagLayers([filter], function (data) {
            if (isSelected) {
                newTags = newTags.filter(tag => !data.includes(tag));
            } else {
                newTags.push(...data);
            }
            store.dispatch(setTagLayers(newTags));
        });
        setIsSelected(!isSelected);
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
