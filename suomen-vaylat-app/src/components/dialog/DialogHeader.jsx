import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const StyledHeaderContent = styled.div`
    position: sticky;
    top: 0px;
    height: 56px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color:  ${props => props.type === "warning" ? "#C73F00" : props.theme.colors.mainColor1};
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
    type,
    title,
    icon,
    hideWarn
}) => {

    return (
            <StyledHeaderContent type={type}>
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
                        onClick={() => hideWarn()}
                    />
              
            </StyledHeaderContent>
    );
 }

 export default DialogHeader;
