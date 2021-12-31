import { useState } from 'react';
import { cloneElement} from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledModalBackdrop = styled(motion.div)`
    z-index: ${props => props.resize ? 3 : 9992};
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
`;

const StyledModalWrapper = styled(motion.div)`
    z-index: ${props => props.resize ? 4 : 9993};
    position: fixed;
    padding: ${props => props.resize && "50px"};
    @media ${props => props.theme.device.mobileL} {
        position:  ${props => props.fullScreenOnMobile ? "fixed" : "initial"};
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        border-radius: ${props => props.fullScreenOnMobile && "0px"};
        padding: 0px;
        margin: ${props => props.fullScreenOnMobile === false && "8px"};
    };
`;

const StyledModal = styled(motion.div)`
    position: relative;
    width: 100%;
    max-width: ${props => props.maxWidth ? props.maxWidth+"px" : "100vw"};
    height: 100%;
    max-height: calc(100vh - 100px);
    background-color:  ${props => props.theme.colors.mainWhite};
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    resize: ${props => props.resize && "both"};
    overflow: auto;
    @media ${props => props.theme.device.mobileL} {
        max-height: unset;
    };
`;

const StyledModalHeader = styled.div`
    min-height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color:  ${props => props.type === "warning" ? "#C73F00" : props.theme.colors.mainColor1};
    box-shadow: 2px 2px 4px 0px rgba(0,0,0,0.20);
    padding-right: 16px;
    cursor:  ${props => props.drag ? "grab" : "initial"};
    &&:active {
        cursor: ${props => props.drag ? "grabbing" : "initial"};
        cursor: ${props => props.drag ? "-moz-grabbing" : "initial"};
        cursor:  ${props => props.drag ? "-webkit-grabbing" : "initial"};
    };
    svg {
        color: ${props => props.theme.colors.mainWhite};
    };
    @media ${props => props.theme.device.mobileL} {
        pointer-events: none;
        svg {
            pointer-events: auto;
        };
    };
`;

const StyledModalTitle = styled.div`
    display: flex;
    align-items: center;
    padding: 16px 16px 16px 16px;
    p {
        margin: 0px;
        font-size: 20px;
        font-weight: bold;
        color:  ${props => props.theme.colors.mainWhite};
    };
    svg {
        font-size: 20px;
        margin-right: 16px;
    };
    @media ${props => props.theme.device.mobileL} {
        pointer-events: none;
        p {
            font-size: 16px;
        };
        svg {
            pointer-events: auto;
        };
    };
`;

const StyledCloseButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    //padding: 16px;
    cursor: pointer;
`;

const StyledCloseIcon = styled(FontAwesomeIcon)`
    font-size: 20px;
`;

const StyledModalContent = styled.div`
    height: 100%;
    overflow: auto;
`;

const Modal = ({
    constraintsRef,
    drag,
    resize,
    backdrop,
    fullScreenOnMobile,
    titleIcon,
    title,
    type,
    closeAction,
    isOpen,
    id,
    maxWidth,
    children
}) => {

    const dragControls = useDragControls();

    const [localState, setLocalState] = useState(type === "announcement");

    const handleAnnouncementModal = (selected, id) => {
        setLocalState(false);
        setTimeout(() => {
            closeAction(selected, id);
        },[500])
    };
    
    const clonedChildren = cloneElement(children, { handleAnnouncementModal  }); // If announce modal type is passed as prop, add additional "handleAnnouncementModal" function to modal children to handle modal state

    return (
        <AnimatePresence>
            { (isOpen || localState) && 
            <>
                <StyledModalWrapper
                        key="modal"
                        drag={drag}
                        dragConstraints={constraintsRef}
                        dragControls={dragControls}
                        dragListener={false}
                        dragMomentum={false}
                        initial={{ y: 100, filter: "blur(1px)", opacity: 0 }}
                        animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                        exit={{ y: 100, filter: "blur(10px)", opacity: 0 }}
                        transition={{
                            duration: 0.4,
                            type: "tween"
                        }}
                        fullScreenOnMobile={fullScreenOnMobile}
                        resize={resize}
                        onClick={e => {
                            e.stopPropagation();
                        }}
                >
                    <StyledModal
                        resize={resize}
                        maxWidth={maxWidth}
                    >
                        <StyledModalHeader
                            type={type}
                            drag={drag}
                            onPointerDown={(e) => {
                                drag && dragControls.start(e)
                            }}
                        >
                            <StyledModalTitle>
                                {
                                    titleIcon && <FontAwesomeIcon
                                        icon={titleIcon}
                                    />
                                }
                                <p>{title}</p>
                            </StyledModalTitle>

                           <StyledCloseButton
                                onClick={() => {
                                    type !== "announcement" && closeAction();
                                    type === "announcement" && handleAnnouncementModal(null, null);
                                }}
                            >
                                <StyledCloseIcon
                                    icon={faTimes}
                                />
                            </StyledCloseButton>

                        </StyledModalHeader>
                        <StyledModalContent>
                            {!type === "announcement" ? children : clonedChildren}
                        </StyledModalContent>
                    </StyledModal>
                </StyledModalWrapper>
                { backdrop && 
                    <StyledModalBackdrop
                        backdrop={backdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.4,
                            type: "tween"
                        }}
                        onClick={() => {
                            backdrop && closeAction && type !== "announcement" ? closeAction() : type === "announcement" && handleAnnouncementModal(null, null);
                        }}
                        resize={resize}
                    >
                    </StyledModalBackdrop>
                }
            </>
            }

        </AnimatePresence>
    )
};

export default Modal;