import React from 'react';
import { useAppSelector } from '../../../state/hooks';

const StyledFilterButton = styled.div`
    width: 40px;
    height: 20px;
    border: 1px solid black;
    margin: 5px;
    background-color: ${props => props.isSelected ? props.selectedColor : props.color};
`;

const Filter = ({ filter }) => {
    const { store } = useContext(ReactReduxContext);
    const selectFilter = (filter) => {
        store.dispatch(setFilter({filter}));
    };

    return (
        <>
            <StyledFilterButton
                onClick={selectFilter(filter)}
                isSelected={isSelected}
                color={filter.color}
                selectedColor={filter.selectedColor}
            >
                {
                    filter.title
                }
            </StyledFilterButton>
        </>
    );
};

export default Filter;
