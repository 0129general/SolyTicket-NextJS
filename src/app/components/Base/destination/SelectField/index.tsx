"use client";

import React, { useContext } from "react";
import Select, { StylesConfig } from "react-select";
import ThemeContext from "@/app/context/ThemeContext";

interface SelectFieldProps {
  name: string;
  options: any[]; // You can type this better if you know the structure
  placeholder: string;
  onOptionSelect?: (id: string | null, name: string | null) => void;
  selectedValue?: string; // This allows selecting an option by value
  value?: any; // Add the value prop to make it compatible
  instanceId?: string;
}


const customStyles = (theme: string): StylesConfig<any, false> => ({
  container: (provided: any) => ({}),
  control: (provided: any, state: any) => ({
    ...provided,
    border:
      state.isFocused || state.hasValue
        ? "1px solid #4E43F1"
        : "1px solid #AAAAAA",
    boxShadow: "none", // Remove box shadow
    cursor: "pointer",
    paddingLeft: 20,
    paddingRight: 20,
    height: "100%",
    borderRadius: "6px",
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
    color: theme === "dark" ? "#cbd5e0" : "#4E43F1",
    padding: "0",
  }),
  indicatorSeparator: () => ({
    display: "none", // Remove the separator
  }),
  singleValue: (provided: any) => ({
    ...provided,
    fontWeight: "500",
    color: theme === "dark" ? "#cbd5e0" : "#323232",
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: "0",
    color: theme === "dark" ? "#cbd5e0" : "#323232",
    fontSize: 14,
  }),
  input: (provided: any) => ({
    ...provided,
    margin: "0",
    padding: "0",
    color: theme === "dark" ? "#cbd5e0" : "#323232",
  }),
  menu: () => ({
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: theme === "dark" ? "#1a202c" : "white",
    zIndex: 99,
    position: "relative",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    padding: "0.5rem",
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
          : "white",
    color: theme === "dark" ? "#cbd5e0" : "#333",
    "&:hover": {
      backgroundColor: "#4E43F1",
      color: "white",
    },
  }),
  placeholder: (provided: any, state: any) => ({
    ...provided,
    fontWeight: "500",
    display: state.isFocused ? "none" : "block",
    color: theme === "dark" ? "#a0aec0" : "#323232",
  }),
});

export const SelectField = (props: SelectFieldProps) => {
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
    <div className="w-full sm:w-[275px]">
      <label className="text-gray-400 font-medium text-sm block mb-2">
        Kişi sayısı
      </label>
      <Select
        styles={customStyles(theme)}
        classNamePrefix="react-select"
        name={props.name}
        options={props.options}
        placeholder={props.placeholder}
        className="border-none focus:ring-0 focus:border-transparent h-[45px] sm:h-[55px]"
        onChange={handleChange}
        isClearable
        value={selectedOption}
        instanceId={props.instanceId}
        components={{
          CrossIcon: () => null,
          IndicatorSeparator: () => null,
        }}
      />
    </div>
  );
};