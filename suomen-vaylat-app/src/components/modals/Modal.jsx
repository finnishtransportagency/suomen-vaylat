import { useState, useContext } from 'react';
import { cloneElement } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { ReactReduxContext } from 'react-redux';
import { faTimes, faWindowMaximize, faWindowMinimize, faWindowRestore, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { setMinimizeGfi, setMaximizeGfi } from '../../state/slices/uiSlice';

import { isMobile, theme } from '../../theme/theme';
import ReactTooltip from 'react-tooltip';

const MIN_SCREEN_WIDTH_MAXIMIZE = 500;

const StyledModalBackdrop = styled(motion.div)`
    z-index: ${(props) => (props.type === 'warning' ? 9998 : 10)};
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
    cursor: pointer;
`;

const StyledModalWrapper = styled(motion.div)`
    z-index: ${(props) =>
        props.type === 'warning' ? 9999 : props.resize ? 4 : 9993};
    position: absolute;
    width: ${(props) => props.maximize? '100% !important' : 'auto'};
    height: ${(props) => props.maximize? '100%' : 'auto'};
    top: ${(props) => props.resize && '0px'};
    left: ${(props) => props.resize && '0px'};
    padding: ${props => props.maximize ? '4px 4px 4px 4px' : (props.resize || props.drag) && '8px 50px 50px 8px'};
    max-width: 100%;
    transform: ${props => props.maximize && 'initial !important'};
    @media ${(props) => props.theme.device.mobileL} {
        position: ${(props) =>
            props.fullScreenOnMobile ? 'fixed' : 'initial'};
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        padding: 0px;
        margin: ${(props) => props.fullScreenOnMobile === false && '8px'};
    };
`;

const StyledModal = styled(motion.div)`
    position: relative;
    width: ${(props) => props.maximize  || isMobile ? '100% !important' : props.width && props};
    height: ${(props) => props.maximize || isMobile ? '100% !important' : props.height && props.height};
    min-width: ${(props) => props.minWidth && props.minWidth};
    max-width: ${(props) => (props.maxWidth ? props.maxWidth : '100vw')};
    min-height: ${(props) => props.minHeight && props.minHeight};
    max-height: ${(props) => !props.maximize && 'calc(100vh - 100px)'};
    background-color: ${(props) => props.theme.colors.mainWhite};
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    resize: ${(props) => !props.maximize && props.resize && 'both'};
    overflow: hidden;
    @media ${(props) => props.theme.device.mobileL} {
        border-radius: ${(props) => props.fullScreenOnMobile && '0px'};
        max-width: unset;
        min-width: unset;
        max-height: unset;
    } ;
`;

const StyledModalHeader = styled.div`
    z-index: 10;
    min-height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${(props) =>
        props.type === 'warning'
            ? props.theme.colors.secondaryColor6
            : props.theme.colors.mainColor1};
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.2);
    padding-left: 16px;
    padding-right: 16px;
    cursor: ${(props) => (props.drag ? 'grab' : 'initial')};
    &&:active {
        cursor: ${(props) => (props.drag ? 'grabbing' : 'initial')};
        cursor: ${(props) => (props.drag ? '-moz-grabbing' : 'initial')};
        cursor: ${(props) => (props.drag ? '-webkit-grabbing' : 'initial')};
    }
    svg {
        color: ${(props) => props.theme.colors.mainWhite};
    }
    @media ${(props) => props.theme.device.mobileL} {
        pointer-events: none;
        svg {
            pointer-events: auto;
        }
    } ;
`;

const StyledModalTitle = styled.div`
    display: flex;
    align-items: center;
    user-select: none;
    p {
        margin: 0rem 1rem 0rem 0rem;
        font-size: 20px;
        font-weight: bold;
        color: ${(props) => props.theme.colors.mainWhite};
    }
    svg {
        font-size: 20px;
        margin-right: 16px;
    }
    @media ${(props) => props.theme.device.mobileL} {
        pointer-events: none;
        p {
            font-size: 16px;
        }
        svg {
            pointer-events: auto;
        }
    } ;
`;

const StyledRightContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledHeaderButton = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 8px;
    padding: 8px;
    cursor: pointer;
    svg {
        font-size: 18px;
    }
`;

const StyledCloseButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    cursor: pointer;
`;

const StyledCloseIcon = styled(FontAwesomeIcon)`
    font-size: 20px;
`;

const StyledModalContent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: ${(props) => (props.overflow ? 'auto' : 'hidden')};
`;

const Modal = ({
    hasHelp,
    helpId,
    helpContent,
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
    minWidth,
    maxWidth,
    overflow,
    minimizable,
    minimizeAction,
    maximizable,
    maximizeAction,
    minimize,
    maximize,
    children,
    minHeight,
    height = 'auto',
    width = 'auto'
}) => {
    const { store } = useContext(ReactReduxContext);
    const dragControls = useDragControls();

    const [localState, setLocalState] = useState(type === 'announcement');

    const handleAnnouncementModal = (selected, id) => {
        setLocalState(false);
        setTimeout(() => {
            closeAction(selected, id);
        }, [500]);
    };

    const clonedChildren = cloneElement(children, { handleAnnouncementModal }); // If announce modal type is passed as prop, add additional 'handleAnnouncementModal' function to modal children to handle modal state

    return (
        <AnimatePresence>
            {(isOpen || localState) && (
                <>
                    <StyledModalWrapper
                        key="modal"
                        drag={isMobile? false : drag}
                        dragConstraints={constraintsRef && constraintsRef}
                        dragControls={dragControls}
                        dragListener={false}
                        dragMomentum={false}
                        initial={{
                            y: 100,
                            opacity: 0,
                        }}
                        animate={{
                            y: minimize ? 100 : 0,
                            opacity: minimize ? 0 : 1,
                            pointerEvents: minimize ? 'none' : 'auto',
                        }}
                        exit={{
                            y: 100,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.4,
                            type: 'tween',
                        }}
                        fullScreenOnMobile={fullScreenOnMobile}
                        resize={resize}
                        maximize={maximize}
                        type={type}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}

                    >
                        <StyledModal
                            resize={resize}
                            minWidth={minWidth}
                            maxWidth={maxWidth}
                            fullScreenOnMobile={fullScreenOnMobile}
                            maximize={maximize}
                            minHeight={minHeight}
                            height={height}
                            width={width} 
                        >
                            <StyledModalHeader
                                type={type}
                                drag={drag}
                                onPointerDown={(e) => {
                                    drag && dragControls.start(e);
                                }}
                            >

                                <ReactTooltip backgroundColor={theme.colors.mainColor1} disable={isMobile} id={helpId} place='bottom' type='dark' effect='float'>
                                        {helpContent}
                                </ReactTooltip>

                                <StyledModalTitle>
                                    {titleIcon && (
                                        <FontAwesomeIcon icon={titleIcon} />
                                    )}
                                    <p>{title}</p>
                                </StyledModalTitle>
                                <StyledRightContent>
                                    {minimizable && (
                                            <StyledHeaderButton
                                                onClick={() => minimizeAction()}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faWindowMinimize}
                                                />
                                            </StyledHeaderButton>
                                    )}

                                    { maximizable && window.screen.width > MIN_SCREEN_WIDTH_MAXIMIZE && (
                                        <StyledHeaderButton
                                            onClick={(e) => {
                                                e.preventDefault();
                                                maximizeAction();
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={maximize ? faWindowRestore : faWindowMaximize}
                                            />
                                        </StyledHeaderButton>
                                    )}

                                    {hasHelp && (
                                        <StyledHeaderButton
                                            data-tip
                                            data-for={helpId}
                                        >
                                            <FontAwesomeIcon
                                                icon={faQuestion}
                                            />
                                        </StyledHeaderButton>
                                    )}
                                    
                                    <StyledCloseButton
                                        onClick={() => {
                                            type !== 'announcement' &&
                                                closeAction();
                                            type === 'announcement' &&
                                                handleAnnouncementModal(
                                                    null,
                                                    null
                                                );
                                        }}
                                    >
                                        <StyledCloseIcon icon={faTimes} />
                                    </StyledCloseButton>
                                </StyledRightContent>
                            </StyledModalHeader>
                            <StyledModalContent overflow={overflow}>
                                {!type === 'announcement'
                                    ? children
                                    : clonedChildren}
                            </StyledModalContent>
                        </StyledModal>
                    </StyledModalWrapper>
                    {backdrop && (
                        <StyledModalBackdrop
                            backdrop={backdrop}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 0.4,
                                type: 'tween',
                            }}
                            onClick={() => {
                                backdrop &&
                                closeAction &&
                                type !== 'announcement'
                                    ? closeAction()
                                    : type === 'announcement' &&
                                      handleAnnouncementModal(null, null);
                            }}
                            resize={resize}
                            type={type}
                        />
                    )}
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;
