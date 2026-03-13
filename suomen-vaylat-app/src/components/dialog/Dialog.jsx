// AI-GENERATED
// GPT-5.4 Think deeper
// Inspected by Oskari Rintamäki
// Date: 2026-03-12

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
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
import {
  clamp,
  resolveEffectiveSize,
  toPx,
  anchoredPosition
} from './utils/dialogUtil';
import { useDialogStack } from '../../state/DialogStackContext';

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
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(p) =>
    p.$type === 'warning'
      ? p.theme.colors.secondaryColorDarkOrange
      : p.$onTop
      ? p.theme.colors.mainColor1Selected
      : p.theme.colors.mainColor1};
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
    padding: 8px;
    margin: 0px;
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

const StyledResizeHandle = styled.div`
  position: absolute;
  right: 12px;
  bottom: 14px;
  width: 14px;
  height: 14px;
  cursor: nwse-resize;
  z-index: 20;
  pointer-events: auto;
  opacity: 0.8;

  &::before,
  &::after {
    content: '';
    position: absolute;
    display: block;
    height: 2px;
    background-color: ${(p) => p.theme.colors.mainColor1};
    border-radius: 2px;
    transform: rotate(-45deg);
    transform-origin: right center;
  }

  /* smaller inner line */
  &::before {
    width: 6px;
    right: 1px;
    bottom: 2px;
  }

  /* bigger outer line */
  &::after {
    width: 12px;
    right: 1px;
    bottom: 7px;
  }
`;

/* ---------------- Component ---------------- */

const Dialog = ({
  id,
  drag = true,
  resize = true,
  backdrop = false,
  fullScreenOnMobile = false,
  title,
  titleIcon,
  type, // warning?
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
  minWidth = '25rem',
  minHeight = '25rem',
  maxWidth = '90vw',
  maxHeight = '90vh',

  /** Anchor */
  anchorOriginX = '50%',
  anchorOriginY = '50%',
  anchorX = 'center',
  anchorY = 'center',

  children,
  style = {}
}) => {
  const panelRef = useRef(null);
  const headerRef = useRef(null);
  const bodyRef = useRef(null);

  const [hasUserMoved, setHasUserMoved] = useState(false);
  const [userResized, setUserResized] = useState(false);

  const [bases, setBases] = useState({ rem: 16, em: 16 });
  const mobileFullscreen = isMobile && fullScreenOnMobile;

  const { register, unregister, bringToFront, getZIndex, topId } =
    useDialogStack();

  const idRef = useRef(id || Math.random().toString(36).slice(2, 9));

  useEffect(() => {
    const id = idRef.current
    if (!register) return;
    register(id);

    return () => {
      unregister && unregister(id);
    };
  }, [register, unregister]);

  const handleBringToFront = (e) => {
    e.stopPropagation();
    if (!bringToFront) return;
    if (topId === idRef.current) return;
    bringToFront(idRef.current);
  };

  const zIndex = getZIndex ? getZIndex(idRef.current) : 1000;

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

  /**
   * Core behavior:
   * - if resize=false -> ALWAYS auto width/height with content
   * - if resize=true -> auto width/height only if width/height prop is 'auto'
   * - if resize=true and user manually resizes -> stop auto-sizing
   */
  useLayoutEffect(() => {
    if (mobileFullscreen) return;
    if (minimize) return;
    if (!bodyRef.current) return;
    if (maximize) return;

    const autoSizingAllowed = !resize || !userResized;
    if (!autoSizingAllowed) return;

    let rafId = 0;
    let framePending = false;

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
        height: Math.ceil(
          Math.max(contentEl.scrollHeight || 0, rect.height || 0)
        )
      };
    };

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
    bases,
    mobileFullscreen
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
    bases,
    mobileFullscreen
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
  }, [mobileFullscreen, minimize]);

  const hidden = minimize === true;

  const disableDragging = mobileFullscreen || hidden || !drag || maximize;

  const canResize = !mobileFullscreen && !hidden && resize && !maximize;

  const enableResizing = canResize
    ? {
        top: false,
        right: false,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: true,
        bottomLeft: false,
        topLeft: false
      }
    : false;

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
            closeAction();
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
        resizeHandleComponent={{
          bottomRight: <StyledResizeHandle />
        }}
        onDragStart={(e) => {
          if (hidden) return;
          handleBringToFront(e);
          setHasUserMoved(true);
        }}
        onResizeStart={(e) => {
          if (hidden) return;
          handleBringToFront(e);
          setUserResized(true);
        }}
        onMouseDown={(e) => {
          if (hidden) return;
          handleBringToFront(e);
        }}
        onPointerDown={(e) => {
          if (hidden) return;
          handleBringToFront(e);
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
            $onTop={topId === idRef.current}
            className="dialog-header"
          >
            
            {hasHelp && helpId && (
              <Tooltip
                anchorSelect={`#${helpId}`}
                style={{ backgroundColor: theme.colors.mainColor1 }}
                disable={isMobile}
                id={`${helpId}_tooltip`}
                place="bottom"
                effect="float"
              >
                {helpContent}
              </Tooltip>
            )}

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
                  closeAction();
                }}
              >
                <CloseIcon icon={faTimes} />
              </CloseBtn>
            </Right>
          </Header>

          <Body ref={bodyRef}>{children}</Body>
        </Panel>
      </StyledRnd>
    </>
  );
};

export default Dialog;
