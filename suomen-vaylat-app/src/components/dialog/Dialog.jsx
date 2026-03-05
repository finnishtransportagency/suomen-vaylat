// src/components/dialog/Dialog.jsx
import React, { useEffect, useMemo, useRef, useState, cloneElement } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'motion/react';
import { Rnd } from 'react-rnd';
import {
  faTimes,
  faWindowMaximize,
  faWindowMinimize,
  faWindowRestore,
  faQuestion
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isMobile, theme } from '../../theme/theme';
import { Tooltip } from 'react-tooltip';

// Used when deciding if we even show the maximize button
const MIN_SCREEN_WIDTH_MAXIMIZE = 500;

/* ---------------- Styled ---------------- */

const StyledRnd = styled(Rnd)`
  /* z-index is controlled by inline style from the component to support stacking */
  padding: ${(props) =>
    props.$maximize
      ? '4px'
      : (props.$resize || props.$drag) && !props.$maximize
      ? '8px'
      : '0'};
  max-width: 100%;
`;

const StyledDialog = styled.div`
  position: relative;
  width: ${(props) =>
    props.$maximize || isMobile ? '100% !important' : props.$width || 'auto'};
  height: ${(props) =>
    props.$maximize || isMobile ? '100% !important' : props.$height || 'auto'};
  min-width: ${(props) => props.$minWidth || 'auto'};
  max-width: ${(props) => props.$maxWidth || '100vw'};
  min-height: ${(props) => props.$minHeight || 'auto'};
  max-height: ${(props) => (!props.$maximize ? 'calc(100vh - 100px)' : '100vh')};
  background-color: ${(props) => props.theme.colors.mainWhite};
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media ${(props) => props.theme.device.mobileL} {
    border-radius: ${(props) => (props.$fullScreenOnMobile ? '0px' : '4px')};
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
    props.$type === 'warning'
      ? props.theme.colors.secondaryColorDarkOrange
      : props.theme.colors.mainColor1Selected};
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.2);
  padding: 0 16px;

  /* Make this the drag handle for react-rnd */
  &.dialog-header {
    cursor: ${(props) => (props.$drag ? 'grab' : 'default')};
    &:active {
      cursor: ${(props) => (props.$drag ? 'grabbing' : 'default')};
    }
  }

  svg {
    color: ${(props) => props.theme.colors.mainWhite};
  }
  @media ${(props) => props.theme.device.mobileL} {
    pointer-events: none;
    svg { pointer-events: auto; }
  }
`;

const StyledDialogTitle = styled.div`
  display: flex;
  align-items: center;
  user-select: none;

  p {
    margin: 0 1rem 0 0;
    font-size: 20px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.mainWhite};
  }
  svg { font-size: 20px; margin-right: 16px; }

  @media ${(props) => props.theme.device.mobileL} {
    p { font-size: 16px; }
  }
`;

const StyledRightContent = styled.div`
  display: flex;
  align-items: center;
`;

const StyledHeaderButton = styled.div`
  height: 100%;
  display: flex; align-items: center; justify-content: center;
  margin-right: 8px;
  padding: 8px;
  cursor: pointer;
  svg { font-size: 18px; }
`;

const StyledCloseButton = styled.div`
  display: flex; align-items: center; justify-content: center;
  padding: 8px;
  cursor: pointer;
`;

const StyledCloseIcon = styled(FontAwesomeIcon)` font-size: 20px; `;

const StyledDialogContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

/* ---------------- Utils ---------------- */

const toPxNumber = (v) => {
  if (v == null) return null;
  if (typeof v === 'number') return v;
  const m = String(v).match(/(-?\d+(\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
};
const numberOr = (v, fb) => {
  const n = toPxNumber(v);
  return Number.isFinite(n) ? n : fb;
};

/* A tiny global z-index counter so the last focused dialog comes on top */
let __zCounter = 9993;

/* ---------------- Component ---------------- */

const Dialog = ({
  hasHelp,
  helpId,
  helpContent,
  drag = true,
  resize = true,
  fullScreenOnMobile = false,
  titleIcon,
  title,
  type,                      // 'normal' | 'warning' | 'announcement'
  closeAction,
  isOpen,
  minWidth,
  maxWidth,
  top,
  bottom,
  right,
  left,
  minimizable,
  minimizeAction,
  maximizable,
  maximizeAction,
  minimize = false,
  maximize = false,
  children,
  minHeight,
  height = 'auto',
  width = 'auto',
  style = {},
  /** Optional: completely replace the header UI.
   *  If provided, make sure the root element has className="dialog-header"
   *  so dragging still works. */
  customHeader = null,
  /** Optional: restrict which edges can resize (if not provided, all edges when `resize` is true) */
  enableResizingSides,
}) => {
  const [localState, setLocalState] = useState(type === 'announcement');

  const handleAnnouncementDialog = (selected, id) => {
    setLocalState(false);
    setTimeout(() => {
      closeAction?.(selected, id);
    }, 500);
  };

  const renderedChildren =
    type !== 'announcement'
      ? children
      : cloneElement(children, { handleAnnouncementDialog });

  const renderDialogIcon = (icon) => {
    if (icon && React.isValidElement(icon)) return icon;
    if (icon && typeof icon === 'object') return <FontAwesomeIcon icon={icon} />;
    return null;
  };

  // --- initial size/position (convert your props like width/bottom/right) ---
  const initialW = useMemo(
    () => numberOr(width, numberOr(minWidth, 600)),
    [width, minWidth]
  );
  const initialH = useMemo(
    () => numberOr(height, numberOr(minHeight, 400)),
    [height, minHeight]
  );
  const initialX = useMemo(() => {
    const l = toPxNumber(left);
    const r = toPxNumber(right);
    if (Number.isFinite(l)) return l;
    if (Number.isFinite(r)) return Math.max(0, window.innerWidth - initialW - r);
    return 16; // default offset from left
  }, [left, right, initialW]);
  const initialY = useMemo(() => {
    const t = toPxNumber(top);
    const b = toPxNumber(bottom);
    if (Number.isFinite(t)) return t;
    if (Number.isFinite(b)) return Math.max(0, window.innerHeight - initialH - b);
    return 16; // default offset from top
  }, [top, bottom, initialH]);

  // Controlled RND state
  const [size, setSize] = useState({ width: initialW, height: initialH });
  const [position, setPosition] = useState({ x: initialX, y: initialY });

  // Stacking: bump zIndex on focus
  const [zIndex, setZIndex] = useState(++__zCounter);
  const bringToFront = () => {
    console.log("?", __zCounter);
        setZIndex(++__zCounter)
    };
  // Save/restore across maximize toggles
  const prevRef = useRef({ size, position });

  useEffect(() => {
    if (maximize) {
      prevRef.current = { size, position };
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight });
    } else {
      const { size: ps, position: pp } = prevRef.current || {};
      if (ps && pp) {
        setSize(ps);
        setPosition(pp);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maximize]);

  // Clamp inside viewport on window resize
  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (maximize) {
        setSize({ width: vw, height: vh });
        setPosition({ x: 0, y: 0 });
        return;
      }

      setSize((s) => ({
        width: Math.min(s.width, vw),
        height: Math.min(s.height, vh),
      }));
      setPosition((p) => ({
        x: Math.min(Math.max(p.x, 0), Math.max(0, vw - Math.min(size.width, vw))),
        y: Math.min(Math.max(p.y, 0), Math.max(0, vh - Math.min(size.height, vh))),
      }));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maximize, size.width, size.height]);

  const bounds = 'window';

  const disableDragging =
    !drag || minimize || maximize || (isMobile && fullScreenOnMobile);

  const canResize =
    resize && !minimize && !maximize && !(isMobile && fullScreenOnMobile);

  const resizeConfig =
    typeof enableResizingSides === 'object' ? enableResizingSides : canResize;

  // Default header (unless customHeader is provided)
  const Header = 
    <StyledDialogHeader
      id={'dialog_header_' + title}
      $type={type}
      $drag={drag && !disableDragging}
      className="dialog-header"
    >
      <Tooltip
        anchorSelect={'#' + helpId}
        style={{ backgroundColor: theme.colors.mainColor1 }}
        disable={isMobile}
        id={helpId + '_tooltip'}
        place="bottom"
        effect="float"
      >
        {helpContent}
      </Tooltip>

      <StyledDialogTitle>
        {renderDialogIcon(titleIcon)}
        <p>{title}</p>
      </StyledDialogTitle>

      <StyledRightContent>
        {minimizable && (
          <StyledHeaderButton onClick={() => minimizeAction?.()}>
            <FontAwesomeIcon icon={faWindowMinimize} />
          </StyledHeaderButton>
        )}

        {maximizable && window.innerWidth > MIN_SCREEN_WIDTH_MAXIMIZE && (
          <StyledHeaderButton
            onClick={(e) => {
              e.preventDefault();
              maximizeAction?.();
            }}
          >
            <FontAwesomeIcon icon={maximize ? faWindowRestore : faWindowMaximize} />
          </StyledHeaderButton>
        )}

        {hasHelp && (
          <StyledHeaderButton id={helpId}>
            <FontAwesomeIcon icon={faQuestion} />
          </StyledHeaderButton>
        )}

        <StyledCloseButton
          onClick={() => {
            type !== 'announcement' && closeAction?.();
            type === 'announcement' && handleAnnouncementDialog(null, null);
          }}
        >
          <StyledCloseIcon icon={faTimes} />
        </StyledCloseButton>
      </StyledRightContent>
    </StyledDialogHeader>
  ;

  return (
    <AnimatePresence>
      {(isOpen || localState) && (
        <>
          {/* Motion wrapper keeps your entry/minimize animation.
              Set pointer-events so the Rnd surface catches events. */}
            <StyledRnd
              $resize={resize}
              $maximize={maximize}
              $drag={drag}
              size={size}
              position={position}
              bounds={bounds}
              onDragStop={(_, d) => setPosition({ x: d.x, y: d.y })}
              onResize={(_, __, ref, ___, newPosition) => {
                setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
                setPosition(newPosition);
              }}
              dragHandleClassName="dialog-header"
              disableDragging={disableDragging}
              enableResizing={resizeConfig}
              style={{ zIndex: zIndex, ...style }}
              onMouseDown={bringToFront}
            >
              <StyledDialog
                id={'dialog_' + title}
                $minWidth={minWidth}
                $maxWidth={maxWidth}
                $minHeight={minHeight}
                $fullScreenOnMobile={fullScreenOnMobile}
                $maximize={maximize}
                $width={width}
                $height={height}
              >
                {Header}
                <StyledDialogContent>
                  {renderedChildren}
                </StyledDialogContent>
              </StyledDialog>
            </StyledRnd>
        </>
      )}
    </AnimatePresence>
  );
};

export default Dialog;