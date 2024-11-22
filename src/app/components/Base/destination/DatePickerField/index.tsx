"use client";

import React, { useState, forwardRef, useEffect, useContext } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { tr } from "date-fns/locale";
import ThemeContext from "@/app/context/ThemeContext";

// Register the Turkish locale
registerLocale("tr", tr);

// Define the props type for the custom input component
type CustomInputProps = {
  value?: string;
  onClick?: () => void;
  onClear?: () => void;
};

// Custom input component for the DatePicker
const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick, onClear }, ref) => {
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
      throw new Error("SolySelect must be used within a ThemeProvider");
    }
    const { theme } = themeContext;

    return (
      <div
        className={`w-full sm:w-[275px] h-[45px] flex items-center border px-4 sm:h-[55px] rounded-md focus-within:border-primary cursor-pointer relative ${
          theme === "dark"
            ? "border-gray-600 bg-gray-800 text-gray-200"
            : "border-gray-300 bg-white text-gray-700"
        }`}
      >
        <input
          value={value}
          readOnly
          ref={ref}
          className={`border-none outline-none bg-transparent text-sm font-medium flex-grow cursor-pointer ${
            theme === "dark" ? "text-gray-200" : "text-body"
          }`}
          onClick={onClick}
        />
        {value && (
          <button
            className="absolute right-12 focus:outline-none"
            onClick={onClear}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-x-circle"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </button>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className={`bi bi-calendar ml-2 ${
            theme === "dark" ? "text-gray-400" : "text-primary"
          }`}
          viewBox="0 0 16 16"
          onClick={onClick}
        >
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1zm1-1h12V3a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v1z" />
        </svg>
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export const DatePickerField: React.FC = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("SolySelect must be used within a ThemeProvider");
  }
  const { theme } = themeContext;
  const [startDate, setStartDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleClearDate = () => {
    setStartDate(null);
  };

  return (
    <div>
      <label className="text-sm text-gray-400 block mb-2">Tarih</label>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        placeholderText="Date"
        customInput={
          <CustomInput
            value={startDate?.toLocaleDateString("tr")}
            onClear={handleClearDate}
          />
        }
        locale="tr" // Set locale to Turkish
        dateFormat="dd/MM/yyyy" // Set date format to Turkish format
        calendarClassName={`shadow-lg ${
          theme === "dark"
            ? "bg-gray-800 text-gray-200"
            : "bg-white text-gray-700"
        }`}
        dayClassName={(date) =>
          date.getDate() === startDate?.getDate() &&
          date.getMonth() === startDate?.getMonth() &&
          date.getFullYear() === startDate?.getFullYear()
            ? "bg-green-500 text-white hover:bg-green-600"
            : "hover:bg-gray-200"
        }
        popperClassName="z-30 mt-2" // Tailwind classes to ensure it appears above other components
        popperPlacement="bottom-start"
      />
    </div>
  );
};
