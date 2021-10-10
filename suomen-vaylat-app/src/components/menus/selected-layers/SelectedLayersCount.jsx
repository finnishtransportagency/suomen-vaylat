import styled from 'styled-components';

const StyledSelectedLayersCount = styled.div`
    width: 25px;
    height: 21px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.secondaryColor7};
    margin-left: 10px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 600;
`;

const SelectedLayersCount = ({count}) => {
    return (
        <StyledSelectedLayersCount>{count}</StyledSelectedLayersCount>
    );
};

export default SelectedLayersCount;