import React, { cloneElement, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
  faTimes,
  faWindowMaximize,
  faWindowMinimize,
  faWindowRestore,
  faQuestion
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isMobile, theme } from '../../theme/theme';
import ReactTooltip from 'react-tooltip';

const MIN_SCREEN_WIDTH_MAXIMIZE = 500;

const StyledDialogBackdrop = styled(motion.div)`
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

const StyledDialogWrapper = styled(motion.div)`
  z-index: ${(props) =>
    props.type === 'warning' ? 9999 : props.resize ? 100 : 9993};
  position: absolute;
  width: ${(props) => (props.maximize ? '100% !important' : 'auto')};
  height: ${(props) => (props.maximize ? '100%' : 'auto')};
  top: ${(props) => (props.top ? props.top : 'auto')};
  left: ${(props) => (props.left ? props.left : 'auto')};
  bottom: ${(props) => (props.bottom ? props.bottom : 'auto')};
  right: ${(props) => (props.right ? props.right : 'auto')};
  padding: ${(props) =>
    props.maximize ? '4px' : props.resize || props.drag ? '8px' : '0'};
  max-width: 100%;
  transform: ${(props) => (props.maximize ? 'initial !important' : 'none')};
  @media ${(props) => props.theme.device.mobileL} {
    position: ${(props) => (props.fullScreenOnMobile ? 'fixed' : 'initial')};
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    padding: 0px;
    margin: ${(props) => (props.fullScreenOnMobile === false ? '8px' : '0')};
  }
`;

const StyledDialog = styled(motion.div)`
  position: relative;
  width: ${(props) =>
    props.maximize || isMobile
      ? '100% !important'
      : props.width
      ? props.width
      : 'auto'};
  height: ${(props) =>
    props.maximize || isMobile
      ? '100% !important'
      : props.height
      ? props.height
      : 'auto'};
  min-width: ${(props) => (props.minWidth ? props.minWidth : 'auto')};
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : '100vw')};
  min-height: ${(props) => (props.minHeight ? props.minHeight : 'auto')};
  max-height: ${(props) => (!props.maximize ? 'calc(100vh - 100px)' : '100%')};
  background-color: ${(props) => props.theme.colors.mainWhite};
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  resize: ${(props) => (!props.maximize && props.resize ? 'both' : 'none')};
  overflow: hidden;
  @media ${(props) => props.theme.device.mobileL} {
    border-radius: ${(props) => (props.fullScreenOnMobile ? '0px' : '4px')};
    max-width: unset;
    min-width: unset;
    max-height: unset;
  }
`;

const StyledDialogHeader = styled.div`
  z-index: 10;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) =>
    props.type === 'warning'
      ? props.theme.colors.secondaryColorDarkOrange
      : props.theme.colors.mainColor1Selected};
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
  }
`;

const StyledDialogTitle = styled.div`
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
  }
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

const StyledDialogContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: ${(props) => (props.overflow ? 'auto' : 'hidden')};
`;

const Dialog = ({
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
  minWidth,
  maxWidth,
  top,
  bottom,
  right,
  left,
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
  width = 'auto',
  style = {}
}) => {
  const dragControls = useDragControls();
  const [localState, setLocalState] = useState(type === 'announcement');

  const handleAnnouncementDialog = (selected, id) => {
    setLocalState(false);
    setTimeout(() => {
      if (closeAction) closeAction(selected, id);
    }, 500);
  };

  // Only clone if children is a valid React element
  const clonedChildren = React.isValidElement(children)
    ? cloneElement(children, { handleAnnouncementDialog })
    : children;

  const renderDialogIcon = (titleIcon) => {
    if (titleIcon && React.isValidElement(titleIcon)) {
      return titleIcon;
    }
    if (titleIcon && typeof titleIcon === 'object') {
      return <FontAwesomeIcon icon={titleIcon} />;
    }
    return null;
  };

  // Variants/props for wrapper and backdrop that ensure pointerEvents/display are toggled on exit
  const wrapperInitial = {
    y: 100,
    opacity: 0,
    pointerEvents: 'none',
    display: 'none'
  };
  const wrapperAnimate = {
    y: minimize ? 100 : 0,
    opacity: minimize ? 0 : 1,
    pointerEvents: minimize ? 'none' : 'auto',
    display: 'block'
  };
  const wrapperExit = {
    y: 100,
    opacity: 0,
    transitionEnd: { pointerEvents: 'none', display: 'none' }
  };

  const backdropInitial = {
    opacity: 0,
    pointerEvents: 'none',
    display: 'none'
  };
  const backdropAnimate = {
    opacity: 1,
    pointerEvents: 'auto',
    display: 'block'
  };
  const backdropExit = {
    opacity: 0,
    transitionEnd: { pointerEvents: 'none', display: 'none' }
  };

  return (
    <AnimatePresence initial={false}>
      {(isOpen || localState) && (
        <>
          <StyledDialogWrapper
            key={`dialog_wrapper_${title}`}
            id={`dialog_wrapper_${title}`}
            className="dialog_wrapper"
            drag={isMobile ? false : drag}
            dragConstraints={constraintsRef && constraintsRef}
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            initial={wrapperInitial}
            animate={wrapperAnimate}
            exit={wrapperExit}
            transition={{ duration: 0.4, type: 'tween' }}
            fullScreenOnMobile={fullScreenOnMobile}
            resize={resize}
            maximize={maximize}
            type={type}
            onClick={(e) => e.stopPropagation()}
            top={top}
            bottom={bottom}
            right={right}
            left={left}
            style={style}
          >
            <StyledDialog
              id={`dialog_${title}`}
              resize={resize}
              minWidth={minWidth}
              maxWidth={maxWidth}
              fullScreenOnMobile={fullScreenOnMobile}
              maximize={maximize}
              minHeight={minHeight}
              height={height}
              width={width}
            >
              <StyledDialogHeader
                id={`dialog_header_${title}`}
                type={type}
                drag={drag}
                onPointerDown={(e) => {
                  drag && dragControls.start(e);
                }}
              >
                {hasHelp && (
                  <ReactTooltip
                    backgroundColor={theme.colors.mainColor1}
                    disable={isMobile}
                    id={helpId}
                    place="bottom"
                    type="dark"
                    effect="float"
                  >
                    {helpContent}
                  </ReactTooltip>
                )}

                <StyledDialogTitle>
                  {renderDialogIcon(titleIcon)}
                  <p>{title}</p>
                </StyledDialogTitle>

                <StyledRightContent>
                  {minimizable && (
                    <StyledHeaderButton
                      onClick={() => minimizeAction && minimizeAction()}
                    >
                      <FontAwesomeIcon icon={faWindowMinimize} />
                    </StyledHeaderButton>
                  )}

                  {maximizable &&
                    window.screen.width > MIN_SCREEN_WIDTH_MAXIMIZE && (
                      <StyledHeaderButton
                        onClick={(e) => {
                          e.preventDefault();
                          maximizeAction && maximizeAction();
                        }}
                      >
                        <FontAwesomeIcon
                          icon={maximize ? faWindowRestore : faWindowMaximize}
                        />
                      </StyledHeaderButton>
                    )}

                  {hasHelp && (
                    <StyledHeaderButton data-tip data-for={helpId}>
                      <FontAwesomeIcon icon={faQuestion} />
                    </StyledHeaderButton>
                  )}

                  <StyledCloseButton
                    onClick={() => {
                      if (type !== 'announcement') {
                        closeAction && closeAction();
                      } else {
                        handleAnnouncementDialog(null, null);
                      }
                    }}
                  >
                    <StyledCloseIcon icon={faTimes} />
                  </StyledCloseButton>
                </StyledRightContent>
              </StyledDialogHeader>

              <StyledDialogContent overflow={overflow}>
                {type !== 'announcement' ? children : clonedChildren}
              </StyledDialogContent>
            </StyledDialog>
          </StyledDialogWrapper>

          {backdrop && (
            <StyledDialogBackdrop
              key={`dialog_backdrop_${title}`}
              initial={backdropInitial}
              animate={backdropAnimate}
              exit={backdropExit}
              transition={{ duration: 0.4, type: 'tween' }}
              onClick={() => {
                if (backdrop && closeAction && type !== 'announcement') {
                  closeAction();
                } else if (type === 'announcement') {
                  handleAnnouncementDialog(null, null);
                }
              }}
              type={type}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default Dialog;
