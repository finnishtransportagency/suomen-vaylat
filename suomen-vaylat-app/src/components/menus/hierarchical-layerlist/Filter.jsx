import { useContext, useState } from 'react';
import { useAppSelector } from '../../../state/hooks';
import styled from 'styled-components';
import { ReactReduxContext, useSelector } from 'react-redux';
import { setFilter } from '../../../state/slices/rpcSlice';

const StyledFilterButton = styled.div`
    width: 40px;
    height: 20px;
    border: 1px solid black;
    margin: 5px;
    background-color: ${props => props.isSelected ? props.selectedColor : props.color};
`;

const Filter = ({ filter }) => {
    const { store } = useContext(ReactReduxContext);
    const [isSelected, setIsSelected] = useState(false);
    const selectFilter = (filter) => {
        //store.dispatch(setFilter({filter}));
        console.log("selected filter: "+filter);
    };

    return (
        <>
            <StyledFilterButton
                onClick={selectFilter(filter)}
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
