// ZoomBar.jsx
import { useContext, useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  faList,
  faSearchMinus,
  faSearchPlus,
} from '@fortawesome/free-solid-svg-icons';
import NearMeDisabledRoundedIcon from '@mui/icons-material/NearMeDisabledRounded';
import NavigationRoundedIcon from '@mui/icons-material/NavigationRounded';

import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import {
  setZoomTo,
  setZoomIn,
  setZoomOut,
  setCurrentZoomLevel
} from '../../state/slices/rpcSlice';
import {
  setIsCoordinateToolOpen,
  setIsLegendOpen
} from '../../state/slices/uiSlice';
import strings from '../../translations';
import CircleButton from '../../utils/components/CircleButton';
import { theme } from '../../theme/theme';

import XYicon from '../coordinate-tool/resources/images/xy_icon.svg';

/* ===== constants ===== */
const THUMB_SIZE = 18; // diameter of the visible thumb
const THUMB_TOTAL = THUMB_SIZE; // reserve this much vertical space (outer)
const WRAPPER_HEIGHT = 150; // default wrapper height (can be responsive)

const StyledContainer = styled.div`
    position: fixed;
    right: 5;
    bottom: 16px;
    z-index: 5;
    display: flex;
    justify-content: flex-end;
    align-items: end;
    -webkit-align-items: flex-end;
    width: 100%;

@media (max-width: 600px) {
    width: 100vw;
`;

/* ===== styled components ===== */
const StyledDock = styled.div`
  position: relative;
  pointer-events: none;
  display: inline-flex;
`;

const StyledZoomBarContainer = styled.div`
  z-index: 2;
  position: relative;
  pointer-events: none;
  cursor: pointer;
  display: flex;
  transform: ${({ isSearchResultPanelVisible }) =>
    isSearchResultPanelVisible ? 'translateX(-420px)' : 'translateX(0)'};
`;

const StyledZoomBarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: auto;

  @media ${(props) => props.theme.device.mobileL} {
    gap: 6px;
  }
  @media ${(props) => props.theme.device.lowResDesktop} {
    gap: 6px;
  }
`;

/* Thumb (indicator) */
const StyledZoomIndicator = styled.div`
  position: absolute;
  left: 50%;
  top: ${(props) => props.top}px;
  transform: translate(-50%, -50%);
  width: ${THUMB_SIZE}px;
  height: ${THUMB_SIZE}px;
  box-sizing: border-box;
  border: 2px solid ${(props) => props.theme.colors.mainColor1};
  border-radius: 50%;
  z-index: 6;
  pointer-events: none;
  transition: top 0.06s linear;

  background: radial-gradient(
      circle at center,
      ${(props) => props.theme.colors.mainColor1} 0 3px,
      transparent 3px
    ),
    #fff;
  background-clip: padding-box, padding-box;
`;

/* wrapper that reserves padding so the thumb stays within bounds */
const StyledSliderWrapper = styled.div`
  position: relative;
  height: ${WRAPPER_HEIGHT}px;
  width: 18px; /* outer width to comfortably show segments */
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  /* reserve space so thumb sits fully inside */
  padding-top: ${THUMB_TOTAL / 2}px;
  padding-bottom: ${THUMB_TOTAL / 2}px;

  @media ${(props) => props.theme.device.mobileL} {
    height: 100px;
  }
`;

/* Segmented bar: fill exactly the inner area (wrapper height minus padding) */
const StyledSegmentedBar = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 12px; /* visible width of the bar */
  height: calc(100% - ${THUMB_TOTAL}px); /* inner height */
  top: ${THUMB_TOTAL / 2}px; /* align to wrapper padding */
  border-radius: 12px;
  border: 1px solid white;
  z-index: 1;
  pointer-events: none;

  ${(props) => {
    const levels = props.levels || 17;
    const sepPx = 1; // separator thickness in px
    const pct = 100 / levels;
    return `
      background: repeating-linear-gradient(
        to bottom,
        ${props.theme.colors.mainColor1} 0 calc(${pct}% - ${sepPx}px),
        white calc(${pct}% - ${sepPx}px) ${pct}%
      );
      background-size: 100% 100%;
    `;
  }}
`;

/* hover/drag tooltip */
const HoverTooltip = styled.div`
  position: absolute;
  left: -8px;
  transform: translate(-100%, -50%);
  padding: 4px 8px;
  background: ${(p) => p.theme.colors.mainColor1};
  color: ${(p) => p.theme.colors.mainWhite || '#fff'};
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
  pointer-events: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
`;

const StyledZoomBarZoomFeatures = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StyledXYIcon = styled.img`
  height: 2em;
  @media ${(props) => props.theme.device.mobileL} {
    height: 1.7em;
  }
`;

const ZoomBar = () => {
  const { store } = useContext(ReactReduxContext);

  const { currentZoomLevel, zoomRange, channel } = useAppSelector(
    (state) => state.rpc
  );
  const { isCoordinateToolOpen, isSearchResultPanelVisible, isLegendOpen } =
    useAppSelector((state) => state.ui);

  // unique id for this instance (used as prefix for DOM ids)
  const idRef = useRef(`zoombar-${Math.random().toString(36).slice(2, 9)}`);

  const [isLocationTrackingActive, setIsLocationTrackingActive] =
    useState(false);
  const handleLocationTrackingClick = () => {
    if (isLocationTrackingActive) {
      channel.postRequest('StopUserLocationTrackingRequest');
      setIsLocationTrackingActive(false);
    } else {
      channel.postRequest('StartUserLocationTrackingRequest', [
        { addToMap: 'location', centerMap: 'update' }
      ]);
      setIsLocationTrackingActive(true);
    }
  };

  // refs & drag state
  const sliderRef = useRef(null);
  const draggingRef = useRef(false);
  const lastPointerIdRef = useRef(null);

  // show tooltip only while dragging (or hovering, depending on state)
  const [hovering, setHovering] = useState(false);
  const [hoverTop, setHoverTop] = useState(0);
  const [hoverZoom, setHoverZoom] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // clamp helper
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // discrete positions math:
  // positions = number of zoom levels = max - min + 1
  const positions = Math.max(1, zoomRange.max - zoomRange.min + 1);

  // compute top pixel for a zoom value using the inner area (wrapper height minus padding)
  const computeIndicatorTop = useCallback(
    (zoom) => {
      const wrap = sliderRef.current;
      const totalHeight = wrap
        ? wrap.getBoundingClientRect().height
        : WRAPPER_HEIGHT;
      const padding = THUMB_TOTAL / 2;
      const innerHeight = totalHeight - padding * 2;
      const step = positions > 1 ? innerHeight / (positions - 1) : 0;
      // index 0..positions-1 where index 0 = top = max zoom
      const index = clamp(zoomRange.max - zoom, 0, positions - 1);
      return padding + index * step;
    },
    [zoomRange.max, positions]
  );

  // map clientY -> zoom using same inner area and step math
  const clientYToZoom = useCallback(
    (clientY) => {
      const wrap = sliderRef.current;
      if (!wrap) return currentZoomLevel;
      const rect = wrap.getBoundingClientRect();
      const padding = THUMB_TOTAL / 2;
      const innerTop = rect.top + padding;
      const innerHeight = rect.height - padding * 2;
      const step = positions > 1 ? innerHeight / (positions - 1) : innerHeight;
      const y = clamp(clientY, innerTop, innerTop + innerHeight);
      const offset = y - innerTop;
      const index = Math.round(offset / step); // 0..positions-1 (0=top)
      const z = clamp(zoomRange.max - index, zoomRange.min, zoomRange.max);
      return z;
    },
    [positions, zoomRange, currentZoomLevel]
  );

  // pointer move/up handlers on window while dragging (cleanup safety)
  useEffect(() => {
    const onPointerMove = (e) => {
      if (!draggingRef.current) return;
      const z = clientYToZoom(e.clientY);
      store.dispatch(setCurrentZoomLevel(Number(z)));
    };

    const onPointerUp = (e) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
      const z = clientYToZoom(e.clientY);
      store.dispatch(setCurrentZoomLevel(Number(z)));
      store.dispatch(setZoomTo(Number(z)));
      try {
        if (
          typeof lastPointerIdRef.current !== 'undefined' &&
          sliderRef.current?.releasePointerCapture
        ) {
          sliderRef.current.releasePointerCapture(lastPointerIdRef.current);
        }
      } catch (err) {
        // ignore
      }
      lastPointerIdRef.current = null;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [clientYToZoom, store]);
  const handlePointerDown = (e) => {
    if (e.button && e.button !== 0) return;
    e.preventDefault();
    draggingRef.current = true;
    setIsDragging(true);
    lastPointerIdRef.current = e.pointerId;
    try {
      sliderRef.current?.setPointerCapture?.(e.pointerId);
    } catch (err) {}

    // initial update
    const initialZ = clientYToZoom(e.clientY);
    store.dispatch(setCurrentZoomLevel(Number(initialZ)));
    setHovering(false);

    const onPointerMove = (ev) => {
      if (!draggingRef.current) return;
      const z2 = clientYToZoom(ev.clientY);
      store.dispatch(setCurrentZoomLevel(Number(z2)));
      // update drag tooltip position
      const rect = sliderRef.current.getBoundingClientRect();
      const top = clamp(ev.clientY, rect.top, rect.bottom) - rect.top;
      setHoverTop(top);
    };

    const onPointerUp = (ev) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
      const z2 = clientYToZoom(ev.clientY);
      store.dispatch(setCurrentZoomLevel(Number(z2)));
      store.dispatch(setZoomTo(Number(z2)));
      try {
        sliderRef.current?.releasePointerCapture?.(ev.pointerId);
      } catch (err) {}
      lastPointerIdRef.current = null;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // hover tooltip handlers
  const handleSliderPointerMove = (e) => {
    if (draggingRef.current) return;
    const wrap = sliderRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const y = clamp(e.clientY, rect.top, rect.bottom);
    const top = y - rect.top;
    const z = clientYToZoom(e.clientY);
    setHoverTop(top);
    setHoverZoom(z);
    setHovering(true);
  };
  const handleSliderPointerLeave = () => {
    if (draggingRef.current) return;
    setHovering(false);
  };

  // click jump (commit)
  const handleSliderClick = (e) => {
    if (draggingRef.current) return;
    const z = clientYToZoom(e.clientY);
    store.dispatch(setCurrentZoomLevel(Number(z)));
    store.dispatch(setZoomTo(Number(z)));
  };

  // keyboard controls on indicator
  const handleIndicatorKeyDown = (e) => {
    let z = currentZoomLevel;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      z = clamp(currentZoomLevel + 1, zoomRange.min, zoomRange.max);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      z = clamp(currentZoomLevel - 1, zoomRange.min, zoomRange.max);
    } else if (e.key === 'Home') {
      e.preventDefault();
      z = zoomRange.max;
    } else if (e.key === 'End') {
      e.preventDefault();
      z = zoomRange.min;
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      z = clamp(currentZoomLevel + 1, zoomRange.min, zoomRange.max);
    } else if (e.key === '-') {
      e.preventDefault();
      z = clamp(currentZoomLevel - 1, zoomRange.min, zoomRange.max);
    } else {
      return;
    }
    store.dispatch(setCurrentZoomLevel(Number(z)));
    store.dispatch(setZoomTo(Number(z)));
  };

  // compute indicator top pixel (uses computeIndicatorTop)
  const indicatorTop = computeIndicatorTop(currentZoomLevel);

  // tooltip logic: show hover while hovering; while dragging prefer dragging/indicator value
  const showTooltip = hovering || isDragging;
  const tooltipTop = isDragging ? indicatorTop : hoverTop;
  const tooltipText = isDragging ? currentZoomLevel : hoverZoom;

  // tick visuals count
  const tickCount = positions;

  // ids
  const baseId = idRef.current;
  const containerId = `${baseId}-container`;
  const sliderId = `${baseId}-slider`;
  const thumbId = `${baseId}-thumb`;
  const zoomInId = `${baseId}-zoom-in`;
  const zoomOutId = `${baseId}-zoom-out`;
  const legendBtnId = `${baseId}-legend-btn`;
  const coordBtnId = `${baseId}-coord-btn`;
  const locBtnId = `${baseId}-loc-btn`;

  return (
    <StyledContainer id="zoom-menu-container">
      <StyledDock id={containerId}>
        <StyledZoomBarContainer
          $shifted={isSearchResultPanelVisible}
          aria-hidden={false}
          aria-label="Zoom controls"
        >
          <StyledZoomBarContent>
            <CircleButton
              id={legendBtnId}
              icon={faList}
              text={strings.tooltips.legendButton}
              toggleState={isLegendOpen}
              clickAction={() => store.dispatch(setIsLegendOpen(!isLegendOpen))}
              tooltipDirection="left"
              aria-pressed={isLegendOpen}
              aria-label={strings.tooltips.legendButton}
            />

            <StyledZoomBarZoomFeatures>
              <CircleButton
                id={zoomInId}
                icon={faSearchPlus}
                text={strings.tooltips.zoomIn}
                disabled={currentZoomLevel === zoomRange.max}
                clickAction={() => store.dispatch(setZoomIn())}
                tooltipDirection="left"
                aria-label={strings.tooltips.zoomIn}
                aria-disabled={currentZoomLevel === zoomRange.max}
              />

              <StyledSliderWrapper
                id={sliderId}
                ref={sliderRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handleSliderPointerMove}
                onPointerLeave={handleSliderPointerLeave}
                onClick={handleSliderClick}
                aria-label={strings.accessibility.zoomRange}
                role="group"
                aria-roledescription="zoom slider group"
                aria-describedby={thumbId}
              >
                {showTooltip && tooltipText !== null && (
                  <HoverTooltip
                    style={{ top: `${tooltipTop}px` }}
                    role="status"
                    aria-live="polite"
                  >
                    {tooltipText}
                  </HoverTooltip>
                )}

                <StyledZoomIndicator
                  id={thumbId}
                  top={indicatorTop}
                  role="slider"
                  tabIndex={0}
                  aria-orientation="vertical"
                  aria-valuemin={zoomRange.min}
                  aria-valuemax={zoomRange.max}
                  aria-valuenow={currentZoomLevel}
                  aria-valuetext={`Zoom ${currentZoomLevel}`}
                  onKeyDown={handleIndicatorKeyDown}
                  style={{ pointerEvents: 'auto' }}
                />

                <StyledSegmentedBar levels={tickCount} aria-hidden="true" />
              </StyledSliderWrapper>

              <CircleButton
                id={zoomOutId}
                icon={faSearchMinus}
                text={strings.tooltips.zoomOut}
                disabled={currentZoomLevel === zoomRange.min}
                clickAction={() => {
                  if (currentZoomLevel > 0) store.dispatch(setZoomOut());
                }}
                tooltipDirection="left"
                aria-label={strings.tooltips.zoomOut}
                aria-disabled={currentZoomLevel === zoomRange.min}
              />
            </StyledZoomBarZoomFeatures>

            <CircleButton
              id={coordBtnId}
              icon={
                <StyledXYIcon
                  aria-label={strings.tooltips.coordinateTool + 'icon'}
                  src={XYicon}
                />
              }
              text={strings.tooltips.coordinateTool}
              toggleState={isCoordinateToolOpen}
              clickAction={() =>
                store.dispatch(setIsCoordinateToolOpen(!isCoordinateToolOpen))
              }
              tooltipDirection="left"
              aria-pressed={isCoordinateToolOpen}
              aria-label={strings.tooltips.coordinateTool}
            />

            <CircleButton
              id={locBtnId}
              icon={
                isLocationTrackingActive ? (
                  <NavigationRoundedIcon />
                ) : (
                  <NearMeDisabledRoundedIcon />
                )
              }
              color={
                isLocationTrackingActive
                  ? theme.colors.secondaryColorGreen
                  : theme.colors.button
              }
              text={strings.tooltips.myLocButton}
              clickAction={handleLocationTrackingClick}
              tooltipDirection="left"
              aria-pressed={isLocationTrackingActive}
              aria-label={strings.tooltips.myLocButton}
            />
          </StyledZoomBarContent>
        </StyledZoomBarContainer>
      </StyledDock>
    </StyledContainer>
  );
};

export default ZoomBar;
