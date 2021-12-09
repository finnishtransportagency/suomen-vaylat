import styled from 'styled-components';

export const StyledContainer = styled.div`
  display: ${props => props.visible ? 'block' : 'none'};
  label {
    padding-top: 8px;
    font-size: 14px;
    margin: 0;
  }
`;

export const Text = styled.p`
  margin: 8px auto;
`;

export const Error = styled(Text)`
  color: red;
  font-size: 12px;
`;

export const StyledInput = styled.input`
  width: 100%;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${props => props.theme.colors.black};
  margin: 0;
  padding: 6px 8px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  &:disabled {
    opacity: 0.3;
  }
  -moz-appearance: textfield;
  ::-webkit-inner-spin-button{
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button{
      -webkit-appearance: none;
      margin: 0;
  }
  margin-top: ${props => props.marginTop ? '8px' : '0'};
  `;

export const StyledSelect = styled.select`
  width: 100%;
  min-width: 95px;
  min-height: 48px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin: 0;
  color: black;
  padding: 14px 4px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  border: none;
  &:disabled {
    opacity: 0.3;
  }

  background-color: white;
  margin-top: ${props => props.marginTop ? '8px' : '0'};
  `;

export const StyledOption = styled.option`

`;

export const StyledTextField = styled(({
  id,
  name,
  type,
  label,
  min,
  value,
  placeholder,
  hasError,
  isTouched,
  hintText,
  onChange,
  disabled,
  className,
  onKeyPress,
  marginTop
}) => {
  const error = isTouched && hasError;
  return (
    <div className={className}>
      <StyledInput
        id={id}
        name={name}
        type={type}
        min={min}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        disabled={disabled}
        error={error}
        marginTop={marginTop}
      />
      {hintText && <Text>{hintText}</Text>}
      {error && <Error>{error}</Error>}
    </div>
  )
})``

export const StyledSelectInput = styled(({
  id,
  name,
  value,
  placeholder,
  hasError,
  isTouched,
  hintText,
  onChange,
  disabled,
  className,
  options,
  marginTop
}) => {
  const error = isTouched && hasError;
  return (
    <div className={className}>
      <StyledSelect
        id={id}
        name={name}
        value={value + '' || ''}
        onChange={onChange}
        disabled={disabled}
        error={error}
        marginTop={marginTop}
      >
        <StyledOption value='' readOnly={true} hidden={true}>{placeholder}</StyledOption>
        {options.map(({ value, label }, index) => <StyledOption key={index} value={value} >{label}</StyledOption>)}
      </StyledSelect>
      {hintText && <Text>{hintText}</Text>}
      {error && <Error>{error}</Error>}
    </div>
  )
})``