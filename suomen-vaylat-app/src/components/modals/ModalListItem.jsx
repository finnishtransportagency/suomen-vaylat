import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const StyledModalListItemContainer = styled(motion.div)`
    display: flex;
    align-items: center;
`;

const StyledModalListItem = styled(motion.div)`
    position: relative;
    width: 100%;
    z-index: 1;
    min-height: 56px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: ${props => props.selectAction && "pointer"};
    background-color: ${props => props.color ? props.color : props.theme.colors.mainColor1};
    border-radius: 4px;
    margin-right: 8px;
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    @-moz-document url-prefix() {
        position: initial;
    }
    padding: 8px;
`;

const StyledModalListItemTitle = styled.div`
    user-select: none;
    max-width: 240px;
    color: ${(props) => props.theme.colors.mainWhite};
    margin: 0;
    padding: 0px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.1s ease-in;
`;

const StyledModalListItemSubTitle = styled.div`
    margin: 0;
    padding: 0px;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
`;

const StyledLeftContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledRightContent = styled.div`
    height: 100%;
    display: flex;
`;

const StyledCloseButton = styled.div`
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 8px;
    cursor: pointer;
    svg {
        font-size: 18px;
        color: white;
    }
`;

const StyleModalListItemIcon = styled.div`
    width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        font-size: 20px;
        color: ${(props) => props.theme.colors.mainWhite};
    }
    p {
        margin: 0;
        font-weight: bold;
        font-size: 22px;
        color: ${(props) => props.theme.colors.mainWhite};
    }
`;

const StyledSavedViewTitleContent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ModalListItem = ({
        index,
        id,
        type,
        title,
        subtitle,
        checkedValue,
        icon,
        selectAction,
        closeAction,
        removeAction,
        hoverInAction,
        hoverOutAction,
        data,
        color,
        children
    }) => {

    return <StyledModalListItemContainer
        transition={{
            duration: 0.2,
            type: "tween"
        }}
        initial={{
            opacity: 0,
            //height: 0,
        }}
        animate={{
            opacity: 1,
            height: "auto",
        }}
        exit={{
            opacity: 0,
            //height: 0,
        }}
    >
        <StyledModalListItem
            onClick={e => {
                e.preventDefault();
                selectAction && selectAction(data);
            }}
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
                height: 'auto',
            }}
            exit={{
                opacity: 0,
            }}
            whileHover={
                selectAction && {
                scale: 1.02,
                transition: { duration: 0.2 },
            }}
            color={color}
        >
            <StyledLeftContent>
                <StyleModalListItemIcon>
                    {icon ? (
                        <FontAwesomeIcon icon={icon} />
                    ) : (
                        <p>{title.charAt(0).toUpperCase()}</p>
                    )}
                </StyleModalListItemIcon>
                <StyledSavedViewTitleContent>
                    {title && (
                        <StyledModalListItemTitle>
                            {title}
                        </StyledModalListItemTitle>
                    )}
                    {subtitle && (
                        <StyledModalListItemSubTitle>
                            {subtitle}
                        </StyledModalListItemSubTitle>
                    )}
                </StyledSavedViewTitleContent>
            </StyledLeftContent>
            <StyledRightContent>
                {closeAction && (
                    <StyledCloseButton onClick={() => closeAction(id)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </StyledCloseButton>
                )}
            </StyledRightContent>
        </StyledModalListItem>
        {children && children}
    </StyledModalListItemContainer>

};

export default ModalListItem;
