import styled from 'styled-components';
import Select from "react-select";


const StyledSelect = styled(Select)`
  fontSize: 14,
  color: 'blue',
`;

const Dropdown = ({   
    options,
    action,
    placeholder,
    value, 
    setValue
    }) => {
      const styles3 = { 
        option: (provided, state) => ({
        ...provided,
        zIndex: 101,
        position: 'relative'
    })
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
            isDisabled={false}
          />
      );
  };

  export default Dropdown;