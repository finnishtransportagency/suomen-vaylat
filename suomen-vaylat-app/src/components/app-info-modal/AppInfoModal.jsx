import { useContext } from 'react';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import { ReactReduxContext } from "react-redux";
import styled from 'styled-components';
import { useAppSelector } from "../../state/hooks";
import { setIsInfoOpen } from "../../state/slices/uiSlice";
import strings from "../../translations";

const StyledModal = styled(Modal)`
    position: absolute;
    width: 100%;
    max-width: 800px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${props => props.theme.colors.mainWhite};
    box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.20);
    border-radius: 4px;
    overflow: auto;
    @media ${props => props.theme.device.mobileL} {
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        transform: none;
    };
`;

const StyledContent = styled.div`
    max-width: 800px;
    padding: 32px;
    border-radius: 4px;
`;

const StyledHeader = styled.div`
    position: sticky;
    top: 0px;
    padding: 16px;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.mainColor1};
    height: 56px;
    display: flex;
    align-items: center;
    box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.20);
`;

const StyledModalTitle = styled.p`
    margin: 0;
    font-size: 20px;
    font-weight: bold;
`;

const StyledModalCloseIcon = styled.div`
    min-width: 28px;
    min-height: 28px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 20px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.mainColor2};
        }
    };
`;

export const AppInfoModal = () => {
    const { store } = useContext(ReactReduxContext);
    const isInfoOpen = useAppSelector((state) => state.ui.isInfoOpen);
    const headingText = strings.appInfo.headingText.bold()
    const mainText = strings.appInfo.mainText
    const content = <div dangerouslySetInnerHTML={{__html: headingText + "<br><br>" + mainText}}></div>
    const title = strings.appInfo.title

    function closeModal() {
        store.dispatch(setIsInfoOpen(false));
    };

    return (
        <StyledModal
            isOpen={isInfoOpen}
            onRequestClose={() => closeModal()}
        >
            <StyledHeader className="modal-header">
                <StyledModalTitle>{title}</StyledModalTitle>
                <StyledModalCloseIcon
                    onClick={() => {
                        closeModal();
                    }} title='Sulje'>
                    <FontAwesomeIcon
                        icon={faTimes}
                    />
                </StyledModalCloseIcon>
            </StyledHeader>
            <StyledContent>
                {content}
            </StyledContent>
        </StyledModal>
    );
};

export default AppInfoModal;