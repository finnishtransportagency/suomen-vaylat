import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';

import { setIsSideMenuOpen } from '../../state/slices/uiSlice';

const StyledHeaderContent = styled.div`
    position: sticky;
    top: 0px;
    height: 56px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color:  ${props => props.theme.colors.mainColor1};
    padding: 16px;
    box-shadow: 2px 2px 4px 0px rgba(0,0,0,0.20);
    p {
        margin: 0px;
        font-size: 20px;
        font-weight: bold;
        color:  ${props => props.theme.colors.mainWhite};
    };
    svg {
        color: ${props => props.theme.colors.mainWhite};
    };
`;

const StyledTitleContent = styled.div`
    display: flex;
    align-items: center;
    svg {
        font-size: 20px;
        margin-right: 8px;
    }
`;

const StyledCloseIcon = styled(FontAwesomeIcon)`
    cursor: pointer;
    font-size: 20px;
`;

const DialogHeader = ({
    title,
    icon
}) => {

    const { store } = useContext(ReactReduxContext);

    const {
        isSideMenuOpen
    } =  useAppSelector((state) => state.ui);

    return (
            <StyledHeaderContent>
                <StyledTitleContent>
                    {
                        icon && <FontAwesomeIcon
                            icon={icon}
                        />
                    }
                    <p>{title}</p>
                </StyledTitleContent>
                    <StyledCloseIcon
                        icon={faTimes}
                        onClick={() => store.dispatch(setIsSideMenuOpen(!isSideMenuOpen))}
                    />
              
            </StyledHeaderContent>
    );
 }

 export default DialogHeader;
