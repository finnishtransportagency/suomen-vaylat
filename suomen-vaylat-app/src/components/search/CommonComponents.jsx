import styled from 'styled-components';

export const StyledContainer = styled.div`
    display: ${props => props.visible ? 'block' : 'none'};
    padding-left:6px;
`;

export const Text = styled.p`
  margin: 8px auto;
`;

export const Error = styled(Text)`
  font-size: 12px;
  color: red;
`;

export const StyledInput = styled.input`
  width: 229px;
  font-size: 14px;
  padding: 6px 8px;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => props.error ? 'red' : '#dcdce3'};
  border-radius: 2px;
  margin: 0;
  min-height: 36px;
  font-size: 14px;
  color: ${props => props.theme.colors.black};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  &:disabled {
    display: none;
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
  @media only screen and (max-width: 400px) {
    margin-top: 8px;
  }
  `;

export const StyledSelect = styled.select`
  width: 100%;
  font-size: 14px;
  padding: 6px 4px;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => props.error ? 'red' : '#dcdce3'};
  border-radius: 2px;
  margin: 0;
  min-height: 36px;
  font-size: 14px;
  color: #black;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;

  &:disabled {
    display:none;
  }

  background: ${props => props.theme.colors.white};
  margin-top: ${props => props.marginTop ? '8px' : '0'};
  `;

export const StyledOption = styled.option`
`;

export const StyledTextField = styled(({
    id,
    name,
    type,
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
          value={value + ''|| ''}
          onChange={onChange}
          disabled={disabled}
          error={error}
          marginTop={marginTop}
        >
          <StyledOption value="" readOnly={true} hidden={true}>{placeholder}</StyledOption>
          {options.map(({ value, label }, index) => <StyledOption key={index} value={value} >{label}</StyledOption>)}
        </StyledSelect>
        {hintText && <Text>{hintText}</Text>}
        {error && <Error>{error}</Error>}
      </div>
    )
  })``

  export const ToastMessage = ({title, message, errors}) => (
    <div>
      <h5>{title}</h5>
      {message}
      {errors && errors.length > 0 &&
      <ul>
        {errors.map((item,index)=>{
              return <li key={index}>{item}</li>
          })}
        </ul>
      }
    </div>
  )