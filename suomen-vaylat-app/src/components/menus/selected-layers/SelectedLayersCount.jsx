import styled from 'styled-components';

const StyledSelectedLayersCount = styled.div`
    margin-left: 10px;
    width: 25px;
    height: 21px;
    background-color: ${props => props.theme.colors.secondaryColor7};
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.colors.mainWhite};
    font-size: 14px;
    font-weight: 600;
`;

const SelectedLayersCount = ({count}) => {
    return (
        <StyledSelectedLayersCount>{count}</StyledSelectedLayersCount>
    );
};

export default SelectedLayersCount;