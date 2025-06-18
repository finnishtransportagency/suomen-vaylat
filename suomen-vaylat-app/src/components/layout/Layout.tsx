import styled from 'styled-components';
import Content from './Content';
import Header from './Header';

const StyledLayout = styled.div`
    position: fixed;
    width: 100vw;
    display: flex;
    flex-direction: column;
    height: var(--app-height);
    background; transparent;
`;

export const Layout = () => {
    return (
        <StyledLayout>
            <Header/>
            <Content/>
        </StyledLayout>
    );
 }

 export default Layout;