import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  cloneElement
} from 'react';
import styled from 'styled-components';
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

/* ---------------- Constants ---------------- */

const MIN_SCREEN_WIDTH_MAXIMIZE = 500;

/* ---------------- Styled ---------------- */

const StyledRnd = styled(Rnd)``;

const Panel = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(p) => p.theme.colors.mainWhite};
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media ${(p) => p.theme.device.mobileL} {
    border-radius: ${(p) => (p.$fullScreenOnMobile ? '0px' : '4px')};
    max-width: unset;
    min-width: unset;
    max-height: unset;
  }
`;

const Header = styled.div`
  z-index: 10;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(p) =>
    p.$type === 'warning'
      ? p.theme.colors.secondaryColorDarkOrange
      : p.theme.colors.mainColor1Selected};
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.2);
  padding: 0 16px;

  &.dialog-header {
    cursor: ${(p) => (p.$drag ? 'grab' : 'default')};
    &:active {
      cursor: ${(p) => (p.$drag ? 'grabbing' : 'default')};
    }
  }

  svg {
    color: ${(p) => p.theme.colors.mainWhite};
  }

  @media ${(p) => p.theme.device.mobileL} {
    pointer-events: none;
    svg {
      pointer-events: auto;
    }
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  user-select: none;

  p {
    margin: 0 1rem 0 0;
    font-size: 20px;
    font-weight: bold;
    color: ${(p) => p.theme.colors.mainWhite};
  }

  svg {
    font-size: 20px;
    margin-right: 16px;
  }

  @media ${(p) => p.theme.device.mobileL} {
    p {
      font-size: 16px;
    }
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderBtn = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  padding: 8px;
  cursor: pointer;

  svg {
    font-size: 18px;
  }
`;

const CloseBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  cursor: pointer;
`;

const CloseIcon = styled(FontAwesomeIcon)`
  font-size: 20px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const StyledDialogBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
`;

/* ---------------- Utils ---------------- */

const clamp = (v, minV, maxV) => Math.min(maxV ?? v, Math.max(minV ?? v, v));

/**
 * Convert CSS length to px.
 * Supports: px | % | vw | vh | rem | em | number | 'auto'
 * - % / vw / vh are relative to viewport (Rnd is bounded to 'window')
 * - rem is relative to <html> computed font-size
 * - em  is relative to the dialog panel's computed font-size
 */
const toPx = (
  val,
  axis = 'x',
  bounds = { vw: window.innerWidth, vh: window.innerHeight },
  bases = { rem: 16, em: 16 }
) => {
  if (val == null) return null;
  if (typeof val === 'number') return val;

  const s = String(val).trim().toLowerCase();
  if (s === 'auto') return null;
  if (s.endsWith('px')) return parseFloat(s);
  if (s.endsWith('vw')) return (parseFloat(s) / 100) * bounds.vw;
  if (s.endsWith('vh')) return (parseFloat(s) / 100) * bounds.vh;
  if (s.endsWith('%')) {
    const p = parseFloat(s) / 100;
    return axis === 'x' ? p * bounds.vw : p * bounds.vh;
  }
  if (s.endsWith('rem')) {
    const n = parseFloat(s);
    return Number.isFinite(n) ? n * (bases.rem || 16) : null;
  }
  if (s.endsWith('em')) {
    const n = parseFloat(s);
    return Number.isFinite(n) ? n * (bases.em || bases.rem || 16) : null;
  }

  // bare number treated as px
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
};

/** Resolve request/min/max to px, then clamp to get effective size */
const resolveEffectiveSize = (
  reqW,
  reqH,
  minW,
  minH,
  maxW,
  maxH,
  bounds,
  bases
) => {
  const rW = toPx(reqW, 'x', bounds, bases);
  const rH = toPx(reqH, 'y', bounds, bases);
  const miW = toPx(minW, 'x', bounds, bases);
  const miH = toPx(minH, 'y', bounds, bases);
  const maW = toPx(maxW, 'x', bounds, bases);
  const maH = toPx(maxH, 'y', bounds, bases);

  const fallbackW = miW ?? 700;
  const fallbackH = miH ?? 600;

  const wantW = rW ?? fallbackW;
  const wantH = rH ?? fallbackH;

  return {
    width: clamp(wantW, miW ?? wantW, maW ?? wantW),
    height: clamp(wantH, miH ?? wantH, maH ?? wantH),
    minW: miW,
    minH: miH,
    maxW: maW,
    maxH: maH
  };
};

const anchoredPosition = (
  w,
  h,
  anchorOriginX,
  anchorOriginY,
  anchorX,
  anchorY,
  bounds,
  bases
) => {
  const originX = toPx(anchorOriginX, 'x', bounds, bases) ?? 16;
  const originY = toPx(anchorOriginY, 'y', bounds, bases) ?? 16;
  const shiftX = anchorX === 'center' ? w / 2 : anchorX === 'end' ? w : 0;
  const shiftY = anchorY === 'center' ? h / 2 : anchorY === 'end' ? h : 0;

  return {
    x: clamp(originX - shiftX, 0, Math.max(0, bounds.vw - w)),
    y: clamp(originY - shiftY, 0, Math.max(0, bounds.vh - h))
  };
};

let __zCounter = 9993;

/* ---------------- Component ---------------- */

const Dialog = ({
  id,
  drag = true,
  resize = true,
  backdrop = false,
  fullScreenOnMobile = false,
  title,
  titleIcon,
  type,
  hasHelp,
  helpId,
  helpContent,
  closeAction,
  minimizable,
  minimize = false,
  minimizeAction,
  maximizable,
  maximize = false,
  maximizeAction,

  /** Sizing */
  width = 'auto',
  height = 'auto',
  minWidth,
  minHeight,
  maxWidth = '90vw',
  maxHeight = '90vh',

  /** Anchor */
  anchorOriginX = '50%',
  anchorOriginY = '50%',
  anchorX = 'center',
  anchorY = 'center',

  enableResizingSides,

  children,
  style = {}
}) => {
  const isAnnouncement = type === 'announcement';
  const [localState, setLocalState] = useState(isAnnouncement);

  // If parent conditionally renders dialog, normal dialogs are always visible when mounted.
  const isVisible = isAnnouncement ? localState : true;

  const panelRef = useRef(null);
  const headerRef = useRef(null);
  const bodyRef = useRef(null);

  const [hasUserMoved, setHasUserMoved] = useState(false);
  const [userResized, setUserResized] = useState(false);

  const [bases, setBases] = useState({ rem: 16, em: 16 });
  const mobileFullscreen = isMobile && fullScreenOnMobile;

  useEffect(() => {
    const computeBases = () => {
      const rem =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

      const em = panelRef.current
        ? parseFloat(getComputedStyle(panelRef.current).fontSize) || rem
        : rem;

      setBases({ rem, em });
    };

    computeBases();
    window.addEventListener('resize', computeBases);
    return () => window.removeEventListener('resize', computeBases);
  }, []);

  const handleAnnouncementDialog = (selected, id) => {
    setLocalState(false);
    setTimeout(() => {
      closeAction?.(selected, id);
    }, 500);
  };

  const renderedChildren = !isAnnouncement
    ? children
    : cloneElement(children, { handleAnnouncementDialog });

  const renderDialogIcon = (icon) => {
    if (icon && React.isValidElement(icon)) return icon;
    if (icon && typeof icon === 'object')
      return <FontAwesomeIcon icon={icon} />;
    return null;
  };

  /**
   * If resize=false:
   *   width and height are ALWAYS treated as auto
   * If resize=true:
   *   width/height behave normally
   */
  const effectiveWidthProp = resize ? width : 'auto';
  const effectiveHeightProp = resize ? height : 'auto';

  const autoWidthActive =
    !resize || effectiveWidthProp === 'auto' || effectiveWidthProp == null;

  const autoHeightActive =
    !resize || effectiveHeightProp === 'auto' || effectiveHeightProp == null;

  const initial = useMemo(() => {
    const bounds = { vw: window.innerWidth, vh: window.innerHeight };

    if (mobileFullscreen) {
      return {
        width: bounds.vw,
        height: bounds.vh,
        minW: bounds.vw,
        minH: bounds.vh,
        maxW: bounds.vw,
        maxH: bounds.vh
      };
    }

    return resolveEffectiveSize(
      effectiveWidthProp,
      effectiveHeightProp,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      bounds,
      bases
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initial anchor
  const initialPos = useMemo(() => {
    const bounds = { vw: window.innerWidth, vh: window.innerHeight };

    if (mobileFullscreen) {
      return { x: 0, y: 0 };
    }

    return anchoredPosition(
      initial.width,
      initial.height,
      anchorOriginX,
      anchorOriginY,
      anchorX,
      anchorY,
      bounds,
      bases
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [size, setSize] = useState({
    width: initial.width,
    height: initial.height
  });

  const [position, setPosition] = useState({
    x: initialPos.x,
    y: initialPos.y
  });

  // Re-resolve when rem/em bases become available
  useEffect(() => {
    const bounds = { vw: window.innerWidth, vh: window.innerHeight };

    if (mobileFullscreen) {
      setSize({ width: bounds.vw, height: bounds.vh });
      setPosition({ x: 0, y: 0 });
      return;
    }

    const resolved = resolveEffectiveSize(
      effectiveWidthProp,
      effectiveHeightProp,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      bounds,
      bases
    );

    setSize({ width: resolved.width, height: resolved.height });

    const nextPos = anchoredPosition(
      resolved.width,
      resolved.height,
      anchorOriginX,
      anchorOriginY,
      anchorX,
      anchorY,
      bounds,
      bases
    );

    setPosition(nextPos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bases]);

  // Z-index stacking
  const [zIndex, setZIndex] = useState(++__zCounter);
  const bringToFront = () => setZIndex(++__zCounter);

  // Save/restore around maximize
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

  const getMeasuredContentElement = (bodyEl) => {
    if (!bodyEl) return null;
    return bodyEl.firstElementChild || bodyEl;
  };

  const measureContentSize = (bodyEl) => {
    if (!bodyEl) return { width: 0, height: 0 };

    const contentEl = getMeasuredContentElement(bodyEl);

    if (!contentEl) {
      return {
        width: bodyEl.scrollWidth || 0,
        height: bodyEl.scrollHeight || 0
      };
    }

    const rect = contentEl.getBoundingClientRect();

    return {
      width: Math.ceil(Math.max(contentEl.scrollWidth || 0, rect.width || 0)),
      height: Math.ceil(Math.max(contentEl.scrollHeight || 0, rect.height || 0))
    };
  };

  /**
   * Core behavior:
   * - if resize=false -> ALWAYS auto width/height with content
   * - if resize=true -> auto width/height only if width/height prop is 'auto'
   * - if resize=true and user manually resizes -> stop auto-sizing
   */
  useLayoutEffect(() => {
    if (!isVisible) return;
    if (mobileFullscreen) return;
    if (minimize) return;
    if (!bodyRef.current) return;
    if (maximize) return;

    const autoSizingAllowed = !resize || !userResized;
    if (!autoSizingAllowed) return;

    let rafId = 0;
    let framePending = false;

    const updateSizeFromContent = () => {
      const bounds = { vw: window.innerWidth, vh: window.innerHeight };

      const headerH = headerRef.current?.offsetHeight ?? 0;
      const contentSize = measureContentSize(bodyRef.current);

      let desiredW = size.width;
      let desiredH = size.height;

      if (autoWidthActive) {
        desiredW = contentSize.width;
      }

      if (autoHeightActive) {
        desiredH = headerH + contentSize.height;
      }

      const resolved = resolveEffectiveSize(
        desiredW,
        desiredH,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        bounds,
        bases
      );

      const nextWidth = autoWidthActive ? resolved.width : size.width;
      const nextHeight = autoHeightActive ? resolved.height : size.height;

      const widthChanged = Math.abs(nextWidth - size.width) > 1;
      const heightChanged = Math.abs(nextHeight - size.height) > 1;

      if (!widthChanged && !heightChanged) return;

      const nextSize = {
        width: nextWidth,
        height: nextHeight
      };

      setSize(nextSize);

      if (!hasUserMoved) {
        const nextPos = anchoredPosition(
          nextSize.width,
          nextSize.height,
          anchorOriginX,
          anchorOriginY,
          anchorX,
          anchorY,
          bounds,
          bases
        );
        setPosition(nextPos);
      }
    };

    const scheduleMeasure = () => {
      if (framePending) return;
      framePending = true;

      rafId = requestAnimationFrame(() => {
        framePending = false;
        updateSizeFromContent();
      });
    };

    const contentEl = getMeasuredContentElement(bodyRef.current);

    // Observe actual content element size changes
    const resizeObserver = new ResizeObserver(() => {
      scheduleMeasure();
    });

    if (contentEl) {
      resizeObserver.observe(contentEl);
    }

    // Also observe DOM mutations in case buttons are added/removed
    const mutationObserver = new MutationObserver(() => {
      scheduleMeasure();
    });

    mutationObserver.observe(bodyRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });

    // Initial measure
    updateSizeFromContent();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [
    isVisible,
    minimize,
    resize,
    userResized,
    maximize,
    autoWidthActive,
    autoHeightActive,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    anchorOriginX,
    anchorOriginY,
    anchorX,
    anchorY,
    hasUserMoved,
    size.width,
    size.height,
    bases
  ]);

  const reanchorIfNeeded = React.useCallback(() => {
    if (mobileFullscreen) {
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
      return;
    }
    if (maximize || minimize) return;
    if (hasUserMoved || userResized) return;

    const bounds = { vw: window.innerWidth, vh: window.innerHeight };

    const resolved = resolveEffectiveSize(
      effectiveWidthProp,
      effectiveHeightProp,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      bounds,
      bases
    );

    const clampedW = clamp(
      size.width,
      resolved.minW ?? size.width,
      resolved.maxW ?? size.width
    );

    const clampedH = clamp(
      size.height,
      resolved.minH ?? size.height,
      resolved.maxH ?? size.height
    );

    const nextSize = { width: clampedW, height: clampedH };

    const nextPos = anchoredPosition(
      nextSize.width,
      nextSize.height,
      anchorOriginX,
      anchorOriginY,
      anchorX,
      anchorY,
      bounds,
      bases
    );

    setSize(nextSize);
    setPosition(nextPos);
  }, [
    effectiveWidthProp,
    effectiveHeightProp,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    anchorOriginX,
    anchorOriginY,
    anchorX,
    anchorY,
    maximize,
    minimize,
    hasUserMoved,
    userResized,
    size.width,
    size.height,
    bases
  ]);

  useEffect(() => {
    const onResize = () => {
      if (maximize) {
        setSize({ width: window.innerWidth, height: window.innerHeight });
        setPosition({ x: 0, y: 0 });
        return;
      }
      reanchorIfNeeded();
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [reanchorIfNeeded, maximize]);

  // Mobile fullscreen
  useEffect(() => {
    if (!mobileFullscreen) return;
    if (!isVisible) return;
    if (minimize) return;

    const updateFullscreen = () => {
      setPosition({ x: 0, y: 0 });
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateFullscreen();
    window.addEventListener('resize', updateFullscreen);

    return () => window.removeEventListener('resize', updateFullscreen);
  }, [mobileFullscreen, isVisible, minimize]);

  const hidden = minimize === true;

  const disableDragging = mobileFullscreen || hidden || !drag || maximize;

  const canResize = !mobileFullscreen && !hidden && resize && !maximize;

  const enableResizing =
    typeof enableResizingSides === 'object'
      ? hidden
        ? false
        : enableResizingSides
      : canResize;

  const bounds = { vw: window.innerWidth, vh: window.innerHeight };

  const minWpx = mobileFullscreen
    ? bounds.vw
    : toPx(minWidth, 'x', bounds, bases) ?? undefined;

  const minHpx = mobileFullscreen
    ? bounds.vh
    : toPx(minHeight, 'y', bounds, bases) ?? undefined;

  const maxWpx = mobileFullscreen
    ? bounds.vw
    : toPx(maxWidth, 'x', bounds, bases) ?? undefined;

  const maxHpx = mobileFullscreen
    ? bounds.vh
    : toPx(maxHeight, 'y', bounds, bases) ?? undefined;

  return (
    <>
      {/* Hide backdrop while minimized */}
      {backdrop && !hidden && (
        <StyledDialogBackdrop
          style={{ zIndex: zIndex - 1 }}
          onClick={() => {
            if (!isAnnouncement) {
              closeAction?.();
            } else {
              setLocalState(false);
              setTimeout(() => closeAction?.(null, null), 500);
            }
          }}
        />
      )}

      <StyledRnd
        id={id}
        size={size}
        position={position}
        bounds="window"
        minWidth={minWpx}
        minHeight={minHpx}
        maxWidth={maxWpx}
        maxHeight={maxHpx}
        onDragStart={() => {
          if (hidden) return;
          bringToFront();
          setHasUserMoved(true);
        }}
        onResizeStart={() => {
          if (hidden) return;
          bringToFront();
          setUserResized(true);
        }}
        onMouseDown={() => {
          if (hidden) return;
          bringToFront();
        }}
        onDragStop={(_, d) => setPosition({ x: d.x, y: d.y })}
        onResize={(_, __, ref, ___, newPosition) => {
          setSize({
            width: ref.offsetWidth,
            height: ref.offsetHeight
          });
          setPosition(newPosition);
        }}
        dragHandleClassName="dialog-header"
        disableDragging={disableDragging}
        enableResizing={enableResizing}
        style={{
          zIndex,
          opacity: hidden ? 0 : 1,
          visibility: hidden ? 'hidden' : 'visible',
          pointerEvents: hidden ? 'none' : 'auto',
          ...style
        }}
      >
        <Panel ref={panelRef} $fullScreenOnMobile={fullScreenOnMobile}>
          <Header
            ref={headerRef}
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

            <Title>
              {renderDialogIcon(titleIcon)}
              <p>{title}</p>
            </Title>

            <Right>
              {minimizable && (
                <HeaderBtn onClick={() => minimizeAction?.()}>
                  <FontAwesomeIcon icon={faWindowMinimize} />
                </HeaderBtn>
              )}

              {maximizable && window.innerWidth > MIN_SCREEN_WIDTH_MAXIMIZE && (
                <HeaderBtn
                  onClick={(e) => {
                    e.preventDefault();
                    maximizeAction?.();
                  }}
                >
                  <FontAwesomeIcon
                    icon={maximize ? faWindowRestore : faWindowMaximize}
                  />
                </HeaderBtn>
              )}

              {hasHelp && (
                <HeaderBtn id={helpId}>
                  <FontAwesomeIcon icon={faQuestion} />
                </HeaderBtn>
              )}

              <CloseBtn
                onClick={() => {
                  if (!isAnnouncement) {
                    closeAction?.();
                  } else {
                    setLocalState(false);
                    setTimeout(() => closeAction?.(null, null), 500);
                  }
                }}
              >
                <CloseIcon icon={faTimes} />
              </CloseBtn>
            </Right>
          </Header>

          <Body ref={bodyRef}>{renderedChildren}</Body>
        </Panel>
      </StyledRnd>
    </>
  );
};

export default Dialog;
