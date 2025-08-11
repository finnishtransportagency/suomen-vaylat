import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Radio from '@mui/material/Radio';

/* --- reuse (or re-declare) small styled pieces to match existing layout --- */

const SwitchWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

const StyledBold = styled.div`
  font-weight: 500;
  font-size: 15px;
  color: #717070;
`;

const StyledHeaderButton = styled.button`
  cursor: pointer;
  border: none;
  background: none;
  padding: 6px;
  color: ${(props) => props.theme.colors.mainColor1};
  display: inline-flex;
  align-items: center;
`;

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
 * SearchSwitch (MUI radio + info)
 * Props:
 *  - action: function called to select this switch (e.g. updateActiveSwitch(sw.id))
 *  - isSelected: boolean
 *  - title: label text
 *  - tooltipText: string or array of strings (examples)
 *  - tooltipAddress: short address/help text
 *  - id: identifier
 *  - isMobile: passed to tooltip if needed (kept for compatibility)
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
  const [isOpen, setOpen] = useState(false);
  const theme = useTheme();

  const handleSelect = (e) => {
    // keep behavior same as before: call parent action
    if (typeof action === 'function') action();
  };

  const handleInfoClick = (e) => {
    // prevent row click/select when toggling info
    e.stopPropagation();
    setOpen((o) => !o);
  };

  return (
    <div>
      <SwitchWrapper onClick={handleSelect} role="button" aria-pressed={!!isSelected}>
        <LeftArea>
          <Radio
            checked={!!isSelected}
            onChange={handleSelect}
            value={id}
            name="search-switch-group"
            size="small"
            disableRipple
            sx={{
              color: '#BDBDBD',
              '&.Mui-checked': {
                color: theme?.colors?.mainColor1 ?? '#1976d2'
              }
            }}
            inputProps={{ 'aria-label': title }}
            onClick={(e) => e.stopPropagation()} /* stop propagation so outer onClick works only once */
          />
          <StyledBold>{title}</StyledBold>
        </LeftArea>

        <div>
          <StyledHeaderButton
            aria-label={`Show info for ${title}`}
            onClick={handleInfoClick}
            type="button"
          >
            <FontAwesomeIcon icon={faInfoCircle} size="lg" />
          </StyledHeaderButton>
        </div>
      </SwitchWrapper>

      {isOpen && (
        <StyledToolTipContainer isMobile={isMobile} role="dialog" aria-live="polite">
          <strong>{title}</strong>
          <div>{tooltipAddress}</div>
          <div style={{ marginTop: 6, color: '#666', fontSize: '0.96em' }}>
            {Array.isArray(tooltipText)
              ? tooltipText.map((txt, i) => <div key={i}>{txt}</div>)
              : tooltipText}
          </div>
        </StyledToolTipContainer>
      )}
    </div>
  );
};

export default SearchSwitch;
