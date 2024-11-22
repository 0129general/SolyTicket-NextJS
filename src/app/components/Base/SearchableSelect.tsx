"use client";

import React, { useContext } from "react";
import Select from "react-select";
import ThemeContext from "@/app/context/ThemeContext";

interface SearchableSelectProps {
  name: string;
  options: any[];
  placeholder: string;
  onOptionSelect?: (id: string | null, name: string | null) => void; // Optional onOptionSelect prop
  selectedValue?: string; // Optional selectedValue prop
  instanceId?: string; // Optional instanceId prop for consistent ID generation
}

const customStyles = (theme: string) => ({
  container: (provided: any) => ({
    ...provided,
    width: "30%", // Adjust the width as per your requirement
    minWidth: "200px", // Minimum width to ensure readability
    border: "none",
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    // border: state.isFocused || state.hasValue ? "2px solid #4E43F1" : "none", 

    border: state.isFocused || state.hasValue ? "none" : "none",
    boxShadow: "none", // Remove box shadow
    cursor: "pointer",
    padding: "0", // Remove padding
    "&:hover": {
      border: state.isFocused || state.hasValue ? "none" : "none",

      // border: state.isFocused || state.hasValue ? "2px solid #4E43F1" : "none", 
    },
    backgroundColor: state.isFocused
      ? theme === "dark"
        ? "#2d3748"
        : "#f9f9f9"
      : theme === "dark"
        ? "#1a202c"
        : "white", // Change background color on focus
    color: theme === "dark" ? "#cbd5e0" : "#333",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: theme === "dark" ? "#cbd5e0" : "#999", // Change color to match the example
    padding: "0", // Remove padding
  }),
  indicatorSeparator: () => ({
    display: "none", // Remove the separator
  }),
  singleValue: (provided: any) => ({
    ...provided,
    fontWeight: "bold", // Make the text bold
    color: theme === "dark" ? "#cbd5e0" : "#333",
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: "0", // Remove default padding
    color: theme === "dark" ? "#cbd5e0" : "#333",
  }),
  input: (provided: any) => ({
    ...provided,
    margin: "0", // Remove margin
    padding: "0", // Remove padding
    color: theme === "dark" ? "#cbd5e0" : "#333",
  }),
  menu: (provided: any) => ({
    ...provided,
    border: "none", // Remove border from the menu
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Add shadow to the dropdown menu
    backgroundColor: theme === "dark" ? "#1a202c" : "white", // Adjust menu background color for dark mode
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    padding: "0.5rem", // Tailwind padding class equivalent to p-2
    backgroundColor: state.isSelected
      ? theme === "dark"
        ? "#2d3748"
        : "#f0f0f0"
      : state.isFocused
        ? theme === "dark"
          ? "#2d3748"
          : "#f9f9f9"
        : theme === "dark"
          ? "#1a202c"
          : "white", // Add background color on hover and selection
    color: theme === "dark" ? "#cbd5e0" : "#333", // Text color
    "&:hover": {
      backgroundColor: "#4E43F1", // Change background color on hover
      color: "white", // Change text color on hover
    },
  }),
  placeholder: (provided: any, state: any) => ({
    ...provided,
    fontWeight: "bold", // Make the placeholder text bold
    display: state.isFocused ? "none" : "block", // Hide placeholder when focused
    color: theme === "dark" ? "#a0aec0" : "#999", // Adjust placeholder color for dark mode
  }),
});

const SearchableSelect = (props: SearchableSelectProps) => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("SolySelect must be used within a ThemeProvider");
  }
  const { theme } = themeContext;
  const handleChange = (selectedOption: any) => {
    if (props.onOptionSelect) {
      if (selectedOption) {
        props.onOptionSelect(selectedOption.value, selectedOption.label);
      } else {
        props.onOptionSelect(null, null); // Handle unselect
      }
    }
  };

  // Find the selected option based on the selectedValue prop
  const selectedOption = props.options.find(
    (option) => option.value === props.selectedValue
  );

  return (
    <Select
      styles={customStyles(theme)}
      classNamePrefix="react-select"
      name={props.name}
      options={props.options}
      placeholder={props.placeholder}
      className="border-none focus:ring-0 focus:border-transparent"
      onChange={handleChange} // Trigger the onChange handler
      isClearable // Allow clearing the selection
      value={selectedOption} // Set the selected option
      instanceId={props.instanceId} // Use instanceId for consistent ID generation
    />
  );
};

export default SearchableSelect;
