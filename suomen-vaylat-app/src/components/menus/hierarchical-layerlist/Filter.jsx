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

    const selectFilter = (clickedFilter) => {
        const isFilterActive = tags.includes(clickedFilter);
        let updatedTags = isFilterActive 
            ? tags.filter(tag => tag !== clickedFilter) 
            : [...tags, clickedFilter];
    
        // Use Promise.all to fetch layers for all tags in parallel
        const layerPromises = updatedTags.map(tag => {
            return new Promise(resolve => {
                channel.getTagLayers([tag], data => {
                    resolve(data);
                });
            });
        });
    
        Promise.all(layerPromises).then(allLayers => {
            // Combine all the layers and remove duplicates
            const combinedLayers = Array.from(new Set(allLayers.flat()));
    
            // Update the store
            store.dispatch(setTagLayers(combinedLayers));
            store.dispatch(setTags(updatedTags));
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
