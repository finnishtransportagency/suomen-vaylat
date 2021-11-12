import styled from 'styled-components';
import Content from './Content';
import Header from './Header';

const StyledLayout = styled.div`
    display: flex;
    flex-direction: column;
    height: var(--app-height);
    background-color: ${(props: { theme: { colors: { mainColor1: any; }; }; }) => props.theme.colors.mainColor1};
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