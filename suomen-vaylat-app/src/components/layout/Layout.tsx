import styled from 'styled-components';
import Content from './Content';
import Header from './Header';

const StyledLayout = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${(props: { theme: { colors: { maincolor1: any; }; }; }) => props.theme.colors.maincolor1};
    height: var(--app-height);
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