import styled, { useTheme } from 'styled-components';
import Radio from '@mui/material/Radio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const Row = styled.div`
  display: flex;
  align-items: center; /* vertically center all children */
  width: 100%;
  justify-content: space-between;
  gap: 8px;
`;

const Left = styled.div`
  display: flex;
  align-items: center; /* center radio + label */
  gap: 8px;
  flex: 1 1 auto;
  min-width: 0;
`;

/* Using a plain label gives us full control over spacing */
const StyledLabel = styled.label`
  font-size: 16px;
  color: #2b2b2b;
  margin: 0;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer; /* click label toggles radio */
`;

/* Info button (sibling) - no extra margins, vertically centered */
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
`;

/* Tooltip / info panel */
const StyledToolTipContainer = styled.div`
  width: 100%;
  border-radius: 3px;
  font-size: 15px;
  padding: 8px 12px;
  margin-top: 8px;
  background: #eef3fb;
  color: #234167;
  border-radius: 5px;
`;

/**
 * Accessible, aligned SearchSwitch
 * - action: called on radio change
 * - isSelected: boolean
 * - title: label text
 * - tooltipText / tooltipAddress: shown when info open
 * - id: unique id for radio input
 */
const SearchSwitch = ({ action, isSelected, title, tooltipText, tooltipAddress, id, isMobile }) => {
  const theme = useTheme();
  const [isOpen, setOpen] = useState(false);

  const handleChange = (e) => {
    if (typeof action === 'function') action(e);
  };

  const handleInfoClick = (e) => {
    e.stopPropagation();
    setOpen((o) => !o);
  };

  // radio id used by label htmlFor
  const radioId = `search-input-radio-${id}`;

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
              margin: 0,           // remove default margin
              padding: 0,          // keep it compact
              '& .MuiSvgIcon-root': { fontSize: '1.5rem' }, // icon size
              color: '#BDBDBD',
              '&.Mui-checked': { color: theme?.colors?.mainColor1 ?? '#1976d2' }
            }}
            inputProps={{ 'aria-label': title }}
          />

          <StyledLabel htmlFor={radioId}>{title}</StyledLabel>
        </Left>

        <div>
          <InfoButton
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
        <StyledToolTipContainer id={`search-switch-info-${id}`} isMobile={isMobile} role="region" aria-live="polite">
          <strong>{title}</strong>
          {tooltipAddress && <div>{tooltipAddress}</div>}
          <div style={{ marginTop: 6, color: '#666', fontSize: '0.96em' }}>
            {Array.isArray(tooltipText) ? tooltipText.map((t, i) => <div key={i}>{t}</div>) : tooltipText}
          </div>
        </StyledToolTipContainer>
      )}
    </div>
  );
};

export default SearchSwitch;
