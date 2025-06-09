import { useContext } from 'react';
import styled from 'styled-components';
import { ReactReduxContext, useSelector } from 'react-redux';
import { setTagLayers, setTags } from '../../../state/slices/rpcSlice';


const StyledTagButton = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: center;
    cursor: pointer;
    padding: 0px 6px 0px 6px;
    background-color: ${props => props.isSelected ? props.theme.colors.mainColor2 : props.theme.colors.mainWhite};
    margin: 2px;
    border: 1px solid ${props => props.theme.colors.mainColor2};
    border-radius: 20px;
    font-size: 13px;
    transition: all 0.1s ease-out;
    &:hover{
        background-color: ${props => props.theme.colors.mainColor3};
        color: ${props => props.theme.colors.mainWhite};
    };
    color: ${props => props.isSelected && props.theme.colors.mainWhite};
`;

const StyledTag = styled.span`

`;

export const Tag = ({ tag, isOpen }) => {
    const { store } = useContext(ReactReduxContext);
    const {
        channel,
        tags
    } = useSelector(state => state.rpc);

    const selectTag = (clickedTag) => {
        const isTagActive = tags.includes(clickedTag);
        let updatedTags = isTagActive 
            ? tags.filter(tag => tag !== clickedTag) 
            : [...tags, clickedTag];
    
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
        <StyledTag>
            <StyledTagButton
                onClick={() => selectTag(tag)}
                isSelected={tags.includes(tag)}
                isOpen={isOpen}
            >
                {
                    tag
                }
            </StyledTagButton>
        </StyledTag>
    );
};

export default Tag;
