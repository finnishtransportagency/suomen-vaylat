import { useContext, useState } from 'react';
import styled from 'styled-components';
import { ReactReduxContext, useSelector } from 'react-redux';
import { setTagLayers } from '../../../state/slices/rpcSlice';

const StyledFilterButton = styled.div`
    transition: all 0.1s ease-out;
    cursor: pointer;
    display: flex;
    justify-content: center;
    border: 1px solid ${props => props.theme.colors.maincolor2};
    border-radius: 20px;
    padding: 0px 6px 0px 6px;
    margin: 2px;
    font-size: 13px;
    //min-width: 100px;
    background-color: ${props => props.isSelected ? props.theme.colors.maincolor2 : "white"};
    &:hover{
        background-color: ${props => props.theme.colors.maincolor3};
    };
`;

const StyledFilter = styled.span`
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
        <StyledFilter>
            <StyledFilterButton
                onClick={() => selectFilter(filter)}
                isSelected={isSelected}
            >
                {
                    filter
                }
            </StyledFilterButton>
        </StyledFilter>
    );
};

export default Filter;