import { useEffect } from 'react'; 
import styled from 'styled-components';

const StyledViewsContainer = styled.div`

`;


const Views = () => {

    useEffect(() => {
        let storage = window.localStorage;
        console.log(storage.getItem('views'));

        

    },[]);

    <StyledViewsContainer>
        StyledViewsContainer
    </StyledViewsContainer>

};

export default Views;