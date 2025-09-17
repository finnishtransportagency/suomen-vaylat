import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFillDrip } from '@fortawesome/free-solid-svg-icons';
import { SketchPicker } from 'react-color';

const ColorPickerWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
`;

const ColorActionButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 8px;
  border: 1.5px solid #e0e3e7;
  background: #0f6db7; /* demo icon bg like your image - use theme if desired */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  &:focus {
    outline: 3px solid rgba(15, 109, 183, 0.18);
  }
`;

/* hex text input */
const HexInput = styled.input`
  width: 110px;
  padding: 8px 10px;
  font-size: 14px;
  border: 1.5px solid #e3e7ec;
  border-radius: 6px;
  background: #fff;
  color: #222;
  box-shadow: 0 1px 3px #0002;
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme?.colors?.mainColor1 || '#0f6db7'};
  }
`;

/* visible color swatch */
const ColorSwatch = styled.button`
  width: 38px;
  height: 32px;
  border-radius: 6px;
  border: 1.5px solid #e0e3e7;
  padding: 0;
  cursor: pointer;
  background: ${(p) => p.color || '#000'};
  box-shadow: 0 1px 3px #0002;
  display: inline-block;
`;

/* hidden native color input */
const HiddenColorInput = styled.input`
  display: none;
`;

const StyledColorWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
const PickerOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 14000;
  background: rgba(10, 20, 30, 0.35);
`;

const PickerBox = styled.div`
  background: white;
  border-radius: 10px;
  padding: 8px;
  box-shadow: 0 12px 30px rgba(10, 10, 10, 0.18);
`;

/* --- ColorPicker (react-color based) --- */
const ColorPicker = ({ id, value, onChange, ariaLabel }) => {
  const [hex, setHex] = useState((value && value.toLowerCase()) || '#000000');
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);

  // Keep internal hex in sync with parent value
  useEffect(() => {
    if (value && value.toLowerCase() !== hex.toLowerCase()) {
      setHex(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const isValidHex = (v) => /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(v);

  const normalizeHex = (v) => {
    if (!v) return '#000000';
    const s = v.trim();
    const withHash = s.startsWith('#') ? s : `#${s}`;
    if (/^#([0-9a-fA-F]{3})$/.test(withHash)) {
      const r = withHash[1],
        g = withHash[2],
        b = withHash[3];
      return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    return withHash.toLowerCase();
  };

  // Open/close handlers
  const openPicker = () => setOpen(true);
  const closePicker = useCallback(() => setOpen(false), []);

  // Live update while using the SketchPicker
  const handlePickerChange = (color) => {
    setHex(color.hex);
    onChange && onChange(color.hex);
  };

  // Called while typing — keep internal state AND notify parent when a valid hex is available
  const handleHexChange = (e) => {
    const v = e.target.value;
    setHex(v);

    // if the typed value is a valid hex (allow both short and full), normalize and notify parent
    try {
      const normalized = normalizeHex(v);
      if (isValidHex(normalized)) {
        onChange && onChange(normalized);
      }
    } catch (err) {
      // ignore invalid interim values
    }
  };

  // Commit hex on blur or Enter if valid; if invalid, revert to last valid prop value
  const commitHex = () => {
    try {
      const normalized = normalizeHex(hex);
      if (isValidHex(normalized)) {
        // ensure local state stores normalized 6-digit hex
        setHex(normalized);
        onChange && onChange(normalized);
      } else {
        // revert to last valid parent value
        setHex((value && value.toLowerCase()) || '#000000');
      }
    } catch {
      setHex((value && value.toLowerCase()) || '#000000');
    }
  };
  const onKeyDownHex = (e) => {
    if (e.key === 'Enter') {
      commitHex();
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setHex((value && value.toLowerCase()) || '#000000');
      e.currentTarget.blur();
    }
  };

  // Close on ESC when picker open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closePicker();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closePicker]);

  // Click outside handler: pickerBox stops propagation, overlay closes
  return (
    <>
      <ColorPickerWrapper>
        <ColorActionButton
          type="button"
          aria-label={
            ariaLabel ? `${ariaLabel} - open color picker` : 'Open color picker'
          }
          onClick={openPicker}
        >
          <FontAwesomeIcon icon={faFillDrip} />
        </ColorActionButton>

        <StyledColorWrapper>
          <HexInput
            id={id}
            type="text"
            value={hex}
            aria-label={ariaLabel || 'Color hex value'}
            onChange={handleHexChange}
            onBlur={commitHex}
            onKeyDown={onKeyDownHex}
            inputMode="text"
          />

          <ColorSwatch
            type="button"
            color={isValidHex(hex) ? normalizeHex(hex) : value || '#000000'}
            aria-label={`${ariaLabel ? ariaLabel + ' - ' : ''}swatch`}
            onClick={openPicker}
            title={isValidHex(hex) ? normalizeHex(hex) : value || '#000000'}
          />
        </StyledColorWrapper>
      </ColorPickerWrapper>

      {open &&
        ReactDOM.createPortal(
          <PickerOverlay role="dialog" aria-modal="true" onClick={closePicker}>
            <PickerBox onClick={(e) => e.stopPropagation()} ref={pickerRef}>
              <SketchPicker
                color={isValidHex(hex) ? normalizeHex(hex) : value || '#000000'}
                onChange={handlePickerChange}
                onChangeComplete={handlePickerChange}
                disableAlpha={true}
              />
            </PickerBox>
          </PickerOverlay>,
          document.body
        )}
    </>
  );
}

export default ColorPicker;