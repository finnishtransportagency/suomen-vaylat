import styled from 'styled-components';
import Select from "react-select";
import { useState, useEffect } from 'react';


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


      //const [selectedOption, setSelectedOption] = useState("none");
    
      const handleTypeSelect = (e) => {
        console.info("kallopallo", e)
        //setSelectedOption({ title: e.label, value: e.value });
        setValue({...value, value: e.target.value})
        //setValue(e);
        //action();
      };

      const styles = { 
        option: (provided, state) => ({
          ...provided,
          fontWeight: "400",
          color: "black",
          backgroundColor: "orange",
          fontSize: "1rem",
          padding: "0.25rem 0.5rem 0.25rem 0.5rem",
          cursor: "pointer",
          "&:hover": { backgroundColor: "#F5F5F5" },
          zIndex: -5
        }),
        singleValue: (provided, state) => ({
        ...provided,
        //color: "green",
        //color: "white",
        //backgroundColor: "#004080",
        zIndex: -5, 
        fontSize: "1rem"
      }),
        menu: provided => ({ 
          ...provided, 
          zIndex: -5,
          color: "orange" })
    
    };
    
    useEffect(() => {
      console.info("value muuttuu", value)
      //forceUpdate();
    }, [value]);
      return (
        <>
          <StyledSelect
            //  openMenuOnFocus={true}
            isSearchable={true}
            options={options}
            onChange={(e) => {
              console.info("kallopallo", e)
              //setSelectedOption({ title: e.label, value: e.value });
              setValue(e);
              //action();
            }}
            value={Object.keys(value).length === 0 ? null : value}
            //value={options.filter(function(option) {
            // return option.value === value.value;
            //})}
            //label="Single select"
            placeholder={placeholder}
            //styles={styles}
            //onClick={console.info("clickudiclik")}
            autoFocus={false}
            //value={value}
            //onChange={handleChange}
            //getOptionLabel={option => option}
            //getOptionValue={option => option}
            isDisabled={false}  
          />
        </>
      );
  };

  export default Dropdown;