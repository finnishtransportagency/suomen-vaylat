import { useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const StyledModalBackdrop = styled(motion.div)`
    z-index: 9999;
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    background-color: ${props => props.backdrop ? 'rgba(0, 0, 0, 0.3)' : 'transparent'};
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: ${props => props.backdrop ? "auto" : "none"};
    opacity: 0;
`;

const StyledModalWrapper = styled(motion.div)`
    width: 100%;
    height: auto;
    max-width: 400px;
    max-height: 600px;
    background-color:  ${props => props.theme.colors.mainWhite};
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    overflow: hidden;
    pointer-events: auto;
    margin: 8px;
    @media ${props => props.theme.device.mobileL} {
        max-width: 100%;
        max-height: 100%;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
    };
`;

const StyledModalHeader = styled.div`
    position: sticky;
    top: 0px;
    height: 56px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color:  ${props => props.type === "warning" ? "#C73F00" : props.theme.colors.mainColor1};
    box-shadow: 2px 2px 4px 0px rgba(0,0,0,0.20);
    p {
        margin: 0px;
        font-size: 20px;
        font-weight: bold;
        color:  ${props => props.theme.colors.mainWhite};
    };
    cursor:  ${props => props.drag ? "grab" : "initial"};
    &&:active {
        cursor: ${props => props.drag ? "grabbing" : "initial"};
        cursor: ${props => props.drag ? "-moz-grabbing" : "initial"};
        cursor:  ${props => props.drag ? "-webkit-grabbing" : "initial"};
    };
    svg {
        color: ${props => props.theme.colors.mainWhite};
    };
`;

const StyledModalTitle = styled.div`
    display: flex;
    align-items: center;
    padding: 16px;
    svg {
        font-size: 20px;
        margin-right: 16px;
    };
`;

const StyledCloseButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    cursor: pointer;
`;

const StyledCloseIcon = styled(FontAwesomeIcon)`
    font-size: 20px;
`;

const StyledModalContent = styled.div`
    margin: 18px;
    overflow: auto;
`;

const Modal = ({
    drag,
    backdrop,
    icon,
    title,
    type,
    closeAction,
    isOpen,
    children
}) => {

    const constraintsRef = useRef(null);

    const dragControls = useDragControls();

    return (
        <AnimatePresence>
            {isOpen && 
                <StyledModalBackdrop
                    ref={constraintsRef}
                    backdrop={backdrop}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.3,
                        type: "tween"
                    }}
                    onClick={(e) => {
                        backdrop && closeAction()
                    }}
                >
                    <StyledModalWrapper
                        drag={drag}
                        dragConstraints={constraintsRef}
                        dragControls={dragControls}
                        dragListener={false}
                        dragTransition={{
                            bounceStiffness: 1000,
                            bounceDamping: 40
                        }}
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        transition={{
                            duration: 0.3,
                            type: "tween"
                        }}
                        onClick={e => {
                            e.stopPropagation();
                        }}
                    >
                        <StyledModalHeader
                            type={type}
                            drag={drag}
                            onPointerDown={(e) => {
                                dragControls.start(e)
                            }}
                        >
                            <StyledModalTitle>
                                {
                                    icon && <FontAwesomeIcon
                                        icon={icon}
                                    />
                                }
                                <p>{title}</p>
                            </StyledModalTitle>
                            <StyledCloseButton
                                onClick={() => closeAction()}
                            >
                                <StyledCloseIcon
                                    icon={faTimes}
                                />
                            </StyledCloseButton>
                        </StyledModalHeader>
                        <StyledModalContent>
                            {children}
                        </StyledModalContent>
                    </StyledModalWrapper>
                </StyledModalBackdrop>
            }

        </AnimatePresence>
    )
};

export default Modal;