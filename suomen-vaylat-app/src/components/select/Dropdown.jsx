import styled from 'styled-components';
import Select from "react-select";
import { useState } from 'react';


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


      const [selectedOption, setSelectedOption] = useState("none");
    
      const handleTypeSelect = e => {
        setSelectedOption(e.value);
        setValue(e.value)
        action()
      };
    
      return (
        <div>
          <Select
            isSearchable={false}
            options={options}
            onChange={handleTypeSelect}
            value={options.filter(function(option) {
              return option.value === selectedOption;
            })}
            label="Single select"
            placeholder={placeholder}

            
          />
        </div>
      );
  };

  export default Dropdown;