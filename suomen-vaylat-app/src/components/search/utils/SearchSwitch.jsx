import styled, { useTheme } from 'styled-components';
import Radio from '@mui/material/Radio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  gap: 8px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 auto;
  min-width: 0;
`;

/* Focusable label used as the primary tab stop for each option */
const StyledLabel = styled.label`
  font-size: 16px;
  color: #2b2b2b;
  margin: 0;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  outline: none;

  /* clicking with mouse should not show the keyboard focus ring */
  &:focus {
    box-shadow: none;
    outline: none;
  }

  /* show visible ring only when focus comes from keyboard (Tab) */
  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.15);
    border-radius: 4px;
  }
`;

/* Info button (sibling) - keyboard focusable */
const InfoButton = styled.button`
  border: none;
  background: none;
  padding: 6px;
  margin: 0;
  color: ${(p) => p.theme.colors.mainColor1};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  /* no ring on mouse click */
  &:focus {
    outline: none;
  }

  :hover {
    svg {
      opacity: 0.95;
    }
    opacity: 0.95;
  }

  /* visible ring only for keyboard focus */
  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.mainColor1};
    outline-offset: 2px;
  }
`;

const StyledToolTipContainer = styled.div`
  width: 100%;
  border-radius: 3px;
  font-size: 15px;
  padding: 8px 12px;
  margin: 8px 0;
  background: #eef3fb;
  color: #234167;
  border-radius: 5px;
`;

/**
 * SearchSwitch
 * - action: called on radio change
 * - isSelected: boolean
 * - title: label text
 * - tooltipText / tooltipAddress: shown when info open
 * - id: unique id for radio input
 */
const SearchSwitch = ({
  action,
  isSelected,
  title,
  tooltipText,
  tooltipAddress,
  id,
  isMobile
}) => {
  const theme = useTheme();
  const [isOpen, setOpen] = useState(false);

  const handleChange = (e) => {
    if (typeof action === 'function') action(e);
  };

  const handleInfoClick = (e) => {
    e.stopPropagation();
    setOpen((o) => !o);
  };

  const radioId = `search-input-radio-${id}`;

  const onLabelKeyDown = (e) => {
    // Space or Enter should activate the radio (click the native input)
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const input = document.getElementById(radioId);
      if (input) {
        input.click();
        input.focus(); // optionally move focus to the native input
      }
    }
  };

  return (
    <div>
      <Row>
        <Left>
          <Radio
            id={radioId}
            name="search-switch-group"
            checked={!!isSelected}
            onChange={handleChange}
            size="small"
            disableRipple
            sx={{
              margin: 0,
              padding: 0,
              '& .MuiSvgIcon-root': { fontSize: '1.5rem' },
              color: '#BDBDBD',
              '&.Mui-checked': { color: theme?.colors?.mainColor1 ?? '#1976d2' }
            }}
            // keep the native radio out of the tab order (label is primary tab stop)
            inputProps={{
              'aria-label': title,
              tabIndex: -1
            }}
          />

          <StyledLabel
            htmlFor={radioId}
            tabIndex={0}
            onKeyDown={onLabelKeyDown}
          >
            {title}
          </StyledLabel>
        </Left>

        <div>
          <InfoButton
            tabIndex={0}
            aria-expanded={isOpen}
            aria-controls={isOpen ? `search-switch-info-${id}` : undefined}
            aria-label={`Show info for ${title}`}
            onClick={handleInfoClick}
            type="button"
          >
            <FontAwesomeIcon icon={faInfoCircle} size="lg" />
          </InfoButton>
        </div>
      </Row>

      {isOpen && (
        <StyledToolTipContainer
          id={`search-switch-info-${id}`}
          isMobile={isMobile}
          role="region"
          aria-live="polite"
        >
          <strong>{title}</strong>
          {tooltipAddress && <div>{tooltipAddress}</div>}
          <div style={{ marginTop: 6, color: '#666', fontSize: '0.96em' }}>
            {Array.isArray(tooltipText)
              ? tooltipText.map((t, i) => <div key={i}>{t}</div>)
              : tooltipText}
          </div>
        </StyledToolTipContainer>
      )}
    </div>
  );
};

export default SearchSwitch;
