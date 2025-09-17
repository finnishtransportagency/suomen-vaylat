import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFillDrip } from '@fortawesome/free-solid-svg-icons';
import { SketchPicker } from 'react-color';

const StyledColorPickerWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
`;

const StyledColorActionButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 8px;
  border: none;
  background: ${(p) => p.theme.colors.mainColor1};
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

/* container that holds input and swatch so swatch can be absolutely positioned */
const StyledInputContainer = styled.div`
  position: relative;
  display: inline-block;
`;

/* hex text input — fixed height and rounded on left only so swatch can form the right rounding */
const StyledHexInput = styled.input`
  width: 130px;
  height: 38px;
  padding: 8px 12px;
  padding-right: 48px; /* make room for the swatch inside the input area */
  font-size: 14px;
  border: 1.5px solid #e3e7ec;
  border-radius: 4px 6px 6px 4px;
  background: #fff;
  color: #222;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme?.colors?.mainColor1 || '#0f6db7'};
  }
`;

/* visible color swatch — absolutely positioned to appear inside the right edge of the input */
const StyledColorSwatch = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 38px;
  height: 38px; /* match the StyledHexInput height */
  border-radius: 0 6px 6px 0; /* right corners rounded */
  border: none;
  padding: 0;
  cursor: pointer;
  background: ${(p) => p.color || '#000'};
  display: inline-block;
`;

const StyledColorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

/* picker modal */
const StyledPickerOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 14000;
  background: rgba(10, 20, 30, 0.35);
`;

const StyledPickerBox = styled.div`
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

  useEffect(() => {
    if (value && value.toLowerCase() !== hex.toLowerCase()) {
      setHex(value);
    }
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

  const openPicker = () => setOpen(true);
  const closePicker = useCallback(() => setOpen(false), []);

  const handlePickerChange = (color) => {
    setHex(color.hex);
    onChange && onChange(color.hex);
  };

  const handleHexChange = (e) => {
    const v = e.target.value;
    setHex(v);
    try {
      const normalized = normalizeHex(v);
      if (isValidHex(normalized)) {
        onChange && onChange(normalized);
      }
    } catch (err) {}
  };

  const commitHex = () => {
    try {
      const normalized = normalizeHex(hex);
      if (isValidHex(normalized)) {
        setHex(normalized);
        onChange && onChange(normalized);
      } else {
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closePicker();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closePicker]);

  return (
    <>
      <StyledColorPickerWrapper>
        <StyledColorActionButton
          type="button"
          id="import-color-picker-color-action-button"
          aria-label={
            ariaLabel ? `${ariaLabel} - open color picker` : 'Open color picker'
          }
          onClick={openPicker}
        >
          <FontAwesomeIcon icon={faFillDrip} />
        </StyledColorActionButton>

        <StyledColorWrapper id="import-color-picker-color-wrapper">
          <StyledInputContainer id="import-color-picker-input-container">
            <StyledHexInput
              id={id}
              type="text"
              value={hex}
              aria-label={ariaLabel || 'Color hex value'}
              onChange={handleHexChange}
              onBlur={commitHex}
              onKeyDown={onKeyDownHex}
              inputMode="text"
            />

            <StyledColorSwatch
              type="button"
              id="import-color-picker-color-swatch"
              color={isValidHex(hex) ? normalizeHex(hex) : value || '#000000'}
              aria-label={`${ariaLabel ? ariaLabel + ' - ' : ''}swatch`}
              onClick={openPicker}
              title={isValidHex(hex) ? normalizeHex(hex) : value || '#000000'}
            />
          </StyledInputContainer>
        </StyledColorWrapper>
      </StyledColorPickerWrapper>

      {open &&
        ReactDOM.createPortal(
          <StyledPickerOverlay id="import-color-picker-color-picker-overlay" role="dialog" aria-modal="true" onClick={closePicker}>
            <StyledPickerBox id="import-color-picker-color-picker-boxr" onClick={(e) => e.stopPropagation()} ref={pickerRef}>
              <SketchPicker
                color={isValidHex(hex) ? normalizeHex(hex) : value || '#000000'}
                onChange={handlePickerChange}
                onChangeComplete={handlePickerChange}
                disableAlpha={true}
              />
            </StyledPickerBox>
          </StyledPickerOverlay>,
          document.body
        )}
    </>
  );
};

export default ColorPicker;
