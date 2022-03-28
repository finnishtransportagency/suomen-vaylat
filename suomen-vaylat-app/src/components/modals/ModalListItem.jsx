import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CheckBox from "../checkbox/CheckBox";

const StyledModalListItemContainer = styled(motion.div)`
    display: flex;
`;

const StyledModalListItem = styled(motion.div)`
    width: 100%;
    z-index: 1;
    min-height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: ${props => props.selectAction && "pointer"};
    background-color: ${props => props.theme.colors.mainColor1};
    border-radius: 4px;
    padding: 8px 0px 8px 0px;
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
    @-moz-document url-prefix() {
        position: initial;
    };
`;

const StyledModalListItemTitle = styled.p`
    user-select: none;
    max-width: 240px;
    color: ${props => props.theme.colors.mainWhite};
    margin: 0;
    padding: 0px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.1s ease-in;
`;

const StyledModalListItemSubTitle = styled.p`
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
    display: flex;
    align-items: center;
`;

const StyleModalListItemHeaderIcon = styled.div`
    width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        font-size: 20px;
        color: ${props => props.theme.colors.mainWhite};
    };
    p {
        margin: 0;
        font-weight: bold;
        font-size: 22px;
        color: ${props => props.theme.colors.mainWhite};
    }
`;

const StyledSavedViewTitleContent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;


const ModalListItem = ({
                           id,
                           layerId,
                           title,
                           subtitle,
                           checkedValue,
                           icon,
                           setCheckedCheckboxes,
                           selectAction,
                           removeAction,
                           hoverInAction,
                           hoverOutAction,
                           data
                       }) => {

    return <StyledModalListItemContainer
        transition={{
            duration: 0.2,
            type: "tween"
        }}
        initial={{
            opacity: 0,
            height: 0,
        }}
        animate={{
            opacity: 1,
            height: "auto",
        }}
        exit={{
            opacity: 0,
            height: 0,
        }}
    >
        <StyledModalListItem
            onClick={e => {
                e.preventDefault();
                selectAction && selectAction(data);
            }}
            selectAction={selectAction}
            onMouseEnter={() => {
                //setHovered(true);
                hoverInAction && hoverInAction(data);
            }}
            onMouseLeave={() => {
                //setHovered(false);
                hoverOutAction && hoverOutAction(data)
            }}
            whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
            }}
        >
            <StyledLeftContent>
                <StyleModalListItemHeaderIcon>
                    {
                        icon ?
                            <FontAwesomeIcon
                                icon={icon}
                            /> :
                            <p>{title.charAt(0).toUpperCase()}</p>
                    }
                </StyleModalListItemHeaderIcon>
                <StyledSavedViewTitleContent>
                    <StyledModalListItemTitle>
                        {title}
                    </StyledModalListItemTitle>
                    <StyledModalListItemSubTitle>
                        {subtitle}
                    </StyledModalListItemSubTitle>
                </StyledSavedViewTitleContent>

            </StyledLeftContent>
            <StyledRightContent>
                {/* <StyledSelectButton
                    //isOpen={isOpen}
                >
                </StyledSelectButton> */}
            </StyledRightContent>
        </StyledModalListItem>
        <CheckBox
            name='mapItemSelected'
            type='checkbox'
            layerId={layerId}
            setCheckedCheckboxes={setCheckedCheckboxes}
            checked={checkedValue}
        />
    </StyledModalListItemContainer>
};

export default ModalListItem;