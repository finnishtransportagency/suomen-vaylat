import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const StyledSwitchContainer = styled.div`
  position: relative;
  width: 52px;
  height: 26px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  background-color: ${(props) => (props.isSelected ? '#8DCB6D' : '#AAAAAA')};
  cursor: pointer;
  float: left;
  margin-top: 6px;

  @media ${(props) => props.theme.device.tablet} {
    width: 44px;
    height: 22px;
  }
`;

const StyledSwitchButton = styled.div`
  position: absolute;
  left: ${(props) => (props.isSelected ? '25px' : '1px')};
  width: 22px;
  height: 22px;
  border-radius: 50%;
  margin-left: 2px;
  margin-right: 2px;
  margin-top: 0.8px;
  transition: all 0.3s ease-out;
  background-color: ${(props) => props.theme.colors.mainWhite};

  @media ${(props) => props.theme.device.tablet} {
    width: 18px;
    height: 18px;
    left: ${(props) => (props.isSelected ? '21px' : '1px')};
  }
`;

const StyledBold = styled.div`
  display: inline-block;
  font-weight: 500;
  padding-left: 12px;
  font-size: 15px;
  color: #717070;
  padding-top: 7px;
`;

const StyledHeaderButton = styled.div`
  cursor: pointer;
  float: right;
`;

const SwitchWrapper = styled.div`
  width: 100%;
      display: flex;
    justify-content: space-between;
    align-items: baseline;
`;

const StyledToolTipContainer = styled.div`
  width: 80%;
  border-radius: 3px;
  display: inline-block;
  font-size: 15px;
  opacity: 1;
  padding: 8px 21px;
  position: ${(props) => (props.isMobile ? 'static;' : 'relative;')};
  pointer-events: none;
  visibility: visible;
  z-index: 999;
  background: #0064af;
  color: white;
  ::selection {
    color: ${(props) => props.theme.colors.secondaryColorDarkOrange};
    background: yellow;
  }
  border-radius: 5px;
  margin: 12px 0px 8px 0px;
`;

const SearchSwitch = ({
  action,
  isSelected,
  title,
  tooltipText,
  tooltipAddress,
  id,
  tooltipEnabled = false,
  isMobile
}) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <SwitchWrapper>
      <div>
      <StyledSwitchContainer
        isSelected={isSelected}
        onClick={(event) => {
          action(event);
        }}
      >
        <StyledSwitchButton isSelected={isSelected} />
      </StyledSwitchContainer>
      <StyledBold>{title}</StyledBold>
      </div>

      <StyledHeaderButton
        data-tip
        data-for={id}
        onClick={() => {
          setOpen(!isOpen);
        }}
      >
        <FontAwesomeIcon
          icon={faInfoCircle}
          style={{
            color: tooltipEnabled ? '#0064af' : '#aaaaaa',
          }}
          size="lg"
        />
      </StyledHeaderButton>
      {isOpen && tooltipText !== undefined && tooltipEnabled && (
        <StyledToolTipContainer isMobile={isMobile}>
          <span>
            {tooltipAddress} <br />
            {tooltipText.map((element, index) => {
              return (
                <span key={`tooltip_text_${index}`}>
                  {element} <br />{' '}
                </span>
              );
            })}{' '}
          </span>
        </StyledToolTipContainer>
      )}
    </SwitchWrapper>
  );
};

export default SearchSwitch;
