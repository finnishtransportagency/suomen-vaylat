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
  border-color: ${props => props.error ? 'red' : 'black'};
  margin: 0;
  `;

export const StyledTextField = styled(({
    id,
    name,
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
          type="number"
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