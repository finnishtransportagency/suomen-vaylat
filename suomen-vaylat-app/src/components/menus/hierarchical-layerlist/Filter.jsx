import { useContext } from 'react';
import styled from 'styled-components';
import { ReactReduxContext, useSelector } from 'react-redux';
import { setTagLayers, setTags } from '../../../state/slices/rpcSlice';


const StyledFilterButton = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: center;
    cursor: pointer;
    padding: 0px 6px 0px 6px;
    background-color: ${props => props.isSelected ? props.theme.colors.mainColor2 : props.theme.colors.white};
    margin: 2px;
    border: 1px solid ${props => props.theme.colors.mainColor2};
    border-radius: 20px;
    font-size: 13px;
    transition: all 0.1s ease-out;
    &:hover{
        background-color: ${props => props.theme.colors.mainColor3};
    };
`;

const StyledFilter = styled.span`

`;

export const Filter = ({ filter, isOpen }) => {
    const { store } = useContext(ReactReduxContext);
    const {
        channel,
        tagLayers,
        tags
    } = useSelector(state => state.rpc);

    const selectFilter = (filter) => {
        var newTags = [...tagLayers];
        var tags2 = [...tags];
        tags2.includes(filter) ? tags2 = tags2.filter(tag => tag !== filter) : tags2.push(filter);
        channel.getTagLayers([filter], function (data) {
            if (tags.includes(filter)) {
                newTags = newTags.filter(tag => !data.includes(tag));
            } else {
                newTags.push(...data);
            }
            store.dispatch(setTagLayers(newTags));
            store.dispatch(setTags(tags2));
        });
    };

    return (
        <StyledFilter>
            <StyledFilterButton
                onClick={() => selectFilter(filter)}
                isSelected={tags.includes(filter)}
                isOpen={isOpen}
            >
                {
                    filter
                }
            </StyledFilterButton>
        </StyledFilter>
    );
};

export default Filter;
