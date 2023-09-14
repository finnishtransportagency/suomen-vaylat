import styled from 'styled-components';
import Select from "react-select";


const StyledSelect = styled(Select)`
  font-size: 14;
  color: 'blue';
`;

const Dropdown = ({   
    options,
    placeholder,
    value, 
    setValue,
    isDisabled
  }) => {
      
  const styles3 = { 
    option: (provided, state) => ({
      ...provided,
      zIndex: 101,
      position: 'relative'
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 })
  };

  return (
    <StyledSelect
      isSearchable={true}
      options={options}
      onChange={(e) => {
        setValue(e);
      }}
      value={Object.keys(value).length === 0 ? null : value}
      placeholder={placeholder}
      styles={styles3}
      autoFocus={false}
      isDisabled={isDisabled}
      menuPortalTarget={document.body} 
    />
  );
};

export default Dropdown;