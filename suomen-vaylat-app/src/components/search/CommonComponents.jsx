import styled from 'styled-components';

export const StyledContainer = styled.div`
    display: ${props => props.visible ? 'block' : 'none'};
`;

export const Text = styled.p`
  margin: 8px auto;
`;

export const Error = styled(Text)`
  font-size: 12px;
  color: red;
`;

export const StyledInput = styled.input`
  width: 100%;
  font-size: 14px;
  padding: 6px 8px;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => props.error ? 'red' : '#dcdce3'};
  border-radius: 2px;
  margin: 0;
  min-height: 36px;
  font-size: 14px;
  color: #777;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'}
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
  color: #777;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  option {
    color: black;
    background: white;
    display: flex;
    white-space: pre;
    min-height: 36px;
    padding: 0px 2px 1px;
    font-size: 14px;
  }
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
    className
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
          disabled={disabled}
          error={error}
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
    options
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
        >
          <option value="" readOnly={true} hidden={true}>{placeholder}</option>
          {options.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
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
      <ul>
      {errors.map((item,index)=>{
            return <li key={index}>{item}</li>
        })}
      </ul>
    </div>
  )